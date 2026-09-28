import { access, mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { createServer } from 'vite';
import { JSDOM } from 'jsdom';

// Vite loads the same TypeScript pages and raw icon imports used by the docs site.
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
try {
  const { pages } = await server.ssrLoadModule('/demo/docs/content.ts');
  const { documentationFiles, siteURL } = await server.ssrLoadModule('/demo/docs/markdown.ts');
  const dom = new JSDOM();
  try {
    const files = documentationFiles(pages, dom.window.document);
    for (const [path, content] of files) {
      const target = `site/${path}`;
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, content);
    }
    // Fail the build if an exported guide points assistants at a missing text file.
    const targets = new Set();
    for (const content of files.values()) {
      for (const [, href] of content.matchAll(/\]\((https:\/\/[^)]+)\)/g)) {
        if (href.startsWith(siteURL) && new URL(href).pathname.endsWith('.txt')) targets.add(href.slice(siteURL.length).split(/[?#]/)[0]);
      }
    }
    for (const target of targets) await access(`site/${target}`);
    console.log(`Generated ${pages.length} guides in Markdown and plain text; verified ${targets.size} assistant documentation targets.`);
  } finally { dom.window.close(); }
} finally { await server.close(); }
