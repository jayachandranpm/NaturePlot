import { describe, expect, it } from "vitest";
import { NaturePlot, chartTypes, type ChartOptions } from "../src";
import { ecologyTypes } from "../src/ecology-catalog";
import { options, types, resetChartOptions } from "../demo/samples";
import { normalizeData } from "../src/utils";
const make = (input: ChartOptions) => {
  const host = document.createElement("div");
  document.body.append(host);
  const chart = new NaturePlot(host, input);
  return { host, chart };
};
const button = (host: HTMLElement, label: string) =>
  host.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)!;
const n = (el: Element, key: string) => Number(el.getAttribute(key));

describe("fifty-chart interactive contract", () => {
  it("has exactly fifty unique named built-ins and thirty distinct new SVG compositions", () => {
    expect(Object.keys(chartTypes)).toHaveLength(50);
    expect(new Set(Object.values(chartTypes).map((m) => m.name)).size).toBe(50);
    const fingerprints = ecologyTypes.map((type) => {
      const { chart, host } = make(options(type));
      const svg = chart.toSVG().replace(/natureplot-\d+/g, "instance");
      chart.destroy();
      host.remove();
      return svg;
    });
    expect(new Set(fingerprints).size).toBe(30);
  });
  it.each(types)(
    "%s supports persistent selection, stepping, clearing, and table toggling",
    (type) => {
      const { chart, host } = make(options(type));
      const marks = host.querySelectorAll<SVGElement>(".np-mark");
      expect(marks.length).toBe(chart.data.length);
      const events: number[] = [];
      host.addEventListener("natureplot:select", (event) =>
        events.push((event as CustomEvent).detail.index),
      );
      button(host, "Next observation").click();
      expect(events).toEqual([0]);
      expect(marks[0].getAttribute("aria-pressed")).toBe("true");
      expect(host.querySelector(".np-reading")!.textContent).toContain(
        `1 of ${chart.data.length}`,
      );
      button(host, "Previous observation").click();
      expect(events.at(-1)).toBe(chart.data.length - 1);
      button(host, "Clear selection").click();
      expect(host.querySelector(".np-has-selection")).toBeNull();
      expect(button(host, "Clear selection").disabled).toBe(true);
      button(host, "Toggle chart data table").click();
      expect(
        host.querySelector(".np-table")!.classList.contains("np-sr-only"),
      ).toBe(false);
      expect(
        button(host, "Toggle chart data table").getAttribute("aria-expanded"),
      ).toBe("true");
      button(host, "Toggle chart data table").click();
      expect(
        host.querySelector(".np-table")!.classList.contains("np-sr-only"),
      ).toBe(true);
      marks[0].dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
      expect(marks[0].getAttribute("aria-pressed")).toBe("true");
      marks[0].dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
      expect(marks[0].getAttribute("aria-pressed")).toBe("false");
      chart.destroy();
      host.remove();
    },
  );
  it("can opt out of controls for decorative instances and disable empty controls", () => {
    const { host, chart } = make({ ...options("forest"), interactive: false });
    expect(host.querySelector(".np-inspector")).toBeNull();
    chart.update({ interactive: true, data: [] });
    expect(button(host, "Next observation").disabled).toBe(true);
    chart.destroy();
    host.remove();
  });
  it("switches across all fifty complete presets without stale schema options", () => {
    const { chart, host } = make(options("forest"));
    types.forEach((type) => {
      chart.update({ ...resetChartOptions, ...options(type) });
      expect(chart.toSVG()).not.toMatch(/NaN|Infinity|undefined/);
      expect(host.querySelectorAll(".np-mark").length).toBe(chart.data.length);
    });
    chart.destroy();
    host.remove();
  });
});

