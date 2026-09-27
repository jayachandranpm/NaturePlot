# NaturePlot.js API reference

Version 0.7.0. No runtime dependencies. Requires a browser DOM to construct charts.

## Exports

```js
import NaturePlot, {
  NaturePlot as Chart,
  createChart,
  chartTypes,
  themes,
  registerChart,
  version,
} from 'natureplot';
```

TypeScript exports: `ChartOptions`, `ChartType`, `ChartDatum`, `DataPoint`, `IntervalPoint`, `StagePoint`, `Threshold`, `SundialOptions`, `SeasonWheelOptions`, `PhenologyOptions`, `Theme`, `ThemeName`, `ChartMetadata`, `RenderContext`, and `ChartRenderer`.

The browser IIFE exposes a `NaturePlot` namespace. Use `NaturePlot.createChart(...)` or `new NaturePlot.NaturePlot(...)`.

## Construction

```js
const chart = new NaturePlot(container, options);
```

`container` is an existing `HTMLElement` or a selector matching one. The chart appends its own wrapper and leaves existing container content intact. Give the container a usable width. SVG uses a fixed 640×360 coordinate system and scales to container width. Several instances can coexist, including in the same host.

### Options

| Property | Type | Default | Meaning |
| --- | --- | --- | --- |
| `type` | string | required | Built-in or registered renderer name |
| `data` | `ChartDatum[]` | required | Numeric, interval, or stage inputs; up to 1,000 observations with chart-specific limits |
| `title` | string | Type name + “chart” | SVG accessible title and data-table caption |
| `description` | string | Encoding and keyboard guidance | SVG accessible description |
| `theme` | name or `Theme` | `meadow` | Colors and background |
| `startDate` | ISO date | First dated observation, else today in UTC | First day in a calendar window |
| `days` | integer | Days in starting month | Garden length, 1–31; ignored by Rainbow |
| `max` | number | Data maximum (or 1) | Positive shared scale ceiling; must be at least every data value |
| `target` | number | 100 | Positive default target for Tide, Rings, Waterline, and Water Clock |
| `unit` | string | none | Appended to formatted values |
| `animate` | boolean | `true` | Brief fade-in; disabled by reduced motion |
| `detail` | `'natural'` or `'essential'` | `'natural'` | Native material detail or simpler SVG, preserving measurements |
| `interactive` | boolean | `true` | Show persistent reading, Previous/Next, Clear, and table controls |
| `showTable` | boolean | `false` | Visually show the otherwise screen-reader-accessible data table |
| `formatValue` | `(number) => string` | English numbers, up to 21 significant digits | Formats readings before adding `unit`; compact axis labels may use shorter notation |
| `onSelect` | `(Readonly<DataPoint>, index) => void` | none | Pointer click or Enter/Space selection |

`title` and `description` are accessible metadata. Add a visible HTML heading in your application if needed. `max` sets the scale for Rainbow, Garden, Forest, Bloom, River, and Mountain. Tide, Rings, Waterline, and Water Clock use `target` instead.

### Data points

```ts
interface DataPoint {
  value: number | null;
  label?: string;
  date?: string;    // YYYY-MM-DD; a real calendar date
  target?: number;  // finite and greater than zero
}
```

Null is missing data; zero is an observed zero. Never substitute zero for a missing value unless that is what the data means.

Calendar entries with explicit dates are matched by date. Undated entries are assigned `startDate + array index`. Missing dates are filled with null. Do not mix assignments that collide. Duplicate and out-of-window dates throw errors. Rainbow contains exactly 49 dates. Garden defaults to the length of the starting month; for a strict month view use its first day as `startDate`.

River, Mountain, and Tidal Rhythm allow negatives and preserve gaps at nulls. River and Mountain use evenly spaced observations and preserve input order; they do not sort by date. Tidal Rhythm uses explicit positions within supplied cycles. Other original instrument charts reject negatives; Living systems charts have the signed-value rules documented below. Tide, Waterline, and Water Clock accept zero or one point; Bloom at most 12, Rings at most 8, and Forest at most 24. The complete chart-specific limits are below. Aggregate crowded categories or use multiple charts.

