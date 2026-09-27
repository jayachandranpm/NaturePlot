// Deterministic, self-contained contact sheets for manual visual review.
// SVG generation uses jsdom; browser inspection remains a separate step.
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';
const dom = new JSDOM('<!doctype html><body></body>');
for (const key of ['window','document','HTMLElement','Element','SVGElement','XMLSerializer','CustomEvent']) globalThis[key] = dom.window[key];
const { NaturePlot, chartTypes, chartGuidance, themes } = await import('../dist/natureplot.js');
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
const { options, types } = await server.ssrLoadModule('/demo/samples.ts');
await server.close();
await mkdir('site/review', {recursive:true});
for (const dark of [false,true]) for (let page=0; page<5; page++) {
  const suffix=dark?'-dark':'';
  const theme=dark?{...themes.meadow,background:'#17221b',ink:'#e2eadb',muted:'#a6b79f',grid:'#364a3b'}:undefined;
  const cards = types.slice(page*10,page*10+10).map(type=> {
    const host = document.createElement('div'), chart = new NaturePlot(host, {...options(type),...(theme?{theme}:{}),animate:false,interactive:false});
    const svg = chart.toSVG(); chart.destroy();
    return `<article id="${type}"><h2>${chartTypes[type].name}</h2><p>${chartGuidance[type].bestFor}</p>${svg}</article>`;
  });
  await writeFile(`site/review/${page+1}${suffix}.html`, `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>NaturePlot review ${page+1} of 5 ${dark?'dark':'light'}</title><style>body{margin:20px;background:${dark?'#101912':'#f1f3eb'};color:${dark?'#e2eadb':'#263e32'};font:14px system-ui}nav{display:flex;flex-wrap:wrap;gap:20px;margin:20px 0}main{display:grid;grid-template-columns:repeat(2,minmax(0,640px));gap:20px}article{border:1px solid ${dark?'#364a3b':'#d5dfd0'};border-radius:12px;background:${dark?'#17221b':'#fafbf5'};overflow:hidden}h2{font:24px Georgia;margin:18px 20px 6px}p{margin:0 20px 12px;min-height:42px;line-height:1.5}svg{display:block;width:100%;height:auto}a{color:inherit}</style><h1>NaturePlot · visual review ${page+1}/5 · ${dark?'dark':'light'}</h1><nav>${[1,2,3,4,5].map(n=>`<a href="${n}${suffix}.html">Charts ${(n-1)*10+1}–${n*10}</a>`).join('')}<a href="${page+1}${dark?'':'-dark'}.html">${dark?'Light':'Dark'} theme</a></nav><main>${cards.join('')}</main></html>`);
}
console.log('Review contact sheets: http://127.0.0.1:4173/review/1.html');
