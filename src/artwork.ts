import type { RenderContext } from "./types.js";

/** Local SVG paint servers: no image assets, CSS dependencies, or geometry changes. */
export function pigment(
  c: RenderContext,
  color: string,
  material: "water" | "leaf" | "stone" = "leaf",
): string {
  if(c.options.detail==='essential') return color;
  const id = `${c.id}-${material}-${color.slice(1)}`;
  if (!c.svg.querySelector(`[id="${id}"]`)) {
    const defs = c.el("defs");
    if (material === "water") {
      const g = c.el(
        "radialGradient",
        { id, cx: ".3", cy: ".25", r: ".8" },
        defs,
      );
      c.el(
        "stop",
        { offset: "0", "stop-color": c.theme.background, "stop-opacity": ".9" },
        g,
      );
      c.el(
        "stop",
        { offset: ".38", "stop-color": color, "stop-opacity": ".52" },
        g,
      );
      c.el(
        "stop",
        { offset: "1", "stop-color": color, "stop-opacity": ".95" },
        g,
      );
    } else {
      const g = c.el(
        "linearGradient",
        { id, x1: "0", y1: "0", x2: "1", y2: "1" },
        defs,
      );
      c.el(
        "stop",
        { offset: "0", "stop-color": color, "stop-opacity": ".92" },
        g,
      );
      c.el(
        "stop",
        { offset: ".55", "stop-color": color, "stop-opacity": ".72" },
        g,
      );
      c.el(
        "stop",
        { offset: "1", "stop-color": color, "stop-opacity": ".95" },
        g,
      );
    }
  }
  return `url(#${id})`;
}

/** Keep zero and missing observations visible without assigning either a positive area. */
export function measuredDot(
  c: RenderContext,
  parent: Element,
  x: number,
  y: number,
  radius: number,
  color: string,
  missing = false,
): void {
  c.el(
    "circle",
    {
      cx: x,
      cy: y,
      r: Math.max(11, radius),
      fill: "transparent",
      class: "np-hit-area",
    },
    parent,
  );
  if (missing || radius === 0) {
    c.el(
      "circle",
      {
        cx: x,
        cy: y,
        r: 4,
        fill: c.theme.background,
        stroke: c.theme.muted,
        "stroke-width": 1.4,
        "stroke-dasharray": missing ? "2 2" : "none",
        class: missing ? "np-missing-marker" : "np-zero-marker",
      },
      parent,
    );
    if (missing)
      c.el(
        "path",
        {
          d: `M${x - 2} ${y + 2}l4 -4`,
          stroke: c.theme.muted,
          "pointer-events": "none",
        },
        parent,
      );
    return;
  }
  c.el(
    "circle",
    {
      cx: x,
      cy: y,
      r: radius,
      fill: pigment(c, color, "water"),
      class: "np-measured-dot",
    },
    parent,
  );
  c.el(
    "circle",
    {
      cx: x,
      cy: y,
      r: Math.max(0, radius - 0.5),
      fill: "none",
      stroke: color,
      "stroke-width": 0.8,
      "pointer-events": "none",
    },
    parent,
  );
  if (radius > 6)
    c.el(
      "path",
      {
        d: `M${x - radius * 0.55} ${y - radius * 0.12} Q${x - radius * 0.5} ${y - radius * 0.65} ${x - radius * 0.03} ${y - radius * 0.62}`,
        fill: "none",
        stroke: c.theme.background,
        "stroke-width": 1.2,
        "stroke-linecap": "round",
        opacity: 0.8,
        "pointer-events": "none",
      },
      parent,
    );
  // A second, smaller reflection gives depth without expanding the measured area.
  if (radius > 8) {
    c.el("ellipse", { cx: x - radius * .32, cy: y - radius * .48, rx: radius * .12, ry: radius * .065, transform: `rotate(-36 ${x-radius*.32} ${y-radius*.48})`, fill: c.theme.background, opacity: .85, "pointer-events": "none" }, parent);
    c.el("path", { d: `M${x+radius*.56} ${y+radius*.05}Q${x+radius*.58} ${y+radius*.52} ${x+radius*.14} ${y+radius*.69}`, fill: "none", stroke: color, "stroke-width": .8, opacity: .5, "pointer-events": "none" }, parent);
  }
}