## Methods

### `chart.update(partialOptions): chart`

Merges options and redraws. Rendering occurs off-DOM before replacing the previous wrapper, so invalid input or a throwing custom renderer leaves the previous chart intact. Pass `undefined` to clear an optional option. When switching chart types, reset options that no longer apply (for example, calendar dates or a fixed `max`). The playground demonstrates this.

```js
chart.update({ data: nextData, max: undefined });
chart.update({ type: 'river', data: trend, startDate: undefined, days: undefined });
```

A redraw replaces the chart subtree. Reattach external listeners to the stable host, not individual marks. Use `onSelect` or the bubbling event instead. Focus is not automatically restored across a redraw.

### `chart.setTheme(nameOrPalette): chart`

Changes the theme and redraws. Built-in names: `meadow`, `ocean`, `autumn`, `twilight`.

```js
chart.setTheme({
  background: '#fafbf5',
  ink: '#263e32',
  muted: '#738174',
  grid: '#dce5d8',
  colors: ['#63866a', '#93aa73', '#bbca80', '#e3c874'],
});
```

All colors must be 3- or 6-digit hex colors. `colors` must have at least one entry. The chart copies its palette to avoid later external mutations affecting an existing instance.

### `chart.toSVG(): string`

Returns a standalone XML SVG with explicit 640×360 dimensions, accessible title/description, its background, and required local gradient/clip definitions. There are no remote assets or dependencies. Export becomes a static image and removes keyboard tab indices, button states, and tooltip references. The exported drawing shows all observations without the interactive selection dimming. HTML tooltips and the HTML data table are not part of the SVG export. Fonts use system fallbacks. If combining exported files into one DOM, ensure IDs remain unique across separately loaded library instances.

### `chart.download(filename?): void`

Downloads SVG via a temporary browser Blob URL. Defaults to `<type>.svg`. An `.svg` suffix is added if needed. Call from a user interaction when browser download policies require one. Blob URLs are revoked after the download starts.

### `chart.destroy(): void`

Removes the instance wrapper and event listeners. Does not alter sibling DOM. Calling repeatedly is safe. Updating or exporting a destroyed instance throws an error.

### `chart.data: DataPoint[]`

Returns a defensive copy of normalized data, including filled calendar dates. Changing this returned array does not mutate the chart. `chart.id` is a unique identifier within the loaded library module; `chart.container` is the host element.

## Interaction and accessibility

Tab enters the chart at its current observation. Arrow keys move through observations in data order, wrapping at the edges. Home and End jump to first/last. Enter/Space select; Escape closes the tooltip. Pointer hover/focus shows exact values. Clicking selects, including on touch devices. The tooltip uses safe text content.

All marks have accessible labels. A semantic HTML table follows the SVG. It is visually hidden by default but remains available to screen readers. Use `showTable: true` for visible tabular access. Color-driven calendars also use exact dated labels and values. Custom palettes should be evaluated for contrast.

Selection also dispatches a bubbling `CustomEvent` from the wrapper:

```js
document.querySelector('#chart').addEventListener('natureplot:select', event => {
  const { point, index, chart } = event.detail;
  // point is a frozen copy; index refers to normalized data.
});
```

The library inserts scoped `.np-chart` CSS into each wrapper. It never resets application styles. A short fade-in respects `prefers-reduced-motion`. Strict content-security policies that block inline styles need application-level integration; this release does not provide a CSP nonce option.

## Register a natural metaphor

Renderers are trusted application code. Register a unique lowercase name; built-in names cannot be replaced.

