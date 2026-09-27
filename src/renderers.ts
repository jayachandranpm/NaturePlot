import { pigment, mixColor, contrastInk, engrave, cloud, barkRim } from './artwork.js';
import { ecologyRenderers } from './ecology.js';
import { ecologyMetadata } from './ecology-catalog.js';
import { instrumentMetadata, instrumentRenderers } from './instruments.js';
import type { ChartMetadata, ChartRenderer, DataPoint, RenderContext } from './types.js';
import { arc, dateLabel, intensity, label, legend, maximum, pointLabel, polar, truncate } from './utils.js';

// Keep the unit in the axis heading, leaving room for legible tick numbers.
function valueTick(ctx:RenderContext,value:number):string {
  const text=ctx.options.formatValue?.(value)??new Intl.NumberFormat('en',{maximumFractionDigits:2}).format(value);
  return text.length>8||(value!==0&&Math.abs(value)<.001)?value.toExponential(1):text;
}

const rainbow: ChartRenderer = ctx => {
  const max = maximum(ctx.data, ctx.options.max);
  cloud(ctx, 58, 272, .7);
  cloud(ctx, 582, 272, .7);
  ctx.data.forEach((p, i) => {
    const week = Math.floor(i / 7), day = i % 7;
    const radius = 222 - week * 23;
    const start = Math.PI + day * Math.PI / 7 + 10 / radius;
    const end = Math.PI + (day + 1) * Math.PI / 7 - 10 / radius;
    const d = arc(320, 273, radius, start, end);
    ctx.el('path', { d, fill: 'none', stroke: ctx.theme.grid, 'stroke-width': 17, 'stroke-linecap': 'round' });
    const mark = ctx.el('path', { d, fill: 'none', stroke: ctx.theme.colors[(6 - week) % ctx.theme.colors.length], 'stroke-width': 17, 'stroke-linecap': 'round', opacity: intensity(p.value, max) });
    ctx.mark(mark, p, i);
  });
  const first = ctx.data[0], last = ctx.data[48];
  label(ctx, 102, 299, dateLabel(first.date!), { 'text-anchor': 'start' });
  label(ctx, 538, 299, dateLabel(last.date!), { 'text-anchor': 'end' });
  label(ctx, 320, 274, '49 little moments', { fill: ctx.theme.ink, 'font-size': 13 });
  legend(ctx);
};

