// Run against an installed wheel: node tests/python-package-smoke.mjs /path/to/venv/bin/python
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { JSDOM, VirtualConsole } from 'jsdom';
import { createServer } from 'vite';
import { chartTypes, version } from '../dist/natureplot.js';

const python = process.argv[2];
if (!python) throw new Error('Pass the Python executable from a clean environment with the built wheel installed.');
const server = await createServer({ configFile: false, server: { middlewareMode: true } });
const { options } = await server.ssrLoadModule('/demo/samples.ts');
await server.close();
const cases = Object.keys(chartTypes).map(type => options(type));
const result = spawnSync(python, ['-c', `
import json, sys
from natureplot import Chart, __version__
charts = []
for options in json.load(sys.stdin):
    chart = Chart(options.pop("type"), options.pop("data"), **options)
    charts.append(chart.to_html())
unsafe = '</script><script>window.injected=true</script><img src=x onerror=alert(1)>'
chart = Chart("forest", [{"label": unsafe, "value": 2}], title=unsafe)
charts.append(chart.to_html())
charts.append(Chart("forest", [{"value": -1}]).to_html())
charts.append(Chart("forest", [{"value": 1}]).to_html(include_js=False))
first = Chart("forest", [{"value": 1}]).to_html(full_document=False)
second = Chart("bloom", [{"value": 2}]).to_html(full_document=False, include_js=False)
charts.append(first + second)
print(json.dumps({"version": __version__, "charts": charts}))
`], { input: JSON.stringify(cases), encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
assert.equal(result.status, 0, result.stderr);
const { charts, version: pythonVersion } = JSON.parse(result.stdout);
assert.equal(pythonVersion, version);
let count = 0;
for (const source of charts) {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error));
  const dom = new JSDOM(source, { runScripts: 'dangerously', virtualConsole });
  const { document } = dom.window;
  assert.deepEqual(errors, []);
  if (count < 51) {
    assert.equal(document.querySelectorAll('.np-chart > svg').length, 1, `Chart ${count} did not render: ${document.querySelector('[role=alert]')?.textContent}`);
    assert.equal(document.querySelector('[role=alert]').hidden, true);
    const host = document.querySelector('.natureplot-python > div');
    const chart = host.natureplot;
    assert.doesNotMatch(chart.toSVG(), /NaN|Infinity/);
    if (chart.data.length) {
      document.querySelector('.np-controls button').click();
      assert.ok(document.querySelector('.np-mark[aria-pressed=true]'), `Chart ${count} selection did not work`);
      chart.update({ showTable: true });
      assert.ok(document.querySelector('.np-table'));
    }
    assert.equal(dom.window.injected, undefined);
    assert.equal(document.querySelector('img'), null);
    assert.equal(document.querySelector('[id$=-export]').hidden, false);
  } else if (count < 53) {
    assert.equal(document.querySelector('[role=alert]').hidden, false);
    assert.ok(document.querySelector('[role=alert]').textContent.length > 0);
  } else {
    assert.equal(document.querySelectorAll('.np-chart > svg').length, 2);
    assert.equal(new Set([...document.querySelectorAll('[id]')].map(node => node.id)).size, document.querySelectorAll('[id]').length);
  }
  dom.window.close();
  count++;
}
console.log('Installed Python wheel: all 50 charts render, select, show data, and export SVG. Escaping, validation errors, missing runtime, and shared-runtime fragments passed.');