/** Compound frond: its final x-coordinate is the measured value. */
export function fernFrond(c: RenderContext, parent: Element, x: number, y: number, length: number, color: string): void {
  c.el("path", { d: `M${x} ${y}H${x+length}`, stroke: color, "stroke-width": 1.5, class: "np-frond-measure" }, parent);
  if (length < 4) return;
  // Fixed pinna count avoids encoding a second, unintended count or threshold.
  for (let k = 0; k < 11; k++) {
    const t = .06 + k * .076, base = x + length * t;
    const width = Math.min(12, length * .15) * Math.sin(Math.PI * (t+.07));
    const advance = Math.min(length * .12, 16);
    for (const side of [-1, 1]) {
      const tipX = Math.min(x+length, base+advance), tipY = y+side*width;
      c.el("path", { d: `M${base} ${y}Q${base+advance*.12} ${y+side*width*.87} ${tipX} ${tipY}Q${base+advance*.9} ${y+side*width*.23} ${base} ${y}Z`, fill: pigment(c,color), stroke: color, "stroke-width": .35, class: "np-frond-pinna" }, parent);
      if (width > 3) c.el("path", { d: `M${base+1} ${y}Q${base+advance*.55} ${y+side*width*.35} ${tipX-1} ${tipY-side}`, stroke: c.theme.background, "stroke-width": .5, fill: "none", opacity: .5, "pointer-events": "none" }, parent);
    }
  }
}

/** Decorative bark lies outside every quantitative growth layer. */
export function barkRim(c: RenderContext, x: number, y: number, radius: number): void {
  const g = c.el("g", { class: "np-ornament", "aria-hidden": "true", "pointer-events": "none" });
  const points = Array.from({length: 97}, (_,i) => {
    const a = i*Math.PI/48, r = radius+5+1.5*Math.sin(a*13)+.8*Math.cos(a*23);
    return `${i ? 'L' : 'M'}${x+r*Math.cos(a)} ${y+r*Math.sin(a)}`;
  });
  c.el("path", { d: points.join('')+'Z', fill: "none", stroke: c.theme.muted, "stroke-width": 4, opacity: .4 }, g);
  for(let i=0;i<48;i++) {
    const a=i*Math.PI/24, r=radius+5+1.5*Math.sin(a*13)+.8*Math.cos(a*23);
    c.el("path", { d: `M${x+(r-1)*Math.cos(a)} ${y+(r-1)*Math.sin(a)}L${x+(r+2)*Math.cos(a+.009)} ${y+(r+2)*Math.sin(a+.009)}`, stroke: c.theme.background, "stroke-width": .7, opacity: .65 }, g);
  }
}

/** Fine irregular engraving stays strictly within an exact circular annulus. */
export function growthGrain(c: RenderContext, parent: Element, x: number, y: number, inner: number, outer: number): void {
  const thickness = outer-inner;
  if(thickness < 5) return;
  const g=c.el("g", { class: "np-ornament", "aria-hidden": "true", "pointer-events": "none" }, parent);
  for(const fraction of [.25,.55,.8]) {
    const r=inner+thickness*fraction, amplitude=Math.min(.65,thickness*.05);
    const d=Array.from({length: 97},(_,i)=>{
      const a=i*Math.PI/48, rr=r+amplitude*(Math.sin(a*7)+.35*Math.cos(a*11));
      return `${i ? 'L' : 'M'}${x+rr*Math.cos(a)} ${y+rr*Math.sin(a)}`;
    }).join('')+'Z';
    c.el("path", { d, fill: "none", stroke: c.theme.ink, "stroke-width": .6, opacity: .2 },g);
  }
}

export function stoneDial(c: RenderContext, x: number, y: number, radius: number): void {
  const g=c.el("g", { class: "np-ornament", "aria-hidden": "true", "pointer-events": "none" });
  c.el("circle", { cx:x,cy:y,r:radius,fill:pigment(c,c.theme.grid,"stone"),stroke:c.theme.muted,"stroke-width":1,opacity:.6 },g);
  c.el("circle", { cx:x,cy:y,r:radius-4,fill:"none",stroke:c.theme.muted,"stroke-width":.6,opacity:.35 },g);
  // Deterministic low-contrast flecks, deliberately sparse in the reading area.
  for(let i=0;i<95;i++) {
    const a=i*2.39996323, r=Math.sqrt((i+.5)/95)*(radius-7);
    c.el("path", { d:`M${x+Math.cos(a)*r} ${y+Math.sin(a)*r}l${i%3 ? .8 : 1.5} -.5`,stroke:c.theme.muted,"stroke-width":.6,opacity:.16 },g);
  }
}

