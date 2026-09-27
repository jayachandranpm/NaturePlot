import { afterEach, describe, expect, it, vi } from 'vitest';
import { NaturePlot, createChart, registerChart, themes } from '../src';
import { addDays, normalizeData, parseDate } from '../src/utils';
import type { ChartOptions, ChartType } from '../src';

const instances: NaturePlot[] = [];
function create(options: ChartOptions) {
  const host = document.createElement('div');
  document.body.append(host);
  const chart = new NaturePlot(host, options);
  instances.push(chart);
  return { chart, host };
}
afterEach(() => { instances.forEach(c => c.destroy()); instances.length = 0; document.body.replaceChildren(); });

describe('real calendar windows', () => {
  it('fills exactly 49 dates spanning a year, retaining zero and missing values distinctly', () => {
    const { chart, host } = create({ type: 'rainbow', startDate: '2025-12-20', data: [{ date: '2025-12-20', value: 0 }, { date: '2026-01-01', value: 8 }] });
    expect(chart.data).toHaveLength(49);
    expect(chart.data[0].value).toBe(0);
    expect(chart.data[1].value).toBeNull();
    expect(chart.data.at(-1)?.date).toBe('2026-02-06');
    expect(host.querySelectorAll('.np-mark')).toHaveLength(49);
    expect(host.querySelectorAll('tbody tr')).toHaveLength(49);
  });
  it.each([['2024-02-01', 29], ['2025-02-01', 28], ['2026-09-01', 30], ['2026-10-01', 31]])('renders every date in %s', (startDate, count) => {
    const { chart, host } = create({ type: 'garden', startDate, data: [] });
    expect(chart.data).toHaveLength(count);
    expect(host.querySelectorAll('.np-mark')).toHaveLength(count);
    // Each stem has one 39px-wide ground shadow. 30 dates produce three plants.
    expect(host.querySelectorAll('ellipse[rx="39"]')).toHaveLength(Math.ceil(count / 10));
  });
  it('is unaffected by daylight saving transitions', () => {
    expect(addDays('2026-03-07', 2)).toBe('2026-03-09');
    expect(addDays('2026-10-31', 2)).toBe('2026-11-02');
  });
  it.each(['2026-02-30', '2025-02-29', '2026-13-01', '2026-9-01', 'not-a-date'])('rejects invalid dates: %s', date => {
    expect(() => parseDate(date)).toThrow(/date/);
  });
  it('rejects duplicate, out-of-range, and excess undated entries', () => {
    expect(() => normalizeData({ type: 'garden', startDate: '2026-09-01', data: [{ date: '2026-09-01', value: 1 }, { date: '2026-09-01', value: 2 }] })).toThrow(/duplicate/);
    expect(() => normalizeData({ type: 'garden', startDate: '2026-09-01', data: [{ date: '2026-10-01', value: 1 }] })).toThrow(/outside/);
    expect(() => normalizeData({ type: 'garden', startDate: '2026-09-01', data: Array.from({ length: 31 }, () => ({ value: 1 })) })).toThrow(/outside/);
  });
});

