import { naturalSpecimen, hasNaturalForm, focusHalo } from './specimens.js';
import { pigment, measuredDot, mixColor, contrastInk, fernFrond, engrave, bird } from "./artwork.js";
import type { ChartRenderer, DataPoint, RenderContext } from "./types.js";
import type { EcologyType } from "./ecology-catalog.js";
import { clockMinutes, pointLabel, polar, truncate } from "./utils.js";
const TAU = Math.PI * 2;
const C = (c: RenderContext, i = 0) =>
  c.theme.colors[i % c.theme.colors.length];
const txt = (
  c: RenderContext,
  x: number,
  y: number,
  s: string,
  p?: Element,
  a: Record<string, string | number> = {},
) =>
  c.el(
    "text",
    { x, y, fill: c.theme.ink, "font-size": 14, "text-anchor": "middle", ...a },
    p,
    s,
  );
const line = (
  c: RenderContext,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  p?: Element,
  a: Record<string, string | number> = {},
) =>
  c.el(
    "line",
    { x1, y1, x2, y2, stroke: c.theme.grid, "stroke-width": 1.5, ...a },
    p,
  );
const path = (
  c: RenderContext,
  d: string,
  p?: Element,
  a: Record<string, string | number> = {},
) =>
  c.el("path", { d, fill: "none", stroke: C(c), "stroke-width": 2, ...a }, p);
const circle = (
  c: RenderContext,
  x: number,
  y: number,
  r: number,
  p?: Element,
  a: Record<string, string | number> = {},
) => c.el("circle", { cx: x, cy: y, r, fill: C(c), ...a }, p);
const val = (p: DataPoint) => p.value ?? 0;
const sum = (data: DataPoint[]) => data.reduce((s, p) => s + val(p), 0);
const max = (c: RenderContext) =>
  c.options.max ?? (Math.max(0, ...c.data.map(val)) || 1);
const fmt = (c: RenderContext, v: number) => {
  const s = c.format(v);
  return s.length > 16
    ? v.toExponential(2) + (c.options.unit ? " " + c.options.unit : "")
    : s;
};
const name = (p: DataPoint, i: number, n = 16) => truncate(pointLabel(p, i), n);
const mark = (c: RenderContext, p: DataPoint, i: number) => {
  const g = c.el("g");
  c.mark(g, p, i);
  return g;
};
const note = (c: RenderContext, s: string) =>
  txt(c, 320, 338, s, undefined, { "font-size": 13, fill: c.theme.muted });
const scale = (values: number[], lo: number, hi: number, zero = false) => {
  let a = Math.min(...values),
    b = Math.max(...values);
  if (zero) {
    a = Math.min(0, a);
    b = Math.max(0, b);
  }
  if (!values.length) {
    a = 0;
    b = 1;
  }
  if (a === b) {
    if (zero && a === 0) b = 1;
    else {
      const padding = Math.abs(a) * 0.1 || 1;
      a -= padding;
      b += padding;
    }
  }
  return { a, b, at: (v: number) => lo + ((v - a) / (b - a)) * (hi - lo) };
};
// Preserve angles and relative distances for coordinates in the same planar unit.
const spatialScales = (c: RenderContext) => {
  const xx = c.data.map((p) => p.x!),
    yy = c.data.map((p) => p.y!);
  const ax = Math.min(...xx),
    bx = Math.max(...xx),
    ay = Math.min(...yy),
    by = Math.max(...yy);
  const units = Math.max((bx - ax) / 533, (by - ay) / 220) || 1 / 220;
  const cx = (ax + bx) / 2,
    cy = (ay + by) / 2;
  return {
    xs: scale([cx - (units * 533) / 2, cx + (units * 533) / 2], 65, 598),
    ys: scale([cy - units * 110, cy + units * 110], 275, 55),
  };
};
const groups = (c: RenderContext) =>
  [...new Set(c.data.map((p) => p.track ?? "Series"))].map((key) => ({
    key,
    items: c.data
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => (p.track ?? "Series") === key),
  }));
const horizontal = (c: RenderContext, s: ReturnType<typeof scale>, y = 285) => {
  line(c, 150, y, 596, y);
  [s.a, (s.a + s.b) / 2, s.b].forEach((v) => {
    line(c, s.at(v), y, s.at(v), y + 5);
    txt(c, s.at(v), y + 24, ['firefly','dune'].includes(c.options.type)?plain(v):fmt(c, v));
  });
};
const plain = (v: number) =>
  Math.abs(v) >= 1e6 || (v !== 0 && Math.abs(v) < 0.001)
    ? v.toExponential(2)
    : new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(v);
const axes = (
  c: RenderContext,
  x: ReturnType<typeof scale>,
  y: ReturnType<typeof scale>,
  xname = "x",
  yname = "value",
) => {
  line(c, 65, 280, 598, 280);
  line(c, 65, 45, 65, 280);
  [x.a, (x.a + x.b) / 2, x.b].forEach((v) =>
    txt(
      c,
      x.at(v),
      303,
      ["echo", "pebble"].includes(c.options.type) ? fmt(c, v) : plain(v),
    ),
  );
  [y.a, (y.a + y.b) / 2, y.b].forEach((v) => {
    line(c, 65, y.at(v), 598, y.at(v), undefined, {
      "stroke-dasharray": "3 5",
    });
    txt(
      c,
      56,
      y.at(v) + 5,
      ["dew", "echo", "sediment"].includes(c.options.type)
        ? fmt(c, v)
        : plain(v),
      undefined,
      { "text-anchor": "end", "font-size": 12 },
    );
  });
  txt(c, 335, 326, c.options.xLabel ?? xname, undefined, {
    fill: c.theme.muted,
  });
  txt(c, 67, 26, c.options.yLabel ?? yname, undefined, {
    "text-anchor": "start",
    fill: c.theme.muted,
  });
};
const hex = (x: number, y: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => polar(x, y, r, (TAU * i) / 6))
    .map((p) => p.join(","))
    .join(" ");
const segment = (x: number, y: number, r: number, a: number, b: number) =>
  `M${x},${y}L${polar(x, y, r, a)}A${r},${r} 0 ${b - a > Math.PI ? 1 : 0} 1 ${polar(x, y, r, b)}Z`;

