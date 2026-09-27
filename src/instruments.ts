import { naturalSpecimen, hasNaturalForm } from './specimens.js';
import type { ChartMetadata, ChartRenderer, DataPoint, RenderContext } from './types.js';
import { barkRim, growthGrain, stoneDial, pigment, engrave } from './artwork.js';
import { arc, clockMinutes, cycleSpan, dateLabel, denomination, intensity, label, maximum, parseDate, pointLabel, polar, seasonYear, truncate, yearStart } from './utils.js';

const TAU = Math.PI * 2;
const top = -Math.PI / 2;
const cycleTick = (value: number): string => Math.abs(value) >= 1e12 || (value !== 0 && Math.abs(value) < .001) ? value.toExponential(2) : String(Math.round(value * 100) / 100);
const color = (ctx: RenderContext, index: number) => ctx.theme.colors[index % ctx.theme.colors.length];
const text = (ctx: RenderContext, x: number, y: number, value: string, parent?: Element, attrs: Record<string, string | number> = {}) => ctx.el('text', { x, y, fill: ctx.theme.ink, 'font-size': 11, 'text-anchor': 'middle', ...attrs }, parent, value);
const foot = (ctx: RenderContext, value: string) => label(ctx, 320, 339, value, { 'font-size': 10 });
function sun(ctx: RenderContext, x: number, y: number, r: number, parent?: Element): void {
  ctx.el('circle', { cx: x, cy: y, r, fill: color(ctx, 3), opacity: .8 }, parent);
  for (let i = 0; i < 8; i++) { const a = polar(x, y, r + 5, i * TAU / 8), b = polar(x, y, r + 9, i * TAU / 8); ctx.el('path', { d: `M${a}L${b}`, stroke: color(ctx, 3), 'stroke-width': 1.3, opacity: .65 }, parent); }
}
function star(x: number, y: number, radius: number): string {
  return Array.from({ length: 10 }, (_, i) => `${i ? 'L' : 'M'}${polar(x, y, i % 2 ? radius * .43 : radius, top + i * Math.PI / 5)}`).join('')+'Z';
}
/** Closed annulus sector; the full-circle branch avoids coincident arc endpoints. */
function sector(cx: number, cy: number, inner: number, outer: number, a: number, b: number): string {
  if (b - a >= TAU - 1e-9) return `M${cx},${cy - outer}A${outer},${outer} 0 1 1 ${cx},${cy + outer}A${outer},${outer} 0 1 1 ${cx},${cy - outer}M${cx},${cy - inner}A${inner},${inner} 0 1 0 ${cx},${cy + inner}A${inner},${inner} 0 1 0 ${cx},${cy - inner}Z`;
  const large = b - a > Math.PI ? 1 : 0;
  return `M${polar(cx, cy, outer, a)}A${outer},${outer} 0 ${large} 1 ${polar(cx, cy, outer, b)}L${polar(cx, cy, inner, b)}A${inner},${inner} 0 ${large} 0 ${polar(cx, cy, inner, a)}Z`;
}
/** A circular sector, affinely scaled into a seed: filled area is the fraction. */
function seed(ctx: RenderContext, parent: Element, x: number, y: number, fraction: number, fill: string, radius = 6, material = 'seed'): void {
  const g = ctx.el('g', { transform: `translate(${x} ${y}) rotate(-28) scale(1 .68)` }, parent);
  ctx.el('circle', { r: radius, fill: ctx.theme.grid }, g);
  if (fraction >= 1 - 1e-10) ctx.el('circle', { r: radius, fill }, g);
  else if (fraction > 0) {
    const b = top + fraction * TAU;
    ctx.el('path', { d: `M0,0L${polar(0, 0, radius, top)}A${radius},${radius} 0 ${fraction > .5 ? 1 : 0} 1 ${polar(0, 0, radius, b)}Z`, fill }, g);
  }
  ctx.el('path', { d: `M${-radius * .55},0L${radius * .55},0`, stroke: ctx.theme.background, 'stroke-width': .7, opacity: .5 }, g);
  ctx.el('path', { d: `M${-radius*.75},0Q0,${-radius*.65} ${radius*.75},0M${-radius*.75},0Q0,${radius*.65} ${radius*.75},0`, fill:'none',stroke:ctx.theme.background,'stroke-width':.45,opacity:.35,'pointer-events':'none' },g);
  if(hasNaturalForm(ctx,material)) {
    const clipped=ctx.el('g',{},g);
    const id=`${ctx.id}-seed-fill-${ctx.svg.querySelectorAll('clipPath').length}`;
    const defs=ctx.el('defs'),clip=ctx.el('clipPath',{id},defs);
    if(fraction>=1-1e-10)ctx.el('circle',{r:radius},clip);
    else if(fraction>0)ctx.el('path',{d:`M0,0L${polar(0,0,radius,top)}A${radius},${radius} 0 ${fraction>.5?1:0} 1 ${polar(0,0,radius,top+fraction*TAU)}Z`},clip);
    clipped.setAttribute('clip-path',`url(#${id})`);
    naturalSpecimen(ctx,material,clipped,-radius,-radius,radius*2,radius*2,{},material==='seed'?fill:undefined);
  }
  ctx.el('ellipse',{cx:-radius*.65,cy:0,rx:radius*.09,ry:radius*.2,fill:ctx.theme.ink,opacity:.2,'pointer-events':'none'},g);
}