describe('data integrity and lifecycle', () => {
  it('renders all built-in types without invalid geometry', () => {
    for (const type of ['rainbow', 'garden', 'forest', 'river', 'bloom', 'mountain', 'tide', 'rings'] as ChartType[]) {
      const { chart } = create({ type, data: [{ label: 'One', value: 0 }, ...(type === 'tide' ? [] : [{ label: 'Two', value: null }, { label: 'Three', value: 10 }])], startDate: '2026-09-01' });
      expect(chart.toSVG()).not.toMatch(/NaN|Infinity|undefined/);
    }
  });
  it('keeps the previous chart intact after an invalid update', () => {
    const { chart, host } = create({ type: 'forest', data: [{ value: 5 }] });
    const svg = host.querySelector('svg');
    expect(() => chart.update({ data: [{ value: -3 }] })).toThrow(/nonnegative/);
    expect(host.querySelector('svg')).toBe(svg);
    expect(chart.data[0].value).toBe(5);
  });
  it.each([NaN, Infinity, -Infinity])('rejects non-finite %s', value => {
    expect(() => create({ type: 'river', data: [{ value }] })).toThrow(/finite/);
  });
  it('rejects sparse arrays instead of emitting invalid geometry', () => {
    expect(() => create({ type: 'forest', data: new Array(2) })).toThrow(/finite/);
  });
  it('downloads the serialized SVG and releases its temporary URL', () => {
    vi.useFakeTimers();
    const createURL = vi.fn(() => 'blob:natureplot-test');
    const revokeURL = vi.fn();
    vi.stubGlobal('URL', { createObjectURL: createURL, revokeObjectURL: revokeURL });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      expect(this.download).toBe('my-chart.svg');
      expect(this.href).toBe('blob:natureplot-test');
      expect(document.body.contains(this)).toBe(true);
    });
    try {
      const { chart } = create({ type: 'tide', data: [{ value: 42 }] });
      chart.download('my-chart');
      expect(click).toHaveBeenCalledOnce();
      expect(createURL.mock.calls[0][0]).toBeInstanceOf(Blob);
      expect(document.querySelector('a[download]')).toBeNull();
      vi.runAllTimers();
      expect(revokeURL).toHaveBeenCalledWith('blob:natureplot-test');
    } finally {
      click.mockRestore();
      vi.unstubAllGlobals();
      vi.useRealTimers();
    }
  });
  it('rejects impossible maxima, targets and unknown renderers', () => {
    expect(() => create({ type: 'forest', data: [{ value: 5 }], max: 2 })).toThrow(/max/);
    expect(() => create({ type: 'tide', data: [{ value: 5 }], target: 0 })).toThrow(/target/);
    expect(() => create({ type: 'tide', data: [{ value: 1 }, { value: 2 }] })).toThrow(/one observation/);
    expect(() => create({ type: 'constructor', data: [] })).toThrow(/unknown chart/);
  });
  it('defensively copies input and returned data', () => {
    const data = [{ label: 'First', value: 5 }];
    const { chart } = create({ type: 'forest', data });
    data[0].value = 99;
    chart.data[0].value = 88;
    chart.setTheme('ocean');
    expect(chart.data[0].value).toBe(5);
  });
  it('changes palettes and safely escapes untrusted labels', () => {
    const { chart, host } = create({ type: 'forest', title: '<script>bad()</script>', data: [{ label: '<img src=x onerror=bad()>', value: 2 }] });
    chart.setTheme('ocean');
    expect(chart.toSVG()).toContain(themes.ocean.background);
    expect(host.querySelector('img')).toBeNull();
    expect(chart.toSVG()).toContain('&lt;script&gt;');
    expect(chart.toSVG()).toContain('&lt;img');
    expect(() => chart.setTheme({ ...themes.meadow, colors: ['url(https://example.com)'] })).toThrow(/hex/);
  });
  it('destroys only its own DOM, is idempotent, and prevents stale mutation', () => {
    const { chart, host } = create({ type: 'forest', data: [] });
    const sibling = document.createElement('span');
    host.append(sibling);
    chart.destroy(); chart.destroy();
    expect(host.children).toHaveLength(1);
    expect(host.firstElementChild).toBe(sibling);
    expect(() => chart.update({ data: [] })).toThrow(/destroyed/);
    expect(() => chart.toSVG()).toThrow(/destroyed/);
  });
  it('exports standalone parseable SVG with dimensions and independent IDs', () => {
    const first = create({ type: 'river', data: [{ value: 4 }, { value: 8 }] });
    const second = create({ type: 'river', data: [{ value: 2 }, { value: 9 }] });
    expect(first.chart.id).not.toBe(second.chart.id);
    const doc = new DOMParser().parseFromString(first.chart.toSVG(), 'image/svg+xml');
    expect(doc.querySelector('parsererror')).toBeNull();
    expect(doc.documentElement.getAttribute('width')).toBe('640');
    expect(doc.documentElement.namespaceURI).toBe('http://www.w3.org/2000/svg');
    expect(doc.querySelector('[tabindex]')).toBeNull();
    const path = doc.querySelector('path[fill^="url"]')!;
    expect(path.getAttribute('fill')).toBe(`url(#${first.chart.id}-area)`);
    expect(doc.getElementById(`${first.chart.id}-area`)).not.toBeNull();
  });
});

