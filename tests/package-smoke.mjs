import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><div id="chart"></div>', { runScripts: 'outside-only' });
for (const key of ['document', 'HTMLElement', 'Element', 'XMLSerializer', 'CustomEvent']) globalThis[key] = dom.window[key];
const module = await import('../dist/natureplot.js');
const chart = module.createChart('#chart', { type: 'garden', startDate: '2026-09-01', data: [{ value: 5 }] });
assert.equal(chart.data.length, 30);
assert.match(chart.toSVG(), /<svg/);
assert.equal(typeof module.registerChart, 'function');
chart.destroy();

dom.window.eval(await readFile(new URL('../dist/natureplot.global.js', import.meta.url), 'utf8'));
const browserChart = dom.window.NaturePlot.createChart('#chart', { type: 'tide', data: [{ value: 75 }] });
assert.match(browserChart.toSVG(), /75%/);
assert.equal(dom.window.document.querySelectorAll('.np-mark').length, 1);
browserChart.destroy();
assert.equal(dom.window.document.querySelector('#chart').children.length, 0);
assert.equal(module.version, '0.7.0');
assert.equal(Object.keys(module.chartTypes).length, 50);
assert.equal(Object.keys(module.chartGuidance).length, 50);
assert.equal(Object.keys(dom.window.NaturePlot.chartGuidance).length, 50);
const { createServer } = await import('vite');
const sourceServer = await createServer({ configFile: false, server: { middlewareMode: true } });
const { options: sampleOptions } = await sourceServer.ssrLoadModule('/demo/samples.ts');
await sourceServer.close();
for (const type of Object.keys(module.chartTypes)) {
  const input = sampleOptions(type);
  for (const api of [module, dom.window.NaturePlot]) {
    const instance = api.createChart('#chart', input);
    assert.doesNotMatch(instance.toSVG(), /NaN|Infinity|undefined/);
    assert.ok(instance.data.length > 0);
    instance.destroy();
  }
}
console.log('All 50 charts passed ES module and browser IIFE package smoke checks.');
for(const api of [module,dom.window.NaturePlot]) for(const type of Object.keys(module.chartTypes)) {
  const chart=api.createChart('#chart',sampleOptions(type));
  for(const detail of ['natural','essential']) {
    chart.update({detail});chart.select(0);
    assert.ok(dom.window.document.querySelector('.np-mark[aria-pressed="true"]'));
    assert.equal(dom.window.document.querySelector('svg image'),null);
    assert.ok(!chart.toSVG().includes('data:image'));
  }
  chart.destroy();
}
console.log('All 50 charts passed native and essential SVG, selection and export checks in both package formats.');
dom.window.close();