```js
import { NaturePlot, registerChart } from 'natureplot';

registerChart('seeds', ctx => {
  const max = Math.max(1, ...ctx.data.map(p => p.value ?? 0));
  ctx.data.forEach((point, index) => {
    const seed = ctx.el('circle', {
      cx: 70 + index * 55,
      cy: 180,
      // Circle area, rather than radius, represents value in this example.
      r: Math.sqrt(Math.max(0, point.value ?? 0) / max) * 22,
      fill: ctx.theme.colors[index % ctx.theme.colors.length],
    });
    ctx.mark(seed, point, index);
  });
}, {
  name: 'Seeds',
  subtitle: 'Every idea starts small',
  category: 'Comparison',
  description: 'Compare a handful of positive values with seeds.',
  encoding: 'Seed area represents a nonnegative value.',
});

new NaturePlot('#chart', {
  type: 'seeds',
  data: [{ label: 'Ideas', value: 6 }, { label: 'Projects', value: 3 }],
});
```

`RenderContext` contains `svg`, `data`, `options`, `theme`, `width`, `height`, `id`, `format(value)`, `el(tag, attrs?, parent?, text?)`, and `mark(element, point, index)`. `el` creates SVG nodes safely; `mark` adds standard focus/tooltip/selection semantics. Use `ctx.id` as a prefix for custom SVG gradients and clip paths. Custom renderers are responsible for their own geometry, visual scales, and type-specific validation. Generic finite-value validation still applies.

## Framework integration

Instantiate after mount and destroy before the component unmounts:

```jsx
import { useEffect, useRef } from 'react';
import { NaturePlot } from 'natureplot';

export function Forest({ data }) {
  const host = useRef(null);
  useEffect(() => {
    const chart = new NaturePlot(host.current, { type: 'forest', data });
    return () => chart.destroy();
  }, [data]);
  return <div ref={host} />;
}
```

For frequent updates, keep the instance in a ref and call `update()` from a separate effect. The library does not ship a framework adapter or require React.

## Design boundaries

The expressive silhouette is not always the most precise comparison. Use visible tables or Cartesian views when exact comparisons matter. Petal area/tree width are not separate measures. Rings compare fractions through angle. Rainbow hue identifies a week while opacity represents value. River's curves are a visual interpolation between observations, not additional measured samples. Calendar weeks begin exactly on `startDate`.

There is no server rendering, continuous-time spacing in River/Mountain, pan/zoom, arbitrary multi-series overlays, automatic localization, or automatic aggregation in this release.


## Natural instruments — v0.2.0

All twelve research-inspired additions use the same lifecycle, themes, keyboard selection, exact tables, and SVG export as the original eight. All time and cycle data is supplied by the application. Sundial is a clock-time schedule, Lunar Cycle and Star Cycle are abstract cycles, and Tidal Rhythm does not forecast tides.

| Type | Encoding | Supported data |
| --- | --- | --- |
| `seed-ledger` | Countable seeds with an explicit denomination; fractional filled area | Up to 6 nonnegative or missing observations |
| `waterline` | Water height on a linear capacity scale with supplied thresholds | Zero or one observation, positive target, up to 6 unique thresholds |
| `sundial` | Angular clock time and duration on separate tracks | Up to 12 intervals and 4 tracks within one day |
| `season-wheel` | Actual date intervals around a Gregorian year | Up to 12 intervals and 4 tracks within one year |
| `phenology` | Observed dates and expected windows on a date axis | Up to 6 stages, including stages with no dates yet |
| `lunar-cycle` | Abstract cycle position; separate radial stems for quantity | Up to 24 unique positions and nonnegative/missing values |
| `water-clock` | Remaining water height from elapsed or remaining duration | Zero or one observation with a positive target duration |
| `balance` | Two common-scale bars and a directional beam | Exactly two nonnegative/missing observations, or an empty array |
| `cord-ledger` | Countable knots on parent-grouped cords | Up to 8 categories; each parent track must be contiguous |
| `growth-history` | Ordered annuli by thickness or area, plus linear bars | Up to 10 nonnegative/missing period contributions |
| `tidal-rhythm` | Aligned cycle positions on one shared numeric scale | Up to 4 cycles, 48 observations each; negatives and gaps supported |
| `star-cycle` | Angular checkpoints with intensity for value | Up to 24 unique positions and nonnegative/missing values |

