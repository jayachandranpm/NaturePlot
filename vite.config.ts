import { defineConfig } from 'vite';
export default defineConfig({
  base: './',
  build: {
    outDir: 'site',
    rollupOptions: { input: { showcase: 'index.html', docs: 'docs/index.html' } },
  },
});