const honeycomb: ChartRenderer = (c) => {
  const rows = [...new Set(c.data.map((p) => p.track!))],
    cols = [...new Set(c.data.map((p) => p.label!))],
    h = Math.min(42, 240 / rows.length),
    w = Math.min(69, 410 / cols.length),
    r = Math.min(25, h / 1.8);
  cols.forEach((s, j) => txt(c, 181 + j * w, 31, truncate(s, 9)));
  rows.forEach((s, i) =>
    txt(c, 137, 65 + i * h, truncate(s, 13), undefined, {
      "text-anchor": "end",
    }),
  );
  rows.forEach((row, i) =>
    cols.forEach((col, j) => {
      const index = c.data.findIndex((p) => p.track === row && p.label === col),
        p = c.data[index],
        g = p ? mark(c, p, index) : c.el("g"),
        x = 181 + j * w + (i % 2 ? r * 0.15 : 0),
        y = 60 + i * h;
      c.el(
        "polygon",
        {
          points: hex(x, y, r),
          fill: p ? C(c) : c.theme.grid,
          opacity:
            p && p.value !== null ? 0.18 + (0.82 * val(p)) / max(c) : 0.12,
          stroke: c.theme.muted,
        },
        g,
      );
      c.el('polygon', {points:hex(x,y,r-2.4),fill:'none',stroke:c.theme.background,'stroke-width':1,opacity:.5,'pointer-events':'none'},g);
      if (p)
        txt(c, x, y + 5, p.value === null ? "—" : truncate(c.options.formatValue?.(p.value)??plain(p.value),6), g, {
          "font-size": 13,
          fill: contrastInk(
            mixColor(
              c.theme.background,
              C(c),
              p.value === null ? 0.12 : 0.18 + (0.82 * val(p)) / max(c),
            ),
          ),
        });
    }),
  );
  note(c, `Equal cells · intensity = value${c.options.unit?` (${c.options.unit})`:''} · pale cells are unmeasured`);
};
const rootTree: ChartRenderer = (c) => {
  const depths = c.data.map((p) => {
    let d = 0,
      q = p;
    while (q.parent) {
      d++;
      q = c.data.find((n) => n.id === q.parent)!;
    }
    return d;
  });
  const depthMax = Math.max(...depths, 1);
  const positions = c.data.map((p, i) => {
    const peers = c.data.filter((_, j) => depths[j] === depths[i]);
    const k = peers.indexOf(p);
    return [
      75 + (depths[i] / depthMax) * 475,
      50 + ((k + 1) * 240) / (peers.length + 1),
    ];
  });
  c.data.forEach((p, i) => {
    if (p.parent) {
      const j = c.data.findIndex((n) => n.id === p.parent),
        a = positions[j],
        b = positions[i];
      path(
        c,
        `M${a}C${a[0] + 70},${a[1]} ${b[0] - 70},${b[1]} ${b}`,
        undefined,
        { stroke: C(c,depths[i]), opacity: 0.6, 'stroke-width': 3.5 },
      );
      path(c, `M${a}C${a[0]+70},${a[1]} ${b[0]-70},${b[1]} ${b}`,undefined,{stroke:c.theme.background,'stroke-width':.75,opacity:.6,'pointer-events':'none'});
    }
  });
  c.data.forEach((p, i) => {
    const [x, y] = positions[i],
      g = mark(c, p, i);
    measuredDot(
      c,
      g,
      x,
      y,
      12 * Math.sqrt(val(p) / max(c)),
      C(c, depths[i]),
      p.value === null,
    );
    txt(c, x, y + 24, truncate(p.label ?? p.id!, 12), g, { "font-size": 13 });
  });
  note(
    c,
    "Depth = ancestry · node area = value · hollow = zero · dashed = missing",
  );
};
const canopy: ChartRenderer = (c) => {
  const gs = groups(c),
    total = sum(c.data);
  let x = 30;
  gs.forEach(({ key, items }, j) => {
    const part = items.reduce((s, { p }) => s + val(p), 0),
      w = total ? (580 * part) / total : 580 / gs.length;
    txt(c, x + w / 2, 31, truncate(key, 14));
    let y = 49;
    items.forEach(({ p, i }) => {
      const cellInk = contrastInk(
        mixColor(c.theme.background, C(c, j), 0.35 + (0.5 * (i % 3)) / 2),
      );
      const h = part ? (235 * val(p)) / part : 0,
        g = mark(c, p, i);
      const crown = c.el(
        "rect",
        {
          x,
          y,
          width: w,
          height: h,
          fill: C(c, j),
          opacity: 0.35 + (0.5 * (i % 3)) / 2,
          stroke: c.theme.background,
          "stroke-width": 2,
          class: "np-canopy-cell",
        },
        g,
      );
      engrave(c,crown,'leaf');
      if (w > 74 && h > 36) {
        const cx = x + w / 2,
          cy = y + h / 2;
        path(
          c,
          `M${cx - w * 0.3},${cy + h * 0.3}Q${cx - w * 0.25},${cy - h * 0.42} ${cx + w * 0.3},${cy - h * 0.3}Q${cx + w * 0.25},${cy + h * 0.42} ${cx - w * 0.3},${cy + h * 0.3}M${cx - w * 0.3},${cy + h * 0.3}L${cx + w * 0.3},${cy - h * 0.3}`,
          g,
          { stroke: c.theme.background, "stroke-width": 1.5, opacity: 0.28 },
        );
        txt(c, x + w / 2, y + h / 2 - 3, name(p, i, Math.floor(w / 9)), g, {
          fill: cellInk,
        });
        txt(c, x + w / 2, y + h / 2 + 17, fmt(c, val(p)), g, {
          "font-size": 13,
          fill: cellInk,
        });
      }
      if (!h) circle(c, x + 8, 300, 3, g, { fill: c.theme.muted });
      y += h;
    });
    x += w;
  });
  note(
    c,
    total
      ? "Rectangle area = contribution to the total"
      : "No positive contributions to allocate",
  );
};
const fern: ChartRenderer = (c) => {
  const sorted = c.data
      .map((p, i) => ({ p, i }))
      .sort((a, b) => val(b.p) - val(a.p)),
    total = sum(c.data);
  let acc = 0;
  line(c, 168, 40, 168, 291, undefined, { stroke: C(c), "stroke-width": 3 });
  sorted.forEach(({ p, i }, rank) => {
    const y = 52 + (rank * 230) / Math.max(1, c.data.length - 1),
      length = (245 * val(p)) / max(c),
      g = mark(c, p, i);
    txt(c, 150, y + 5, name(p, i), g, { "text-anchor": "end" });
    fernFrond(c, g, 168, y, length, C(c, rank));
    line(c, 168, y, 168 + Math.max(12, length), y, g, { stroke: "transparent", "stroke-width": 24, class: "np-hit-area" });
    acc += val(p);
    const x = 454 + (total ? acc / total : 0) * 108;
    circle(c, x, y, 6, g, { fill: C(c, 2) });
    txt(c, 622, y + 5, total ? `${Math.round((acc / total) * 100)}%` : "—", g, {
      "text-anchor": "end",
      "font-size": 13,
    });
  });
  txt(c, 522, 26, "Cumulative share", undefined, { "font-size": 13 });
  txt(c, 290, 26, "Amount", undefined, { "font-size": 13 });
  line(c, 168, 302, 413, 302);
  [0, .5, 1].forEach(f => {
    line(c, 168+245*f, 302, 168+245*f, 306);
    txt(c, 168+245*f, 323, fmt(c,max(c)*f), undefined, { "font-size":12 });
  });
  note(c, "Frond length = ranked amount · spores = cumulative %");
};
const phyllotaxis: ChartRenderer = (c) => {
  const total = sum(c.data),
    exact = c.data.map((p) => (total ? (val(p) / total) * 120 : 0)),
    counts = exact.map(Math.floor);
  let remaining = total ? 120 - counts.reduce((a, b) => a + b, 0) : 0;
  const remainders = exact
    .map((v, i) => ({ i, v: v - counts[i] }))
    .sort((a, b) => b.v - a.v);
  for (let j = 0; j < remaining; j++) counts[remainders[j].i]++;
  const naturalHead=hasNaturalForm(c,'sunflower');
  if(naturalHead) {
    circle(c,206,169,85,undefined,{fill:'#493b25'});
    naturalSpecimen(c,'sunflower',undefined,46,9,320,320);
  }
  let k = 0;
  c.data.forEach((p, i) => {
    const g = mark(c, p, i);
    for (let j = 0; j < counts[i]; j++, k++) {
      const a = k * 2.399963229728653,
        r = (naturalHead?7.05:10.7) * Math.sqrt(k + 0.5);
      circle(c, 206 + Math.cos(a) * r, 169 + Math.sin(a) * r, 4.5, g, {
        fill: pigment(c,C(c, i)),
        ...(naturalHead?{stroke:C(c,i),'stroke-width':2}:{}),
      });
      const sx=206+Math.cos(a)*r,sy=169+Math.sin(a)*r;
      if(naturalHead) {
        naturalSpecimen(c,'seed',g,sx-4.5,sy-3.1,9,6.2,{transform:`rotate(${a*180/Math.PI} ${sx} ${sy})`},C(c,i));
        continue;
      }
      path(c,`M${sx-2},${sy}Q${sx},${sy-2} ${sx+2},${sy}`,g,{stroke:c.theme.background,'stroke-width':.6,opacity:.6,'pointer-events':'none'});
    }
    circle(c, 383, 51 + i * 30, 5, g, { fill: C(c, i) });
    txt(
      c,
      397,
      56 + i * 30,
      `${name(p, i, 15)} · ${total ? ((100 * val(p)) / total).toFixed(1) : "0"}%`,
      g,
      { "text-anchor": "start" },
    );
  });
  note(c, "120 dots, rounded shares · exact values in the inspector");
};
const leafVeins: ChartRenderer = (c) => {
  const s = scale(
    c.data.flatMap((p) => [
      p.baseline!,
      ...(p.value === null ? [] : [p.value]),
    ]),
    150,
    596,
    true,
  );
  horizontal(c, s);
  c.data.forEach((p, i) => {
    const y = 52 + (i * 210) / Math.max(1, c.data.length - 1),
      g = mark(c, p, i);
    txt(c, 137, y + 5, name(p, i), g, { "text-anchor": "end" });
    const a = s.at(p.baseline!);
    const before = circle(c, a, y, 6, g, {
      fill: c.theme.background,
      stroke: C(c),
      "stroke-width": 2,
    });
    if (p.value !== null) {
      const b = s.at(p.value);
      const naturalLeaf=hasNaturalForm(c,'leaf');
      const leaf = path(
        c,
        `M${a},${y}Q${(a + b) / 2},${y - 12} ${b},${y}Q${(a + b) / 2},${y + 12} ${a},${y}`,
        g,
        { fill: C(c, p.value >= p.baseline! ? 0 : 3), opacity: 0.3 },
      );
      if(naturalLeaf && Math.abs(b-a)>1) {
        leaf.setAttribute('opacity','0');
        naturalSpecimen(c,'leaf',g,Math.min(a,b),y-18,Math.abs(b-a),36,{...(b<a?{transform:`translate(${a+b} 0) scale(-1 1)`}:{})});
        line(c,a,y,b,y,g,{stroke:c.theme.background,'stroke-width':1,opacity:.6});
        focusHalo(c,g,b,y,10);
      } else engrave(c,leaf,'leaf');
      circle(c, b, y, 6, g, { fill: C(c, p.value >= p.baseline! ? 0 : 3) });
      // Keep the hollow baseline above the leaf surface, including reversed pairs.
      g.append(before);
      if(a===b) circle(c,b,y,2.5,g,{fill:C(c)});
    }
  });
  note(c, "Hollow = before · solid = after · one shared numeric axis");
};
const lotus: ChartRenderer = (c) => {
  const n = c.data.length,
    center = [320, 173],
    r = 105,
    points = c.data.map((p, i) =>
      polar(
        ...(center as [number, number]),
        r * Math.min(1, val(p) / (p.target ?? c.options.target ?? 100)),
        -Math.PI / 2 + (i * TAU) / n,
      ),
    );
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i * TAU) / n,
      tip = polar(320, 173, r, a),
      l = polar(320, 173, r * 0.72, a - 0.32),
      rr = polar(320, 173, r * 0.72, a + 0.32);
    path(c, `M320,173Q${l} ${tip}Q${rr} 320,173`, undefined, {
      stroke: C(c, i),
      fill: pigment(c,C(c,i)),
      'fill-opacity': .035,
      "stroke-width": 1,
      opacity: 0.25,
      "pointer-events": "none",
    });
    for(const offset of [-.09,.09]) {
      const control=polar(320,173,r*.55,a+offset), end=polar(320,173,r*.91,a);
      path(c,`M320,173Q${control} ${end}`,undefined,{stroke:C(c,i),'stroke-width':.6,opacity:.13,'pointer-events':'none'});
    }
  }
  [0.25, 0.5, 0.75, 1].forEach((f) =>
    c.el("polygon", {
      points: Array.from({ length: n }, (_, i) =>
        polar(320, 173, r * f, -Math.PI / 2 + (i * TAU) / n).join(","),
      ).join(" "),
      fill: "none",
      stroke: c.theme.grid,
      "stroke-dasharray": f === 1 ? "5 4" : "1 0",
    }),
  );
  if (c.data.every((p) => p.value !== null))
    c.el("polygon", {
      points: points.map((p) => p.join(",")).join(" "),
      fill: C(c),
      "fill-opacity": 0.18,
      stroke: C(c),
      "stroke-width": 2,
    });
  c.data.forEach((p, i) => {
    const a = -Math.PI / 2 + (i * TAU) / n,
      outer = polar(320, 173, r, a),
      label = polar(320, 173, r + 35, a),
      g = mark(c, p, i);
    line(c, 320, 173, ...outer, g);
    circle(c, ...points[i], 6, g, {
      fill: p.value === null ? c.theme.grid : C(c, i),
    });
    txt(c, label[0], label[1], name(p, i, 12), g, { "font-size": 13 });
    txt(
      c,
      label[0],
      label[1] + 17,
      p.value === null
        ? "No data"
        : `${Math.round((val(p) / (p.target ?? c.options.target ?? 100)) * 100)}%`,
      g,
      { "font-size": 13 },
    );
  });
};
const ranges =
  (box: boolean): ChartRenderer =>
  (c) => {
    const s = scale(
      c.data.flatMap((p) => [p.low!, p.high!]),
      150,
      596,
    );
    horizontal(c, s);
    c.data.forEach((p, i) => {
      const y = 54 + (i * 210) / Math.max(1, c.data.length - 1),
        g = mark(c, p, i),
        a = s.at(p.low!),
        b = s.at(p.high!);
      txt(c, 136, y + 5, name(p, i), g, { "text-anchor": "end" });
      line(c, a, y, b, y, g, { stroke: C(c, i), "stroke-width": 3 });
      line(c, a, y - 9, a, y + 9, g, { stroke: C(c, i) });
      line(c, b, y - 9, b, y + 9, g, { stroke: C(c, i) });
      if (box) {
        const q = s.at(p.q1!),
          r = s.at(p.q3!);
        const pod = path(
          c,
          `M${q},${y}Q${q},${y - 17} ${(q + r) / 2},${y - 17}Q${r},${y - 17} ${r},${y}Q${r},${y + 17} ${(q + r) / 2},${y + 17}Q${q},${y + 17} ${q},${y}`,
          g,
          { fill: C(c, i), "fill-opacity": 0.35 },
        );
        if(hasNaturalForm(c,'pod') && r>q) {
          pod.setAttribute('opacity','0');
          naturalSpecimen(c,'pod',g,q,y-22,r-q,44);
          line(c,q,y-24,q,y+24,g,{stroke:C(c,i),'stroke-width':1.2});
          line(c,r,y-24,r,y+24,g,{stroke:C(c,i),'stroke-width':1.2});
          focusHalo(c,g,s.at(val(p)),y,25);
        } else engrave(c,pod,'glass');
        line(c, s.at(val(p)), y - 25, s.at(val(p)), y + 25, g, {
          stroke: c.theme.ink,
          "stroke-width": 2,
        });
      } else {
        // Coral growth stays inside the supplied interval, never past its limits.
        const width = b-a;
        if(width > 4) {
          path(c, `M${a},${y}Q${a+width*.3},${y-4} ${b},${y}Q${a+width*.4},${y+4} ${a},${y}Z`, g, { fill: pigment(c,C(c,i),"stone"), stroke: "none" });
          for(let branch=0;branch<7;branch++) {
            const t=(branch+1)/8, x=a+width*t, reach=Math.min(11,width/14), dy=(branch%2 ? -1:1)*(9+3*Math.sin(branch*2));
            path(c, `M${x-reach},${y}C${x},${y} ${x-reach*.3},${y+dy*.75} ${x+reach*.35},${y+dy}Q${x+reach*.8},${y+dy*.8} ${x+reach*.55},${y+dy*.6}L${x+reach*.24},${y+dy*.4}Q${x+reach},${y+dy*.55} ${x+reach},${y+dy*.2}Q${x+reach*.5},${y-1} ${x-reach},${y}Z`,g,{fill:pigment(c,C(c,i),"stone"),stroke:"none",class:"np-coral-branch"});
          }
        }
        if (p.value !== null)
          measuredDot(c, g, s.at(p.value), y, 7, C(c, i));
        else txt(c, (a + b) / 2, y - 14, "No estimate", g, { "font-size": 12 });
      }
    });
    note(
      c,
      box
        ? "Whiskers = min/max · pod = Q1–Q3 · line = median"
        : "Branch = supplied low/high range · polyp = central estimate",
    );
  };