const seedLedger: ChartRenderer = ctx => {
  const unit = denomination(ctx.data, ctx.options.unitsPerMark, 40);
  label(ctx, 42, 37, 'A HARVEST OF SMALL THINGS', { 'text-anchor': 'start', 'font-size': 10, 'letter-spacing': 1.8 });
  ctx.data.forEach((point, index) => {
    const rowHeight = Math.min(56, 252 / ctx.data.length), y = 67 + index * rowHeight;
    const g = ctx.el('g');
    ctx.el('rect', { x: 30, y: y - 13, width: 580, height: rowHeight - 4, rx: 7, fill: color(ctx, index), opacity: .055 }, g);
    text(ctx, 43, y + 7, truncate(pointLabel(point, index), 16), g, { 'text-anchor': 'start', 'font-size': 11 });
    const amount = (point.value ?? 0) / unit;
    const full = Math.floor(amount), fraction = Math.max(0, amount - full);
    const count = Math.min(40, full + (fraction > 0 ? 1 : 0));
    for (let j = 0; j < count; j++) seed(ctx, g, 172 + (j % 20) * 19, y + Math.floor(j / 20) * 16, j < full ? 1 : fraction, color(ctx, index),hasNaturalForm(ctx,'seed')?8:6);
    if (!count) text(ctx, 175, y + 7, point.value === null ? 'Not recorded' : 'No seeds yet', g, { 'text-anchor': 'start', fill: ctx.theme.muted, 'font-size': 10 });
    text(ctx, 596, y + 7, ctx.format(point.value), g, { 'text-anchor': 'end', 'font-size': 12 });
    ctx.mark(g, point, index);
  });
  foot(ctx, `1 seed = ${ctx.format(unit)} · partial seed area = fractional unit${unit !== (ctx.options.unitsPerMark ?? 1) ? ' · bundled to fit' : ''}`);
};

const waterline: ChartRenderer = ctx => {
  const point = ctx.data[0], capacity = point.target ?? ctx.options.target ?? 100;
  const x = 192, y = 57, width = 133, height = 230;
  const level = height * Math.min(1, (point.value ?? 0) / capacity);
  const g = ctx.el('g');
  const defs = ctx.el('defs');
  const clip = ctx.el('clipPath', { id: `${ctx.id}-column` }, defs);
  ctx.el('rect', { x, y, width, height, rx: 10 }, clip);
  ctx.el('rect', { x, y, width, height, rx: 10, fill: ctx.theme.grid, opacity: .5 }, g);
  const water = ctx.el('rect', { x, y: y + height - level, width, height: level, fill: pigment(ctx,color(ctx, 0),'water'), opacity: .85, 'clip-path': `url(#${ctx.id}-column)`, class: 'np-water-level' }, g);
  const waterDetail=ctx.el('g',{'clip-path':`url(#${ctx.id}-column)`},g);
  // Keep the vessel clip around the engraving as well as the fill.
  waterDetail.append(water); engrave(ctx,water,'glass');
  ctx.el('path',{d:`M${x+6} ${y+4}H${x+width-6}M${x+6} ${y+height-4}H${x+width-6}`,stroke:ctx.theme.muted,'stroke-width':.8,opacity:.5,'pointer-events':'none'},g);
  if (point.value !== null) ctx.el('line', { x1: x, x2: x + width, y1: y + height - level, y2: y + height - level, stroke: color(ctx, 1), 'stroke-width': 2 }, g);
  ctx.el('rect', { x, y, width, height, rx: 10, fill: 'none', stroke: color(ctx, 0), 'stroke-width': 1.5, opacity: .5 }, g);
  for (let i = 0; i <= 4; i++) {
    const tickY = y + height - i * height / 4;
    ctx.el('path', { d: `M${x - 9} ${tickY}h9`, stroke: ctx.theme.muted, opacity: .6 });
    label(ctx, x - 18, tickY + 4, ctx.format(capacity * i / 4), { 'text-anchor': 'end', 'font-size': 10 });
  }
  // Labels use separate rows and leaders, so nearby thresholds remain readable.
  const thresholds = [...(ctx.options.thresholds ?? [])].sort((a, b) => b.value - a.value);
  thresholds.forEach((threshold, i) => {
    const actualY = y + height * (1 - threshold.value / capacity), labelY = 106 + i * 29;
    ctx.el('path', { d: `M${x - 3} ${actualY}H${x + width + 14}L395 ${labelY - 4}H411`, fill: 'none', stroke: color(ctx, i + 2), 'stroke-width': 1, 'stroke-dasharray': '4 4' });
    label(ctx, 423, labelY, `${truncate(threshold.label, 19)} · ${ctx.format(threshold.value)}`, { 'text-anchor': 'start', 'font-size': 11, fill: ctx.theme.ink });
  });
  text(ctx, 424, 57, ctx.format(point.value), undefined, { 'text-anchor': 'start', 'font-size': 31 });
  label(ctx, 424, 79, `of ${ctx.format(capacity)} capacity`, { 'text-anchor': 'start', 'font-size': 11 });
  text(ctx, x + width / 2, 311, truncate(pointLabel(point, 0), 30), undefined, { 'font-size': 12 });
  ctx.mark(g, point, 0);
  foot(ctx, 'Water height = quantity · dashed marks = your thresholds');
};

