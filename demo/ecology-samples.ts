import type { ChartOptions, ChartDatum } from "../src/types";
import {
  ecologyMetadata,
  ecologyTypes,
  type EcologyType,
} from "../src/ecology-catalog";
const named = (labels: string[], values: number[]): ChartDatum[] =>
  labels.map((label, i) => ({ label, value: values[i] }));
const examples: Record<EcologyType, Omit<ChartOptions, "type">> = {
  honeycomb: {
    title: "A week across the studio",
    data: ["Design", "Build", "Research", "Support"].flatMap((track, r) =>
      ["Mon", "Tue", "Wed", "Thu", "Fri"].map((label, j) => ({
        track,
        label,
        value: [2, 5, 8, 4, 7][(j + r) % 5],
      })),
    ),
  },
  mycelium: {
    title: "Knowledge moving between teams",
    data: [
      ["Research", "Design", 8],
      ["Design", "Build", 12],
      ["Build", "Support", 6],
      ["Support", "Research", 4],
      ["Research", "Build", 3],
      ["Design", "Support", 5],
    ].map(([source, destination, value]) => ({
      source: String(source),
      destination: String(destination),
      label: `${source} → ${destination}`,
      value: Number(value),
    })),
  },
  "root-tree": {
    title: "Where each responsibility belongs",
    data: [
      { id: "studio", label: "Studio", value: 18 },
      { id: "product", parent: "studio", label: "Product", value: 12 },
      { id: "operations", parent: "studio", label: "Operations", value: 8 },
      { id: "design", parent: "product", label: "Design", value: 7 },
      { id: "engineering", parent: "product", label: "Engineering", value: 10 },
      { id: "care", parent: "operations", label: "Customer care", value: 6 },
    ],
  },
  canopy: {
    title: "How the work is shared",
    unit: "h",
    data: [
      { label: "Interviews", track: "Discover", value: 18 },
      { label: "Synthesis", track: "Discover", value: 12 },
      { label: "Prototypes", track: "Create", value: 25 },
      { label: "Build", track: "Create", value: 35 },
      { label: "Testing", track: "Learn", value: 16 },
      { label: "Reflection", track: "Learn", value: 9 },
    ],
  },
  fern: {
    title: "The issues worth solving first",
    data: named(
      ["Slow loading", "Navigation", "Missing info", "Mobile layout", "Other"],
      [42, 26, 17, 9, 6],
    ),
  },
  phyllotaxis: {
    title: "One hundred hours, well spent",
    unit: "h",
    data: named(
      ["Making", "Learning", "Sharing", "Resting", "Planning"],
      [36, 22, 14, 18, 10],
    ),
  },
  "leaf-veins": {
    title: "Team response time, before and after",
    unit: "min",
    data: [
      { label: "Support", baseline: 18, value: 12 },
      { label: "Sales", baseline: 8, value: 13 },
      { label: "Engineering", baseline: 15, value: 19 },
      { label: "Operations", baseline: 14, value: 17 },
    ],
  },
  lotus: {
    title: "Different goals, one clear profile",
    data: [
      { label: "Writing", value: 18, target: 24 },
      { label: "Walking", value: 32, target: 40 },
      { label: "Learning", value: 6, target: 8 },
      { label: "Making", value: 3, target: 5 },
      { label: "Rest", value: 8, target: 10 },
      { label: "Sharing", value: 4, target: 6 },
    ],
  },
  "petal-box": {
    title: "How long did a task take?",
    unit: "min",
    data: [
      { label: "Team A", low: 10, q1: 18, value: 24, q3: 32, high: 46 },
      { label: "Team B", low: 12, q1: 22, value: 29, q3: 39, high: 55 },
      { label: "Team C", low: 8, q1: 14, value: 20, q3: 26, high: 40 },
    ],
  },
  raincloud: {
    title: "A distribution of focus sessions",
    data: [
      { label: "0–10 min", low: 0, high: 10, value: 4 },
      { label: "10–20 min", low: 10, high: 20, value: 12 },
      { label: "20–30 min", low: 20, high: 30, value: 23 },
      { label: "30–45 min", low: 30, high: 45, value: 19 },
      { label: "45–60 min", low: 45, high: 60, value: 8 },
    ],
  },
  dew: {
    title: "Effort, outcome, and reach",
    xLabel: "Effort (hours)", yLabel: "Outcome (points)", weightLabel: "Reach",
    data: Array.from({ length: 14 }, (_, i) => ({
      label: `Project ${i + 1}`,
      x: Math.round((2 + i * 0.7) * 10) / 10,
      value: Math.round((4 + i * 1.1 + Math.sin(i) * 3) * 100) / 100,
      weight: 4 + ((i * 7) % 20),
    })),
  },
  "wind-rose": {
    title: "Where visitors arrive from",
    data: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"].map((label, i) => ({
      label,
      angle: i * 45,
      value: [12, 22, 35, 18, 9, 7, 16, 25][i],
    })),
  },
  dune: {
    title: "Different teams, different rhythms",
    data: ["Morning", "Afternoon", "Evening"].flatMap((track, j) =>
      [0, 5, 10, 15, 20, 25, 30, 35, 40].map((position, i) => ({
        track,
        position,
        label: `${track} / ${position}`,
        value: Math.round(25 * Math.exp(-(((i - (3 + j)) / 2) ** 2))),
      })),
    ),
  },
  glacier: {
    title: "From opening balance to closing balance",
    unit: "credits",
    data: named(
      ["Start", "Earned", "Tools", "Travel", "Bonus", "Saved"],
      [120, 65, -30, -20, 40, 15],
    ),
  },
  sediment: {
    title: "How demand changes its shape",
    data: ["Reading", "Watching", "Making"].flatMap((track, j) =>
      [1, 2, 3, 4, 5, 6].map((position, i) => ({
        track,
        position,
        label: `${track} / week ${position}`,
        value: [
          [14, 18, 23, 19, 16, 21],
          [9, 12, 13, 17, 22, 18],
          [6, 8, 12, 16, 18, 24],
        ][j][i],
      })),
    ),
  },
  delta: {
    title: "Where our shared budget goes",
    unit: "credits",
    data: ["Research", "Build", "Support", "Reserve"].map((destination, i) => ({
      source: "Shared fund",
      destination,
      label: destination,
      value: [24, 42, 19, 15][i],
    })),
  },
  estuary: {
    title: "Skills flowing into projects",
    unit: "h",
    data: [
      ["Design", "Website", 18],
      ["Design", "Mobile", 12],
      ["Engineering", "Website", 28],
      ["Engineering", "Mobile", 24],
      ["Engineering", "Tools", 14],
      ["Operations", "Tools", 9],
      ["Operations", "Website", 5],
    ].map(([source, destination, value]) => ({
      source: String(source),
      destination: String(destination),
      label: `${source} → ${destination}`,
      value: Number(value),
    })),
  },
  pitcher: {
    title: "From first visit to first success",
    data: named(
      ["Visited", "Signed up", "Activated", "Returned", "Subscribed"],
      [1200, 760, 520, 360, 210],
    ),
  },
  firefly: {
    title: "Small signals through the day",
    data: ["Deploys", "Feedback", "Signups"].flatMap((track, j) =>
      [1, 2.5, 5, 8, 9.5, 13, 17, 19, 22].map((position, i) => ({
        track,
        position: position + j * 0.4,
        label: `${track} event ${i + 1}`,
        value: 2 + ((i * 3 + j) % 9),
      })),
    ),
  },
  migration: {
    title: "A walk through the neighborhood",
    data: [
      [0, 0],
      [2, 1],
      [3, 4],
      [6, 5],
      [8, 3],
      [7, 0],
      [4, -1],
    ].map(([x, y], i) => ({
      label: `Stop ${i + 1}`,
      x,
      y,
      value: [4, 7, 12, 6, 10, 5, 3][i],
    })),
  },
  murmuration: {
    title: "Every response time, by team",
    unit: "min",
    data: ["Team A", "Team B", "Team C"].flatMap((track, j) =>
      Array.from({ length: 14 }, (_, i) => ({
        track,
        label: `${track} / ${i + 1}`,
        value: 8 + j * 7 + ((i * 7) % 19),
      })),
    ),
  },
  "coral-range": {
    title: "Estimates with room for uncertainty",
    unit: "days",
    data: [
      { label: "Discovery", low: 3, value: 5, high: 8 },
      { label: "Prototype", low: 5, value: 8, high: 12 },
      { label: "Implementation", low: 10, value: 16, high: 24 },
      { label: "Validation", low: 4, value: 7, high: 11 },
    ],
  },
  pebble: {
    title: "Where a typical wait falls",
    unit: "min",
    data: [2, 3, 3, 4, 5, 5, 5, 7, 8, 8, 10, 12, 14, 19, 24].map(
      (value, i) => ({ label: `Wait ${i + 1}`, value }),
    ),
  },
  nautilus: {
    title: "Three cycles of creative practice",
    cycleLength: 12,
    data: Array.from({ length: 24 }, (_, i) => ({
      label: `Session ${i + 1}`,
      position: i * 1.5,
      value: 3 + ((i * 7) % 10),
    })),
  },
  frost: {
    title: "Which measures move together?",
    data: ["Reach", "Quality", "Speed", "Trust"].flatMap((track, i) =>
      ["Reach", "Quality", "Speed", "Trust"].map((label, j) => ({
        track,
        label,
        value: [
          [1, 0.6, -0.3, 0.7],
          [0.6, 1, -0.5, 0.8],
          [-0.3, -0.5, 1, -0.2],
          [0.7, 0.8, -0.2, 1],
        ][i][j],
      })),
    ),
  },
  echo: {
    title: "Does a busy day follow a busy day?",
    data: named(
      Array.from({ length: 16 }, (_, i) => `Day ${i + 1}`),
      [12, 15, 19, 18, 23, 29, 25, 20, 18, 16, 21, 27, 30, 26, 22, 18],
    ),
  },
  cairn: {
    title: "Many small gifts, one shared goal",
    target: 100,
    unit: "credits",
    data: named(["Maya", "Noor", "Leo", "Ari", "Sam"], [24, 18, 12, 16, 10]),
  },
  daylight: {
    title: "The daylight we observed",
    data: [
      ["2026-03-01", "06:30", "17:55"],
      ["2026-03-15", "06:10", "18:08"],
      ["2026-04-01", "05:50", "18:22"],
      ["2026-04-15", "05:28", "18:36"],
      ["2026-05-01", "05:09", "18:51"],
    ].map(([date, start, end]) => ({ date, start, end, label: date })),
  },
  isobar: {
    title: "Temperature across a small garden",
    unit: "°C",
    data: [0, 1, 2, 3, 4].flatMap((y) =>
      [0, 1, 2, 3, 4, 5].map((x) => ({
        x,
        y,
        label: `Plot ${x}, ${y}`,
        value:
          Math.round(
            (18 + 7 * Math.exp(-((x - 3) ** 2 + (y - 2) ** 2) / 4) + x * 0.35) *
              100,
          ) / 100,
      })),
    ),
  },
  bamboo: {
    title: "Quiz scores, every number preserved",
    data: [
      23, 27, 31, 35, 35, 38, 42, 43, 44, 46, 47, 48, 52, 53, 54, 55, 58, 61,
      64, 67, 72, 74, 81, 86,
    ].map((value, i) => ({ label: `Student ${i + 1}`, value })),
  },
};
let revision = 0;
export function ecologyOptions(type: EcologyType, fresh = false): ChartOptions {
  const base = examples[type],
    factor = fresh ? 0.82 + (++revision % 7) * 0.05 : 1;
  const data = base.data.map((point) => {
    const p = { ...point };
    if (fresh) {
      if (type === "daylight") {
        const [h, m] = p.start!.split(":").map(Number);
        const minutes = h * 60 + m + 7;
        p.start = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
      } else if (type === "frost") {
        if (p.track !== p.label && p.value !== null && p.value !== undefined)
          p.value = Math.round(p.value * factor * 100) / 100;
      } else {
        for (const key of [
          "value",
          "baseline",
          "low",
          "q1",
          "q3",
          "high",
          "weight",
        ] as const) {
          const v = p[key];
          if (typeof v === "number")
            p[key] =
              type === "bamboo"
                ? Math.min(99, Math.round(v * factor))
                : Math.round(v * factor * 100) / 100;
        }
      }
    }
    return p;
  });
  return {
    type,
    ...base,
    data,
    theme: ["mycelium", "firefly", "nautilus", "frost", "echo"].includes(type)
      ? "twilight"
      : [
            "raincloud",
            "dew",
            "glacier",
            "sediment",
            "delta",
            "estuary",
            "migration",
            "coral-range",
            "isobar",
          ].includes(type)
        ? "ocean"
        : ["dune", "wind-rose", "daylight", "bamboo", "pitcher"].includes(type)
          ? "autumn"
          : "meadow",
  };
}
export const ecologyNames = Object.fromEntries(
  ecologyTypes.map((type) => [type, examples[type].title!]),
) as Record<EcologyType, string>;
export const ecologyUseCases = Object.fromEntries(
  ecologyTypes.map((type) => [
    type,
    ecologyMetadata[type].subtitle.toUpperCase(),
  ]),
) as Record<EcologyType, string>;