const garden: ChartRenderer = ctx => {
  const plants = Math.ceil(ctx.data.length / 10), max = maximum(ctx.data, ctx.options.max);
  ctx.el('path', { d: 'M48 277 Q175 269 318 279 T592 276', fill: 'none', stroke: ctx.theme.grid, 'stroke-width': 1.5 });
  for (let plant = 0; plant < plants; plant++) {
    const x = (640 / (plants + 1)) * (plant + 1);
    ctx.el('ellipse', { cx: x, cy: 280, rx: 39, ry: 5, fill: ctx.theme.colors[0], opacity: .07 });
    ctx.el('path', { d: `M${x} 279 Q${x - 6} 190 ${x + 2} 71`, fill: 'none', stroke: ctx.theme.colors[0], 'stroke-width': 2.5, 'stroke-linecap': 'round' });
    ctx.el('path', { d: `M${x} 279q-8 7-19 10m19-10q8 8 22 11m-22-11v13`, fill:'none', stroke:ctx.theme.muted, 'stroke-width':.7,opacity:.5,'pointer-events':'none' });
    for (let j = 0; j < 10 && plant * 10 + j < ctx.data.length; j++) {
      const i = plant * 10 + j, p = ctx.data[i], side = j % 2 ? 1 : -1;
      const y = 255 - Math.floor(j / 2) * 36 - (j % 2) * 9;
      const tipX = x + side * 65, tipY = y - 38;
      const d = `M${x} ${y} Q${x + side * 8} ${y - 45} ${tipX} ${tipY} Q${x + side * 50} ${y + 5} ${x} ${y}Z`;
      ctx.el('path', { d, fill: ctx.theme.grid });
      const leaf = ctx.el('path', { d, fill: ctx.theme.colors[(plant + Math.floor(j / 4)) % ctx.theme.colors.length], opacity: intensity(p.value, max) });
      ctx.mark(leaf, p, i);
      ctx.el('path', { d: `M${x + side * 5} ${y - 4} L${tipX - side * 12} ${tipY + 5}`, stroke: ctx.theme.background, opacity: .5, 'stroke-width': 1, 'pointer-events': 'none' });
      [.3, .55, .75].forEach(t => {
        const vx = x + side * 53 * t, vy = y - 33 * t;
        ctx.el('path', { d: `M${vx} ${vy}q${side * 4} -8 ${side * 11} -12`, fill: 'none', stroke: ctx.theme.background, opacity: .35, 'stroke-width': .8, 'pointer-events': 'none' });
        ctx.el('path', { d: `M${vx} ${vy}q${side * 10} 5 ${side * 16} 1`, fill: 'none', stroke: ctx.theme.background, opacity: .3, 'stroke-width': .65, 'pointer-events': 'none' });
      });
      label(ctx, x + side * 39, y - 20, String(Number(p.date!.slice(-2))), { fill: contrastInk(mixColor(ctx.theme.grid, ctx.theme.colors[(plant + Math.floor(j / 4)) % ctx.theme.colors.length], intensity(p.value, max))), 'font-size': 10, 'pointer-events': 'none' });
    }
    const begin = ctx.data[plant * 10].date!;
    const end = ctx.data[Math.min(plant * 10 + 9, ctx.data.length - 1)].date!;
    label(ctx, x, 305, `${dateLabel(begin)} – ${dateLabel(end)}`, { 'font-size': 11 });
    ctx.el('ellipse', { cx: x + 2, cy: 69, rx: 4, ry: 8, transform: `rotate(15 ${x + 2} 69)`, fill: ctx.theme.colors[1 % ctx.theme.colors.length] });
  }
  legend(ctx);
};

const forest: ChartRenderer = ctx => {
  const max = maximum(ctx.data, ctx.options.max), base = 276, left = 72, right = 598;
  label(ctx,left,42,ctx.options.yLabel??ctx.options.unit??'Value',{'text-anchor':'start','font-size':13});
  for (let t = 0; t <= 4; t++) {
    const y = base - t * 51;
    ctx.el('line', { x1: left - 12, y1: y, x2: right, y2: y, stroke: ctx.theme.grid, 'stroke-dasharray': t ? '3 6' : 'none' });
    label(ctx, left - 23, y + 4, valueTick(ctx,max * t / 4), { 'text-anchor': 'end', 'font-size': 12 });
  }
  const step = (right - left) / Math.max(ctx.data.length, 1);
  ctx.data.forEach((p, i) => {
    const x = left + step * (i + .5), h = (p.value ?? 0) / max * 204, w = Math.min(36, step * .37);
    const group = ctx.el('g');
    if (p.value === null || p.value === 0) {
      ctx.el('circle', { cx: x, cy: base, r: 4, fill: p.value === null ? ctx.theme.grid : ctx.theme.colors[i % ctx.theme.colors.length] }, group);
    } else {
      ctx.el('path', { d: `M${x} ${base} V${base - h}`, stroke: ctx.theme.ink, 'stroke-width': 2, opacity: .45 }, group);
      const top = base - h;
      ctx.el('path', { d: `M${x} ${top} L${x + w * .64} ${top + h * .39} H${x + w * .36} L${x + w * .86} ${top + h * .62} H${x + w * .58} L${x + w} ${top + h * .83} Q${x} ${top + h * .9} ${x - w} ${top + h * .83} L${x - w * .58} ${top + h * .62} H${x - w * .86} L${x - w * .36} ${top + h * .39} H${x - w * .64}Z`, fill: pigment(ctx, ctx.theme.colors[i % ctx.theme.colors.length]) }, group);
      [.4, .6, .8].forEach(f => ctx.el('path', { d: `M${x-w*f*.65} ${top+h*f}L${x} ${top+h*(f+.05)}L${x+w*f*.65} ${top+h*f}`, fill: 'none', stroke: ctx.theme.background, opacity: .25, 'stroke-width': .9, 'pointer-events': 'none' }, group));
      if (h > 20) for(let tier=1;tier<=8;tier++) {
        const f=.16+tier*.072, reach=w*f*.78;
        ctx.el('path',{d:`M${x-reach} ${top+h*f}Q${x-reach*.45} ${top+h*(f+.035)} ${x} ${top+h*(f+.06)}Q${x+reach*.45} ${top+h*(f+.035)} ${x+reach} ${top+h*f}`,fill:'none',stroke:ctx.theme.background,'stroke-width':.55,opacity:.45,'pointer-events':'none'},group);
      }
      ctx.el('path', { d: `M${x} ${top + h * .12} V${base - h * .14}`, stroke: ctx.theme.background, opacity: .27, 'stroke-width': 1 }, group);
    }
    ctx.mark(group, p, i);
    if (i % Math.max(1, Math.ceil(ctx.data.length / 9)) === 0) label(ctx, x, 301, truncate(pointLabel(p, i), 9), { 'font-size': 11 });
  });
  label(ctx, 335, 335, 'Tree height = value · all trees share a zero baseline', { 'font-size': 11 });
};

