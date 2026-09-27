import { afterEach, describe, expect, it, vi } from 'vitest';
import { NaturePlot, chartTypes } from '../src';
import type { ChartOptions } from '../src';
import { clockMinutes, denomination, normalizeData } from '../src/utils';
import { options, types, resetChartOptions } from '../demo/samples';

const charts: NaturePlot[] = [];
function render(options: ChartOptions) {
  const host = document.createElement('div'); document.body.append(host);
  const chart = new NaturePlot(host, options); charts.push(chart);
  return { host, chart };
}
afterEach(() => { charts.forEach(chart => chart.destroy()); charts.length = 0; document.body.replaceChildren(); });

describe('the complete collection', () => {
  it('exposes fifty built-in charts and switches through every data schema', () => {
    expect(types).toHaveLength(50);
    types.forEach(type => expect(chartTypes[type]).toBeDefined());
    const { chart, host } = render(options('garden'));
    for (const type of types) {
      chart.update({ ...resetChartOptions, ...options(type) });
      expect(host.querySelectorAll('.np-mark').length, type).toBe(chart.data.length);
      const svg = chart.toSVG();
      expect(svg, type).not.toMatch(/NaN|Infinity|undefined/);
      expect(new DOMParser().parseFromString(svg, 'image/svg+xml').querySelector('parsererror'), type).toBeNull();
      expect(host.querySelectorAll('tbody tr').length, type).toBe(chart.data.length);
    }
  });
  it.each(types.slice(8))('%s supports an empty state and export without external assets', type => {
    const { chart, host } = render({ ...options(type), data: [] });
    expect(host.textContent).toContain('Room to grow');
    expect(chart.toSVG()).not.toMatch(/NaN|Infinity|undefined|https?:\/\/(?!www\.w3\.org)/);
  });
});