### Additional options

| Option | Default | Contract |
| --- | --- | --- |
| `unitsPerMark` | `1` | Positive seed/knot denomination. At most 40 seeds per row or 20 knots per cord; larger totals use a labeled multiple of this unit. |
| `thresholds` | `[]` | Waterline `{ value, label }[]`; unique finite values from zero through capacity, with nonempty labels. |
| `year` | First interval's year, else current UTC year | Season Wheel integer Gregorian year, 1–9998. |
| `at` | none | Sundial HH:mm cursor, or Season Wheel ISO date cursor. Must lie inside its window. |
| `endDate` | Inferred | Phenology upper inclusive domain. For a fixed domain supply both `startDate` and `endDate`; end must be later. |
| `cycleLength` | Lunar 30, Star 12, Tidal 24 | Positive finite abstract cycle span. |
| `cycleUnit` | `steps` | Display label for cycle positions, distinct from numeric `unit`. |
| `cyclePosition` | none | Lunar/Star cursor, in `[0, cycleLength)`. |
| `timeMode` | `remaining` | Water Clock input convention: `remaining` or `elapsed`. |
| `growthMode` | `thickness` | Growth History mapping: `thickness` or `area`. |

`max` also sets the shared scale for Lunar Cycle, Star Cycle, Balance, and Tidal Rhythm. Growth History's linked bars honor `max`; the annuli distribute the known contributions across their available radius/area independently of `max`. Negative periods are not supported.

### Intervals

```ts
interface IntervalPoint {
  label?: string;
  start: string;
  end: string;
  track?: string;
  value?: number | null;
}
```

Sundial times use `HH:mm`. An interval end may be `24:00`; a start or cursor may not. Season Wheel dates use real `YYYY-MM-DD` dates. All ends are **exclusive**. Zero-length, reversed, out-of-window, and same-track overlapping intervals throw. Adjacent intervals may share a boundary. Different tracks may overlap. Tracks run outside inward in order of first appearance; the default track is `Schedule`.

```js
new NaturePlot('#chart', {
  type: 'sundial',
  at: '13:30',
  data: [
    { label: 'Deep work', start: '09:00', end: '11:30', track: 'Work' },
    { label: 'Walk', start: '12:00', end: '13:00', track: 'Life' },
  ],
});
```

Split intervals crossing midnight or the selected year into separate windows. For a full selected year, `end` may equal January 1 of the next year. Leap days and month lengths contribute their actual share of the circle.

### Observed stages

```ts
interface StagePoint {
  label?: string;
  observedAt?: string;
  expectedStart?: string;
  expectedEnd?: string;
  value?: number | null;
}
```

Expected windows need both endpoints, with end on or after start. Every supplied date must be real and fit an explicit domain when one is supplied. A stage without an `observedAt` remains unobserved even after an expected window passes. The chart never infers completion from today's date. Numeric values are optional for intervals and stages; normalized readings return `value: null` when omitted.

```js
new NaturePlot('#chart', {
  type: 'phenology',
  data: [
    { label: 'Sown', observedAt: '2026-03-01' },
    { label: 'Flower', expectedStart: '2026-04-10', expectedEnd: '2026-04-25' },
    { label: 'Harvest' },
  ],
});
```

### Cycle observations

Numeric data points can additionally contain `position?: number`, `cycle?: string`, and `track?: string`. A `position` is a zero-based position in the explicitly defined cycle, not a timestamp or an inferred astronomical phase.

