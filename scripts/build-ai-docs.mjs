import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { createServer } from 'vite';
import { JSDOM } from 'jsdom';

// Vite loads the same TypeScript pages and raw icon imports used by the docs site.
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
try {
  const { pages } = await server.ssrLoadModule('/demo/docs/content.ts');
  const { documentationFiles } = await server.ssrLoadModule('/demo/docs/markdown.ts');
  const dom = new JSDOM();
  try {
    const files = documentationFiles(pages, dom.window.document);
    for (const [path, content] of files) {
      const target = `site/${path}`;
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, content);
    }
    console.log(`Generated ${pages.length} Markdown guides and AI documentation indexes.`);
  } finally { dom.window.close(); }
} finally { await server.close(); }