const raincloud: ChartRenderer = (c) => {
  const xs = scale(
      c.data.flatMap((p) => [p.low!, p.high!]),
      65,
      598,
    ),
    densities = c.data.map((p) => val(p) / (p.high! - p.low!)),
    ys = scale([0, ...densities], 280, 65, true);
  axes(c, xs, ys, "Bin interval", "Frequency density");
  c.data.forEach((p, i) => {
    const a = xs.at(p.low!),
      b = xs.at(p.high!),
      y = ys.at(densities[i]),
      g = mark(c, p, i);
    const rain = c.el(
      "rect",
      {
        x: a,
        y,
        width: b - a,
        height: 280 - y,
        fill: C(c, i),
        opacity: 0.6,
        stroke: c.theme.background,
        class: "np-bin",
      },
      g,
    );
    engrave(c,rain,'glass');
    for (let drop = 0; drop < 3; drop++) {
      const dx = a + ((drop + 1) * (b - a)) / 4,
        dy = y + 18 + drop * 7;
      if (dy + 12 < 280)
        path(
          c,
          `M${dx},${dy - 6}Q${dx - 5},${dy + 2} ${dx},${dy + 5}Q${dx + 5},${dy + 2} ${dx},${dy - 6}`,
          g,
          { fill: c.theme.background, stroke: "none", opacity: 0.45 },
        );
    }
    if (b - a > 35)
      txt(c, (a + b) / 2, y - 8, fmt(c, val(p)), g, { "font-size": 13 });
  });
};
const dew: ChartRenderer = (c) => {
  const xs = scale(
    c.data.map((p) => p.x!),
    85,
    572,
  );
  const ys = scale(
    c.data
      .filter((p) => p.value !== null)
      .map(val)
      .concat([0]),
    264,
    62,
    true,
  );
  const wm = Math.max(0, ...c.data.map((p) => p.weight ?? 1)) || 1;
  axes(c, xs, ys, "x", "Value");
  c.data.forEach((p, i) => {
    const g = mark(c, p, i),
      x = xs.at(p.x!),
      y = p.value === null ? 345 : ys.at(p.value);
    measuredDot(
      c,
      g,
      x,
      y,
      23 * Math.sqrt((p.weight ?? 1) / wm),
      C(c, 0),
      p.value === null,
    );
  });
  [0.25, 0.5, 1].forEach((f, i) => {
    const x = 365 + i * 84;
    circle(c, x, 24, 23 * Math.sqrt(f), undefined, {
      fill: "none",
      stroke: C(c),
    });
    txt(c, x + 27, 28, plain(wm * f), undefined, {
      "text-anchor": "start",
      "font-size": 12,
    });
  });
  txt(c, 348, 28, c.options.weightLabel ?? "Weight", undefined, {
    "text-anchor": "end",
    "font-size": 12,
  });
  if (c.data.some((p) => p.value === null))
    txt(c, 20, 350, "Missing", undefined, {
      "text-anchor": "start",
      "font-size": 12,
    });
};
const windRose: ChartRenderer = (c) => {
  const cx = 320,
    cy = 175,
    r = 116,
    n = c.data.length;
  [0.25, 0.5, 1].forEach((f) =>
    circle(c, cx, cy, r * Math.sqrt(f), undefined, {
      fill: "none",
      stroke: c.theme.grid,
    }),
  );
  ["N", "E", "S", "W"].forEach((s, i) => {
    const p = polar(cx, cy, 143, -Math.PI / 2 + (i * Math.PI) / 2);
    txt(c, p[0], p[1] + 4, s);
  });
  c.data.forEach((p, i) => {
    const a = (p.angle! * Math.PI) / 180 - Math.PI / 2,
      w = (TAU / n) * 0.86,
      g = mark(c, p, i),
      radius = r * Math.sqrt(val(p) / max(c));
    if (radius > 0) {
    const wind = path(c, segment(cx, cy, radius, a - w / 2, a + w / 2), g, {
      fill: pigment(c,C(c, i)),
      stroke: c.theme.background,
      opacity: 0.8,
      class:'np-wind-sector', 'data-radius':radius,
    });
    engrave(c,wind,'water');
    } else measuredDot(c,g,...polar(cx,cy,10,a),0,C(c,i),p.value===null);
  });
  [0.25, 0.5, 1].forEach((f, i) => {
    line(c, 490, 119 + i * 29, 508, 119 + i * 29, undefined, {
      stroke: c.theme.muted,
    });
    txt(c, 517, 123 + i * 29, fmt(c, max(c) * f), undefined, {
      "text-anchor": "start",
      "font-size": 13,
    });
  });
  txt(c, 490, 92, "Ring values", undefined, {
    "text-anchor": "start",
    "font-size": 13,
  });
  note(c, "Sector area = value · clockwise from north");
};
const dune: ChartRenderer = (c) => {
  const gs = groups(c),
    xs = scale(
      c.data.map((p) => p.position!),
      150,
      596,
    ),
    height = 220 / gs.length,
    ceiling = max(c);
  txt(c, 596, 30, `Each ridge: 0–${fmt(c, ceiling)}`, undefined, {
    "text-anchor": "end",
    "font-size": 13,
  });
  gs.forEach(({ key, items }, j) => {
    const y = 65 + j * height;
    txt(c, 137, y + 20, truncate(key, 14), undefined, { "text-anchor": "end" });
    line(c, 150, y + height - 10, 596, y + height - 10);
    let run: { x: number; y: number }[] = [];
    const flush = () => {
      if (run.length) {
        const series = c.el("g", {class:"np-series", "data-series":key});
        const ridge = path(
          c,
          `M${run[0].x},${y + height - 10}L${run.map((p) => `${p.x},${p.y}`).join("L")}L${run.at(-1)!.x},${y + height - 10}Z`,
          series,
          {
            fill: C(c, j),
            "fill-opacity": 0.3,
            stroke: C(c, j),

          },
        );
        engrave(c,ridge,"sand");
      }
      run = [];
    };
    items.forEach(({ p, i }) => {
      const x = xs.at(p.position!),
        py = y + height - 10 - ((height - 20) * val(p)) / ceiling;
      if (p.value === null) flush();
      else run.push({ x, y: py });
      const g = mark(c, p, i);
      circle(c, x, py, 4, g, {
        fill: p.value === null ? c.theme.grid : C(c, j),
      });
    });
    flush();
  });
  horizontal(c, xs);
  note(c, "Position = bin location · all ridge heights share one scale");
};
const glacier: ChartRenderer = (c) => {
  let running = 0;
  const steps = c.data.map((p) => {
    const start = running;
    running += val(p);
    return { start, end: running };
  });
  const s = scale(
      [0, ...steps.flatMap((p) => [p.start, p.end])],
      281,
      53,
      true,
    ),
    w = 500 / c.data.length;
  txt(
    c,
    68,
    29,
    c.options.unit ? `Balance (${c.options.unit})` : "Running balance",
    undefined,
    { "text-anchor": "start", "font-size": 13 },
  );
  [...new Set([s.a, 0, s.b])].forEach((v) => {
    line(c, 68, s.at(v), 605, s.at(v));
    txt(c, 61, s.at(v) + 5, plain(v), undefined, {
      "text-anchor": "end",
      "font-size": 12,
    });
  });
  c.data.forEach((p, i) => {
    const g = mark(c, p, i),
      x = 85 + i * w,
      a = s.at(steps[i].start),
      b = s.at(steps[i].end);
    const ice = c.el(
      "rect",
      {
        x,
        y: Math.min(a, b),
        width: w * 0.68,
        height: Math.abs(b - a),
        rx: 2,
        fill: C(c, val(p) >= 0 ? 0 : 3),
        opacity: 0.75,
        class: "np-waterfall-step",
      },
      g,
    );
    engrave(c,ice,"ice");
    if (Math.abs(b - a) > 24)
      path(
        c,
        `M${x + w * 0.18},${Math.min(a, b) + 4}l${w * 0.12},9l${-w * 0.1},8`,
        g,
        { stroke: c.theme.background, opacity: 0.55 },
      );
    if (i < c.data.length - 1)
      line(c, x + w * 0.68, b, x + w, b, undefined, {
        "stroke-dasharray": "3 3",
      });
    txt(c, x + w * 0.34, 304, name(p, i, 8), g, { "font-size": 13 });
    txt(c, x + w * 0.34, Math.min(a, b) - 8, fmt(c, val(p)), g, {
      "font-size": 12,
    });
  });
  note(c, `Signed steps from zero · ending balance ${fmt(c, running)}`);
};
const sediment: ChartRenderer = (c) => {
  const gs = groups(c),
    positions = gs[0].items.map(({ p }) => p.position!),
    xs = scale(positions, 65, 598),
    totals = positions.map((_, i) =>
      gs.reduce((s, g) => s + val(g.items[i].p), 0),
    ),
    ys = scale([0, ...totals], 275, 50, true);
  let base = positions.map(() => 0);
  axes(c, xs, ys, "Position", "Stacked total");
  gs.forEach(({ key, items }, j) => {
    const lx = 233 + j * 98;
    line(c, lx - 17, 22, lx - 5, 22, undefined, {
      stroke: C(c, j),
      "stroke-width": 4,
    });
    txt(c, lx, 26, truncate(key, 10), undefined, {
      "text-anchor": "start",
      "font-size": 12,
    });
    const upper = base.map((v, i) => v + val(items[i].p));
    const series = c.el("g",{class:"np-series","data-series":key});
    const layer = path(
      c,
      `M${positions.map((p, i) => `${xs.at(p)},${ys.at(upper[i])}`).join("L")}L${positions
        .map((p, i) => `${xs.at(p)},${ys.at(base[i])}`)
        .reverse()
        .join("L")}Z`,
      series,
      {
        fill: C(c, j),
        "fill-opacity": 0.65,
        stroke: c.theme.background,

      },
    );
    engrave(c,layer,"sand");
    items.forEach(({ p, i }, k) => {
      const g = mark(c, p, i);
      circle(c, xs.at(p.position!), ys.at(base[k] + val(p) / 2), 5, g, {
        fill: C(c, j),
        stroke: c.theme.background,
      });
    });
    base = upper;
  });
};
const flows =
  (single: boolean): ChartRenderer =>
  (c) => {
    const sources = [...new Set(c.data.map((p) => p.source!))],
      dests = [...new Set(c.data.map((p) => p.destination!))],
      total = sum(c.data),
      gap = 30,
      usable = 235 - gap * (Math.max(sources.length, dests.length) - 1),
      factor = total ? usable / total : 0;
    const starts = (labels: string[], field: "source" | "destination") => {
      let y = 49;
      return new Map(
        labels.map((key) => {
          const amount = c.data
              .filter((p) => p[field] === key)
              .reduce((s, p) => s + val(p), 0),
            entry = { y, height: amount * factor, offset: 0, amount };
          y += entry.height + gap;
          return [key, entry] as const;
        }),
      );
    };
    const left = starts(sources, "source"),
      right = starts(dests, "destination");
    c.data.forEach((p, i) => {
      const a = left.get(p.source!)!,
        b = right.get(p.destination!)!,
        h = val(p) * factor,
        y1 = a.y + a.offset,
        y2 = b.y + b.offset,
        g = mark(c, p, i);
      a.offset += h;
      b.offset += h;
      if (h) {
        const ribbon = path(
          c,
          `M165,${y1}C310,${y1} 330,${y2} 475,${y2}L475,${y2 + h}C330,${y2 + h} 310,${y1 + h} 165,${y1 + h}Z`,
          g,
          {
            fill: C(c, single ? i : sources.indexOf(p.source!)),
            stroke: "none",
            "fill-opacity": 0.5,
            class: "np-flow-ribbon",
          },
        );
        engrave(c,ribbon,"water");
      } else
        path(c, `M165,${y1}C310,${y1} 330,${y2} 475,${y2}`, g, {
          stroke: c.theme.muted,
          "stroke-dasharray": "3 4",
        });
    });
    for (const [entries, x, anchor] of [
      [left, 149, "end"],
      [right, 491, "start"],
    ] as const)
      entries.forEach((v, key) => {
        c.el("rect", {
          x: anchor === "end" ? 157 : 475,
          y: v.y,
          width: 8,
          height: v.height,
          fill: c.theme.ink,
          opacity: 0.4,
        });
        txt(c, x, v.y + v.height / 2 - 3, truncate(key, 15), undefined, {
          "text-anchor": anchor,
          "font-size": 13,
        });
        txt(c, x, v.y + v.height / 2 + 15, fmt(c, v.amount), undefined, {
          "text-anchor": anchor,
          "font-size": 12,
          fill: c.theme.muted,
        });
      });
    note(
      c,
      single
        ? "One source · ribbon width = allocated quantity"
        : "Source → destination · ribbon widths conserve supplied flow",
    );
  };