describe('calibrated quantity encodings', () => {
  it('counts whole and fractional seeds without replacing missing values with zero', () => {
    const { host, chart } = render({ type: 'seed-ledger', data: [{ value: 23.5 }, { value: 0 }, { value: null }, { value: .000001 }] });
    const marks = host.querySelectorAll('.np-mark');
    expect(marks[0].querySelectorAll(':scope > g')).toHaveLength(24);
    expect(marks[1].textContent).toContain('No seeds yet');
    expect(marks[2].textContent).toContain('Not recorded');
    expect(marks[3].querySelectorAll(':scope > g')).toHaveLength(1);
    expect(chart.data[0].value).toBe(23.5);
    expect(host.textContent).toContain('1 seed = 1');
  });
  it('uses an explicit effective denomination for large seed and cord totals', () => {
    expect(denomination([{ value: 1000 }], 1, 40)).toBe(25);
    const seed = render({ type: 'seed-ledger', unitsPerMark: 1, data: [{ value: 1000 }] });
    expect(seed.host.querySelectorAll('.np-mark > g')).toHaveLength(40);
    expect(seed.host.textContent).toContain('1 seed = 25');
    const cord = render({ type: 'cord-ledger', unitsPerMark: 1, data: [{ value: 1000 }] });
    expect(cord.host.querySelectorAll('.np-mark [data-specimen="knot"]')).toHaveLength(20);
    expect(cord.host.textContent).toContain('1 knot = 50');
  });
  it('places water at its exact fraction of capacity and preserves overflow', () => {
    const { chart, host } = render({ type: 'waterline', data: [{ value: 25, target: 100 }], thresholds: [{ label: 'Reserve', value: 50 }] });
    const level = host.querySelector('.np-water-level')!;
    expect(Number(level.getAttribute('height')) / 230).toBe(.25);
    chart.update({ data: [{ value: 125, target: 100 }] });
    expect(Number(host.querySelector('.np-water-level')!.getAttribute('height'))).toBe(230);
    expect(host.querySelector('.np-mark')!.getAttribute('aria-label')).toContain('125 / 100');
    expect(host.querySelector('tfoot')!.textContent).toContain('Reserve: 50');
  });
  it('makes elapsed and remaining clock readings equivalent while retaining their input convention', () => {
    const elapsed = render({ type: 'water-clock', timeMode: 'elapsed', data: [{ value: 9, target: 25 }] });
    const remaining = render({ type: 'water-clock', timeMode: 'remaining', data: [{ value: 16, target: 25 }] });
    expect(elapsed.host.querySelector('.np-clock-water')!.getAttribute('height')).toBe(remaining.host.querySelector('.np-clock-water')!.getAttribute('height'));
    expect(elapsed.host.textContent).toContain('Input: 9 elapsed');
    elapsed.chart.update({ data: [{ value: 30, target: 25 }] });
    expect(elapsed.host.querySelector('.np-clock-water')!.getAttribute('height')).toBe('0');
    expect(elapsed.host.textContent).toContain('5 beyond duration');
  });
  it('gives equal balance values equal bars and reports the signed difference', () => {
    const { chart, host } = render({ type: 'balance', max: 100, data: [{ value: 50 }, { value: 50 }] });
    const widths = [...host.querySelectorAll('.np-balance-amount')].map(node => Number(node.getAttribute('width')));
    expect(widths).toEqual([65, 65]);
    chart.update({ data: [{ value: 72 }, { value: 54 }] });
    expect(host.textContent).toContain('Right − left: -18');
    chart.update({ data: [{ value: null }, { value: 54 }] });
    expect(host.textContent).toContain('Difference unavailable');
  });
  it('distinguishes radial thickness from annular area and keeps comparison bars linear', () => {
    const { chart, host } = render({ type: 'growth-history', data: [{ value: 1 }, { value: 2 }, { value: 3 }] });
    const layers = () => [...host.querySelectorAll('.np-growth-layer')].map(node => [Number(node.getAttribute('data-inner-radius')), Number(node.getAttribute('data-outer-radius'))]);
    const thickness = layers().map(([inner, outer]) => outer - inner);
    expect(thickness[1] / thickness[0]).toBeCloseTo(2);
    expect(thickness[2] / thickness[0]).toBeCloseTo(3);
    chart.update({ growthMode: 'area' });
    const areas = layers().map(([inner, outer]) => Math.PI * (outer * outer - inner * inner));
    expect(areas[1] / areas[0]).toBeCloseTo(2);
    expect(areas[2] / areas[0]).toBeCloseTo(3);
    const bars = [...host.querySelectorAll('.np-growth-comparison')].map(node => Number(node.getAttribute('width')));
    expect(bars[1] / bars[0]).toBeCloseTo(2);
  });
  it('does not allocate growth to missing periods, but keeps them accessible', () => {
    const { host } = render({ type: 'growth-history', data: [{ label: 'Known', value: 5 }, { label: 'Unknown', value: null }, { label: 'None', value: 0 }] });
    expect(host.querySelectorAll('.np-growth-layer')).toHaveLength(1);
    expect(host.querySelectorAll('.np-mark')).toHaveLength(3);
    expect(host.querySelectorAll('.np-mark')[1].getAttribute('aria-label')).toContain('No data');
  });
});