describe("measurement semantics", () => {
  it("canopy rectangles preserve areas including group allocations", () => {
    const { host, chart } = make({
      type: "canopy",
      data: [
        { track: "A", value: 10 },
        { track: "A", value: 30 },
        { track: "B", value: 60 },
      ],
    });
    const boxes = [...host.querySelectorAll(".np-canopy-cell")];
    const areas = boxes.map((p) => n(p, "width") * n(p, "height"));
    expect(areas[1] / areas[0]).toBeCloseTo(3);
    expect(areas[2] / areas[0]).toBeCloseTo(6);
    chart.destroy();
    host.remove();
  });
  it("phyllotaxis apportions exactly 120 dots and leaves zero parts unallocated", () => {
    const { host, chart } = make({
      type: "phyllotaxis",
      data: [{ value: 1 }, { value: 2 }, { value: 0 }],
    });
    const groups = [...host.querySelectorAll(".np-mark")];
    expect(groups.map((g) => g.querySelectorAll("circle").length - 1)).toEqual([
      40, 80, 0,
    ]);
    chart.destroy();
    host.remove();
  });
  it("histogram areas, not heights, encode unequal-width bin counts", () => {
    const { host, chart } = make({
      type: "raincloud",
      data: [
        { low: 0, high: 10, value: 10 },
        { low: 10, high: 30, value: 10 },
      ],
    });
    const bars = [...host.querySelectorAll(".np-bin")];
    expect(n(bars[0], "height") / n(bars[1], "height")).toBeCloseTo(2);
    expect(n(bars[0], "width") * n(bars[0], "height")).toBeCloseTo(
      n(bars[1], "width") * n(bars[1], "height"),
    );
    chart.destroy();
    host.remove();
  });
  it("waterfall contributions accumulate with a negative middle step", () => {
    const { host, chart } = make({
      type: "glacier",
      data: [{ value: 20 }, { value: -5 }, { value: 10 }],
    });
    expect(host.textContent).toContain("ending balance 25");
    const bars = [...host.querySelectorAll(".np-waterfall-step")];
    expect(n(bars[0], "height") / n(bars[1], "height")).toBeCloseTo(4);
    expect(n(bars[1], "y") + n(bars[1], "height")).toBeCloseTo(
      n(bars[2], "y") + n(bars[2], "height"),
    );
    chart.destroy();
    host.remove();
  });
  it("ECDF ties have equal cumulative heights and retains their indexes", () => {
    const { host, chart } = make({
      type: "pebble",
      data: [{ value: 3 }, { value: 1 }, { value: 3 }, { value: 8 }],
    });
    const marks = [...host.querySelectorAll(".np-mark")];
    const a = marks
      .find((m) => m.getAttribute("data-index") === "0")!
      .querySelector("circle")!;
    const b = marks
      .find((m) => m.getAttribute("data-index") === "2")!
      .querySelector("circle")!;
    expect(n(a, "cy")).toBe(n(b, "cy"));
    expect(n(a, "cy")).toBeCloseTo(278 - (278 - 53) * 0.75);
    chart.destroy();
    host.remove();
  });
  it("contours interpolate a linear field at the expected coordinates", () => {
    const { host, chart } = make({
      type: "isobar",
      data: [
        { x: 0, y: 0, value: 0 },
        { x: 1, y: 0, value: 10 },
        { x: 0, y: 1, value: 0 },
        { x: 1, y: 1, value: 10 },
      ],
    });
    const contours = [...host.querySelectorAll(".np-contour")];
    expect(contours.length).toBe(6);
    contours.forEach((el) => {
      const expected = 331.5 + (n(el, "data-level") / 10 - 0.5) * 220;
      expect(n(el, "x1")).toBeCloseTo(expected);
      expect(n(el, "x2")).toBeCloseTo(expected);
    });
    chart.destroy();
    host.remove();
  });
  it("daylight keeps exact clock endpoints in its accessible table", () => {
    const { host, chart } = make({
      type: "daylight",
      data: [{ date: "2026-09-21", start: "06:00", end: "18:30" }],
    });
    expect(host.querySelector(".np-table")!.textContent).toContain("750 min");
    expect(chart.data[0].value).toBeNull();
    chart.destroy();
    host.remove();
  });
  it("lag pairs break at missing readings rather than connecting across them", () => {
    const { host, chart } = make({
      type: "echo",
      data: [{ value: 2 }, { value: null }, { value: 8 }, { value: 10 }],
    });
    const circles = [...host.querySelectorAll(".np-mark circle:not(.np-focus-halo)")];
    expect(circles.map((c) => n(c, "r"))).toEqual([3, 3, 3, 6]);
    expect(host.querySelector(".np-table")!.textContent).toContain(
      "Previous value",
    );
    chart.destroy();
    host.remove();
  });
  it("includes every new data field in exact readings and copies ownership", () => {
    const data = [{ label: "Project", x: 3, weight: 7, value: 12 }];
    const { host, chart } = make({ type: "dew", data });
    data[0].x = 99;
    expect(chart.data[0].x).toBe(3);
    expect(host.querySelector(".np-table")!.textContent).toContain("Weight");
    const before = chart.toSVG();
    expect(() => chart.update({ data: [{ value: 4 }] })).toThrow(/x/);
    expect(chart.toSVG()).toBe(before);
    chart.destroy();
    host.remove();
  });
});

