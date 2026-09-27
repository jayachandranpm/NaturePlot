import type { ChartOptions, DataPoint } from './types.js';
import { ecologyMetadata, type EcologyType } from './ecology-catalog.js';
import { clockMinutes, cycleSpan, denomination, pointLabel, targetOf } from './utils.js';
export interface DataColumn { header: string; read: (point: DataPoint, index: number) => string }
/** Shared exact readings for the library table and the showcase data view. */
export function dataColumns(options: ChartOptions, data: DataPoint[], format: (value: number | null) => string): DataColumn[] {
  const columns: DataColumn[] = [{ header: 'Observation', read: pointLabel }];
  const temporal = ['sundial', 'season-wheel', 'phenology', 'daylight'].includes(options.type);
  if (!temporal || data.some(point => point.date)) columns.push({ header: 'Date', read: point => point.date ?? '—' });
  if (!temporal || data.some(point => point.value !== null)) columns.push({ header: 'Value', read: point => format(point.value) });
  if (!temporal) columns.push({ header: 'Target', read: point => { const target = targetOf(point, options); return target === undefined ? '—' : format(target); } });
  if (options.type === 'sundial' || options.type === 'season-wheel' || options.type === 'daylight') columns.push(
    { header: 'Start', read: point => point.start! },
    { header: 'End (exclusive)', read: point => point.end! },
    { header: 'Duration', read: point => options.type !== 'season-wheel' ? `${clockMinutes(point.end!, true) - clockMinutes(point.start!)} min` : `${(Date.parse(point.end!) - Date.parse(point.start!)) / 86400000} days` },
    { header: 'Track', read: point => point.track ?? 'Schedule' },
  );
  if (options.type === 'phenology') columns.push(
    { header: 'Observed', read: point => point.observedAt ?? 'Not observed' },
    { header: 'Expected start', read: point => point.expectedStart ?? '—' },
    { header: 'Expected end', read: point => point.expectedEnd ?? '—' },
    { header: 'Status', read: point => point.observedAt ? 'Observed' : point.expectedStart ? 'Expected, not observed' : 'Not yet scheduled' },
  );
  if (['lunar-cycle', 'star-cycle', 'tidal-rhythm'].includes(options.type)) columns.push({ header: 'Position', read: point => `${point.position}${options.cycleUnit ? ' '+options.cycleUnit : ''}` });
  if (options.type === 'tidal-rhythm') columns.push({ header: 'Cycle', read: point => point.cycle! });
  if (options.type === 'cord-ledger') columns.push({ header: 'Track', read: point => point.track ?? 'Contributions' });
  if (Object.hasOwn(ecologyMetadata, options.type)) {
    for (const key of ['id','parent','source','destination','track','position','angle','x','y','weight','baseline','low','q1','q3','high'] as const) {
      if (data.some(p => p[key] !== undefined) && !columns.some(column => column.header.toLowerCase() === key)) columns.push({ header: key[0].toUpperCase()+key.slice(1), read: p => p[key] === undefined ? '—' : String(p[key]) });
    }
    if (options.type === 'echo') columns.push({ header: 'Previous value', read: (_, i) => i ? format(data[i-1].value) : 'No predecessor' });
  }
  return columns;
}
export function measurementContext(options: ChartOptions, data: DataPoint[], format: (value: number | null) => string): string {
  const notes: string[] = [];
  if (Object.hasOwn(ecologyMetadata, options.type)) notes.push(ecologyMetadata[options.type as EcologyType].encoding);
  if (['seed-ledger', 'cord-ledger'].includes(options.type)) notes.push(`One ${options.type === 'seed-ledger' ? 'seed' : 'knot'} = ${format(denomination(data, options.unitsPerMark, options.type === 'cord-ledger' ? 20 : 40))}. Partial marks represent fractional units.`);
  if (options.type === 'waterline') notes.push(...(options.thresholds ?? []).map(threshold => `${threshold.label}: ${format(threshold.value)}.`));
  if (options.type === 'water-clock') notes.push(`Input is ${options.timeMode ?? 'remaining'} duration. Water height shows remaining duration.`);
  if (options.type === 'sundial') notes.push('Clock-time schedule, not solar position. Interval ends are exclusive.');
  if (options.type === 'season-wheel') notes.push('Gregorian date intervals. Ends are exclusive.');
  if (options.at && ['sundial', 'season-wheel'].includes(options.type)) notes.push(`Cursor: ${options.at}.`);
  if (['star-cycle', 'lunar-cycle', 'tidal-rhythm'].includes(options.type)) notes.push(`Cycle length: ${cycleSpan(options)} ${options.cycleUnit ?? 'steps'}.`);
  if (options.type === 'lunar-cycle') notes.push('Abstract cycle; moon symbols are illustrative, not computed astronomical phases.');
  if (options.cyclePosition !== undefined && ['lunar-cycle', 'star-cycle'].includes(options.type)) notes.push(`Cycle cursor: ${options.cyclePosition}.`);
  if (options.type === 'growth-history') notes.push(`Ring ${options.growthMode ?? 'thickness'} represents each period's contribution; input order is chronological. Null means unknown contribution and receives no quantitative layer.`);
  if (options.type === 'balance' && data.length === 2) notes.push(data.some(point => point.value === null) ? 'Difference unavailable because an observation is missing.' : `Difference (right minus left): ${format(data[1].value! - data[0].value!)}.`);
  if (options.xLabel) notes.push(`Horizontal axis: ${options.xLabel}.`);
  if (options.yLabel) notes.push(`Vertical axis: ${options.yLabel}.`);
  if (options.weightLabel && options.type === 'dew') notes.push(`Droplet area: ${options.weightLabel}.`);
  return notes.join(' ');
}
