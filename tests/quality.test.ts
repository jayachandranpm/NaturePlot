import { afterEach, describe, expect, it } from "vitest";
import {
  NaturePlot,
  chartGuidance,
  chartTypes,
  type ChartOptions,
  type ChartType,
} from "../src";
import { options, types } from "../demo/samples";
const charts: NaturePlot[] = [];
afterEach(() => {
  charts.forEach((c) => c.destroy());
  charts.length = 0;
  document.body.replaceChildren();
});
function make(input: ChartOptions) {
  const host = document.createElement("div");
  document.body.append(host);
  const chart = new NaturePlot(host, { ...input, animate: false });
  charts.push(chart);
  return { host, chart };
}
function assertDrawing(host: HTMLElement, chart: NaturePlot) {
  const svg = host.querySelector("svg")!;
  const geometry = [...svg.querySelectorAll("*")].flatMap((el) =>
    [...el.attributes]
      .filter((a) =>
        [
          "d",
          "points",
          "x",
          "y",
          "cx",
          "cy",
          "r",
          "rx",
          "ry",
          "x1",
          "x2",
          "y1",
          "y2",
          "width",
          "height",
          "stroke-width",
          "opacity",
          "fill-opacity",
          "transform",
        ].includes(a.name),
      )
      .map((a) => a.value),
  );
  expect(geometry.join(" ")).not.toMatch(/NaN|Infinity|undefined/);
  expect(host.querySelectorAll(".np-mark")).toHaveLength(chart.data.length);
  expect(host.querySelectorAll("tbody tr")).toHaveLength(chart.data.length);
  // Paint servers and clips must remain self-contained in a downloaded SVG.
  const parsed = new DOMParser().parseFromString(
    chart.toSVG(),
    "image/svg+xml",
  );
  expect(parsed.querySelector("parsererror")).toBeNull();
  for (const match of chart.toSVG().matchAll(/url\(#([^)]+)\)/g))
    expect(parsed.getElementById(match[1]), match[1]).not.toBeNull();
}
const knownOnly = new Set([
  "canopy",
  "fern",
  "phyllotaxis",
  "petal-box",
  "raincloud",
  "glacier",
  "sediment",
  "delta",
  "estuary",
  "pitcher",
  "migration",
  "pebble",
  "cairn",
  "isobar",
  "bamboo",
]);
function zeros(type: ChartType) {
  const input = options(type);
  input.data = input.data.map((p) => ({
    ...p,
    value: type === "frost" && p.track === p.label ? 1 : 0,
    ...(["petal-box", "coral-range"].includes(type)
      ? { low: 0, q1: 0, q3: 0, high: 0 }
      : {}),
  }));
  if (type === "bamboo") input.data = input.data.slice(0, 18);
  return input;
}
describe("reviewed contracts for every natural form", () => {
  it.each(types)(
    "%s handles legal zero, empty, missing, and themed states without losing observations",
    (type) => {
      const { host, chart } = make(zeros(type));
      assertDrawing(host, chart);
      const missing = {
        ...options(type),
        data: options(type).data.map((p) => ({
          ...p,
          value: type === "frost" && p.track === p.label ? 1 : null,
        })),
      };
      if (knownOnly.has(type)) {
        const before = chart.toSVG();
        expect(() => chart.update(missing)).toThrow();
        expect(chart.toSVG()).toBe(before);
      } else {
        chart.update(missing);
        assertDrawing(host, chart);
      }
      for (const theme of ["meadow", "ocean", "autumn", "twilight"] as const) {
        chart.update({ ...options(type), theme });
        assertDrawing(host, chart);
      }
      chart.update({ data: [] });
      assertDrawing(host, chart);
    },
  );
  it.each(types.filter((t) => !["frost", "bamboo"].includes(t)))(
    "%s retains finite geometry for very small quantities",
    (type) => {
      const input = options(type),
        factor = 1e-60;
      input.data = input.data.map((p) => {
        const q = { ...p };
        for (const field of [
          "value",
          "baseline",
          "low",
          "q1",
          "q3",
          "high",
          "target",
          "weight",
        ] as const)
          if (typeof q[field] === "number") q[field] = q[field]! * factor;
        return q;
      });
      for (const k of ["max", "target", "unitsPerMark"] as const)
        if (input[k]) input[k]! *= factor;
      input.thresholds = input.thresholds?.map((t) => ({
        ...t,
        value: t.value * factor,
      }));
      const { host, chart } = make(input);
      assertDrawing(host, chart);
    },
  );
  it("provides a distinct purpose, limitation and valid alternative for all fifty charts", () => {
    expect(Object.keys(chartGuidance)).toHaveLength(50);
    expect(
      new Set(Object.values(chartGuidance).map((g) => g.bestFor)).size,
    ).toBe(50);
    for (const [type, g] of Object.entries(chartGuidance)) {
      expect(g.bestFor.length).toBeGreaterThan(25);
      expect(g.caution.length).toBeGreaterThan(50);
      expect(chartTypes[g.alternative]).toBeDefined();
      expect(g.alternative).not.toBe(type);
    }
  });
});
describe("measurement regression findings", () => {
  it("keeps zero histograms empty and at the bottom of a nonnegative axis", () => {
    const { host } = make({
      type: "raincloud",
      data: [
        { low: 0, high: 1, value: 0 },
        { low: 1, high: 3, value: 0 },
      ],
    });
    for (const bin of host.querySelectorAll(".np-bin")) {
      expect(Number(bin.getAttribute("height"))).toBe(0);
      expect(Number(bin.getAttribute("y"))).toBe(280);
    }
  });
  it("uses no quantitative area for zero bubbles and preserves area ratios at tiny scales", () => {
    const { host, chart } = make({
      type: "dew",
      data: [
        { x: 1, value: 2, weight: 0 },
        { x: 2, value: 3, weight: 1e-60 },
        { x: 3, value: 4, weight: 4e-60 },
        { x: 4, value: null, weight: 1e-60 },
      ],
    });
    const marks = host.querySelectorAll(".np-mark");
    expect(marks[0].querySelector(".np-measured-dot")).toBeNull();
    expect(marks[0].querySelector(".np-zero-marker")).not.toBeNull();
    expect(marks[3].querySelector(".np-missing-marker")).not.toBeNull();
    const r = (i: number) =>
      Number(marks[i].querySelector(".np-measured-dot")!.getAttribute("r"));
    expect(r(2) ** 2 / r(1) ** 2).toBeCloseTo(4);
    expect(host.querySelector("tbody")!.textContent).toContain("1e-60");
    assertDrawing(host, chart);
  });
  it("does not distort planar angles or distances", () => {
    const { host } = make({
      type: "migration",
      data: [
        { x: 0, y: 0, value: 1 },
        { x: 1, y: 1, value: 1 },
        { x: 10, y: 2, value: 1 },
      ],
    });
    const [a, b] = [...host.querySelectorAll(".np-measured-dot")];
    expect(
      Math.abs(Number(b.getAttribute("cx")) - Number(a.getAttribute("cx"))),
    ).toBeCloseTo(
      Math.abs(Number(b.getAttribute("cy")) - Number(a.getAttribute("cy"))),
    );
  });
  it("keeps Cairn geometry and readings on one shared target and does not inflate zero stones", () => {
    const { host } = make({
      type: "cairn",
      target: 0.5,
      data: [
        { label: "A", value: 0, target: 100 },
        { label: "B", value: 0.25, target: 200 },
      ],
    });
    const stones = host.querySelectorAll(".np-cairn-stone");
    expect(Number(stones[0].getAttribute("height"))).toBe(0);
    expect(Number(stones[1].getAttribute("height"))).toBe(115);
    expect(
      [...host.querySelectorAll("tbody tr")].map(
        (r) => r.lastElementChild!.textContent,
      ),
    ).toEqual(["0.5", "0.5"]);
  });
  it("does not apply a one-pixel floor to positive network weights", () => {
    const { host } = make({
      type: "mycelium",
      data: [
        { source: "A", destination: "B", value: 1 },
        { source: "B", destination: "C", value: 100 },
      ],
    });
    const lines = host.querySelectorAll(".np-thread");
    expect(
      Number(lines[0].getAttribute("stroke-width")) /
        Number(lines[1].getAttribute("stroke-width")),
    ).toBeCloseTo(0.01);
    expect(host.querySelectorAll(".np-hit-area")).toHaveLength(2);
  });
  it("uses data-relative scales for fractional forest values", () => {
    const { host } = make({
      type: "forest",
      data: [{ value: 0.2 }, { value: 0.4 }],
    });
    expect(
      [...host.querySelectorAll("svg text")].map((t) => t.textContent),
    ).toContain("0.4");
  });
  it("rejects unreadable ring counts and numerically unsupported magnitudes atomically", () => {
    const { chart } = make(options("rings")),
      svg = chart.toSVG();
    expect(() =>
      chart.update({ data: Array.from({ length: 9 }, () => ({ value: 1 })) }),
    ).toThrow(/at most 8/);
    expect(() => chart.update({ data: [{ value: 1e308 }] })).toThrow(/Rescale/);
    expect(chart.toSVG()).toBe(svg);
  });
  it("retains custom axis labels in exported drawings and rejects non-string labels", () => {
    const { host, chart } = make({
      ...options("dew"),
      xLabel: "Effort (h)",
      yLabel: "Outcome (points)",
      weightLabel: "Reach",
    });
    expect(host.querySelector("svg")!.textContent).toContain("Effort (h)");
    expect(chart.toSVG()).toContain("Reach");
    expect(() => chart.update({ xLabel: 4 as unknown as string })).toThrow(
      /xLabel must be a string/,
    );
  });
});

describe("reviewed interaction and SVG delivery", () => {
  it("emphasizes the selected series in Sediment and restores it on clear", () => {
    const { host } = make(options("sediment"));
    host
      .querySelector<HTMLButtonElement>('[aria-label="Next observation"]')!
      .click();
    const layers = host.querySelectorAll("[data-series]");
    expect(layers.length).toBeGreaterThan(1);
    expect(host.querySelectorAll(".np-series-muted")).toHaveLength(
      layers.length - 1,
    );
    host
      .querySelector<HTMLButtonElement>('[aria-label="Clear selection"]')!
      .click();
    expect(host.querySelector(".np-series-muted")).toBeNull();
  });
  it("exports a standalone image without dangling tooltip or button semantics", () => {
    const { chart, host } = make(options("dew"));
    host
      .querySelector<HTMLButtonElement>('[aria-label="Next observation"]')!
      .click();
    const svg = new DOMParser().parseFromString(chart.toSVG(), "image/svg+xml");
    expect(svg.documentElement.getAttribute("role")).toBe("img");
    expect(
      svg.querySelector('[role="button"],[aria-pressed],[tabindex]'),
    ).toBeNull();
    for (const el of svg.querySelectorAll(
      "[aria-describedby],[aria-labelledby]",
    )) {
      const ids = [
        el.getAttribute("aria-describedby"),
        el.getAttribute("aria-labelledby"),
      ]
        .filter(Boolean)
        .join(" ")
        .split(" ");
      ids.forEach((id) => expect(svg.getElementById(id)).not.toBeNull());
    }
  });
});

it('does not inflate zero waterfall contributions or zero-flow nodes', () => {
  const {host} = make({type:'glacier',data:[{value:0},{value:10},{value:0}]});
  const steps = host.querySelectorAll('.np-waterfall-step');
  expect(Number(steps[0].getAttribute('height'))).toBe(0);
  expect(Number(steps[2].getAttribute('height'))).toBe(0);
  const {host:flow} = make({type:'delta',data:[{source:'A',destination:'B',value:0}]});
  expect(flow.querySelector('.np-flow-ribbon')).toBeNull();
  expect([...flow.querySelectorAll('svg rect')].filter(r=>Number(r.getAttribute('width'))===8).every(r=>Number(r.getAttribute('height'))===0)).toBe(true);
});