describe('time without invented dates or durations', () => {
  it('uses exclusive day interval ends, including a complete 24-hour arc', () => {
    expect(clockMinutes('24:00', true)).toBe(1440);
    const { host, chart } = render({ type: 'sundial', data: [{ label: 'Day', start: '00:00', end: '24:00' }] });
    expect(host.querySelector('tbody')!.textContent).toContain('1440 min');
    expect(chart.data[0]).toMatchObject({ value: null, start: '00:00', end: '24:00' });
    const arc = host.querySelector('.np-interval')!;
    expect(Number(arc.getAttribute('data-end-angle')) - Number(arc.getAttribute('data-start-angle'))).toBeCloseTo(Math.PI * 2);
    expect(arc.getAttribute('d')!.match(/A/g)).toHaveLength(4);
  });
  it('allows adjacent intervals and overlapping intervals only on separate tracks', () => {
    const adjacent = [{ start: '09:00', end: '10:00' }, { start: '10:00', end: '11:00' }];
    expect(() => normalizeData({ type: 'sundial', data: adjacent })).not.toThrow();
    expect(() => normalizeData({ type: 'sundial', data: [{ start: '09:00', end: '11:00' }, { start: '10:00', end: '12:00' }] })).toThrow(/overlap/);
    expect(() => normalizeData({ type: 'sundial', data: [{ start: '09:00', end: '11:00', track: 'A' }, { start: '10:00', end: '12:00', track: 'B' }] })).not.toThrow();
  });
  it('positions February by its real 29 days in a leap year', () => {
    const { host } = render({ type: 'season-wheel', year: 2024, data: [{ label: 'February', start: '2024-02-01', end: '2024-03-01' }] });
    const arc = host.querySelector('.np-interval')!;
    expect((Number(arc.getAttribute('data-end-angle')) - Number(arc.getAttribute('data-start-angle'))) / (2 * Math.PI)).toBeCloseTo(29 / 366);
    expect(host.querySelector('tbody')!.textContent).toContain('29 days');
  });
  it('permits January 1 next year as an exclusive end, but rejects cross-year starts', () => {
    expect(() => normalizeData({ type: 'season-wheel', year: 2026, data: [{ start: '2026-12-01', end: '2027-01-01' }] })).not.toThrow();
    expect(() => normalizeData({ type: 'season-wheel', year: 2026, data: [{ start: '2025-12-01', end: '2026-01-15' }] })).toThrow(/selected year/);
  });
  it('keeps observed dates separate from expectations and unobserved stages', () => {
    const { chart, host } = render({ type: 'phenology', startDate: '2026-03-01', endDate: '2026-03-31', data: [{ label: 'Observed', observedAt: '2026-03-16', expectedStart: '2026-03-10', expectedEnd: '2026-03-20' }, { label: 'Expected', expectedStart: '2026-03-20', expectedEnd: '2026-03-25' }, { label: 'Unknown' }] });
    expect(Number(host.querySelector('.np-observed-stage')!.getAttribute('data-x'))).toBeCloseTo(174 + 345 / 2);
    expect(host.querySelectorAll('.np-observed-stage')).toHaveLength(1);
    expect(host.querySelectorAll('.np-expected-window')).toHaveLength(2);
    expect(chart.data[1].observedAt).toBeUndefined();
    expect(host.querySelector('tbody')!.textContent).toContain('Not yet scheduled');
  });
  it.each([
    ['sundial', { data: [{ start: '23:00', end: '01:00' }] }, /advance/],
    ['sundial', { data: [{ start: '9:00', end: '10:00' }] }, /HH:mm/],
    ['sundial', { data: [{ start: '24:00', end: '24:00' }] }, /outside/],
    ['season-wheel', { data: [{ start: '2025-02-29', end: '2025-03-01' }] }, /date/],
    ['phenology', { data: [{ expectedStart: '2026-03-01' }] }, /both/],
    ['phenology', { data: [{ expectedStart: '2026-03-10', expectedEnd: '2026-03-01' }] }, /before/],
    ['phenology', { startDate: '2026-03-01', endDate: '2026-03-31', data: [{ observedAt: '2026-04-01' }] }, /outside/],
  ] as const)('rejects invalid temporal input for %s', (type, patch, message) => {
    expect(() => normalizeData({ type, ...patch, data: [...patch.data] })).toThrow(message);
  });
});

