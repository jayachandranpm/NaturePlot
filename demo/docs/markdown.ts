import type { Page } from './content';
import { version } from '../../src';

export const siteURL = 'https://jayachandranpm.github.io/NaturePlot/';
export const markdownURL = (slug: string): string => new URL(`docs/${slug}.md`, siteURL).href;

function absoluteLink(href: string): string {
  if (href.startsWith('#/')) {
    // Hash-routed HTML pages have separate, fetchable Markdown counterparts.
    return markdownURL(href.slice(2).split('/')[0] || 'introduction');
  }
  return new URL(href, `${siteURL}docs/`).href;
}

/** Convert the authored documentation, not the mounted chart DOM, to Markdown. */
export function htmlToMarkdown(html: string, doc: Document): string {
  const template = doc.createElement('template');
  template.innerHTML = html;
  const children = (node: Node): string => Array.from(node.childNodes).map(render).join('');
  const text = (value: string): string => value.replace(/\s+/g, ' ');
  function render(node: Node): string {
    if (node.nodeType === 3) return text(node.textContent ?? '');
    if (node.nodeType !== 1) return children(node);
    const element = node as Element;
    const tag = element.tagName.toLowerCase();
    if (['svg', 'script', 'style', 'button'].includes(tag) || element.matches('[aria-hidden="true"], .code-head, .example-toolbar, .example-caption')) return '';
    if (element.matches('[data-example]')) {
      const type = element.getAttribute('data-example')!;
      return `\n\n[Interactive ${type} example](${siteURL}?chart=${encodeURIComponent(type)}#playground)\n\n`;
    }
    if (tag === 'pre') {
      const value = (element.querySelector('code') ?? element).textContent ?? '';
      const filename = element.closest('.code-block')?.querySelector('.code-head > span')?.textContent?.trim() ?? '';
      const ext = filename.split('.').pop();
      const language = filename === 'terminal' ? 'sh' : ({ js: 'js', ts: 'ts', html: 'html', jsx: 'jsx', py: 'python', json: 'json' } as Record<string, string>)[ext ?? ''] ?? '';
      const longest = Math.max(2, ...(value.match(/`+/g) ?? []).map(run => run.length));
      const fence = '`'.repeat(longest + 1);
      return `\n\n${fence}${language}\n${value}\n${fence}\n\n`;
    }
    if (tag === 'code') {
      const value = element.textContent ?? '';
      const fence = '`'.repeat(Math.max(0, ...(value.match(/`+/g) ?? []).map(run => run.length)) + 1);
      return `${fence}${value}${fence}`;
    }
    if (tag === 'table') {
      const rows = Array.from(element.querySelectorAll('tr')).map(row => Array.from(row.children).map(cell => children(cell).trim().replace(/\|/g, '\\|').replace(/\n+/g, ' ')));
      if (!rows.length) return '';
      const line = (row: string[]) => `| ${row.join(' | ')} |`;
      return `\n\n${line(rows[0])}\n${line(rows[0].map(() => '---'))}\n${rows.slice(1).map(line).join('\n')}\n\n`;
    }
    const value = children(element);
    if (tag === 'a') {
      const href = element.getAttribute('href');
      return href ? `[${value.trim()}](${absoluteLink(href)})` : value;
    }
    if (/^h[1-6]$/.test(tag)) return `\n\n${'#'.repeat(Number(tag[1]))} ${value.trim()}\n\n`;
    if (tag === 'br') return '\n';
    if (tag === 'strong' || tag === 'b') return `**${value.trim()}**`;
    if (tag === 'em' || tag === 'i') return value.trim() ? `*${value.trim()}*` : '';
    if (tag === 'li') {
      const prefix = element.parentElement?.tagName === 'OL' ? `${Array.from(element.parentElement.children).indexOf(element) + 1}. ` : '- ';
      return `\n${prefix}${value.trim()}`;
    }
    if (['ul', 'ol', 'p', 'div', 'aside', 'section', 'figure'].includes(tag)) return `\n\n${value.trim()}\n\n`;
    return value;
  }
  // Normalize prose only; fenced code content must remain byte-for-byte intact.
  let fence = '';
  const lines: string[] = [];
  for (const line of children(template.content).trim().split('\n')) {
    const delimiter = line.match(/^(`{3,})/);
    if (delimiter) {
      if (!fence) fence = delimiter[1];
      else if (line.trim() === fence) fence = '';
      lines.push(line);
    } else if (fence || line.trim() || lines.at(-1) !== '') lines.push(line);
  }
  return lines.join('\n');
}

export function pageToMarkdown(page: Page, doc: Document): string {
  return `# ${page.title.replace(/\n/g, ' ')}\n\n> ${page.description}\n\nNaturePlot.js v${version} · ${page.group}\n\nDocumentation: ${siteURL}docs/#/${page.slug}\n\n${page.sections.map(section => `## ${section.title}\n\n${htmlToMarkdown(section.html, doc)}`).join('\n\n')}\n`;
}

export function documentationFiles(pages: Page[], doc: Document): Map<string, string> {
  const files = new Map<string, string>();
  const groups = [...new Set(pages.map(page => page.group))];
  const summary = `# NaturePlot.js\n\n> NaturePlot.js v${version} is a dependency-free, framework-independent JavaScript library of 50 nature-inspired interactive SVG charts, with TypeScript declarations and a Python interface.\n\nInstall JavaScript with npm, pnpm, Yarn, or Bun using the package name natureplot. Install Python with pip, uv, or Poetry using natureplot. The JavaScript renderer requires a browser DOM; Python produces HTML reports and notebook output using that renderer. Charts use native SVG, not generated images. Each chart has its own input limits and measurement rules. Examples contain illustrative data.\n\nUse the linked Markdown guides for supported options, examples, accessibility, and chart selection. Do not infer quantitative meaning from decorative texture or claim that a chart is a calibrated astronomical instrument.\n\n`;
  const index = summary + groups.map(group => `## ${group}\n\n${pages.filter(page => page.group === group).map(page => `- [${page.title.replace(/\n/g, ' ')}](${markdownURL(page.slug)}): ${page.description}`).join('\n')}`).join('\n\n') + `\n\n## Optional\n\n- [Full documentation](${siteURL}llms-full.txt): All current documentation pages in one file.\n- [API reference](${siteURL}docs/API.md): Plain Markdown API reference.\n- [Source repository](https://github.com/jayachandranpm/NaturePlot): Source code, tests, and MIT license.\n`;
  for (const page of pages) {
    if (!/^[a-z0-9-]+$/.test(page.slug)) throw new Error(`Invalid documentation slug: ${page.slug}`);
    files.set(`docs/${page.slug}.md`, pageToMarkdown(page, doc));
  }
  const full = summary + pages.map(page => files.get(`docs/${page.slug}.md`)).join('\n---\n\n');
  for (const path of ['llms.txt', 'llms.md', 'llm.txt', 'docs/llms.txt', 'docs/llms.md', 'docs/llm.txt']) files.set(path, index);
  for (const path of ['llms-full.txt', 'docs/llms-full.txt']) files.set(path, full);
  files.set('docs/index.md', files.get('docs/introduction.md')!);
  return files;
}
