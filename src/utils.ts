import type { ChartOptions, DataPoint, RenderContext } from './types.js';
import { validateEcology } from './ecology-validation.js';
export const NS = 'http://www.w3.org/2000/svg';
export function parseDate(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`NaturePlot: invalid ISO date "${value}". Use YYYY-MM-DD.`);
  const date = new Date(value + 'T00:00:00Z');
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) throw new Error(`NaturePlot: invalid calendar date "${value}".`);
  return date;
}
export function addDays(value: string, offset: number): string {
  const date = parseDate(value);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}
export function dateLabel(value: string): string {
  return parseDate(value).toLocaleDateString('en', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}
export function clockMinutes(value: string, allowEnd = false): number {
  if (typeof value !== 'string' || !/^\d{2}:\d{2}$/.test(value)) throw new Error('NaturePlot: clock times must use HH:mm.');
  const [hours, minutes] = value.split(':').map(Number);
  if (minutes > 59 || hours > 23 && !(allowEnd && hours === 24 && minutes === 0)) throw new Error('NaturePlot: clock time is outside the day; only an interval end may be 24:00.');
  return hours * 60 + minutes;
}
export function seasonYear(options: ChartOptions, data: DataPoint[]): number {
  return options.year ?? (data[0]?.start ? Number(data[0].start.slice(0, 4)) : new Date().getUTCFullYear());
}
export function yearStart(year: number): string { return `${String(year).padStart(4, '0')}-01-01`; }
export function cycleSpan(options: ChartOptions): number { return options.cycleLength ?? (options.type === 'star-cycle' ? 12 : options.type === 'tidal-rhythm' ? 24 : 30); }
export function targetOf(point: DataPoint, options: ChartOptions): number | undefined {
  if (options.type === 'cairn') return options.target ?? 100;
  return point.target ?? (['tide', 'rings', 'waterline', 'water-clock', 'lotus', 'cairn'].includes(options.type) ? options.target ?? 100 : undefined);
}
export function denomination(data: DataPoint[], base = 1, limit = 40): number {
  const largest = Math.max(0, ...data.map(point => point.value ?? 0));
  if (largest / base <= limit) return base;
  const factor = Math.ceil(largest / limit / base);
  const multiple = factor * base;
  return Number.isFinite(multiple) && multiple > 0 ? multiple : largest / limit;
}
export function normalizeData(options: ChartOptions): DataPoint[] {
  if (options.detail !== undefined && !['natural','essential'].includes(options.detail)) throw new Error('NaturePlot: detail must be natural or essential.');
  if (options.artwork !== undefined && !['illustrated','vector'].includes(options.artwork)) throw new Error('NaturePlot: artwork must be illustrated or vector.');
  if (!Array.isArray(options.data)) throw new Error('NaturePlot: data must be an array.');
  if (options.data.length > 1000) throw new Error('NaturePlot: use at most 1,000 observations; aggregate larger datasets first.');
  for (const key of ['title', 'description', 'unit', 'cycleUnit', 'xLabel', 'yLabel', 'weightLabel'] as const) {
    if (options[key] !== undefined && typeof options[key] !== 'string') throw new Error(`NaturePlot: ${key} must be a string.`);
  }
  const temporal = ['sundial', 'season-wheel', 'phenology', 'daylight'].includes(options.type);
  const nonnegative = ['rainbow', 'garden', 'forest', 'bloom', 'tide', 'rings', 'seed-ledger', 'waterline', 'lunar-cycle', 'water-clock', 'balance', 'cord-ledger', 'growth-history', 'star-cycle'].includes(options.type);
  const data: DataPoint[] = Array.from(options.data, (point, i) => {
    if (!point || typeof point !== 'object') throw new Error(`NaturePlot: data[${i}].value must be a finite number or null.`);
    const value = temporal && point.value === undefined ? null : point.value;
    if (value !== null && (typeof value !== 'number' || !Number.isFinite(value))) throw new Error(`NaturePlot: data[${i}].value must be a finite number or null.`);
    if (nonnegative && value !== null && value < 0) throw new Error(`NaturePlot: ${options.type} requires nonnegative values.`);
    for (const field of ['label', 'track', 'cycle', 'start', 'end', 'observedAt', 'expectedStart', 'expectedEnd'] as const) {
      if (point[field] !== undefined && typeof point[field] !== 'string') throw new Error(`NaturePlot: data[${i}].${field} must be a string.`);
    }
    if (point.date !== undefined) parseDate(point.date);
    if (point.target !== undefined && (!Number.isFinite(point.target) || point.target <= 0)) throw new Error('NaturePlot: targets must be positive numbers.');
    if (point.position !== undefined && !Number.isFinite(point.position)) throw new Error('NaturePlot: cycle positions must be finite numbers.');
    return { ...point, value };
  });
  if (options.max !== undefined && (!Number.isFinite(options.max) || options.max <= 0 || data.some(p => p.value !== null && p.value > options.max!))) throw new Error('NaturePlot: max must be positive and at least the largest value.');
  if (options.target !== undefined && (!Number.isFinite(options.target) || options.target <= 0)) throw new Error('NaturePlot: target must be a positive number.');
  if (['tide', 'waterline', 'water-clock'].includes(options.type) && data.length > 1) throw new Error(`NaturePlot: ${options.type} accepts one observation. Use rings for multiple goals.`);
  const limits: Record<string, number> = { rings: 8, forest: 24, bloom: 12, 'seed-ledger': 6, 'cord-ledger': 8, 'growth-history': 10, sundial: 12, 'season-wheel': 12, phenology: 6, 'lunar-cycle': 24, 'star-cycle': 24 };
  if (limits[options.type] && data.length > limits[options.type]) throw new Error(`NaturePlot: ${options.type} supports at most ${limits[options.type]} observations.`);
  if (options.startDate !== undefined) parseDate(options.startDate);
  if (options.endDate !== undefined) parseDate(options.endDate);
  if (options.type === 'balance' && data.length && data.length !== 2) throw new Error('NaturePlot: balance requires exactly two observations.');
  if (['seed-ledger', 'cord-ledger'].includes(options.type) && options.unitsPerMark !== undefined && (!Number.isFinite(options.unitsPerMark) || options.unitsPerMark <= 0)) throw new Error('NaturePlot: unitsPerMark must be a positive finite number.');
  if (options.type === 'water-clock' && options.timeMode !== undefined && !['remaining', 'elapsed'].includes(options.timeMode)) throw new Error('NaturePlot: timeMode must be remaining or elapsed.');
  if (options.type === 'growth-history' && options.growthMode !== undefined && !['thickness', 'area'].includes(options.growthMode)) throw new Error('NaturePlot: growthMode must be thickness or area.');
  if (options.type === 'waterline' && options.thresholds !== undefined) {
    if (!Array.isArray(options.thresholds) || options.thresholds.length > 6) throw new Error('NaturePlot: use at most 6 thresholds.');
    const capacity = data[0]?.target ?? options.target ?? 100;
    const seen = new Set<number>();
    Array.from(options.thresholds).forEach(threshold => {
      if (!threshold || !Number.isFinite(threshold.value) || threshold.value < 0 || threshold.value > capacity || typeof threshold.label !== 'string' || !threshold.label.trim()) throw new Error('NaturePlot: each threshold needs a label and a value between zero and capacity.');
      if (seen.has(threshold.value)) throw new Error('NaturePlot: threshold values must be unique.');
      seen.add(threshold.value);
    });
  }
  if (options.type === 'sundial' || options.type === 'season-wheel') {
    const solar = options.type === 'sundial';
    const year = seasonYear(options, data);
    if (!solar && (!Number.isInteger(year) || year < 1 || year > 9998)) throw new Error('NaturePlot: year must be an integer from 1 to 9998.');
    const begin = solar ? 0 : parseDate(yearStart(year)).getTime();
    const end = solar ? 1440 : parseDate(yearStart(year + 1)).getTime();
    const intervals = data.map((point, i) => {
      if (!point.start || !point.end) throw new Error(`NaturePlot: data[${i}] needs start and end for an interval.`);
      const a = solar ? clockMinutes(point.start) : parseDate(point.start).getTime();
      const b = solar ? clockMinutes(point.end, true) : parseDate(point.end).getTime();
      if (a < begin || b > end || b <= a) throw new Error(`NaturePlot: intervals must advance within the selected ${solar ? 'day' : 'year'}; split intervals that cross its boundary.`);
      return { start: a, end: b, track: point.track ?? 'Schedule' };
    });
    if (new Set(intervals.map(point => point.track)).size > 4) throw new Error('NaturePlot: use at most 4 interval tracks.');
    intervals.forEach((point, i) => {
      if (intervals.slice(0, i).some(other => point.track === other.track && point.start < other.end && point.end > other.start)) throw new Error('NaturePlot: intervals on the same track must not overlap. Use separate tracks for simultaneous activities.');
    });
    if (options.at !== undefined) {
      const at = solar ? clockMinutes(options.at) : parseDate(options.at).getTime();
      if (at < begin || at >= end) throw new Error('NaturePlot: at must fall inside the selected interval window.');
    }
  }
  if (options.type === 'phenology') {
    if ((options.startDate === undefined) !== (options.endDate === undefined)) throw new Error('NaturePlot: provide both startDate and endDate for a fixed stage timeline.');
    if (options.startDate && options.endDate! <= options.startDate) throw new Error('NaturePlot: endDate must be after startDate.');
    data.forEach(point => {
      if ((point.expectedStart === undefined) !== (point.expectedEnd === undefined)) throw new Error('NaturePlot: an expected window requires both expectedStart and expectedEnd.');
      for (const field of ['observedAt', 'expectedStart', 'expectedEnd'] as const) {
        const date = point[field];
        if (date !== undefined) {
          parseDate(date);
          if (options.startDate && (date < options.startDate || date > options.endDate!)) throw new Error('NaturePlot: a stage date falls outside the timeline domain.');
        }
      }
      if (point.expectedStart && point.expectedEnd! < point.expectedStart) throw new Error('NaturePlot: an expected window must not end before it starts.');
    });
  }
  if (['lunar-cycle', 'star-cycle', 'tidal-rhythm'].includes(options.type)) {
    const span = cycleSpan(options);
    if (!Number.isFinite(span) || span <= 0) throw new Error('NaturePlot: cycleLength must be a positive finite number.');
    if (options.cycleUnit !== undefined && typeof options.cycleUnit !== 'string') throw new Error('NaturePlot: cycleUnit must be a string.');
    if (options.cyclePosition !== undefined && (!Number.isFinite(options.cyclePosition) || options.cyclePosition < 0 || options.cyclePosition >= span)) throw new Error('NaturePlot: cyclePosition must be within [0, cycleLength).');
    const cycles = new Map<string, number[]>();
    data.forEach((point, i) => {
      const cycle = options.type === 'tidal-rhythm' ? point.cycle ?? 'Cycle 1' : 'Cycle';
      const positions = cycles.get(cycle) ?? [];
      point.position ??= options.type === 'tidal-rhythm' ? positions.length : i;
      if (point.position < 0 || (options.type === 'tidal-rhythm' ? point.position > span : point.position >= span)) throw new Error('NaturePlot: an observation position falls outside the cycle.');
      if (options.type === 'tidal-rhythm' && positions.length && point.position <= positions.at(-1)!) throw new Error('NaturePlot: positions in each tidal cycle must increase strictly.');
      if (positions.includes(point.position)) throw new Error('NaturePlot: cycle positions must be unique within each cycle.');
      positions.push(point.position); cycles.set(cycle, positions);
      if (options.type === 'tidal-rhythm') point.cycle = cycle;
    });
    if (options.type === 'tidal-rhythm' && (cycles.size > 4 || [...cycles.values()].some(positions => positions.length > 48))) throw new Error('NaturePlot: tidal-rhythm supports at most 4 cycles with 48 observations each.');
  }
  if (options.type === 'cord-ledger') {
    const completed = new Set<string>(); let previous: string | undefined;
    data.forEach(point => {
      const track = point.track ?? 'Contributions';
      if (track !== previous) {
        if (completed.has(track)) throw new Error('NaturePlot: keep each cord track contiguous in input order.');
        if (previous !== undefined) completed.add(previous);
        previous = track;
      }
    });
  }
  // Bound built-in numeric arithmetic before computing sums, ratios, or squared areas.
  // Custom renderers retain the documented generic finite-value contract.
  const builtIn = nonnegative || temporal || ['river', 'mountain', 'tidal-rhythm'].includes(options.type);
  if (builtIn) {
    const safe = (value: number | null | undefined) => value == null || value === 0 || Math.abs(value) >= 1e-100 && Math.abs(value) <= 1e100;
    const numbers = data.flatMap(p => [p.value, p.target, p.position]).concat([options.max, options.target, options.unitsPerMark, options.cycleLength, options.cyclePosition], (options.thresholds ?? []).map(t => t.value));
    if (numbers.some(v => !safe(v))) throw new Error('NaturePlot: built-in numeric magnitudes must be zero or between 1e-100 and 1e100. Rescale the data and state its unit.');
  }
  validateEcology(options, data);
  if (!['rainbow', 'garden'].includes(options.type)) return data;
  const start = options.startDate ?? data.find(p => p.date)?.date ?? new Date().toISOString().slice(0, 10);
  const parsed = parseDate(start);
  const monthEnd = new Date(parsed);
  monthEnd.setUTCMonth(monthEnd.getUTCMonth() + 1, 0);
  const count = options.type === 'rainbow' ? 49 : options.days ?? monthEnd.getUTCDate();
  if (!Number.isInteger(count) || count < 1 || count > 49 || (options.type === 'garden' && count > 31)) throw new Error('NaturePlot: garden days must be an integer between 1 and 31.');
  const days = Array.from({ length: count }, (_, i) => addDays(start, i));
  const map = new Map<string, DataPoint>();
  data.forEach((point, i) => {
    const date = point.date ?? days[i];
    if (!date || !days.includes(date)) throw new Error(`NaturePlot: observation ${i + 1} falls outside the calendar window.`);
    if (map.has(date)) throw new Error(`NaturePlot: duplicate calendar date ${date}.`);
    map.set(date, { ...point, date });
  });
  return days.map(date => map.get(date) ?? { date, value: null });
}
export function maximum(data: DataPoint[], provided?: number): number {
  return provided ?? (Math.max(0, ...data.map(p => p.value ?? 0)) || 1);
}
export function polar(cx: number, cy: number, r: number, angle: number): [number, number] {
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
}
export function arc(cx: number, cy: number, radius: number, start: number, end: number): string {
  const [sx, sy] = polar(cx, cy, radius, start);
  const [ex, ey] = polar(cx, cy, radius, end);
  return `M${sx},${sy} A${radius},${radius} 0 ${end - start > Math.PI ? 1 : 0} 1 ${ex},${ey}`;
}
export function label(ctx: RenderContext, x: number, y: number, text: string, attrs: Record<string, string | number> = {}): SVGTextElement {
  return ctx.el('text', { x, y, fill: ctx.theme.muted, 'font-size': 12, 'text-anchor': 'middle', ...attrs }, undefined, text);
}
export function truncate(value: string, length = 13): string { return value.length > length ? value.slice(0, length - 1) + '…' : value; }
export function pointLabel(point: DataPoint, index: number): string { return point.label ?? (point.date ? dateLabel(point.date) : `Item ${index + 1}`); }
export function intensity(value: number | null, max: number): number { return value === null ? 0.1 : 0.25 + Math.min(1, value / max) * 0.75; }
export function legend(ctx: RenderContext): void {
  const y = 335, ceiling = maximum(ctx.data, ctx.options.max);
  label(ctx, 206, y + 3, ctx.format(0), { 'text-anchor': 'end' });
  for (let i = 0; i < 5; i++) ctx.el('rect', { x: 221 + i * 17, y: y - 8, width: 12, height: 12, rx: 3, fill: ctx.theme.colors[0], opacity: .25 + i * .1875 });
  label(ctx, 319, y + 3, ctx.format(ceiling), { 'text-anchor': 'start' });
  ctx.el('circle', {cx: 423, cy: y-2, r: 5, fill: ctx.theme.grid, stroke: ctx.theme.muted, 'stroke-dasharray': '2 2'});
  label(ctx, 436, y + 3, 'No data', { 'text-anchor': 'start' });
}
