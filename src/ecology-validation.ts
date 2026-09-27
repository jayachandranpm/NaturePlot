import type { ChartOptions, DataPoint } from "./types.js";
import { ecologyTypes, type EcologyType } from "./ecology-catalog.js";
const fail = (message: string): never => {
  throw new Error("NaturePlot: " + message);
};
const required = (p: DataPoint, key: keyof DataPoint) => {
  if (p[key] === undefined || p[key] === "") fail(`${key} is required.`);
};
const grouped = (data: DataPoint[]) =>
  [...new Set(data.map((p) => p.track ?? "Series"))].map((track) =>
    data.filter((p) => (p.track ?? "Series") === track),
  );
const limits: Record<EcologyType, number> = {
  honeycomb: 36,
  mycelium: 18,
  "root-tree": 16,
  canopy: 12,
  fern: 8,
  phyllotaxis: 8,
  "leaf-veins": 6,
  lotus: 8,
  "petal-box": 6,
  raincloud: 12,
  dew: 40,
  "wind-rose": 16,
  dune: 64,
  glacier: 10,
  sediment: 64,
  delta: 7,
  estuary: 16,
  pitcher: 7,
  firefly: 60,
  migration: 20,
  murmuration: 60,
  "coral-range": 6,
  pebble: 60,
  nautilus: 36,
  frost: 36,
  echo: 40,
  cairn: 8,
  daylight: 7,
  isobar: 64,
  bamboo: 60,
};
export function validateEcology(
  options: ChartOptions,
  data: DataPoint[],
): void {
  if (!(ecologyTypes as readonly string[]).includes(options.type)) return;
  const type = options.type as EcologyType;
  if (data.length > limits[type])
    fail(`${type} supports at most ${limits[type]} observations.`);
  for (const p of data) {
    for (const key of [
      "x",
      "y",
      "weight",
      "angle",
      "baseline",
      "low",
      "q1",
      "q3",
      "high",
    ] as const)
      if (p[key] !== undefined && !Number.isFinite(p[key]))
        fail(`${key} must be finite.`);
    for (const key of ["id", "parent", "source", "destination"] as const)
      if (
        p[key] !== undefined &&
        (typeof p[key] !== "string" || !p[key]!.trim())
      )
        fail(`${key} must be a nonempty string.`);
    // Bounded arithmetic keeps accumulated totals and interpolated coordinates finite.
    for (const key of [
      "value",
      "x",
      "y",
      "weight",
      "position",
      "baseline",
      "low",
      "q1",
      "q3",
      "high",
    ] as const)
      if (
        typeof p[key] === "number" &&
        (Math.abs(p[key]!) > 1e100 ||
          (p[key] !== 0 && Math.abs(p[key]!) < 1e-100))
      )
        fail(
          `${type} supports zero and magnitudes from 1e-100 to 1e100; rescale units first.`,
        );
    if (
      ![
        "leaf-veins",
        "petal-box",
        "dew",
        "glacier",
        "murmuration",
        "coral-range",
        "pebble",
        "frost",
        "echo",
        "isobar",
        "daylight",
      ].includes(type) &&
      p.value !== null &&
      p.value < 0
    )
      fail(`${type} requires nonnegative values.`);
    if (
      [
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
      ].includes(type) &&
      p.value === null
    )
      fail(
        `${type} needs known values; missing data would make its derived quantities misleading.`,
      );
    if (p.weight !== undefined && p.weight < 0)
      fail("weight must be nonnegative.");
  }
  if (
    type === "nautilus" &&
    (!Number.isFinite(options.cycleLength ?? 12) ||
      (options.cycleLength ?? 12) <= 0 ||
      (options.cycleLength ?? 12) > 1e100)
  )
    fail("cycleLength must be positive and no greater than 1e100.");
  for (const key of ["target", "max", "cycleLength"] as const)
    if (
      options[key] !== undefined &&
      (options[key]! < 1e-100 || options[key]! > 1e100)
    )
      fail(`${key} must be between 1e-100 and 1e100 for living-system charts.`);
  if (
    data.some(
      (p) => p.target !== undefined && (p.target < 1e-100 || p.target > 1e100),
    )
  )
    fail("point targets must be between 1e-100 and 1e100.");
  if (!data.length) return;
  if (["honeycomb", "frost"].includes(type)) {
    data.forEach((p) => {
      required(p, "track");
      required(p, "label");
    });
    const rows = [...new Set(data.map((p) => p.track!))],
      cols = [...new Set(data.map((p) => p.label!))];
    if (rows.length > 6 || cols.length > 6)
      fail("matrix dimensions must not exceed 6.");
    const cells = new Map<string, DataPoint>();
    data.forEach((p) => {
      const key = JSON.stringify([p.track, p.label]);
      if (cells.has(key)) fail("matrix cells must be unique.");
      cells.set(key, p);
    });
    if (type === "frost") {
      if (
        rows.length < 2 ||
        rows.length !== cols.length ||
        rows.some((r) => !cols.includes(r)) ||
        data.length !== rows.length ** 2
      )
        fail("frost requires a complete square matrix of matching variables.");
      data.forEach((p) => {
        if (p.value !== null && (p.value < -1 || p.value > 1))
          fail("correlations must lie between -1 and 1.");
        if (p.track === p.label && p.value !== 1)
          fail("correlation diagonal must equal 1.");
        if (cells.get(JSON.stringify([p.label, p.track]))!.value !== p.value)
          fail("correlation matrix must be symmetric.");
      });
    }
  }
  if (["mycelium", "delta", "estuary"].includes(type)) {
    const pairs = new Set<string>();
    data.forEach((p) => {
      required(p, "source");
      required(p, "destination");
      const key = JSON.stringify([p.source, p.destination]);
      if (pairs.has(key)) fail("directed link pairs must be unique.");
      pairs.add(key);
      if (type !== "estuary" && p.source === p.destination)
        fail("self-links are not supported.");
    });
    const sources = new Set(data.map((p) => p.source)),
      destinations = new Set(data.map((p) => p.destination));
    if (type === "mycelium" && new Set([...sources, ...destinations]).size > 10)
      fail("mycelium supports at most 10 nodes.");
    if (type === "delta" && sources.size !== 1)
      fail("delta requires one source.");
    if (type === "estuary" && (sources.size > 5 || destinations.size > 5))
      fail("estuary supports at most 5 sources and 5 destinations.");
  }
  if (type === "root-tree") {
    const levelCounts = new Map<number, number>();
    const nodes = new Map<string, DataPoint>();
    data.forEach((p) => {
      required(p, "id");
      if (nodes.has(p.id!)) fail("node ids must be unique.");
      nodes.set(p.id!, p);
    });
    data.forEach((p) => {
      let current = p;
      const visited = new Set<string>();
      while (current) {
        if (visited.has(current.id!))
          fail("hierarchy must not contain cycles.");
        visited.add(current.id!);
        if (visited.size > 4)
          fail("root-tree supports at most 4 depth levels.");
        if (!current.parent) break;
        const parent = nodes.get(current.parent);
        if (!parent) fail("every parent must reference an existing node.");
        current = parent!;
      }
      const depth = visited.size;
      levelCounts.set(depth, (levelCounts.get(depth) ?? 0) + 1);
    });
    if ([...levelCounts.values()].some((n) => n > 5))
      fail(
        "root-tree supports at most 5 nodes at each depth for readable labels.",
      );
  }
  if (["canopy", "dune", "sediment", "firefly", "murmuration"].includes(type)) {
    if (grouped(data).length > (type === "firefly" ? 5 : 4))
      fail(`${type} has too many tracks.`);
  }
  if (type === "lotus" && data.length < 3) fail("lotus needs at least 3 axes.");
  if (type === "leaf-veins") data.forEach((p) => required(p, "baseline"));
  if (["petal-box", "coral-range", "raincloud"].includes(type))
    data.forEach((p, i) => {
      required(p, "low");
      required(p, "high");
      if (p.low! > p.high!) fail("low must not exceed high.");
      if (type === "raincloud") {
        if (p.low! === p.high!) fail("histogram bins need positive width.");
        if (i && p.low! < data[i - 1].high!)
          fail("histogram bins must be ordered and non-overlapping.");
      } else if (p.value !== null && (p.value < p.low! || p.value > p.high!))
        fail("value must fall inside its range.");
      if (type === "petal-box") {
        required(p, "q1");
        required(p, "q3");
        if (
          !(
            p.low! <= p.q1! &&
            p.q1! <= p.value! &&
            p.value! <= p.q3! &&
            p.q3! <= p.high!
          )
        )
          fail("quartiles must satisfy low ≤ q1 ≤ median ≤ q3 ≤ high.");
      }
    });
  if (["dew", "migration", "isobar"].includes(type))
    data.forEach((p) => {
      required(p, "x");
      if (type !== "dew") required(p, "y");
    });
  if (["migration", "echo", "pitcher"].includes(type) && data.length < 2)
    fail(`${type} needs at least 2 observations.`);
  if (type === "wind-rose") {
    if (![4, 8, 16].includes(data.length))
      fail("wind-rose needs 4, 8, or 16 sectors.");
    data.forEach((p, i) => {
      if (p.angle !== (i * 360) / data.length)
        fail("wind angles must equal index × 360 / count.");
    });
  }
  if (["dune", "sediment", "firefly", "nautilus"].includes(type))
    data.forEach((p) => required(p, "position"));
  if (["dune", "sediment"].includes(type)) {
    const groups = grouped(data);
    groups.forEach((g) => {
      if (g.length < 2 || g.length > 16)
        fail("each profile needs 2–16 positions.");
      g.forEach((p, i) => {
        if (i && p.position! <= g[i - 1].position!)
          fail("profile positions must increase strictly.");
      });
    });
    if (
      type === "sediment" &&
      groups.some(
        (g) =>
          g.length !== groups[0].length ||
          g.some((p, i) => p.position !== groups[0][i].position),
      )
    )
      fail("sediment tracks must share identical positions.");
  }
  if (
    type === "pitcher" &&
    data.some((p, i) => i > 0 && p.value! > data[i - 1].value!)
  )
    fail("funnel counts must be non-increasing.");
  if (type === "nautilus")
    data.forEach((p, i) => {
      if (
        p.position! < 0 ||
        p.position! >= 4 * (options.cycleLength ?? 12) ||
        (i && p.position! <= data[i - 1].position!)
      )
        fail("spiral positions must increase within four cycles.");
    });
  if (type === "daylight") {
    const dates = new Set<string>();
    data.forEach((p) => {
      required(p, "date");
      required(p, "start");
      required(p, "end");
      if (dates.has(p.date!)) fail("daylight dates must be unique.");
      dates.add(p.date!);
      const clock = (s: string, end = false) => {
        if (!/^\d{2}:\d{2}$/.test(s))
          return fail("daylight times must use HH:mm.");
        const [h, m] = s.split(":").map(Number);
        if (m > 59 || (h > 23 && !(end && h === 24 && m === 0)))
          fail("daylight time outside 24-hour day.");
        return h * 60 + m;
      };
      if (clock(p.end!, true) <= clock(p.start!))
        fail("daylight end must be after start in one day.");
    });
  }
  if (type === "isobar") {
    const xs = new Set(data.map((p) => p.x)),
      ys = new Set(data.map((p) => p.y));
    if (
      xs.size < 2 ||
      ys.size < 2 ||
      xs.size > 8 ||
      ys.size > 8 ||
      data.length !== xs.size * ys.size ||
      new Set(data.map((p) => JSON.stringify([p.x, p.y]))).size !== data.length
    )
      fail(
        "isobar requires a complete 2–8 by 2–8 coordinate grid without duplicates.",
      );
  }
  if (
    type === "bamboo" &&
    [...new Set(data.map((p) => Math.floor(p.value! / 10)))].some(
      (stem) =>
        data.filter((p) => Math.floor(p.value! / 10) === stem).length > 18,
    )
  )
    fail("bamboo supports at most 18 leaves per stem; split dense samples.");
  if (
    type === "bamboo" &&
    data.some(
      (p) => !Number.isInteger(p.value) || p.value! < 0 || p.value! > 99,
    )
  )
    fail("bamboo accepts integers from 0 to 99.");
}
