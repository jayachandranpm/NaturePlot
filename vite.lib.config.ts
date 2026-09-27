import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    lib: { entry: 'src/index.ts', name: 'NaturePlot', formats: ['es', 'iife'], fileName: format => format === 'es' ? 'natureplot.js' : 'natureplot.global.js' },
    outDir: 'dist', minify: true, rollupOptions: { output: { exports: 'named' } },
  },
});