Lunar/Star positions must be unique within `[0, cycleLength)` and default to the array index. Tidal positions are within `[0, cycleLength]`, allowing the final boundary reading. They must increase strictly within each cycle. Tidal cycle names default to `Cycle 1`; omitted positions default to the observation index within that cycle. Different cycles can be interleaved in input; keyboard exploration and selection indices still follow normalized input order.

```js
new NaturePlot('#chart', {
  type: 'tidal-rhythm', cycleLength: 24, cycleUnit: 'h',
  data: [
    { cycle: 'Monday', position: 0, value: 12 },
    { cycle: 'Monday', position: 6, value: 30 },
    { cycle: 'Monday', position: 24, value: 14 },
    { cycle: 'Tuesday', position: 0, value: 9 },
    { cycle: 'Tuesday', position: 6, value: 27 },
    { cycle: 'Tuesday', position: 24, value: 18 },
  ],
});
```

### Exact readings and updates

Tables and mark descriptions include interval starts, exclusive ends, duration, tracks, observed/expected dates, stage status, cycle positions, and cycle names as applicable. SVG descriptions retain measurement keys and complete threshold labels. Threshold arrays are defensively copied.

As before, `update()` merges settings. Clear old type-specific options when switching forms, especially `startDate`, `endDate`, `max`, `target`, `thresholds`, `at`, and cycle settings. The playground's chart switch resets these automatically; its settings editor lets you edit measurement options directly.

Zero and missing values remain distinct. Seed/knot bundling never silently discards a numeric remainder. Growth History assigns no quantitative layer to an unknown period, keeps the period in its table and legend, and labels the stack incomplete. Waterline and Water Clock preserve exact over-target readings even where the visible fill is capped. Balance reports right minus left; its tilt is not a calibrated physical formula.


## Living systems — v0.3.0

Thirty new charts bring the collection to fifty. See [the complete catalog](CHART_CATALOG.md) for encodings and chart-specific bounds, and [the research plan](FIFTY_CHARTS_PLAN.md) for natural and historical inspirations. Each new chart has a live guide at `/docs/#/<type>`.

Additional optional `PointFields`:

| Fields | Meaning |
|---|---|
| `x`, `y` | Supplied numeric coordinates; required according to the chart |
| `weight` | Nonnegative bubble area variable for Dew; defaults to 1 |
| `angle` | Wind Rose direction in clockwise degrees from north |
| `baseline` | Before reading for Leaf Veins |
| `low`, `high` | Bin edges or range bounds, depending on chart |
| `q1`, `q3` | Supplied quartiles for Petal Box; `value` is its median |
| `id`, `parent` | Unique node identifier and optional parent identifier |
| `source`, `destination` | Directed relationship identifiers |
| `track` | Category row, distribution group, composition layer, or event lane |
| `position` | Explicit bin/event/sequence position; for Nautilus, spans multiple cycles |

These fields are copied with observations and included in tables, tooltips, selection callbacks, and SVG descriptions. Daylight accepts optional-value interval data with an ISO `date` and same-day HH:mm `start`/`end`. Only an end can be 24:00. It does not compute sunrise or sunset.

Numeric fields in all built-in charts accept zero or absolute magnitudes between 1e-100 and 1e100. Rescale units outside that interval. Positive goals, maxima, and cycle lengths follow the same bounds. All totals and contours use supplied measurements. `null` is rejected where missing data would invalidate a total, rank distribution, histogram, or flow; charts that accept missing readings explicitly preserve them.

`unit` applies to the main value. Spatial coordinates, event positions, ECDF fractions, and histogram-density axes do not inherit unrelated value units. Per-chart rules govern sorting: callbacks always retain normalized input indexes even when a renderer ranks or groups observations.

### Shared observation inspector

All fifty charts display Previous, Next, Clear, and Show data buttons by default. Click, tap, Enter, or Space selects a mark, sets `aria-pressed`, emphasizes it, and preserves its reading in an announced status region. Previous/Next wrap in input order. Escape and Clear remove the selection. `natureplot:select` and `onSelect` fire for stepping as well as direct activation. Table visibility changes without rerendering. Updates reset selection and restore the configured `showTable` state.