describe('cycles retain their own measurement system', () => {
  it('uses explicit cycle positions rather than evenly spacing tidal observations', () => {
    const { host } = render({ type: 'tidal-rhythm', cycleLength: 24, data: [{ position: 0, value: 0 }, { position: 6, value: 5 }, { position: 24, value: 10 }] });
    const xs = [...host.querySelectorAll('.np-mark')].map(node => Number(node.getAttribute('cx')));
    expect((xs[1] - xs[0]) / (xs[2] - xs[0])).toBe(.25);
  });
  it('shares one scale across cycles and preserves signed data and gaps', () => {
    const { host } = render({ type: 'tidal-rhythm', data: [{ cycle: 'A', position: 0, value: -10 }, { cycle: 'A', position: 4, value: null }, { cycle: 'A', position: 8, value: 10 }, { cycle: 'B', position: 0, value: -10 }, { cycle: 'B', position: 8, value: 10 }] });
    expect(host.querySelectorAll('.np-cycle-area')).toHaveLength(3);
    const ys = [...host.querySelectorAll('.np-mark')].map(node => Number(node.getAttribute('cy')));
    expect(ys[0] - ys[2]).toBeCloseTo(ys[3] - ys[4]);
    expect(host.textContent).toContain('-10');
  });
  it('keeps keyboard selection in data order even when cycle records are interleaved', () => {
    const onSelect = vi.fn();
    const { host } = render({ type: 'tidal-rhythm', onSelect, data: [{ cycle: 'A', position: 0, value: 1 }, { cycle: 'B', position: 0, value: 2 }, { cycle: 'A', position: 1, value: 3 }] });
    const first = host.querySelector<SVGElement>('[data-index="0"]')!; first.focus();
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.activeElement?.getAttribute('data-index')).toBe('1');
    document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ cycle: 'B', value: 2, position: 0 }), 1);
  });
  it('labels lunar symbols as abstract and keeps quantity separate from position', () => {
    const { chart, host } = render({ type: 'lunar-cycle', cycleLength: 30, data: [{ label: 'Review', position: 15, value: 8 }] });
    expect(chart.toSVG()).toContain('not computed astronomical phases');
    expect(host.querySelector('tbody')!.textContent).toContain('15');
    expect(host.querySelector('.np-mark')!.getAttribute('aria-label')).toContain('Position: 15');
  });
  it.each([
    { type: 'star-cycle', cycleLength: 12, data: [{ position: 12, value: 1 }] },
    { type: 'lunar-cycle', data: [{ position: 2, value: 1 }, { position: 2, value: 3 }] },
    { type: 'tidal-rhythm', data: [{ position: 3, value: 1 }, { position: 2, value: 3 }] },
    { type: 'tidal-rhythm', cycleLength: 0, data: [] },
  ])('rejects ambiguous or out-of-range cycles: $type', input => {
    expect(() => normalizeData(input)).toThrow(/cycle|position|increase/);
  });
});

describe('validation and ownership for instrument options', () => {
  it('copies threshold objects and preserves a valid chart after a rejected update', () => {
    const thresholds = [{ label: 'Reserve', value: 20 }];
    const { chart, host } = render({ type: 'waterline', data: [{ value: 50 }], thresholds });
    thresholds[0].value = 500; thresholds[0].label = 'Changed externally';
    chart.setTheme('ocean');
    expect(host.textContent).toContain('Reserve');
    expect(host.textContent).not.toContain('Changed externally');
    const previous = chart.toSVG();
    expect(() => chart.update({ thresholds: [{ label: 'Too high', value: 101 }] })).toThrow(/capacity/);
    expect(chart.toSVG()).toBe(previous);
  });
  it.each([
    { type: 'balance', data: [{ value: 1 }] },
    { type: 'seed-ledger', unitsPerMark: 0, data: [{ value: 1 }] },
    { type: 'seed-ledger', data: [{ value: -1 }] },
    { type: 'cord-ledger', data: [{ track: 'A', value: 1 }, { track: 'B', value: 1 }, { track: 'A', value: 1 }] },
    { type: 'waterline', data: [{ value: 1 }], thresholds: [{ label: 'A', value: 1 }, { label: 'B', value: 1 }] },
    { type: 'growth-history', growthMode: 'radius', data: [{ value: 1 }] },
  ])('rejects misleading quantity configuration for $type', input => {
    expect(() => normalizeData(input as ChartOptions)).toThrow();
  });
  it.each(['seed-ledger', 'cord-ledger', 'growth-history', 'balance', 'tidal-rhythm', 'lunar-cycle', 'star-cycle'])('keeps %s geometry finite for large values within the supported magnitude range', type => {
    const data = [{ value: 1e100 }, { value: 1e100 }];
    const { chart } = render({ type, data, ...(['lunar-cycle', 'star-cycle', 'tidal-rhythm'].includes(type) ? { cycleLength: 1e100 } : {}) });
    expect(chart.toSVG()).not.toMatch(/NaN|Infinity/);
  });
});