export function mixColor(a: string, b: string, t: number): string {
  const rgb = (s: string) => {
    const h = s.slice(1);
    const full =
      h.length === 3
        ? h
            .split("")
            .map((c) => c + c)
            .join("")
        : h;
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  };
  const aa = rgb(a),
    bb = rgb(b);
  return (
    "#" +
    aa
      .map((v, i) =>
        Math.round(v + (bb[i] - v) * t)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}
export function contrastInk(background: string): string {
  const h = background.slice(1),
    full =
      h.length === 3
        ? h
            .split("")
            .map((c) => c + c)
            .join("")
        : h;
  const rgb = [0, 2, 4]
    .map((i) => parseInt(full.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722 > 0.179
    ? "#000000"
    : "#ffffff";
}

export type Material = 'water' | 'sand' | 'rock' | 'ice' | 'leaf' | 'glass';

/** Texture is clipped to the original shape; it cannot move a measured boundary. */
export function engrave(c: RenderContext, shape: SVGElement, material: Material): void {
  if(c.options.detail==='essential')return;
  const patternId = `${c.id}-engraving-${material}`;
  let defs = c.svg.querySelector('defs');
  if (!defs) defs = c.el('defs');
  if (!c.svg.querySelector(`[id="${patternId}"]`)) {
    const tile = material === 'leaf' ? 32 : 24;
    const pattern = c.el('pattern', { id: patternId, width: tile, height: tile, patternUnits: 'userSpaceOnUse' }, defs);
    const paths: Record<Material, string> = {
      water: 'M-6 6Q0 2 6 6T18 6T30 6M-6 18Q0 14 6 18T18 18T30 18',
      sand: 'M-4 5Q7 0 16 5T32 5M-4 12Q7 7 16 12T32 12M-4 20Q7 15 16 20T32 20',
      rock: 'M-2 19L9 5L14 11L24 0M9 5L7 23M14 11L25 16',
      ice: 'M0 0L13 8L24 3M13 8L8 24M13 8L24 22M0 16L10 17',
      leaf: 'M0 32L32 0M8 24Q6 16 0 12M16 16Q13 7 9 0M8 24Q19 25 25 32M16 16Q26 17 32 22',
      glass: 'M5 0V24M8 0V24M20 0V24',
    };
    c.el('path', { d: paths[material], fill: 'none', stroke: c.theme.background, 'stroke-width': material === 'glass' ? 1.3 : .65, opacity: material === 'rock' ? .22 : .3 }, pattern);
  }
  const clipId = `${c.id}-engraving-clip-${defs.querySelectorAll('clipPath').length}`;
  const clip = c.el('clipPath', { id: clipId }, defs);
  const boundary = shape.cloneNode(false) as SVGElement;
  // Only the primitive geometry belongs in a clipping definition.
  for (const attr of [...boundary.attributes]) {
    if (!['d', 'points', 'x', 'y', 'width', 'height', 'rx', 'ry', 'r', 'cx', 'cy', 'transform', 'fill-rule'].includes(attr.name)) boundary.removeAttribute(attr.name);
  }
  boundary.setAttribute('fill', '#000');
  clip.append(boundary);
  const g = c.el('g', { class: 'np-ornament', 'aria-hidden': 'true', 'pointer-events': 'none', 'clip-path': `url(#${clipId})` }, shape.parentElement!);
  c.el('rect', { width: 640, height: 360, fill: `url(#${patternId})` }, g);
}

/** Small natural silhouettes anchored on a data coordinate, never a new observation. */
export function bird(c: RenderContext, parent: Element, x: number, y: number, color: string, size = 6): void {
  c.el('path', { d: `M${x-size} ${y-2}Q${x-size*.6} ${y-size} ${x} ${y}Q${x+size*.6} ${y-size} ${x+size} ${y-2}M${x} ${y-1}v3`, fill: 'none', stroke: color, 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
}

export function cloud(c: RenderContext, x: number, y: number, scale = 1): void {
  const g = c.el('g', { transform: `translate(${x} ${y}) scale(${scale})`, class: 'np-ornament', 'aria-hidden': 'true', 'pointer-events': 'none' });
  c.el('path', { d: 'M-26 6Q-32-5-20-7Q-19-23-5-17Q5-31 17-15Q34-15 32-1Q45 10 27 12H-22Q-31 12-26 6Z', fill:c.theme.grid, opacity:.65 },g);
  c.el('path', { d:'M-19-7Q-9-10-6-4M16-14Q23-8 20-2M-22 5Q0 10 25 5', fill:'none',stroke:c.theme.background,'stroke-width':1.2,opacity:.75 },g);
}
