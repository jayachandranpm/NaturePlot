import { afterEach, describe, expect, it, vi } from 'vitest';
import { types } from '../demo/samples';
import { code, pages, pageBySlug } from '../demo/docs/content';
import { documentationFiles, htmlToMarkdown, markdownURL, textURL, pageToMarkdown, siteURL } from '../demo/docs/markdown';
import { assistantLinks, assistantPrompt, mountPageActions, pageActionsHTML } from '../demo/docs/page-actions';

const page = pageBySlug.get('phyllotaxis')!;

describe('AI documentation export', () => {
  it('preserves code literally, including markup, backticks, and blank lines', () => {
    const source = '<script>\nconst x = `<span>hello</span>`;\n\n\nconst fence = "```";\n</script>';
    const markdown = htmlToMarkdown(code(source, 'example.html'), document);
    expect(markdown).toBe(`\`\`\`\`html\n${source}\n\`\`\`\``);
    expect(markdown).not.toContain('Copy');
  });

  it('keeps tables, links, headings, and inline code without decorative SVG or controls', () => {
    const result = htmlToMarkdown('<h3>Read data</h3><p>Use <code>value: null</code> and <a href="#/data/missing-is-not-zero">the guide</a>.</p><table><tr><th>Item</th><th>Rule</th></tr><tr><td>A | B</td><td>One<br>Two</td></tr></table><button>Copy</button><svg><text>Decoration</text></svg>', document);
    expect(result).toContain('### Read data');
    expect(result).toContain('`value: null`');
    expect(result).toContain(`[the guide](${textURL('data')})`);
    expect(result).toContain('| Item | Rule |\n| --- | --- |\n| A \\| B | One Two |');
    expect(result).not.toMatch(/Decoration|Copy|<svg|\n{3}/);
  });

  it('uses plain-text destinations for local Markdown links without changing external links or code', () => {
    const result = htmlToMarkdown('<p><a href="./API.md#data">API</a> <a href="../llms.md">index</a> <a href="https://example.com/guide.md">external</a> <code>docs/ai.md</code></p>', document);
    expect(result).toContain(`[API](${siteURL}docs/API.txt#data)`);
    expect(result).toContain(`[index](${siteURL}llms.txt)`);
    expect(result).toContain('[external](https://example.com/guide.md)');
    expect(result).toContain('`docs/ai.md`');
  });

  it('exports identical Markdown and text versions of every guide with resolvable text links', () => {
    const files = documentationFiles(pages, document);
    for (const current of pages) {
      const markdown = files.get(`docs/${current.slug}.md`)!;
      expect(files.get(`docs/${current.slug}.txt`)).toBe(markdown);
      expect(markdown).toContain(current.description);
      for (const section of current.sections) {
        expect(markdown).toContain(`## ${section.title}`);
        const template = document.createElement('template'); template.innerHTML = section.html;
        for (const node of template.content.querySelectorAll('pre code')) expect(markdown).toContain(node.textContent);
      }
      for (const [,slug] of markdown.matchAll(/https:\/\/jayachandranpm\.github\.io\/NaturePlot\/docs\/([a-z0-9-]+)\.txt/g)) expect(files.has(`docs/${slug}.txt`), slug).toBe(true);
      expect(markdown).not.toMatch(/\]\(https:\/\/jayachandranpm\.github\.io\/NaturePlot\/[^)]+\.md(?:[?#][^)]*)?\)/);
    }
    for (const type of types) expect(files.has(`docs/${type}.txt`)).toBe(true);
    const index = files.get('llms.txt')!;
    expect(index.startsWith('# NaturePlot.js\n\n>')).toBe(true);
    for (const current of pages) {
      expect(index).toContain(textURL(current.slug));
      expect(index).not.toContain(markdownURL(current.slug));
      expect(files.get('llms-full.txt')).toContain(files.get(`docs/${current.slug}.md`));
    }
    for (const alias of ['llm.txt','llms.md','docs/llms.txt']) expect(files.get(alias)).toBe(index);
    expect(files.get('docs/llms-full.txt')).toBe(files.get('llms-full.txt'));
    expect(files.get('docs/index.txt')).toBe(files.get('docs/introduction.txt'));
  });
});

describe('assistant links and page actions', () => {
  let cleanup: (() => void) | undefined;
  afterEach(() => { cleanup?.(); cleanup = undefined; document.body.replaceChildren(); vi.unstubAllGlobals(); });
  const mount = () => {
    document.body.innerHTML = pageActionsHTML(page);
    const toast = vi.fn(); cleanup = mountPageActions(document.body, page, toast);
    return toast;
  };
  const clipboard = (writeText: (value: string) => Promise<void>) => vi.stubGlobal('navigator', { clipboard: { writeText } });

  it('builds page-specific HTTPS links without local state or tracking data', () => {
    const links = assistantLinks(page);
    expect(links.map(link => link.id)).toEqual(['chatgpt','perplexity','gemini','grok','claude']);
    for (const provider of links) {
      const url = new URL(provider.href);
      expect(url.protocol).toBe('https:');
      if (provider.id === 'gemini') expect(url.search).toBe('');
      else expect(url.searchParams.get('q')).toBe(assistantPrompt(page));
      expect(provider.href.length).toBeLessThan(2000);
    }
    expect(assistantPrompt(page)).toContain(`${siteURL}docs/phyllotaxis.txt`);
    expect(assistantPrompt(pageBySlug.get('installation')!)).toContain('docs/installation.txt');
    expect(assistantPrompt(pageBySlug.get('ai')!)).toContain('docs/ai.txt');
    expect(assistantPrompt(page)).toContain(`${siteURL}llms-full.txt`);
    expect(assistantPrompt(page)).toContain('use it directly without requiring web access');
    expect(assistantPrompt(page)).not.toContain('localhost');
  });

  it('copies source Markdown rather than mounted SVG markup', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined); clipboard(writeText); const toast = mount();
    document.querySelector<HTMLButtonElement>('[data-copy-page]')!.click();
    await vi.waitFor(() => expect(toast).toHaveBeenCalledWith('Page copied as Markdown.'));
    expect(writeText).toHaveBeenCalledWith(pageToMarkdown(page, document));
  });

  it('exposes a manual copy fallback when clipboard access is denied', async () => {
    clipboard(vi.fn().mockRejectedValue(new Error('denied'))); const toast = mount();
    document.querySelector<HTMLButtonElement>('[data-copy-page]')!.click();
    await vi.waitFor(() => expect(toast).toHaveBeenCalled());
    const fallback = document.querySelector<HTMLElement>('.page-copy-fallback')!;
    expect(fallback.hidden).toBe(false);
    expect(fallback.querySelector('textarea')!.value).toBe(pageToMarkdown(page, document));
    expect(document.activeElement).toBe(fallback.querySelector('textarea'));
    expect(toast).not.toHaveBeenCalledWith('Page copied as Markdown.');
  });

  it('copies full page context for Gemini and keeps a fallback on failure', async () => {
    const writeText=vi.fn().mockRejectedValue(new Error('denied')); clipboard(writeText); mount();
    const link = document.querySelector<HTMLAnchorElement>('[data-ai-provider="gemini"]')!;
    link.addEventListener('click', event => event.preventDefault()); link.click();
    await vi.waitFor(() => expect(document.querySelector<HTMLElement>('.ai-prompt-content')!.hidden).toBe(false));
    expect(document.querySelector('.ai-prompt-toggle')!.getAttribute('aria-expanded')).toBe('true');
    expect(writeText.mock.calls[0][0]).toContain(pageToMarkdown(page, document));
    expect(document.querySelector<HTMLTextAreaElement>('.ai-prompt-fallback textarea')!.value).toContain(pageToMarkdown(page, document));
  });

  it('discloses a copyable prompt and keeps its accessible state in sync', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined); clipboard(writeText); mount();
    const toggle = document.querySelector<HTMLButtonElement>('.ai-prompt-toggle')!;
    const content = document.getElementById(toggle.getAttribute('aria-controls')!)!;
    expect(content.hidden).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    toggle.click();
    expect(content.hidden).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    content.querySelector<HTMLButtonElement>('[data-copy-prompt]')!.click();
    await vi.waitFor(() => expect(document.querySelector('.ai-action-status')!.textContent).toContain('Prompt and guide copied'));
    expect(writeText).toHaveBeenCalledWith(`${assistantPrompt(page)}\n\nDocumentation for reference:\n\n${pageToMarkdown(page, document)}`);
    toggle.click();
    expect(content.hidden).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('selects the full prompt and guide for manual copying when clipboard access is denied', async () => {
    clipboard(vi.fn().mockRejectedValue(new Error('denied'))); mount();
    document.querySelector<HTMLButtonElement>('.ai-prompt-toggle')!.click();
    document.querySelector<HTMLButtonElement>('[data-copy-prompt]')!.click();
    const field = document.querySelector<HTMLTextAreaElement>('.ai-prompt-content textarea')!;
    await vi.waitFor(() => expect(document.activeElement).toBe(field));
    expect(field.value).toContain(pageToMarkdown(page, document));
    expect(field.selectionStart).toBe(0);
    expect(field.selectionEnd).toBe(field.value.length);
    expect(document.querySelector('.ai-action-status')!.textContent).toContain('Prompt and guide selected');
  });

  it('closes on Escape and outside activation, returning keyboard focus', () => {
    mount(); const details=document.querySelector<HTMLDetailsElement>('.ask-ai')!;
    details.open=true;
    details.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
    expect(details.open).toBe(false); expect(document.activeElement).toBe(details.querySelector('summary'));
    details.open=true; document.body.dispatchEvent(new Event('pointerdown',{bubbles:true}));
    expect(details.open).toBe(false);
  });
});