function trend(ctx: RenderContext, smooth: boolean): void {
  const { data, theme } = ctx;
  const lo = Math.min(0, ...data.map(p => p.value ?? 0));
  const hi = ctx.options.max ?? Math.max(0, ...data.map(p => p.value ?? 0));
  const range = hi - lo || 1, bottom = 279, top = 68, left = 65, right = 593;
  const yFor = (value: number) => bottom - (value - lo) / range * (bottom - top);
  const xFor = (i: number) => data.length === 1 ? (left + right) / 2 : left + i / Math.max(1, data.length - 1) * (right - left);
  label(ctx,left,40,ctx.options.yLabel??ctx.options.unit??'Value',{'text-anchor':'start','font-size':13});
  for (let i = 0; i <= 4; i++) {
    const value = lo + range * i / 4, y = yFor(value);
    ctx.el('line', { x1: left, x2: right, y1: y, y2: y, stroke: theme.grid, 'stroke-dasharray': '3 6' });
    label(ctx, left - 12, y + 4, valueTick(ctx,value), { 'text-anchor': 'end', 'font-size': 12 });
  }
  const zero = yFor(0);
  ctx.el('line', { x1: left, x2: right, y1: zero, y2: zero, stroke: theme.muted, opacity: .45 });
  const defs = ctx.el('defs');
  const gradient = ctx.el('linearGradient', { id: `${ctx.id}-area`, x1: '0', y1: '0', x2: '0', y2: '1' }, defs);
  ctx.el('stop', { offset: '0%', 'stop-color': theme.colors[0], 'stop-opacity': smooth ? .5 : .65 }, gradient);
  ctx.el('stop', { offset: '100%', 'stop-color': theme.colors[2 % theme.colors.length], 'stop-opacity': .12 }, gradient);
  const segments: { x: number; y: number }[][] = [];
  let segment: { x: number; y: number }[] = [];
  data.forEach((p, i) => {
    if (p.value === null) { if (segment.length) segments.push(segment); segment = []; }
    else segment.push({ x: xFor(i), y: yFor(p.value) });
  });
  if (segment.length) segments.push(segment);
  segments.forEach(points => {
    let d = `M${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const p = points[i], prev = points[i - 1], mid = (p.x + prev.x) / 2;
      d += smooth ? ` C${mid},${prev.y} ${mid},${p.y} ${p.x},${p.y}` : ` L${p.x},${p.y}`;
    }
    const area = `${d} L${points.at(-1)!.x},${zero} L${points[0].x},${zero}Z`;
    const landscape = ctx.el('path', { d: area, fill: `url(#${ctx.id}-area)` });
    engrave(ctx, landscape, smooth ? 'water' : 'rock');
    ctx.el('path', { d, fill: 'none', stroke: theme.colors[0], 'stroke-width': smooth ? 3 : 2, 'stroke-linejoin': 'round' });
  });
  data.forEach((p, i) => {
    const x = xFor(i), y = p.value === null ? zero : yFor(p.value);
    const g = ctx.el('g');
    ctx.el('circle', { cx: x, cy: y, r: 11, fill: 'transparent' }, g);
    ctx.el('circle', { cx: x, cy: y, r: p.value === null ? 3 : 4, fill: p.value === null ? theme.grid : theme.background, stroke: theme.colors[0], 'stroke-width': 1.7 }, g);
    ctx.mark(g, p, i);
    const labelStep=Math.max(1,Math.ceil(data.length/7));
    if ((i % labelStep === 0 && data.length-1-i>=labelStep) || i === data.length - 1) label(ctx, x, 306, truncate(pointLabel(p, i), 9), { 'font-size': 11 });
  });
  label(ctx, 330, 338, 'Equal spacing = observation order · gaps = missing readings', { 'font-size': 11 });
}

const bloom: ChartRenderer = ctx => {
  const cx = 320, cy = 177, max = maximum(ctx.data, ctx.options.max), count = ctx.data.length;
  [45, 80, 115].forEach(r => ctx.el('circle', { cx, cy, r, fill: 'none', stroke: ctx.theme.grid, 'stroke-dasharray': '2 6' }));
  ctx.data.forEach((p, i) => {
    const angle = -Math.PI / 2 + i / count * Math.PI * 2;
    const spread = Math.min(.5, Math.PI / Math.max(3, count) * .8);
    const length = 15 + (p.value ?? 0) / max * 100;
    const base1 = polar(cx, cy, 15, angle - spread), base2 = polar(cx, cy, 15, angle + spread);
    const tip = polar(cx, cy, length, angle);
    const c1 = polar(cx, cy, length, angle - spread), c2 = polar(cx, cy, length, angle + spread);
    const d = `M${base1} Q${c1} ${tip} Q${c2} ${base2}Z`;
    const petal = ctx.el('g');
    ctx.el('path', { d, fill: p.value === null ? ctx.theme.grid : pigment(ctx, ctx.theme.colors[i % ctx.theme.colors.length]), stroke: ctx.theme.background, 'stroke-width': 1.4 }, petal);
    if (p.value !== null && p.value > 0) {
      const base = polar(cx, cy, 17, angle), vein = polar(cx, cy, length - 3, angle);
      ctx.el('path', { d: `M${base}L${vein}`, stroke: ctx.theme.background, opacity: .5, 'stroke-width': .8 }, petal);
      for(const side of [-1,1]) {
        const start=polar(cx,cy,20,angle+side*spread*.25), control=polar(cx,cy,length*.75,angle+side*spread*.4), end=polar(cx,cy,length-4,angle+side*spread*.06);
        ctx.el('path',{d:`M${start}Q${control} ${end}`,fill:'none',stroke:ctx.theme.background,'stroke-width':.6,opacity:.35,'pointer-events':'none'},petal);
      }
    }
    ctx.mark(petal, p, i);
    const [lx, ly] = polar(cx, cy, 142, angle);
    label(ctx, lx, ly + 4, truncate(pointLabel(p, i), 14), { 'font-size': 11, fill: ctx.theme.ink });
  });
  ctx.el('circle', { cx, cy, r: 13, fill: ctx.theme.colors[3 % ctx.theme.colors.length], 'pointer-events': 'none' });
  [0, 1, 2, 3, 4].forEach(i => { const p = polar(cx, cy, 6, i * 1.26); ctx.el('circle', { cx: p[0], cy: p[1], r: 1.1, fill: ctx.theme.ink, opacity: .45, 'pointer-events': 'none' }); });
  label(ctx, 320, 347, `Petal length · 0–${ctx.format(max)}`, { 'font-size': 10 });
};

const tide: ChartRenderer = ctx => {
  const p = ctx.data[0], cx = 320, cy = 168, r = 111;
  const target = p.target ?? ctx.options.target ?? 100;
  const percentage = p.value === null ? null : p.value / target * 100;
  const progress = Math.min(1, Math.max(0, (percentage ?? 0) / 100));
  const level = cy + r - progress * r * 2;
  const defs = ctx.el('defs'), clip = ctx.el('clipPath', { id: `${ctx.id}-water` }, defs);
  ctx.el('circle', { cx, cy, r }, clip);
  ctx.el('circle', { cx, cy, r: r + 7, fill: 'none', stroke: ctx.theme.grid, 'stroke-width': 1 });
  ctx.el('circle', { cx, cy, r, fill: ctx.theme.grid, opacity: .45 });
  const group = ctx.el('g', { 'clip-path': `url(#${ctx.id}-water)` });
  const amp = progress > .02 && progress < .98 ? 7 : 0;
  ctx.el('path', { d: `M190 ${level} Q255 ${level - amp * 2} 320 ${level} T450 ${level} V300 H190Z`, fill: ctx.theme.colors[1 % ctx.theme.colors.length], opacity: .5 }, group);
  const water = ctx.el('path', { d: `M190 ${level} Q255 ${level + amp * 2} 320 ${level} T450 ${level} V300 H190Z`, fill: ctx.theme.colors[0], opacity: .8 }, group);
  engrave(ctx,water,'water');
  [0,.5,1].forEach(f=>{ const y=cy+r-f*r*2; ctx.el('path',{d:`M197 ${y}h8`,stroke:ctx.theme.muted,'stroke-width':1}); label(ctx,189,y+4,`${f*100}%`,{'text-anchor':'end','font-size':12}); });
  const mark = ctx.el('circle', { cx, cy, r, fill: 'transparent' });
  ctx.mark(mark, p, 0);
  // An opaque label plate keeps exact values legible at every fill level.
  ctx.el('rect', { x: 260, y: 132, width: 120, height: 72, rx: 24, fill: ctx.theme.background, 'fill-opacity': .94, 'pointer-events': 'none' });
  label(ctx, cx, 173, percentage === null ? '—' : `${Math.round(percentage)}%`, { fill: ctx.theme.ink, 'font-size': 39, 'font-weight': 500, 'pointer-events': 'none' });
  label(ctx, cx, 194, 'of your goal', { 'font-size': 10, 'pointer-events': 'none' });
  label(ctx, cx, 308, truncate(pointLabel(p, 0), 50), { fill: ctx.theme.ink, 'font-size': 14 });
  label(ctx, cx, 333, `${ctx.format(p.value)} / ${ctx.format(target)}`, { 'font-size': 11 });
};

const rings: ChartRenderer = ctx => {
  const count = ctx.data.length, gap = Math.min(23, 99 / Math.max(1, count));
  const cx = 250, cy = 176;
  barkRim(ctx,cx,cy,132);
  ctx.data.forEach((p, i) => {
    const radius = 120 - i * gap, target = p.target ?? ctx.options.target ?? 100;
    const progress = Math.min(1, Math.max(0, (p.value ?? 0) / target));
    const color = ctx.theme.colors[i % ctx.theme.colors.length];
    const g = ctx.el('g');
    ctx.el('circle', { cx, cy, r: radius, fill: 'none', stroke: ctx.theme.grid, 'stroke-width': Math.max(1, gap - 7) }, g);
    if (progress > 0) {
      const end = -Math.PI / 2 + Math.PI * 2 * Math.min(.99999, progress);
      ctx.el('path', { d: arc(cx, cy, radius, -Math.PI / 2, end), fill: 'none', stroke: color, 'stroke-width': Math.max(1, gap - 7), 'stroke-linecap': 'butt', opacity: .9 }, g);
      if(gap>10) for(const offset of [-1.5,1.5]) ctx.el('path',{d:arc(cx,cy,radius+offset,-Math.PI/2,end),fill:'none',stroke:ctx.theme.background,'stroke-width':.55,opacity:.4,'pointer-events':'none'},g);
    }
    ctx.mark(g, p, i);
    if (i < 10) {
      const y = 62 + i * Math.min(40, 250 / count);
      ctx.el('circle', { cx: 423, cy: y - 4, r: 4, fill: color });
      label(ctx, 437, y, truncate(pointLabel(p, i), 17), { 'text-anchor': 'start', fill: ctx.theme.ink, 'font-size': 12 });
      label(ctx, 437, y + 16, p.value === null ? 'No data' : `${Math.round(p.value / target * 100)}% of ${ctx.format(target)}`, { 'text-anchor': 'start', 'font-size': 10 });
    }
  });
  label(ctx, 320, 337, 'Sweep angle = progress · hollow track = unfilled goal', { 'font-size': 11 });
};

export const renderers: Record<string, ChartRenderer> = { rainbow, garden, forest, river: ctx => trend(ctx, true), bloom, mountain: ctx => trend(ctx, false), tide, rings, ...instrumentRenderers, ...ecologyRenderers };
export const chartTypes: Record<string, ChartMetadata> = {
  rainbow: { name: 'Rainbow', subtitle: 'A spectrum of small wins', description: 'Give seven weeks of daily activity a little color. Every arc is a week; every segment is a day.', encoding: '7 arcs × 7 days. Color intensity represents the value; pale gray means no data.', category: 'Calendar' },
  garden: { name: 'Garden', subtitle: 'Good habits take root', description: 'Watch a month of effort grow into a garden. Three plants, thirty leaves, a story in every day.', encoding: 'Each plant holds 10 consecutive dates. Leaf intensity represents value. A 31st day adds a sprout.', category: 'Calendar' },
  forest: { name: 'Forest', subtitle: 'See how your ideas grow', description: 'Turn comparisons into a little woodland. A taller tree represents a larger value.', encoding: 'Tree height represents value on a shared linear scale starting at zero.', category: 'Comparison' },
  river: { name: 'River', subtitle: 'Find the flow in your data', description: 'Follow the gentle ebb and flow of your everyday rhythms, one observation at a time.', encoding: 'Vertical position represents value. Curves pass through observations without overshoot; gaps remain gaps.', category: 'Trend' },
  bloom: { name: 'Bloom', subtitle: 'A fuller picture, petal by petal', description: 'Give every dimension room to blossom. A simple flower reveals the shape of your strengths.', encoding: 'Petal length beyond the center represents value. Petal area is decorative, not a part-to-whole measure.', category: 'Comparison' },
  mountain: { name: 'Mountain', subtitle: 'Make every milestone visible', description: 'Explore the peaks and quieter stretches of a journey, from daily activity to weekly demand.', encoding: 'Each vertex is an observation on a linear scale. Straight slopes connect adjacent values.', category: 'Trend' },
  tide: { name: 'Tide', subtitle: 'Little by little, the tide rises', description: 'A single goal, a rising tide. Make progress feel calm, tangible, and within reach.', encoding: 'Water height represents the fraction of a target. Text preserves progress beyond 100%.', category: 'Progress' },
  rings: { name: 'Rings', subtitle: 'Every season leaves a mark', description: 'Layer your goals like the rings of a tree. Every circle has its own pace and possibility.', encoding: 'Arc angle represents percent of each target. Compare angles or percentages, not raw arc lengths.', category: 'Progress' },
  ...instrumentMetadata,
  ...ecologyMetadata,
};