describe('quantitative encodings', () => {
  it('places forest tree tips on a shared zero-based height scale', () => {
    const { host } = create({ type: 'forest', max: 10, data: [{ value: 5 }, { value: 10 }, { value: 0 }] });
    const marks = host.querySelectorAll('.np-mark');
    const half = marks[0].querySelector('path[fill]')!.getAttribute('d')!;
    const full = marks[1].querySelector('path[fill]')!.getAttribute('d')!;
    expect(Number(half.match(/^M[^ ]+ ([^ ]+)/)![1])).toBe(174);
    expect(Number(full.match(/^M[^ ]+ ([^ ]+)/)![1])).toBe(72);
    expect(marks[2].querySelector('circle')?.getAttribute('cy')).toBe('276');
  });
  it.each(['river', 'mountain'])('%s preserves negatives and does not bridge missing observations', type => {
    const { chart, host } = create({ type, data: [{ value: -10 }, { value: 0 }, { value: null }, { value: 10 }] });
    expect(host.querySelectorAll('path[fill^="url"]')).toHaveLength(2);
    expect(host.querySelectorAll('.np-mark')).toHaveLength(4);
    expect(chart.toSVG()).not.toMatch(/NaN|Infinity/);
    expect(host.textContent).toContain('-10');
  });
  it('preserves over-target values while clamping water fill', () => {
    const { host } = create({ type: 'tide', data: [{ value: 125, target: 100 }] });
    expect(host.textContent).toContain('125%');
    expect(host.querySelector('g[clip-path] path')?.getAttribute('d')).toContain('M190 57');
    expect(host.querySelector('.np-mark')?.getAttribute('aria-label')).toContain('125 / 100');
  });
});

describe('keyboard, events, and extensibility', () => {
  it('uses roving focus, shows details, and selects with Enter', () => {
    const onSelect = vi.fn();
    const { host } = create({ type: 'forest', data: [{ label: 'A', value: 4 }, { label: 'B', value: 8 }], onSelect });
    const listener = vi.fn(); host.addEventListener('natureplot:select', listener);
    const marks = host.querySelectorAll<SVGElement>('.np-mark');
    marks[0].focus();
    marks[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.activeElement).toBe(marks[1]);
    expect(marks[0].getAttribute('tabindex')).toBe('-1');
    expect(marks[1].getAttribute('tabindex')).toBe('0');
    expect(host.querySelector<HTMLDivElement>('.np-tooltip')?.hidden).toBe(false);
    marks[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(onSelect).toHaveBeenCalledWith({ label: 'B', value: 8 }, 1);
    expect(listener).toHaveBeenCalledOnce();
    marks[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(host.querySelector<HTMLDivElement>('.np-tooltip')?.hidden).toBe(true);
  });
  it('supports a custom renderer through the same safe primitives', () => {
    registerChart('test-seed', ctx => { const circle = ctx.el('circle', { cx: 320, cy: 180, r: 15 }); ctx.mark(circle, ctx.data[0], 0); }, { name: 'Seed', category: 'Comparison', subtitle: 'A seed', description: 'A custom renderer', encoding: 'A dot' });
    const { host } = create({ type: 'test-seed', data: [{ value: 3 }] });
    expect(host.querySelector('.np-mark')?.getAttribute('r')).toBe('15');
    expect(() => registerChart('forest', () => {}, {} as never)).toThrow(/unique/);
  });
  it('accepts selectors through the convenience factory and reports missing targets', () => {
    const host = document.createElement('div'); host.id = 'target'; document.body.append(host);
    const chart = createChart('#target', { type: 'forest', data: [] }); instances.push(chart);
    expect(host.textContent).toContain('Room to grow');
    expect(() => createChart('#missing', { type: 'forest', data: [] })).toThrow(/container/);
  });
});