Set `interactive: false` to omit the visible inspector for decorative miniatures. Mark focus, tooltips, callbacks, and the semantic table remain available. Empty charts disable stepping. Reduced-motion preferences still apply. Export contains the chart SVG rather than its HTML controls.

### Readable sizing

SVGs retain their 640 × 360 coordinate system. They scale up with the container; below 640px, the chart scrolls inside its own container. This preserves readable labels and avoids page-level horizontal overflow. Small built-in SVG labels have a minimum size of 12 SVG units; new chart labels generally use 14. The inspector and table use 14px text. Long labels remain exact in the inspector and table even where chart labels are shortened.

## Choosing a chart — v0.5.0

`chartGuidance` maps every built-in `ChartType` to `{ bestFor, caution, alternative }`. Each entry states a specific purpose, a measurement limitation, and another built-in chart worth considering. It is exported from both bundles.

```js
import { chartGuidance } from 'natureplot';
console.log(chartGuidance.dew.bestFor);
```

Cartesian charts using the shared axes (Dew, Migration, Raincloud, Sediment, Pebble, Echo, Isobar) accept optional string `xLabel` and `yLabel`; Dew also accepts `weightLabel`. Firefly accepts `xLabel` for its event-position caption. Include coordinate units in the label. Labels do not transform data. `unit` applies to the primary value.

Migration and Isobar preserve equal units per pixel on both axes, extending the shorter domain as needed. They expect planar coordinates in the same unit. No projection or extrapolation is calculated.

Zero-weight dots use a hollow location marker; missing dots use a dashed marker. These are status symbols, not positive quantitative areas. Mycelium long dashes mean zero; short dashes mean unknown weight. Its positive thread widths have no minimum-value floor.

Cairn uses only the chart-level `target` (default 100); point targets do not override the shared goal. Its zero contributions have zero stone height. Sediment and Dune emphasize the selected record's track while preserving the common scale.

Built-in numeric magnitudes must be zero or within 1e-100 through 1e100. This bound now also applies to the original twenty renderers. For more extreme magnitudes, rescale values and set a unit label before rendering. Custom renderers retain generic finite-value validation.

## Natural detail — v0.7.0

`detail: 'natural' | 'essential'` sets visual detail for all fifty built-in charts. Natural is the default. Both modes use native SVG paths, symbols and local gradients; no image assets are registered or fetched. Essential removes material ornament and uses simpler geometry while preserving the observations, scales, exact readings and selection controls.

```js
chart.update({ detail: 'essential' });
chart.select(0);
const svg = chart.toSVG(); // Pure, self-contained vector output.
```

`select(index): this` selects a normalized input observation, updates the inspector and selection emphasis, and emits the same callback and DOM event as direct activation. Indexes must be integers within `chart.data`; invalid indexes and destroyed charts throw. Call after `update`, because updates reset selection.

`chartUseCases[type]` exposes `{ example, question, decision }` for all 50 built-ins. `chartGuidance[type]` includes those fields plus `bestFor`, `caution` and `alternative`. These are selection aids, not computed conclusions from the caller’s data.

```js
import { chartGuidance } from 'natureplot';
console.log(chartGuidance['petal-box'].question);
// Which delivery provider is faster and more consistent?
```

### Migration from 0.6

Remove `registerIllustrations`, `illustratedCharts` and the `natureplot/illustrations` import. The photographic pack and its types are no longer exported. The legacy `artwork: 'illustrated' | 'vector'` field is deprecated and accepted for source compatibility, but has no effect. Use `detail` instead. All new exports remain pure vector and need no image CSP permissions.

The original image files and generation records are retained as historical experiments. They are not dependencies of the current chart library or site. See [the native SVG review](NATIVE_SVG_REVIEW.md).