const mycelium: ChartRenderer = (c) => {
  const nodes = [
      ...new Set(c.data.flatMap((p) => [p.source!, p.destination!])),
    ],
    position = (s: string) =>
      polar(
        320,
        172,
        118,
        -Math.PI / 2 + (nodes.indexOf(s) * TAU) / nodes.length,
      );
  c.data.forEach((p, i) => {
    const a = position(p.source!),
      b = position(p.destination!),
      g = mark(c, p, i),
      m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2],
      dx = b[0] - a[0],
      dy = b[1] - a[1],
      length = Math.hypot(dx, dy) || 1,
      k = [m[0] - (dy / length) * 25, m[1] + (dx / length) * 25];
    path(c, `M${a}Q${k} ${b}`, g, {
      stroke: "transparent",
      "stroke-width": 14,
      class: "np-hit-area",
    });
    path(c, `M${a}Q${k} ${b}`, g, {
      stroke: val(p) ? C(c, i) : c.theme.muted,
      "stroke-width": val(p) ? (10 * val(p)) / max(c) : 1,
      opacity: 0.7,
      "stroke-dasharray":
        p.value === null ? "2 5" : p.value === 0 ? "7 5" : "none",
      class: "np-thread",
    });
    if (val(p)>0) path(c,`M${a}Q${k} ${b}`,g,{stroke:c.theme.background,"stroke-width":(10*val(p)/max(c))*.18,opacity:.45,"pointer-events":"none"});
    const t = 0.7,
      px = (1 - t) ** 2 * a[0] + 2 * t * (1 - t) * k[0] + t * t * b[0],
      py = (1 - t) ** 2 * a[1] + 2 * t * (1 - t) * k[1] + t * t * b[1],
      angle = Math.atan2(
        (1 - t) * (k[1] - a[1]) + t * (b[1] - k[1]),
        (1 - t) * (k[0] - a[0]) + t * (b[0] - k[0]),
      );
    path(
      c,
      `M${polar(px, py, 7, angle + 2.5)}L${px},${py}L${polar(px, py, 7, angle - 2.5)}`,
      g,
      { stroke: C(c, i), "stroke-width": 2 },
    );
  });
  nodes.forEach((s) => {
    const [x, y] = position(s);
    circle(c, x, y, 9, undefined, {
      fill: c.theme.background,
      stroke: C(c),
      "stroke-width": 2,
    });
    const dx = x - 320,
      dy = y - 172,
      len = Math.hypot(dx, dy);
    txt(
      c,
      x + (dx / len) * 25,
      y + (dy / len) * 25 + 4,
      truncate(s, 11),
      undefined,
      {
        "font-size": 13,
        "text-anchor": dx > 1 ? "start" : dx < -1 ? "end" : "middle",
      },
    );
  });
  note(c, "Width = weight · long dash = zero · short dash = missing");
};
const pitcher: ChartRenderer = (c) => {
  const first = val(c.data[0]),
    h = 225 / c.data.length;
  c.data.forEach((p, i) => {
    const g = mark(c, p, i),
      w = first ? (300 * val(p)) / first : 0,
      y = 49 + i * h;
    if (w>0) {
      const chamber = c.el('rect', {x:350-w/2,y,width:w,height:h-5,rx:Math.min(8,w/6),fill:pigment(c,C(c,i)),opacity:.85,class:'np-funnel-stage'},g);
      engrave(c,chamber,'glass');
      line(c,350-w*.44,y+3,350+w*.44,y+3,g,{stroke:c.theme.background,'stroke-width':1,opacity:.5,'pointer-events':'none'});
    }
    if (!w) measuredDot(c,g,350,y+h/2,0,C(c,i));
    txt(c, 175, y + h / 2 + 4, name(p, i), g, { "text-anchor": "end" });
    txt(c, 530, y + h / 2, fmt(c, val(p)), g, { "text-anchor": "start" });
    const prev = i ? val(c.data[i - 1]) : first;
    txt(
      c,
      530,
      y + h / 2 + 17,
      prev ? `${Math.round((val(p) / prev) * 100)}% kept` : "—",
      g,
      { "text-anchor": "start", "font-size": 12 },
    );
  });
  note(c, "Width = count · retention compares adjacent stages");
};
const firefly: ChartRenderer = (c) => {
  const gs = groups(c),
    xs = scale(
      c.data.map((p) => p.position!),
      150,
      596,
    );
  horizontal(c, xs);
  gs.forEach(({ key, items }, j) => {
    const y = 58 + (j * 200) / Math.max(1, gs.length - 1);
    txt(c, 135, y + 5, truncate(key, 14), undefined, { "text-anchor": "end" });
    line(c, 150, y, 596, y);
    items.forEach(({ p, i }) => {
      const x = xs.at(p.position!),
        g = mark(c, p, i);
      if(hasNaturalForm(c,'firefly') && p.value!==null) {
        circle(c,x,y,20,g,{fill:'transparent',class:'np-hit-area'});
        naturalSpecimen(c,'firefly',g,x-20,y-21,40,34,{opacity:.35+.65*val(p)/max(c)});
        circle(c,x,y,2.5,g,{fill:C(c,j),stroke:c.theme.background,'stroke-width':.7});
        focusHalo(c,g,x,y,23);
      } else {
      circle(c, x, y, 12, g, {
        fill: C(c, j),
        opacity: p.value === null ? 0.08 : 0.08 + (0.17 * val(p)) / max(c),
      });
      path(c,`M${x},${y-1}Q${x-10},${y-10} ${x-6},${y-1}Q${x-3},${y+1} ${x},${y-1}Q${x+10},${y-10} ${x+6},${y-1}Q${x+3},${y+1} ${x},${y-1}`,g,{stroke:C(c,j),'stroke-width':.6,opacity:.4,fill:'none','pointer-events':'none'});
      circle(c, x, y, 4.5, g, {
        fill: p.value === null ? c.theme.grid : C(c, j),
        opacity: p.value === null ? 1 : 0.25 + (0.75 * val(p)) / max(c),
      });
      }
    });
  });
  note(c, `${c.options.xLabel??'Event position'} · opacity = magnitude${c.options.unit?` (${c.options.unit})`:''}`);
};
const migration: ChartRenderer = (c) => {
  const { xs, ys } = spatialScales(c);
  axes(c, xs, ys, "x coordinate", "y coordinate");
  c.data.forEach((p, i) => {
    const x = xs.at(p.x!),
      y = ys.at(p.y!);
    if (i) {
      const prev = c.data[i - 1],
        a = [xs.at(prev.x!), ys.at(prev.y!)],
        dx = x - a[0],
        dy = y - a[1],
        angle = Math.atan2(dy, dx),
        mx = (a[0] + x) / 2,
        my = (a[1] + y) / 2;
      line(c, a[0], a[1], x, y, undefined, {
        stroke: C(c),
        "stroke-width": 2,
        "stroke-dasharray": "4 4",
      });
      const flight=c.el('g',{transform:`translate(${mx} ${my}) rotate(${angle*180/Math.PI+90})`,'aria-hidden':'true','pointer-events':'none'});
      if(!naturalSpecimen(c,'swallow',flight,-17,-13,34,27)) bird(c,flight,0,0,C(c),7);
    }
    const g = mark(c, p, i);
    measuredDot(c, g, x, y, 16 * Math.sqrt(val(p) / max(c)), C(c, i));
    txt(c, x, y - 20, String(i + 1), g);
    if(hasNaturalForm(c,'swallow'))focusHalo(c,g,x,y,19);
  });
};
const murmuration: ChartRenderer = (c) => {
  const gs = groups(c),
    xs = scale(
      c.data
        .filter((p) => p.value !== null)
        .map(val)
        .concat([0]),
      150,
      596,
    );
  horizontal(c, xs);
  gs.forEach(({ key, items }, j) => {
    const y = 64 + (j * 195) / Math.max(1, gs.length - 1),
      placed: { x: number; y: number }[] = [];
    txt(c, 134, y + 5, truncate(key, 13), undefined, { "text-anchor": "end" });
    line(c, 150, y, 596, y);
    items.forEach(({ p, i }) => {
      const x = p.value === null ? 610 : xs.at(p.value);
      let offset = 0;
      const naturalBird=hasNaturalForm(c,'starling');
      const candidates=naturalBird?[0,-17,17,-30,30]:[0,-10,10,-20,20,-30,30];
      for (const candidate of candidates) {
        offset = candidate;
        if (!placed.some((q) => Math.hypot(x - q.x, y + candidate - q.y) < (naturalBird?21:11)))
          break;
      }
      placed.push({ x, y: y + offset });
      const g = mark(c, p, i);
      if(naturalBird && p.value!==null) {
        naturalSpecimen(c,'starling',g,x-12,y+offset-9,24,18);
        circle(c,x,y+offset,2,g,{fill:C(c,j),stroke:c.theme.background,'stroke-width':.6});
        focusHalo(c,g,x,y+offset,15);
      } else bird(c,g,x,y+offset,p.value===null?c.theme.muted:C(c,j));
      circle(c,x,y+offset,9,g,{fill:'transparent',class:'np-hit-area'});
    });
  });
  note(c, "Each bird = one reading · vertical jitter only separates marks");
};
const pebble: ChartRenderer = (c) => {
  const sorted = c.data
      .map((p, i) => ({ p, i }))
      .sort((a, b) => val(a.p) - val(b.p)),
    xs = scale(c.data.map(val), 65, 598),
    ys = scale([0, 1], 278, 53);
  axes(c, xs, ys, "Sample value", "Fraction at or below value");
  let d = `M65,278`,
    last = 0;
  const unique = [...new Set(sorted.map(({ p }) => val(p)))];
  unique.forEach((v) => {
    const x = xs.at(v),
      f = sorted.filter(({ p }) => val(p) <= v).length / sorted.length;
    d += `H${x}V${ys.at(f)}`;
    last = f;
  });
  d += `H598`;
  path(c, d, undefined, {
    stroke: C(c),
    "stroke-width": 2.5,
    class: "np-ecdf",
  });
  sorted.forEach(({ p, i }) => {
    const f =
        sorted.filter(({ p: q }) => val(q) <= val(p)).length / sorted.length,
      g = mark(c, p, i);
    const x=xs.at(val(p)),y=ys.at(f);
    if(hasNaturalForm(c,'pebble')) {
      naturalSpecimen(c,i%2?'pebble-light':'pebble',g,x-13,y-8,26,16);
      circle(c,x,y,2.1,g,{fill:C(c,i),stroke:c.theme.background,'stroke-width':.8});
      focusHalo(c,g,x,y,16);
    } else {
    c.el('ellipse',{cx:x,cy:y,rx:6,ry:4.5,fill:pigment(c,C(c,i),'stone'),stroke:c.theme.background,'stroke-width':.6},g);
    path(c,`M${x-3},${y+1}Q${x-1},${y-2} ${x+3},${y-1}`,g,{stroke:c.theme.background,'stroke-width':.6,opacity:.65,'pointer-events':'none'});
    }
    circle(c,x,y,14,g,{fill:'transparent',class:'np-hit-area'});
  });
};
const nautilus: ChartRenderer = (c) => {
  const span = c.options.cycleLength ?? 12,
    turns = Math.max(1, Math.floor(c.data.at(-1)!.position! / span) + 1);
  const location = (v: number) => {
    const progress = v / span,
      r = 22 + (progress / turns) * 100;
    return polar(275, 175, r, -Math.PI / 2 + progress * TAU);
  };
  path(
    c,
    Array.from(
      { length: 321 },
      (_, i) => `${i ? "L" : "M"}${location((turns * span * i) / 320)}`,
    ).join(""),
    undefined,
    { stroke: c.theme.grid, "stroke-width": 2 },
  );
  for (let step = 12; step < turns * 12; step++) {
    const v = (step / 12) * span,
      [x, y] = location(v),
      [ix, iy] = location(Math.max(0, v - span));
    const next = location(v+span/12), innerNext = location(v+span/12-span);
    const outerArc = Array.from({length:9},(_,k)=>`L${location(v+span/12*k/8)}`).join('');
    const innerArc = Array.from({length:9},(_,k)=>`L${location(v+span/12-span/12*k/8-span)}`).join('');
    path(c, `M${x},${y}${outerArc}Q${(next[0]+innerNext[0])/2+5},${(next[1]+innerNext[1])/2-5} ${innerNext}${innerArc}Q${(ix+x)/2+5},${(iy+y)/2-5} ${x},${y}Z`, undefined, { fill: pigment(c,C(c,Math.floor(v/span)),"stone"), "fill-opacity": .09, stroke:"none", "pointer-events":"none", class:"np-shell-chamber", "aria-hidden":"true" });
    path(
      c,
      `M${ix},${iy}Q${(ix + x) / 2 + 5},${(iy + y) / 2 - 5} ${x},${y}`,
      undefined,
      {
        stroke: C(c, Math.floor(v / span)),
        "stroke-width": 0.9,
        opacity: 0.22,
        "pointer-events": "none",
      },
    );
  }
  for (let turn = 0; turn < turns; turn++) {
    const [x, y] = location(turn * span);
    txt(c, x + 20, y, `Turn ${turn + 1}`, undefined, {
      "text-anchor": "start",
      "font-size": 12,
    });
  }
  c.data.forEach((p, i) => {
    const g = mark(c, p, i),
      [x, y] = location(p.position!);
    measuredDot(
      c,
      g,
      x,
      y,
      10 * Math.sqrt(val(p) / max(c)),
      C(c, Math.floor(p.position! / span)),
      p.value === null,
    );
  });
  txt(c, 462, 110, "One turn", undefined, { "text-anchor": "start" });
  txt(c, 462, 134, `${span} ${c.options.cycleUnit ?? "steps"}`, undefined, { "text-anchor": "start" });
  txt(c, 462, 171, "Dot area", undefined, { "text-anchor": "start" });
  txt(c, 462, 195, "= value", undefined, { "text-anchor": "start" });
  note(c, "Angle = cycle position · each new turn retains chronology");
};
const frost: ChartRenderer = (c) => {
  const labels = [...new Set(c.data.map((p) => p.track!))],
    n = labels.length,
    size = Math.min(47, 240 / n),
    left = 195;
  labels.forEach((s, i) => {
    txt(c, left + (i + 0.5) * size, 35, truncate(s, 7), undefined, {
      "font-size": 12,
    });
    txt(c, left - 15, 53 + (i + 0.5) * size, truncate(s, 13), undefined, {
      "text-anchor": "end",
    });
  });
  c.data.forEach((p, i) => {
    const col = labels.indexOf(p.label!),
      row = labels.indexOf(p.track!),
      x = left + col * size,
      y = 47 + row * size,
      g = mark(c, p, i),
      fill = mixColor(
        c.theme.background,
        val(p) >= 0 ? "#367d9e" : "#b5683e",
        p.value === null ? 0.06 : Math.abs(val(p)) * 0.8,
      );
    c.el(
      "rect",
      {
        x,
        y,
        width: size - 3,
        height: size - 3,
        rx: 4,
        fill,
        stroke: c.theme.grid,
        "stroke-width": 0.6,
      },
      g,
    );
    // Crystal facets stay in the corners, leaving the signed reading unobstructed.
    [0, 1].forEach((k) => {
      const fx = x + (k ? size - 9 : 6),
        fy = y + (k ? size - 9 : 6);
      for(let arm=0;arm<6;arm++) {
        const a=arm*TAU/6, tip=polar(fx,fy,4,a), fork=polar(fx,fy,2.2,a), l=polar(fork[0],fork[1],1.8,a-.65), r=polar(fork[0],fork[1],1.8,a+.65);
        path(c,`M${fx},${fy}L${tip}M${l}L${fork}L${r}`,g,{stroke:contrastInk(fill),'stroke-width':.45,opacity:.3,'pointer-events':'none'});
      }
    });
    if (size >= 32)
      txt(
        c,
        x + (size - 3) / 2,
        y + size / 2 + 3,
        p.value === null ? "—" : p.value.toFixed(1),
        g,
        { "font-size": 12, fill: contrastInk(fill) },
      );
  });
  [-1, -0.5, 0, 0.5, 1].forEach((v, i) => {
    const x = 195 + i * 47;
    c.el("rect", {
      x,
      y: 302,
      width: 44,
      height: 9,
      rx: 2,
      fill: mixColor(
        c.theme.background,
        v >= 0 ? "#367d9e" : "#b5683e",
        Math.abs(v) * 0.8,
      ),
      stroke: c.theme.grid,
    });
    txt(c, x + 22, 328, String(v), undefined, { "font-size": 12 });
  });
};
const echo: ChartRenderer = (c) => {
  const known = c.data.filter((p) => p.value !== null).map(val),
    xs = scale(known.concat([0]), 65, 598),
    ys = scale(known.concat([0]), 275, 55);
  axes(c, xs, ys, "Previous reading (t − 1)", "Current reading (t)");
  line(c, 65, 275, 598, 55, undefined, {
    stroke: c.theme.muted,
    "stroke-dasharray": "5 5",
  });
  c.data.forEach((p, i) => {
    const prev = c.data[i - 1],
      g = mark(c, p, i),
      valid =
        p.value !== null && prev?.value !== null && prev?.value !== undefined;
    circle(
      c,
      valid ? xs.at(prev.value!) : 158 + i * 11,
      valid ? ys.at(p.value!) : 348,
      valid ? 6 : 3,
      g,
      { fill: valid ? C(c, i) : c.theme.muted, "fill-opacity": 0.65 },
    );
    if(valid) {
      const x=xs.at(prev.value!),y=ys.at(p.value!);
      if(hasNaturalForm(c,'ripple')) {
        naturalSpecimen(c,'ripple',g,x-17,y-17,34,34,{opacity:.85});
        focusHalo(c,g,x,y,20);
      } else [8.5,11].forEach(r=>path(c,`M${x-r},${y}A${r},${r} 0 0 1 ${x},${y-r}M${x+r},${y}A${r},${r} 0 0 1 ${x},${y+r}`,g,{stroke:C(c,i),'stroke-width':.65,opacity:.4,'pointer-events':'none','aria-hidden':'true'}));
    }
  });
  txt(c, 72, 353, "No pair", undefined, {
    "text-anchor": "start",
    "font-size": 12,
  });
};
const cairn: ChartRenderer = (c) => {
  const target = c.options.target ?? 100,
    total = sum(c.data),
    ceiling = Math.max(target, total),
    height = 230;
  let y = 285;
  const goalY = 285 - (target / ceiling) * height;
  line(c, 135, goalY, 510, goalY, undefined, {
    stroke: c.theme.muted,
    "stroke-dasharray": "4 4",
  });
  txt(c, 510, goalY - 9, `Goal ${fmt(c, target)}`, undefined, {
    "text-anchor": "end",
  });
  c.data.forEach((p, i) => {
    const h = (height * val(p)) / ceiling,
      g = mark(c, p, i),
      w = 210 - i * 11;
    const stone = c.el(
      "rect",
      {
        x: 290 - w / 2,
        y: y - h,
        width: w,
        height: h,
        rx: Math.min(9, h / 4),
        fill: pigment(c, C(c, i), "stone"),
        stroke: c.theme.background,
        "stroke-width": 2,
        opacity: 0.8,
        class: "np-cairn-stone",
      },
      g,
    );
    engrave(c,stone,"rock");
    if (h === 0) measuredDot(c, g, 160, 305 + (i % 2) * 10, 0, C(c, i));
    if (h > 23)
      txt(c, 290, y - h / 2 + 5, name(p, i), g, {
        fill: contrastInk(mixColor(c.theme.background, C(c, i), 0.64)),
      });
    y -= h;
  });
  txt(c, 480, 160, fmt(c, total), undefined, { "font-size": 27 });
  txt(c, 480, 187, `${Math.round((total / target) * 100)}% of goal`);
  note(
    c,
    total > target
      ? `${fmt(c, total - target)} beyond the shared goal`
      : `${fmt(c, target - total)} remaining · stone height = contribution`,
  );
};
const daylight: ChartRenderer = (c) => {
  const s = { a: 0, b: 1440, at: (v: number) => 150 + (v / 1440) * 446 };
  [0, 360, 720, 1080, 1440].forEach((v) => {
    const x = s.at(v);
    line(c, x, 42, x, 282, undefined, { "stroke-dasharray": "3 5" });
    txt(c, x, 306, `${String(v / 60).padStart(2, "0")}:00`, undefined, {
      "font-size": 13,
    });
  });
  c.data.forEach((p, i) => {
    const y = 59 + (i * 210) / Math.max(1, c.data.length - 1),
      g = mark(c, p, i),
      a = s.at(clockMinutes(p.start!)),
      b = s.at(clockMinutes(p.end!, true));
    txt(c, 136, y + 5, p.date!, g, { "text-anchor": "end", "font-size": 13 });
    c.el(
      "rect",
      {
        x: a,
        y: y - 11,
        width: b - a,
        height: 22,
        rx: 11,
        fill: pigment(c,C(c,3)),
        opacity: 0.6,
      },
      g,
    );
    for(const side of [-1,1]) path(c,`M${a-3},${y+side*7}l-1,${side*2}M${a+3},${y+side*7}l1,${side*2}`,g,{stroke:C(c,3),'stroke-width':.8,opacity:.65,'pointer-events':'none'});
    circle(c, a, y, 5, g, { fill: C(c, 3) });
    circle(c, b, y, 5, g, { fill: C(c, 1) });
    txt(
      c,
      (a + b) / 2,
      y + 5,
      `${((clockMinutes(p.end!, true) - clockMinutes(p.start!)) / 60).toFixed(1)} h`,
      g,
      {
        "font-size": 13,
        fill: contrastInk(mixColor(c.theme.background, C(c, 3), 0.6)),
      },
    );
  });
  note(c, "Supplied opening → closing times · shared 24-hour scale");
};
const isobar: ChartRenderer = (c) => {
  const xv = [...new Set(c.data.map((p) => p.x!))].sort((a, b) => a - b),
    yv = [...new Set(c.data.map((p) => p.y!))].sort((a, b) => a - b),
    { xs, ys } = spatialScales(c),
    vs = scale(c.data.map(val), 0, 1);
  axes(c, xs, ys, "x coordinate", "y coordinate");
  const observedMin = Math.min(...c.data.map(val)),
    observedMax = Math.max(...c.data.map(val));
  const levels =
      observedMin === observedMax
        ? []
        : [0.25, 0.5, 0.75].map(
            (f) => observedMin + (observedMax - observedMin) * f,
          ),
    lookup = (x: number, y: number) =>
      c.data.find((p) => p.x === x && p.y === y)!;
  if(c.options.detail!=='essential') {
    const xl=xs.at(xv[0]),xr=xs.at(xv.at(-1)!),yt=ys.at(yv.at(-1)!),yb=ys.at(yv[0]);
    c.el('rect',{x:xl,y:yt,width:xr-xl,height:yb-yt,fill:c.theme.grid,opacity:.4});
    // Filled bands use the same piecewise-linear field as the contour lines.
    type Vertex={x:number;y:number;v:number};
    const clip=(vertices:Vertex[],threshold:number,above:boolean):Vertex[]=>{
      const result:Vertex[]=[];
      vertices.forEach((a,i)=>{const b=vertices[(i+1)%vertices.length],ai=above?a.v>=threshold:a.v<=threshold,bi=above?b.v>=threshold:b.v<=threshold;
        if(ai)result.push(a);
        if(ai!==bi){const t=(threshold-a.v)/(b.v-a.v);result.push({x:a.x+t*(b.x-a.x),y:a.y+t*(b.y-a.y),v:threshold});}
      });return result;
    };
    for(let row=0;row<yv.length-1;row++) for(let col=0;col<xv.length-1;col++) {
      const q=[lookup(xv[col],yv[row]),lookup(xv[col+1],yv[row]),lookup(xv[col+1],yv[row+1]),lookup(xv[col],yv[row+1])];
      for(const tri of [[q[0],q[1],q[2]],[q[0],q[2],q[3]]]) {
        const vertices=tri.map(p=>({x:xs.at(p.x!),y:ys.at(p.y!),v:vs.at(val(p))}));
        for(let band=0;band<4;band++) {
          const poly=clip(clip(vertices,band/4,true),(band+1)/4,false);
          if(poly.length>=3)c.el('polygon',{points:poly.map(p=>`${p.x},${p.y}`).join(' '),fill:mixColor(c.theme.background,C(c,band),.35+band*.12),class:'np-isoband','data-low':band/4,'data-high':(band+1)/4});
        }
      }
    }

  }
  // Two linear triangles per grid cell avoid ambiguous marching-square saddles.
  for (let row = 0; row < yv.length - 1; row++)
    for (let col = 0; col < xv.length - 1; col++) {
      const q = [
        lookup(xv[col], yv[row]),
        lookup(xv[col + 1], yv[row]),
        lookup(xv[col + 1], yv[row + 1]),
        lookup(xv[col], yv[row + 1]),
      ];
      for (const tri of [
        [q[0], q[1], q[2]],
        [q[0], q[2], q[3]],
      ])
        levels.forEach((level, j) => {
          const hits: [number, number][] = [];
          for (let edge = 0; edge < 3; edge++) {
            const a = tri[edge],
              b = tri[(edge + 1) % 3];
            if (
              (val(a) < level && val(b) >= level) ||
              (val(b) < level && val(a) >= level)
            ) {
              const t = (level - val(a)) / (val(b) - val(a));
              hits.push([
                xs.at(a.x! + t * (b.x! - a.x!)),
                ys.at(a.y! + t * (b.y! - a.y!)),
              ]);
            }
          }
          if (hits.length === 2) {
            line(c,...hits[0],...hits[1],undefined,{stroke:c.theme.background,"stroke-width":5,opacity:.9,"pointer-events":"none"});
            line(c, ...hits[0], ...hits[1], undefined, {
              stroke: C(c, j),
              "stroke-width": 2.5,
              class: "np-contour",
              "data-level": level,
            });
          }
        });
    }
  c.data.forEach((p, i) => {
    const g = mark(c, p, i);
    focusHalo(c,g,xs.at(p.x!),ys.at(p.y!),11);
    circle(c, xs.at(p.x!), ys.at(p.y!), 5, g, {
      fill: C(c),
      "fill-opacity": 0.25 + 0.75 * vs.at(val(p)),
      stroke: c.theme.background,
    });
  });
  if (!levels.length)
    txt(c, 595, 25, `Constant field: ${fmt(c, observedMin)}`, undefined, {
      "text-anchor": "end",
      "font-size": 12,
    });
  else
    levels.forEach((v, i) => {
      const x = 233 + i * 128;
      line(c, x, 22, x + 20, 22, undefined, {
        stroke: C(c, i),
        "stroke-width": 2.5,
      });
      txt(c, x + 26, 26, fmt(c, v), undefined, {
        "text-anchor": "start",
        "font-size": 12,
      });
    });
};
const bamboo: ChartRenderer = (c) => {
  const stems = [...new Set(c.data.map((p) => Math.floor(val(p) / 10)))].sort(
      (a, b) => a - b,
    ),
    rowH = 240 / Math.max(1, stems.length);
  const naturalBamboo=hasNaturalForm(c,'bamboo');
  if(naturalBamboo) naturalSpecimen(c,'bamboo',undefined,174,29,23,267);
  else line(c, 185, 35, 185, 289, undefined, { stroke: C(c), "stroke-width": 5 });
  line(c,183,35,183,289,undefined,{stroke:c.theme.background,'stroke-width':.8,opacity:.6,'pointer-events':'none'});
  stems.forEach((stem, row) => {
    const y = 49 + row * rowH;
    txt(c, 164, y + 5, String(stem), undefined, { "font-size": 17 });
    line(c, 177, y + rowH * 0.5, 193, y + rowH * 0.5, undefined, {
      stroke: C(c),
      "stroke-width": 3,
    });
    path(c,`M181,${y+rowH*.5-3}h9M185,${y+rowH*.5}q17-15 26-12q-8 14-26 12`,undefined,{stroke:C(c),'stroke-width':.7,fill:C(c),'fill-opacity':.3,'pointer-events':'none'});
    const leaves = c.data
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => Math.floor(val(p) / 10) === stem)
      .sort((a, b) => val(a.p) - val(b.p));
    leaves.forEach(({ p, i }, j) => {
      const g = mark(c, p, i);
      if(naturalBamboo) {
        const lx=211+j*Math.min(22,389/Math.max(1,leaves.length-1));
        naturalSpecimen(c,'leaf',g,lx-11,y-11,22,24);
        circle(c,lx,y,8,g,{fill:c.theme.background,opacity:.82});
        focusHalo(c,g,lx,y,13);
      }
      txt(
        c,
        211 + j * Math.min(22, 389 / Math.max(1, leaves.length - 1)),
        y + 5,
        String(val(p) % 10),
        g,
        { "font-size": 17, fill: c.theme.ink },
      );
    });
  });
  note(c, "Stem | leaf: 4 | 7 means 47 · repeated leaves are distinct");
};
export const ecologyRenderers: Record<EcologyType, ChartRenderer> = {
  honeycomb,
  mycelium,
  "root-tree": rootTree,
  canopy,
  fern,
  phyllotaxis,
  "leaf-veins": leafVeins,
  lotus,
  "petal-box": ranges(true),
  raincloud,
  dew,
  "wind-rose": windRose,
  dune,
  glacier,
  sediment,
  delta: flows(true),
  estuary: flows(false),
  pitcher,
  firefly,
  migration,
  murmuration,
  "coral-range": ranges(false),
  pebble,
  nautilus,
  frost,
  echo,
  cairn,
  daylight,
  isobar,
  bamboo,
};