const waterClock: ChartRenderer = ctx => {
  const point = ctx.data[0], duration = point.target ?? ctx.options.target ?? 100;
  const elapsed = ctx.options.timeMode === 'elapsed';
  const remaining = point.value === null ? null : elapsed ? Math.max(0, duration - point.value) : point.value;
  const fraction = Math.min(1, (remaining ?? 0) / duration);
  const x = 171, y = 71, width = 168, height = 195, level = height * fraction;
  const defs = ctx.el('defs'); const clip = ctx.el('clipPath', { id: `${ctx.id}-vessel` }, defs);
  ctx.el('rect', { x, y, width, height, rx: 12 }, clip);
  const g = ctx.el('g');
  ctx.el('rect', { x, y, width, height, rx: 12, fill: ctx.theme.grid, opacity: .4 }, g);
  const liquid=ctx.el('g',{'clip-path':`url(#${ctx.id}-vessel)`},g);
  const clockWater = ctx.el('rect', { x, y: y + height - level, width, height: level, fill: pigment(ctx,color(ctx, 0),'water'), opacity: .8, 'clip-path': `url(#${ctx.id}-vessel)`, class: 'np-clock-water' }, liquid);
  engrave(ctx,clockWater,'glass');
  ctx.el('path',{d:`M${x-7} ${y-5}H${x+width+7}M${x-6} ${y+height+5}H${x+width+6}`,stroke:color(ctx,3),'stroke-width':2,opacity:.5,'pointer-events':'none'},g);
  if (remaining !== null) ctx.el('line', { x1: x, x2: x + width, y1: y + height - level, y2: y + height - level, stroke: color(ctx, 1), 'stroke-width': 2 }, g);
  ctx.el('path', { d: `M${x - 10} ${y - 9}H${x + width + 10}M${x} ${y}V${y + height - 12}Q${x} ${y + height} ${x + 12} ${y + height}H${x + width - 12}Q${x + width} ${y + height} ${x + width} ${y + height - 12}V${y}M${x - 8} ${y + height + 9}H${x + width + 8}`, fill: 'none', stroke: ctx.theme.muted, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
  for (let i = 0; i <= 4; i++) {
    const tickY = y + height - i * height / 4;
    ctx.el('path', { d: `M${x + 10} ${tickY}h14`, stroke: ctx.theme.ink, opacity: .3 });
    label(ctx, x - 18, tickY + 3, ctx.format(duration * i / 4), { 'text-anchor': 'end', 'font-size': 10 });
  }
  ctx.mark(g, point, 0);
  text(ctx, 404, 126, remaining === null ? 'No data' : ctx.format(remaining), undefined, { 'text-anchor': 'start', 'font-size': 31 });
  label(ctx, 405, 149, 'REMAINING', { 'text-anchor': 'start', 'font-size': 9, 'letter-spacing': 1.8 });
  label(ctx, 405, 184, `Input: ${ctx.format(point.value)} ${elapsed ? 'elapsed' : 'remaining'}`, { 'text-anchor': 'start', 'font-size': 11 });
  label(ctx, 405, 207, `Duration: ${ctx.format(duration)}`, { 'text-anchor': 'start', 'font-size': 11 });
  if (elapsed && point.value !== null && point.value > duration) label(ctx, 405, 236, `${ctx.format(point.value - duration)} beyond duration`, { 'text-anchor': 'start', 'font-size': 11, fill: color(ctx, 4) });
  label(ctx, 255, 311, truncate(pointLabel(point, 0), 31), { fill: ctx.theme.ink, 'font-size': 12 });
  foot(ctx, 'Calibrated, constant-area vessel · a snapshot, not a running timer');
};

const intervalDial = (calendar: boolean): ChartRenderer => ctx => {
  const cx = 213, cy = 176, outer = 106;
  const naturalDial=!calendar&&hasNaturalForm(ctx,'dial');
  if (!calendar && !naturalSpecimen(ctx,'dial',undefined,cx-130,cy-130,260,260)) stoneDial(ctx, cx, cy, outer + 13);
  const year = seasonYear(ctx.options, ctx.data);
  const beginning = calendar ? parseDate(yearStart(year)).getTime() : 0;
  const end = calendar ? parseDate(yearStart(year + 1)).getTime() : 1440;
  const angle = (time: number) => top + (time - beginning) / (end - beginning) * TAU;
  const numeric = (value: string, endValue = false) => calendar ? parseDate(value).getTime() : clockMinutes(value, endValue);
  const tracks = [...new Set(ctx.data.map(point => point.track ?? 'Schedule'))];
  for(let tick=0;tick<(calendar ? 12 : 24);tick++) {
    const a=top+tick*TAU/(calendar ? 12 : 24), p1=polar(cx,cy,outer+9,a),p2=polar(cx,cy,outer+(calendar&&tick%3===0?15:12),a);
    ctx.el('path',{d:`M${p1}L${p2}`,stroke:ctx.theme.muted,'stroke-width':calendar&&tick%3===0?2:1,opacity:.5,'pointer-events':'none'});
  }
  const ringWidth = tracks.length > 2 ? 13 : 19;
  tracks.forEach((_, i) => ctx.el('circle', { cx, cy, r: outer - i * (ringWidth + 5), fill: 'none', stroke: ctx.theme.grid, 'stroke-width': ringWidth, opacity:naturalDial?.45:1 }));
  for (let i = 0; i < 12; i++) {
    const time = calendar ? parseDate(`${String(year).padStart(4, '0')}-${String(i + 1).padStart(2, '0')}-01`).getTime() : i * 120;
    const a = angle(time), p1 = polar(cx, cy, outer + 14, a), p2 = polar(cx, cy, outer + 19, a), p3 = polar(cx, cy, outer + 32, a);
    ctx.el('path', { d: `M${p1}L${p2}`, stroke: ctx.theme.muted, opacity: .6 });
    label(ctx, p3[0], p3[1] + 3, calendar ? ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i] : String(i * 2).padStart(2, '0'), { 'font-size': 10 });
  }
  ctx.data.forEach((point, index) => {
    const lane = tracks.indexOf(point.track ?? 'Schedule'), r = outer - lane * (ringWidth + 5);
    const a = angle(numeric(point.start!)), b = angle(numeric(point.end!, true));
    const g = ctx.el('g');
    ctx.el('path', { d: sector(cx, cy, r - ringWidth / 2, r + ringWidth / 2, a, b), fill: color(ctx, index), opacity: .88, class: 'np-interval', 'data-start-angle': a, 'data-end-angle': b }, g);
    const y = 58 + index * (ctx.data.length > 8 ? 22 : 34);
    ctx.el('circle', { cx: 386, cy: y - 3, r: 3.5, fill: color(ctx, index) }, g);
    text(ctx, 398, y, truncate(pointLabel(point, index), 24), g, { 'text-anchor': 'start', 'font-size': 11 });
    if (ctx.data.length <= 8) text(ctx, 398, y + 15, calendar ? `${dateLabel(point.start!)} – ${dateLabel(point.end!)} · ${truncate(point.track ?? 'Schedule', 15)}` : `${point.start} – ${point.end} · ${truncate(point.track ?? 'Schedule', 15)}`, g, { 'text-anchor': 'start', 'font-size': 8, fill: ctx.theme.muted });
    ctx.mark(g, point, index);
  });
  if (ctx.options.at !== undefined) {
    const a = angle(numeric(ctx.options.at)), endpoint = polar(cx, cy, outer + 8, a);
    ctx.el('path', { d: `M${cx} ${cy}L${endpoint}`, stroke: ctx.theme.ink, 'stroke-width': 1.8, opacity: .7, 'pointer-events': 'none' });
    sun(ctx, endpoint[0], endpoint[1], 5);
  }
  if (calendar) {
    text(ctx, cx, cy - 5, String(year), undefined, { 'font-size': 27 });
    label(ctx, cx, cy + 16, `${Math.round((end - beginning) / 86400000)} days`, { 'font-size': 10 });
  } else {
    if(!naturalDial) {
    ctx.el('path', { d: `M${cx - 9} ${cy + 11}L${cx} ${cy - 24}L${cx + 9} ${cy + 11}Z`, fill: pigment(ctx, color(ctx, 0), 'stone'), opacity: .85 });
    ctx.el('path', { d: `M${cx} ${cy-24}L${cx} ${cy+11}L${cx+9} ${cy+11}Z`, fill: ctx.theme.ink, opacity:.2, 'pointer-events':'none' });
    }
    label(ctx, cx, cy + 37, ctx.options.at ?? '24-hour day', { 'font-size': 11, fill: ctx.theme.ink });
  }
  foot(ctx, calendar ? 'Angle = date · arc = duration · tracks run outside in · end dates exclusive' : 'Clock time, not solar position · arc = duration · tracks run outside in');
};

const phenology: ChartRenderer = ctx => {
  const dates = ctx.data.flatMap(point => [point.observedAt, point.expectedStart, point.expectedEnd].filter((date): date is string => !!date));
  const sorted = [...dates].sort();
  const first = ctx.options.startDate ?? sorted[0] ?? new Date().toISOString().slice(0, 10);
  const last = ctx.options.endDate ?? sorted.at(-1) ?? first;
  const min = parseDate(first).getTime(), max = Math.max(min + 86400000, parseDate(last).getTime());
  const x = (date: string) => 174 + (parseDate(date).getTime() - min) / (max - min) * 345;
  label(ctx, 39, 34, 'FOLLOW THE SIGNS OF CHANGE', { 'text-anchor': 'start', 'font-size': 10, 'letter-spacing': 1.7 });
  label(ctx, 581, 52, 'UNOBSERVED', { 'font-size': 8, 'letter-spacing': .7 });
  for (let i = 0; i <= 4; i++) {
    const tick = 174 + 345 * i / 4;
    ctx.el('line', { x1: tick, y1: 59, x2: tick, y2: 278, stroke: ctx.theme.grid, 'stroke-dasharray': '3 5' });
    label(ctx, tick, 300, dateLabel(new Date(min + (max - min) * i / 4).toISOString().slice(0, 10)), { 'font-size': 9 });
  }
  ctx.data.forEach((point, index) => {
    const y = 80 + index * Math.min(42, 200 / Math.max(1, ctx.data.length - 1));
    const g = ctx.el('g');
    ctx.el('rect', { x: 28, y: y - 17, width: 584, height: 34, rx: 5, fill: color(ctx, index), opacity: .035 }, g);
    text(ctx, 39, y + 4, truncate(pointLabel(point, index), 18), g, { 'text-anchor': 'start', 'font-size': 11 });
    if (point.expectedStart) {
      const x1 = x(point.expectedStart), x2 = x(point.expectedEnd!);
      ctx.el('rect', { x: x1, y: y - 7, width: Math.max(2, x2 - x1), height: 14, rx: 3, fill: color(ctx, index), opacity: .19, class: 'np-expected-window' }, g);
      ctx.el('path', { d: `M${x1} ${y - 10}v20M${x2} ${y - 10}v20`, stroke: color(ctx, index), opacity: .6 }, g);
    }
    if (point.observedAt) {
      const px = x(point.observedAt);
      const stage=(point.label??'').toLowerCase();
      const key=/sown|sow|seed/.test(stage)?'seed':/harvest|fruit|pod/.test(stage)?'pod':/flower|bloom/.test(stage)?'flower':/bud/.test(stage)?'bud':/leaves|leaf/.test(stage)?'leaf':'sprout';
      if(hasNaturalForm(ctx,key)) {
        naturalSpecimen(ctx,key,g,px-19,y-28,38,38,{'data-fit':'contain'});
        ctx.el('line',{x1:px,x2:px,y1:y-5,y2:y+13,stroke:color(ctx,index),'stroke-width':1.5,class:'np-observed-stage','data-x':px},g);
        ctx.el('circle',{cx:px,cy:y+13,r:3,fill:ctx.theme.background,stroke:color(ctx,index),'stroke-width':1.5},g);
      } else {
      ctx.el('path', { d: `M${px} ${y + 10}V${y - 13}M${px} ${y - 3}Q${px - 17} ${y - 16} ${px - 12} ${y - 21}Q${px + 2} ${y - 17} ${px} ${y - 3}M${px} ${y - 7}Q${px + 14} ${y - 27} ${px + 19} ${y - 17}Q${px + 12} ${y - 7} ${px} ${y - 7}`, fill: color(ctx, index), stroke: color(ctx, index), 'stroke-width': 1.4, class: 'np-observed-stage', 'data-x': px }, g);
      ctx.el('path',{d:`M${px} ${y-4}l-10-14M${px+2} ${y-9}l13-9M${px} ${y+8}q-4 6-9 7m9-7q5 6 10 7`,fill:'none',stroke:ctx.theme.background,'stroke-width':.7,opacity:.65,'pointer-events':'none'},g);
      ctx.el('circle', { cx: px, cy: y, r: 3, fill: ctx.theme.ink }, g);
      }
    } else {
      ctx.el('circle', { cx: 581, cy: y, r: 7, fill: ctx.theme.background, stroke: ctx.theme.muted, 'stroke-dasharray': '2 3' }, g);
    }
    ctx.mark(g, point, index);
  });
  foot(ctx, 'Plant marker = observed date · shaded interval = expected window · empty circle = unknown');
};

function moon(ctx: RenderContext, x: number, y: number, r: number, phase: number): void {
  const defs = ctx.el('defs');
  const id = `${ctx.id}-moon-${Math.round(phase * 8)}`;
  const clip = ctx.el('clipPath', { id }, defs); ctx.el('circle', { cx: x, cy: y, r }, clip);
  ctx.el('circle', { cx: x, cy: y, r, fill: ctx.theme.grid, stroke: color(ctx, 2), 'stroke-width': .7 });
  // Stylized cycle illustration only. These are not computed lunar phases.
  if (phase > 0 && phase < 1) {
    const g = ctx.el('g', { 'clip-path': `url(#${id})` });
    ctx.el('circle', { cx: x, cy: y, r, fill: color(ctx, 3), opacity: .9 }, g);
    if (phase !== .5) ctx.el('circle', { cx: x + (phase < .5 ? -1 : 1) * r * 4 * Math.min(phase, 1 - phase), cy: y, r, fill: ctx.theme.grid }, g);
  }
  const detail=ctx.el('g',{'clip-path':`url(#${id})`,'aria-hidden':'true','pointer-events':'none'});
  [[-.35,-.3,.18],[.3,.25,.25],[-.2,.5,.12]].forEach(([dx,dy,size])=>ctx.el('circle',{cx:x+r*dx,cy:y+r*dy,r:r*size,fill:'none',stroke:ctx.theme.muted,'stroke-width':.6,opacity:.32},detail));
}
const cycleChart = (lunar: boolean): ChartRenderer => ctx => {
  const cx = 228, cy = 177, r = 85, span = cycleSpan(ctx.options), max = maximum(ctx.data, ctx.options.max);
  ctx.el('circle', { cx, cy, r, fill: 'none', stroke: ctx.theme.grid, 'stroke-width': 1, 'stroke-dasharray': '2 5' });
  ctx.el('circle', { cx, cy, r: r + 46, fill: 'none', stroke: ctx.theme.grid, 'stroke-width': 1, opacity: .7 });
  for (let i = 0; i < 8; i++) {
    const a = top + i * TAU / 8, p = polar(cx, cy, r, a);
    if (lunar) moon(ctx, p[0], p[1], 9, i / 8);
    else {
      const t = polar(cx, cy, r + 49, a);
      ctx.el('circle', { cx: p[0], cy: p[1], r: 1.6, fill: ctx.theme.muted, opacity: .5 });
      label(ctx, t[0], t[1] + 4, cycleTick(span * (i / 8)), { 'font-size': 9 });
    }
  }
  ctx.data.forEach((point, index) => {
    const a = top + point.position! / span * TAU;
    const base = polar(cx, cy, r + 17, a), end = polar(cx, cy, r + 17 + (lunar ? (point.value ?? 0) / max * 29 : 0), a);
    const g = ctx.el('g');
    if (lunar) {
      ctx.el('path', { d: `M${base}L${end}`, stroke: color(ctx, index), 'stroke-width': 3, 'stroke-linecap': 'round', class: 'np-cycle-stem' }, g);
      ctx.el('circle', { cx: end[0], cy: end[1], r: 3.5, fill: point.value === null ? ctx.theme.grid : color(ctx, index), stroke: point.value === null ? ctx.theme.muted : 'none' }, g);
    } else {
      if(hasNaturalForm(ctx,'star')&&point.value!==null) {
        ctx.el('circle',{cx:base[0],cy:base[1],r:19,fill:'transparent',class:'np-hit-area'},g);
        naturalSpecimen(ctx,'star',g,base[0]-22,base[1]-22,44,44,{opacity:intensity(point.value,max)});
        ctx.el('circle',{cx:base[0],cy:base[1],r:2.5,fill:color(ctx,index)},g);
      } else {
      ctx.el('path', { d: star(base[0], base[1], 9), fill: color(ctx, index), opacity: intensity(point.value, max), stroke: point.value === null ? ctx.theme.muted : 'none', 'stroke-dasharray': '2 2' }, g);
      ctx.el('path',{d:`M${base[0]-2} ${base[1]}h4M${base[0]} ${base[1]-2}v4`,stroke:ctx.theme.background,'stroke-width':.7,opacity:.7,'pointer-events':'none'},g);
    }
      }
    // Dense cycles keep readable labels; the inspector retains every exact reading.
    const dense = ctx.data.length > 8, perColumn = Math.ceil(ctx.data.length / 2);
    const col = dense ? Math.floor(index / perColumn) : 0, row = dense ? index % perColumn : index;
    const lx = 391 + col * 111, ly = 54 + row * (dense ? 22 : 34);
    text(ctx, lx, ly, truncate(pointLabel(point, index), dense ? 13 : 24), g, { 'text-anchor': 'start', 'font-size': 12 });
    if (!dense) text(ctx, lx, ly + 15, `${point.position} ${ctx.options.cycleUnit ?? 'steps'} · ${ctx.format(point.value)}`, g, { 'text-anchor': 'start', fill: ctx.theme.muted, 'font-size': 12 });
    ctx.mark(g, point, index);
  });
  text(ctx, cx, cy - 6, String(span), undefined, { 'font-size': 35 });
  label(ctx, cx, cy + 16, `${ctx.options.cycleUnit ?? 'steps'} per cycle`, { 'font-size': 11 });
  if (ctx.options.cyclePosition !== undefined) {
    const a = top + ctx.options.cyclePosition / span * TAU;
    const p = polar(cx, cy, r - 17, a);
    ctx.el('path', { d: `M${polar(cx, cy, 49, a)}L${p}`, stroke: ctx.theme.ink, 'stroke-width': 1.5, 'stroke-dasharray': '3 3' });
    ctx.el('circle', { cx: p[0], cy: p[1], r: 3, fill: ctx.theme.ink });
  }
  foot(ctx, lunar ? 'Abstract cycle · angle = position · outer stem length = value · moons are illustrative' : 'Angle = cycle position · star intensity = value · dashed cursor = selected position');
};

const balance: ChartRenderer = ctx => {
  const left = ctx.data[0], right = ctx.data[1], missing = left.value === null || right.value === null;
  const max = maximum(ctx.data, ctx.options.max);
  const a = (left.value ?? 0) / max, b = (right.value ?? 0) / max;
  const tilt = missing ? 0 : (b - a) / Math.max(.000001, a + b) * .17;
  const cx = 320, cy = 116, spread = 162;
  const naturalBalance=['balance-stand','balance-beam','balance-pan'].every(key=>hasNaturalForm(ctx,key));
  if(naturalBalance) naturalSpecimen(ctx,'balance-stand',undefined,265,99,110,180);
  else {
  ctx.el('path', { d: 'M293 270L320 121L347 270Z', fill: color(ctx, 0), opacity: .22 });
  ctx.el('path',{d:'M307 257Q317 210 320 153M320 251V184M332 257Q323 227 324 211',fill:'none',stroke:ctx.theme.muted,'stroke-width':.8,opacity:.5,'pointer-events':'none'});
  ctx.el('path', { d: 'M263 275Q320 255 377 275', fill: 'none', stroke: ctx.theme.muted, 'stroke-width': 2, 'stroke-linecap': 'round' });
  }
  const lp = [cx - spread * Math.cos(tilt), cy - spread * Math.sin(tilt)], rp = [cx + spread * Math.cos(tilt), cy + spread * Math.sin(tilt)];
  ctx.el('path', { d: `M${lp}L${rp}`, fill: 'none', stroke: ctx.theme.ink, 'stroke-width': 3, 'stroke-linecap': 'round', class: 'np-balance-beam' });
  if(naturalBalance) naturalSpecimen(ctx,'balance-beam',undefined,cx-177,cy-26,354,52,{transform:`rotate(${tilt*180/Math.PI} ${cx} ${cy})`});
  ctx.el('circle', { cx, cy, r: 5, fill: color(ctx, 3), stroke: ctx.theme.ink, 'stroke-width': 1 });
  ctx.data.forEach((point, index) => {
    const p = index ? rp : lp, x = p[0], y = p[1] + 89, g = ctx.el('g');
    if(naturalBalance) naturalSpecimen(ctx,'balance-pan',g,x-59,p[1]-3,118,130);
    else ctx.el('path', { d: `M${x} ${p[1]}L${x - 51} ${y}M${x} ${p[1]}L${x + 51} ${y}M${x - 55} ${y}Q${x} ${y + 36} ${x + 55} ${y}`, fill: 'none', stroke: ctx.theme.muted, 'stroke-width': 1.5 }, g);
    // Stone shapes are ornamental; the common-scale bars below encode amount.
    if ((point.value ?? 0) > 0) for (let j = 0; j < 3; j++) { if(naturalBalance&&hasNaturalForm(ctx,'pebble')){ naturalSpecimen(ctx,j===1?'pebble-light':'pebble',g,x+(j-1)*23-19,y-17-(j===1?7:0),38,23);continue; } const stone=ctx.el('ellipse', { cx: x + (j - 1) * 23, cy: y - 7 - (j === 1 ? 7 : 0), rx: 19, ry: 10, fill: pigment(ctx,color(ctx, index + j),'stone'), opacity: .85 }, g); engrave(ctx,stone,'rock'); }
    text(ctx, x, 52, truncate(pointLabel(point, index), 20), g, { 'font-size': 12 });
    text(ctx, x, 80, ctx.format(point.value), g, { 'font-size': 23 });
    ctx.el('rect', { x: x - 65, y: 288, width: 130, height: 6, rx: 3, fill: ctx.theme.grid }, g);
    ctx.el('rect', { x: x - 65, y: 288, width: (point.value ?? 0) / max * 130, height: 6, rx: 3, fill: color(ctx, index), class: 'np-balance-amount' }, g);
    ctx.mark(g, point, index);
  });
  label(ctx, 320, 318, missing ? 'Difference unavailable' : `Right − left: ${ctx.format(right.value! - left.value!)}`, { fill: ctx.theme.ink, 'font-size': 12 });
  foot(ctx, 'Bar length = amount on a shared scale · beam tilt indicates direction only');
};

const cordLedger: ChartRenderer = ctx => {
  const unit = denomination(ctx.data, ctx.options.unitsPerMark, 20), step = 536 / ctx.data.length;
  const groups = new Map<string, number[]>();
  ctx.data.forEach((point, i) => { const key = point.track ?? 'Contributions'; const indices = groups.get(key) ?? []; indices.push(i); groups.set(key, indices); });
  groups.forEach((indices, name) => {
    const x1 = 52 + step * (indices[0] + .2), x2 = 52 + step * (indices.at(-1)! + .8);
    ctx.el('path', { d: `M${x1} 57V48H${x2}V57`, fill: 'none', stroke: ctx.theme.muted, 'stroke-width': 1.5 });
    label(ctx, (x1 + x2) / 2, 32, truncate(name, Math.max(8, Math.floor((x2 - x1) / 6))), { 'font-size': 10 });
  });
  ctx.data.forEach((point, index) => {
    const x = 52 + step * (index + .5), g = ctx.el('g');
    const naturalCord=hasNaturalForm(ctx,'cord')&&hasNaturalForm(ctx,'knot');
    if(naturalCord) naturalSpecimen(ctx,'cord',g,x-4,50,8,224);
    else {
    ctx.el('path', { d: `M${x} 50Q${x - 5} 143 ${x + 2} 274`, fill: 'none', stroke: color(ctx, index), 'stroke-width': 2, opacity: .58 }, g);
    for(let strand=0;strand<2;strand++) { const d=Array.from({length:57},(_,k)=>{const t=k/56,xx=x-10*t*(1-t)+2*t*t+Math.sin(k*Math.PI/2+strand*Math.PI)*1.3;return `${k?'L':'M'}${xx},${50+t*224}`;}).join('');ctx.el('path',{d,fill:'none',stroke:color(ctx,index),'stroke-width':.6,opacity:.55,'pointer-events':'none'},g); }
    }
    const amount = (point.value ?? 0) / unit, full = Math.floor(amount), fraction = Math.max(0, amount - full);
    for (let i = 0; i < Math.min(20, full + (fraction > 0 ? 1 : 0)); i++) {
      const y = 70 + i * 9.3 + Math.floor(i / 10) * 9;
      if(naturalCord && i<full) {
        ctx.el('ellipse',{cx:x,cy:y,rx:9,ry:5,fill:color(ctx,index),opacity:.35},g);
        naturalSpecimen(ctx,'knot',g,x-10,y-5.2,20,10.4);
      } else seed(ctx, g, x, y, i < full ? 1 : fraction, color(ctx, index), 6.5, naturalCord?'knot':'seed');
    }
    if (point.value === null) text(ctx, x, 170, '?', g, { fill: ctx.theme.muted, 'font-size': 18 });
    text(ctx, x, 298, truncate(pointLabel(point, index), Math.max(7, Math.floor(step / 6))), g, { 'font-size': 10 });
    text(ctx, x, 314, ctx.format(point.value), g, { 'font-size': 11, fill: ctx.theme.ink });
    ctx.mark(g, point, index);
  });
  foot(ctx, `1 knot = ${ctx.format(unit)} · groups of ten · partial knot area = fractional unit${unit !== (ctx.options.unitsPerMark ?? 1) ? ' · bundled' : ''}`);
};

const growthHistory: ChartRenderer = ctx => {
  const cx = 183, cy = 173, core = 13, radius = 116, largest = maximum(ctx.data, ctx.options.max);
  // Scale before summing to avoid overflow for large finite quantities.
  const scaled = ctx.data.map(point => (point.value ?? 0) / largest), sum = scaled.reduce((a, b) => a + b, 0);
  const area = ctx.options.growthMode === 'area'; let cumulative = 0;
  const at = (fraction: number) => area ? Math.sqrt(core * core + fraction * (radius * radius - core * core)) : core + fraction * (radius - core);
  barkRim(ctx, cx, cy, radius);
  ctx.el('circle', { cx, cy, r: core, fill: ctx.theme.grid });
  label(ctx, 465, 37, 'PERIOD CONTRIBUTIONS', { 'font-size': 9, 'letter-spacing': 1.7 });
  ctx.data.forEach((point, index) => {
    const start = sum ? cumulative / sum : 0; cumulative += scaled[index]; const end = sum ? cumulative / sum : 0;
    const r1 = at(start), r2 = at(end), g = ctx.el('g');
    if (r2 > r1) {
      ctx.el('path', { d: sector(cx, cy, r1, r2, top, top + TAU), fill: pigment(ctx,color(ctx, index),'stone'), opacity: .88, 'fill-rule': 'evenodd', class: 'np-growth-layer', 'data-inner-radius': r1, 'data-outer-radius': r2 }, g);
      growthGrain(ctx, g, cx, cy, r1, r2);
    }
    const y = 65 + index * Math.min(30, 230 / ctx.data.length);
    text(ctx, 344, y, truncate(pointLabel(point, index), 19), g, { 'text-anchor': 'start', 'font-size': 10 });
    ctx.el('rect', { x: 344, y: y + 7, width: 200, height: 5, rx: 2.5, fill: ctx.theme.grid }, g);
    ctx.el('rect', { x: 344, y: y + 7, width: scaled[index] * 200, height: 5, rx: 2.5, fill: color(ctx, index), class: 'np-growth-comparison' }, g);
    text(ctx, 606, y + 7, ctx.format(point.value), g, { 'text-anchor': 'end', 'font-size': 10, fill: ctx.theme.muted });
    ctx.mark(g, point, index);
  });
  label(ctx, cx, 310, 'EARLIER → LATER, INSIDE OUT', { 'font-size': 9, 'letter-spacing': 1 });
  foot(ctx, `Ring ${area ? 'area' : 'thickness'} = period contribution · bars share a linear scale${ctx.data.some(point => point.value === null) ? ' · unknown periods have no layer' : ''}`);
};

const tidalRhythm: ChartRenderer = ctx => {
  const span = cycleSpan(ctx.options), cycles = [...new Set(ctx.data.map(point => point.cycle!))];
  const scale = Math.max(1, ctx.options.max ?? 0, ...ctx.data.map(point => Math.abs(point.value ?? 0)));
  const lower = Math.min(0, ...ctx.data.map(point => (point.value ?? 0) / scale));
  const upper = ctx.options.max !== undefined ? ctx.options.max / scale : Math.max(0, ...ctx.data.map(point => (point.value ?? 0) / scale));
  const range = upper - lower || 1, height = 244 / cycles.length;
  cycles.forEach((cycle, row) => {
    const topY = 37 + row * height, bottom = topY + height - 18, usable = height - 28;
    const y = (value: number) => bottom - (value / scale - lower) / range * usable;
    const baseline = y(0), c = color(ctx, row);
    label(ctx, 31, topY + 18, truncate(cycle, 13), { 'text-anchor': 'start', fill: ctx.theme.ink, 'font-size': 11 });
    label(ctx, 116, topY + 10, ctx.format(upper * scale), { 'text-anchor': 'end', 'font-size': 8 });
    label(ctx, 116, bottom + 3, ctx.format(lower * scale), { 'text-anchor': 'end', 'font-size': 8 });
    ctx.el('line', { x1: 135, x2: 602, y1: baseline, y2: baseline, stroke: ctx.theme.grid });
    let segment: [number, number][] = [];
    const flush = () => {
      if (!segment.length) return;
      const d = segment.map((point, i) => `${i ? 'L' : 'M'}${point}`).join('');
      const water = ctx.el('path', { d: `${d}L${segment.at(-1)![0]},${baseline}L${segment[0][0]},${baseline}Z`, fill: c, opacity: .2, class: 'np-cycle-area' });
      engrave(ctx,water,'water');
      ctx.el('path', { d, fill: 'none', stroke: c, 'stroke-width': 2, 'stroke-linejoin': 'round' });
      segment = [];
    };
    const points = ctx.data.map((point, index) => ({ point, index })).filter(entry => entry.point.cycle === cycle);
    points.forEach(({ point }) => { const px = 135 + point.position! / span * 467; if (point.value === null) flush(); else segment.push([px, y(point.value)]); });
    flush();
    points.forEach(({ point, index }) => {
      const px = 135 + point.position! / span * 467, py = point.value === null ? baseline : y(point.value);
      const mark = ctx.el('circle', { cx: px, cy: py, r: point.value === null ? 3 : 3.5, fill: point.value === null ? ctx.theme.background : c, stroke: c, 'stroke-width': 1, 'stroke-dasharray': point.value === null ? '2 2' : 'none' });
      ctx.mark(mark, point, index);
    });
  });
  for (let i = 0; i <= 4; i++) label(ctx, 135 + i * 467 / 4, 302, `${cycleTick(span * (i / 4))}${ctx.options.cycleUnit ? ' '+ctx.options.cycleUnit : ''}`, { 'font-size': 9 });
  foot(ctx, 'Aligned cycle positions · one shared scale · gaps stay gaps · no tide prediction');
};

export const instrumentRenderers: Record<string, ChartRenderer> = {
  'seed-ledger': seedLedger, waterline, sundial: intervalDial(false), 'season-wheel': intervalDial(true), phenology,
  'lunar-cycle': cycleChart(true), 'water-clock': waterClock, balance, 'cord-ledger': cordLedger,
  'growth-history': growthHistory, 'tidal-rhythm': tidalRhythm, 'star-cycle': cycleChart(false),
};
export const instrumentMetadata: Record<string, ChartMetadata> = {
  'seed-ledger': { name: 'Seed Ledger', subtitle: 'Small things, counted carefully', description: 'Count everyday wins as seeds, with an explicit unit and room for fractions.', encoding: 'One seed represents a labeled denomination. Filled seed area represents a fractional unit; rows preserve exact totals.', category: 'Comparison' },
  waterline: { name: 'Waterline', subtitle: 'Know when you reach the mark', description: 'Read capacity and meaningful thresholds on a calibrated water column.', encoding: 'Water height represents value on a linear zero-to-capacity scale. Dashed lines mark supplied thresholds. Fill caps at capacity; exact values remain.', category: 'Progress' },
  sundial: { name: 'Sundial', subtitle: 'Give your day a little sunlight', description: 'Arrange daily activities on a clock-time dial, with separate tracks for overlapping plans.', encoding: 'Angle represents 24-hour clock time. Arc extent represents duration. This is a schedule dial, not a physical sundial or solar calculation.', category: 'Timeline' },
  'season-wheel': { name: 'Season Wheel', subtitle: 'A whole year, in one glance', description: 'See real date intervals unfold around a Gregorian year, one season of work at a time.', encoding: 'Angle represents date within the selected year; arc extent represents duration. Month lengths and leap days are respected. No astronomical solar terms are calculated.', category: 'Calendar' },
  phenology: { name: 'Phenology', subtitle: 'Readiness has its own rhythm', description: 'Follow observed milestones alongside expected windows, leaving unknown dates open.', encoding: 'Horizontal position represents date. Sprouts mark observed dates; shaded spans show expected windows; empty circles mean not observed.', category: 'Timeline' },
  'lunar-cycle': { name: 'Lunar Cycle', subtitle: 'Make room for a recurring rhythm', description: 'Arrange your own recurring routine around an abstract cycle with illustrative moons.', encoding: 'Angle represents cycle position; outer stem length represents value. Moon symbols are illustrative and do not encode completion or calculate lunar phase.', category: 'Cycle' },
  'water-clock': { name: 'Water Clock', subtitle: 'Let time take a gentler shape', description: 'Read elapsed or remaining duration through a calibrated vessel of water.', encoding: 'Water height represents remaining duration in a constant-area vessel. Input convention is explicitly elapsed or remaining. This chart is a snapshot, not a timer.', category: 'Progress' },
  balance: { name: 'Balance', subtitle: 'See both sides of the story', description: 'Compare two quantities with common-scale bars and a softly tilting balance.', encoding: 'Bar lengths use one linear scale. Beam tilt indicates the direction of the difference only; stones are decorative. Difference is right minus left.', category: 'Comparison' },
  'cord-ledger': { name: 'Cord Ledger', subtitle: 'Every contribution has a place', description: 'Count contributions on grouped cords, with a clear denomination for each knot.', encoding: 'One knot represents a labeled denomination. Partial knot area represents a fraction. Parent tracks group contiguous cords. This is not a historical khipu decoder.', category: 'Comparison' },
  'growth-history': { name: 'Growth History', subtitle: 'Let every chapter leave a trace', description: 'Build a record of contributions as successive growth layers with a linked comparison view.', encoding: 'Layer order follows input chronology. Ring thickness or area, as configured, represents period contribution; linked bars use a shared linear scale. Unknown periods have no quantitative layer.', category: 'Trend' },
  'tidal-rhythm': { name: 'Tidal Rhythm', subtitle: 'Find what returns, and what changes', description: 'Compare repeating patterns as aligned cycles with a shared scale and honest gaps.', encoding: 'Horizontal position represents position within each supplied cycle. Vertical position uses a shared numeric scale across cycles. Lines connect observations; this does not predict tides.', category: 'Trend' },
  'star-cycle': { name: 'Star Cycle', subtitle: 'A constellation of things to return to', description: 'Give recurring checkpoints a place in a clearly labeled cycle.', encoding: 'Angular position represents cycle position. Star intensity represents value; exact values and cycle positions remain available. The arrangement is an abstract checkpoint map.', category: 'Cycle' },
};
