import { mkdir, copyFile, readdir } from 'node:fs/promises';
await mkdir('site/docs', { recursive: true });
await copyFile('docs/API.md', 'site/docs/API.md');
await copyFile('LICENSE', 'site/LICENSE');

await copyFile('docs/NATURE_RESEARCH.md', 'site/docs/NATURE_RESEARCH.md');
await copyFile('docs/REMAINING_CHARTS_PLAN.md', 'site/docs/REMAINING_CHARTS_PLAN.md');
await copyFile('docs/THIRD_PARTY.md', 'site/docs/THIRD_PARTY.md');

await copyFile('docs/FIFTY_CHARTS_PLAN.md', 'site/docs/FIFTY_CHARTS_PLAN.md');
await copyFile('docs/CHART_CATALOG.md', 'site/docs/CHART_CATALOG.md');

await copyFile('docs/QUALITY_REVIEW.md', 'site/docs/QUALITY_REVIEW.md');
await copyFile('docs/ART_DIRECTION.md', 'site/docs/ART_DIRECTION.md');

await copyFile('docs/COMPLETE_ART_STUDIES.md', 'site/docs/COMPLETE_ART_STUDIES.md');

await copyFile('docs/SCULPTURAL_CHARTS.md', 'site/docs/SCULPTURAL_CHARTS.md');

await copyFile('docs/NATIVE_SVG_REVIEW.md', 'site/docs/NATIVE_SVG_REVIEW.md');

await copyFile('docs/PUBLISHING.md', 'site/docs/PUBLISHING.md');

await copyFile('docs/DEPLOYMENT.md', 'site/docs/DEPLOYMENT.md');

// Keep the source references readable by assistants that reject text/markdown.
for (const name of await readdir('site/docs')) {
  if (name.endsWith('.md')) await copyFile(`site/docs/${name}`, `site/docs/${name.replace(/\.md$/, '.txt')}`);
}