const invalid: ChartOptions[] = [
  { type: "honeycomb", data: [{ value: 3 }] },
  {
    type: "honeycomb",
    data: [
      { track: "A", label: "B", value: 1 },
      { track: "A", label: "B", value: 2 },
    ],
  },
  { type: "mycelium", data: [{ source: "A", destination: "A", value: 2 }] },
  {
    type: "mycelium",
    data: [
      { source: "A", destination: "B", value: 1 },
      { source: "A", destination: "B", value: 2 },
    ],
  },
  {
    type: "root-tree",
    data: [
      { id: "a", parent: "b", value: 1 },
      { id: "b", parent: "a", value: 1 },
    ],
  },
  { type: "root-tree", data: [{ id: "a", parent: "missing", value: 1 }] },
  { type: "canopy", data: [{ value: null }] },
  { type: "fern", data: [{ value: -1 }] },
  { type: "phyllotaxis", data: [{ value: null }] },
  { type: "leaf-veins", data: [{ value: 2 }] },
  { type: "lotus", data: [{ value: 4 }] },
  { type: "petal-box", data: [{ low: 0, q1: 6, value: 3, q3: 8, high: 10 }] },
  {
    type: "raincloud",
    data: [
      { low: 0, high: 10, value: 2 },
      { low: 8, high: 12, value: 3 },
    ],
  },
  { type: "raincloud", data: [{ low: 5, high: 5, value: 2 }] },
  { type: "dew", data: [{ x: 1, weight: -1, value: 2 }] },
  { type: "wind-rose", data: [{ angle: 0, value: 4 }] },
  {
    type: "dune",
    data: [
      { position: 2, value: 1 },
      { position: 1, value: 4 },
    ],
  },
  { type: "glacier", data: [{ value: null }] },
  {
    type: "sediment",
    data: [
      { track: "A", position: 0, value: 2 },
      { track: "A", position: 1, value: 2 },
      { track: "B", position: 0, value: 2 },
      { track: "B", position: 2, value: 2 },
    ],
  },
  {
    type: "delta",
    data: [
      { source: "A", destination: "B", value: 2 },
      { source: "C", destination: "D", value: 3 },
    ],
  },
  { type: "estuary", data: [{ source: "A", destination: "B", value: null }] },
  { type: "pitcher", data: [{ value: 10 }, { value: 12 }] },
  { type: "firefly", data: [{ value: 2 }] },
  {
    type: "migration",
    data: [
      { x: 2, value: 3 },
      { x: 4, value: 5 },
    ],
  },
  { type: "coral-range", data: [{ low: 1, value: 10, high: 8 }] },
  { type: "pebble", data: [{ value: null }] },
  { type: "nautilus", cycleLength: 12, data: [{ position: 48, value: 2 }] },
  {
    type: "frost",
    data: [
      { track: "A", label: "A", value: 1 },
      { track: "A", label: "B", value: 0.4 },
      { track: "B", label: "A", value: 0.2 },
      { track: "B", label: "B", value: 1 },
    ],
  },
  { type: "echo", data: [{ value: 1 }] },
  { type: "cairn", data: [{ value: -1 }] },
  {
    type: "daylight",
    data: [{ date: "2026-09-21", start: "18:00", end: "06:00" }],
  },
  { type: "isobar", data: [{ x: 0, y: 0, value: 3 }] },
  { type: "bamboo", data: [{ value: 3.5 }] },
  { type: "dew", data: [{ x: NaN, value: 1 }] },
  { type: "dew", data: [{ x: 1, value: 1e101 }] },
];
describe("meaningful input boundaries", () => {
  it.each(invalid.map((input, i) => ({ input, id: `${input.type} ${i}` })))(
    "rejects invalid $id",
    ({ input }) => expect(() => normalizeData(input)).toThrow(/NaturePlot/),
  );
  it.each(ecologyTypes)(
    "%s rejects oversized datasets before rendering",
    (type) => {
      const preset = options(type);
      expect(() =>
        normalizeData({
          ...preset,
          data: Array.from({ length: 100 }, () => ({ ...preset.data[0] })),
        }),
      ).toThrow();
    },
  );
});

describe("release edge cases", () => {
  it("does not invent contour levels for a constant field", () => {
    const { chart, host } = make({
      type: "isobar",
      data: [
        { x: 0, y: 0, value: 5 },
        { x: 1, y: 0, value: 5 },
        { x: 0, y: 1, value: 5 },
        { x: 1, y: 1, value: 5 },
      ],
    });
    expect(host.querySelectorAll(".np-contour")).toHaveLength(0);
    expect(host.textContent).toContain("Constant field: 5");
    chart.destroy();
    host.remove();
  });
  it("handles a tiny valid spiral cycle without an unbounded turn loop", () => {
    const { chart, host } = make({
      type: "nautilus",
      cycleLength: 1e-100,
      data: [{ position: 0, value: 1 }],
    });
    expect(chart.toSVG()).not.toMatch(/NaN|Infinity/);
    expect(host.textContent).toContain("Turn 1");
    chart.destroy();
    host.remove();
  });
  it("preserves tiny nonzero readings in the exact table", () => {
    const { chart, host } = make({
      type: "dew",
      data: [{ x: 1, value: 1e-8 }],
    });
    expect(host.querySelector(".np-table")!.textContent).toContain("1e-8");
    chart.destroy();
    host.remove();
  });
  it("detaches inspector actions on update and destroy", () => {
    let calls = 0;
    const { chart, host } = make({
      ...options("forest"),
      onSelect: () => calls++,
    });
    const old = button(host, "Next observation");
    chart.update({ data: [{ value: 3 }] });
    old.click();
    expect(calls).toBe(0);
    const current = button(host, "Next observation");
    current.click();
    expect(calls).toBe(1);
    chart.destroy();
    current.click();
    expect(calls).toBe(1);
    host.remove();
  });
  it("keeps coordinate units distinct from the measured field unit", () => {
    const { chart, host } = make(options("isobar"));
    const labels = [...host.querySelectorAll("svg text")].map(
      (t) => t.textContent,
    );
    expect(labels).toContain("0");
    expect(labels).not.toContain("0 °C");
    expect(
      labels.some((t) => t!.includes("°C")),
    ).toBe(true);
    chart.destroy();
    host.remove();
  });
  it("bounds crowded hierarchy and stem layouts", () => {
    expect(() =>
      normalizeData({
        type: "root-tree",
        data: Array.from({ length: 6 }, (_, i) => ({
          id: String(i),
          value: 1,
        })),
      }),
    ).toThrow(/5 nodes/);
    expect(() =>
      normalizeData({
        type: "bamboo",
        data: Array.from({ length: 19 }, () => ({ value: 11 })),
      }),
    ).toThrow(/18 leaves/);
  });
});
