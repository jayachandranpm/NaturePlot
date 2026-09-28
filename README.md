# NaturePlot.js

**Data, in its natural form.** A framework-independent, dependency-free SVG chart library inspired by nature. Includes fifty chart types, four palettes, TypeScript declarations, keyboard exploration, exact data tables, and SVG export.

This repository contains the library, a working gallery/playground, and a dedicated documentation site. Install the JavaScript library as `natureplot` from npm. Python users can install `natureplot` from PyPI; see the [Python guide](python/README.md) and [publishing instructions](docs/PUBLISHING.md).

[Home & playground](https://jayachandranpm.github.io/NaturePlot/) · [Documentation](https://jayachandranpm.github.io/NaturePlot/docs/) · [Installation guide](https://jayachandranpm.github.io/NaturePlot/docs/#/installation) · [npm](https://www.npmjs.com/package/natureplot) · [PyPI](https://pypi.org/project/natureplot/)

## Use NaturePlot with AI assistants

Every documentation page includes **Copy page** and **Ask about NaturePlot** actions for ChatGPT, Perplexity, Gemini, Grok, and Claude. Gemini uses copy-and-paste context; other shortcuts include a page-specific prompt and documentation links.

- [llms.txt](https://jayachandranpm.github.io/NaturePlot/llms.txt): project overview and links to every Markdown guide.
- [llms-full.txt](https://jayachandranpm.github.io/NaturePlot/llms-full.txt): all current guides in one file.
- [AI & LLMs guide](https://jayachandranpm.github.io/NaturePlot/docs/#/ai): copying, assistant links, and plain Markdown exports.

`llms.md` and `llm.txt` are aliases of the index. `npm run build:demo` regenerates these files and `docs/<page>.md` from the same source as the website; use `npm run preview` to check the generated files locally.

## Natural SVG, practical decisions

Version 0.7.0 keeps all **50 charts** and replaces the generated photographic pack with native SVG: curved leaves and veins, feathered birds, segmented bamboo, braided knots, shaded stones, brass pans, and data-derived contour bands. Charts and exports contain no raster images. The ESM runtime is about 60 KB gzip.

Every chart has a worked example, a question it answers, a decision it can support, and explicit limits. Search the gallery or documentation by a need such as “returns”, “stock”, “delivery times”, or “onboarding”. Examples use illustrative data. See the [native SVG review](docs/NATIVE_SVG_REVIEW.md).

```js
import { NaturePlot, chartGuidance } from 'natureplot';

const chart = new NaturePlot('#chart', {
  type: 'balance', detail: 'natural', unit: 'USD',
  data: [{ label: 'Budget', value: 72 }, { label: 'Spending', value: 54 }],
});
chart.select(0);
chart.update({ detail: 'essential' }); // Quieter geometry for dense dashboards.
console.log(chartGuidance.balance.question);
```

Both detail levels retain exact readings, keyboard selection, data tables and data-driven geometry. Decorative texture is never an additional observation. Choose simpler encodings when precise comparison matters more than the metaphor.

Migrating from 0.6: remove `registerIllustrations` and `natureplot/illustrations` imports; the pack is no longer exported. The old `artwork` option is accepted but ignored. Use `detail: 'natural' | 'essential'` instead. Original generated files remain in the repository as historical design experiments, outside the live site and package.

## Quality review

All fifty types retain their measurement contracts, validation, empty states, and accessible readings. Rings supports up to 8 goals; Forest up to 24 categories. Built-in numeric fields accept zero or magnitudes from 1e-100 to 1e100. Rescale more extreme units. See the [measurement review](docs/QUALITY_REVIEW.md) and [research plan](docs/FIFTY_CHARTS_PLAN.md) for the encoding rationale.

## Run the project

Requires Node.js 20.19+ or 22.12+ (Node 24 recommended).

```sh
git clone https://github.com/jayachandranpm/NaturePlot.git
cd NaturePlot
npm ci
npm run dev
```

Open the local address printed by Vite. The documentation lives at `/docs/`. The showcase includes all fifty live charts, category filtering, text search, editable sample data and settings, code generation, theme switching, and SVG downloads.

```sh
npm test               # semantic, calendar, lifecycle, and interaction tests
npm run typecheck      # library, showcase, and documentation
npm run build          # library + types in dist/; static showcase and docs in site/
npm run test:package   # after build: ESM, browser bundle, NodeNext types
npm run review:charts  # after build: reproducible SVG contact sheets at /review/1.html
npm run preview        # preview the production showcase
npm pack               # create an installable local package
```

## Use the library

Choose your JavaScript package manager (all consume the same npm package):

```sh
npm install natureplot
pnpm add natureplot
yarn add natureplot
bun add natureplot
```

Python 3.10+ users can choose pip, uv, or Poetry:

```sh
python -m pip install natureplot
uv add natureplot
poetry add natureplot
```

The Python wrapper bundles the same browser renderer and creates self-contained interactive HTML for reports and notebooks:

```python
from natureplot import Chart

chart = Chart("forest", [{"label": "Online", "value": 42}, {"label": "Retail", "value": 28}],
              title="Orders by channel", unit="orders")
chart.write_html("orders.html")
```

For installation and API details, read the [Python guide](python/README.md). For publishing packages, read [PUBLISHING.md](docs/PUBLISHING.md). The home page and documentation deploy automatically to GitHub Pages on pushes to `main`; see [DEPLOYMENT.md](docs/DEPLOYMENT.md).

Create a container. Its width determines the chart width; charts use a responsive 640×360 SVG viewBox.

```html
<div id="chart" style="max-width: 720px"></div>
```

```js
import { NaturePlot } from 'natureplot';

const chart = new NaturePlot('#chart', {
  type: 'garden',
  title: 'Daily orders',
  startDate: '2026-09-01',
  days: 30,
  theme: 'meadow',
  data: [
    { date: '2026-09-01', value: 8 },
    { date: '2026-09-02', value: 12 },
    { date: '2026-09-03', value: 6 },
  ],
  onSelect(point, index) {
    console.log(point, index);
  },
});

chart.update({ data: [{ date: '2026-09-01', value: 10 }] });
chart.setTheme('autumn');
const standaloneSVG = chart.toSVG();
chart.download('daily-orders.svg');
// On unmount:
chart.destroy();
```

For a script tag, copy `dist/natureplot.global.js` into your static files:

```html
<div id="chart"></div>
<script src="./natureplot.global.js"></script>
<script>
  const chart = NaturePlot.createChart('#chart', {
    type: 'forest',
    data: [{ label: 'Mon', value: 4 }, { label: 'Tue', value: 8 }],
  });
</script>
```

No separate stylesheet is required. The core runtime uses no external fonts, images, services, or network calls. The optional showcase and documentation use Google Fonts with local font fallbacks. UI icons are bundled Phosphor SVGs; documentation search is a local MiniSearch index. These are development dependencies and do not enter the published chart bundle.

## Choose a metaphor

| Type | Natural encoding | Everyday use |
| --- | --- | --- |
| `rainbow` | Seven arcs × seven days; intensity encodes value | Seven-week habits, attendance, activity |
| `garden` | Ten dated leaves per plant; intensity encodes value | Monthly habits and daily rituals |
| `forest` | Tree height on a shared linear scale from zero | Category totals, weekly focus hours |
| `river` | Smooth area with observation points and numeric axes | Usage, creative output, daily trends |
| `bloom` | Petal length beyond a central disk | Wellbeing and skill profiles |
| `mountain` | Linear ridgeline with numeric axes | Demand, activity, changing workloads |
| `tide` | Water height as a fraction of a target | One reading, savings, or capacity goal |
| `rings` | Arc angle as a fraction of each target | Several independent goals |
| `seed-ledger` | Countable seed units and fractions | Tasks, attendance, inventory |
| `waterline` | Water height against capacity and thresholds | Resource reserves, capacity alerts |
| `sundial` | Clock-time arcs with tracks | Daily schedules and routines |
| `season-wheel` | Actual date intervals around a year | Planting, releases, annual plans |
| `phenology` | Observed dates versus expected windows | Plant journals, readiness milestones |
| `lunar-cycle` | Abstract cycle position and separate value stems | Recurring creative/review routines |
| `water-clock` | Remaining water from elapsed/remaining duration | Focus sessions, time allowances |
| `balance` | Two shared-scale bars and directional tilt | Replenishment versus consumption |
| `cord-ledger` | Countable knots on grouped cords | Team contributions, grouped quantities |
| `growth-history` | Successive layers by thickness or area | Contributions over time |
| `tidal-rhythm` | Explicit positions across aligned cycles | Repeated demand, daily rhythms |
| `star-cycle` | Angular checkpoints with value intensity | Recurring reviews, maintenance |

Rainbow always contains 49 consecutive dates. Garden defaults to the number of days in the starting month: 28–30 dates produce three plants, and the 31st day adds a fourth sprout. `days` can explicitly select 1–31 dates. Dates use UTC calendar arithmetic. A missing date becomes `null`, which is distinct from zero. A week begins on `startDate`, rather than automatically snapping to a weekday.

## Options and API

Open `/docs/` for the searchable documentation site and live examples. New temporal inputs use `IntervalPoint` and `StagePoint`; cycles extend numeric data with explicit positions. Sundial is a clock-time schedule, Lunar Cycle and Star Cycle are abstract cycles, and Tidal Rhythm is not a tide forecast.

See the [full API reference](docs/API.md) for all properties, methods, data validation rules, themes, keyboard interactions, extension API, and framework integration guidance.

Common options:

```ts
{
  type: 'forest',
  data: [{ label: 'Focus', value: 6 }],
  theme: 'meadow',            // meadow | ocean | autumn | twilight | custom palette
  title: 'Weekly focus',
  description: 'Focus hours by weekday',
  unit: 'h',
  max: 10,                    // fixed scale, must cover every value
  target: 100,                // Tide/Rings default; points may override
  detail: 'natural',          // natural | essential; both are pure SVG
  animate: true,              // respects prefers-reduced-motion
  interactive: true,         // persistent reading + previous/next/clear/table controls
  showTable: false,           // always available to screen readers
  formatValue: value => value.toFixed(1),
  onSelect: (point, index) => {},
}
```

`createChart(container, options)` is equivalent to `new NaturePlot(container, options)`. `update(partialOptions)` and `setTheme(theme)` return the instance. Invalid updates leave the previous chart intact. `chart.data` returns a defensive copy of normalized observations.

## Fifty natural forms

The [complete chart catalog](docs/CHART_CATALOG.md) explains each encoding. The thirty newest charts cover distributions, resource flows, hierarchies, paired comparisons, uncertainty, event timing, trajectories, and spatial fields. Their [research and design plan](docs/FIFTY_CHARTS_PLAN.md) records sources and the distinct purpose of each chart.

Charts keep a minimum SVG width of 640px in a scrollable container so small screens do not shrink labels into unreadable text. The site uses 16px body text and larger controls. Click/tap a mark to retain its reading, step through observations, clear selection, or open the data table. Set `interactive: false` for decorative examples.

## Accessibility and data integrity

- Every observation is keyboard focusable through roving focus. Tab enters a chart; arrows move through its marks; Home/End jump; Enter/Space select; Escape clears selection. Previous/Next buttons provide an alternative to pointing at marks.
- Tooltips and an accessible HTML data table expose exact labels, dates, values, and targets. Visible numeric axes accompany the Cartesian charts. `showTable: true` makes the exact table visible to everyone.
- SVG title/description and per-mark labels explain each encoding. Theme colors do not replace accessible values.
- Animation obeys reduced-motion preferences. No ambient, perpetual animation.
- User strings are rendered using DOM text APIs. Invalid dates, non-finite values, duplicate calendar dates, out-of-window dates, and unsuitable negative values are rejected.
- River, Mountain, and Tidal Rhythm preserve negative data and break their paths at missing values. Several Living systems charts also support signed readings; each guide states its contract. Tide accepts only one observation. Bloom accepts at most 12 dimensions.

## Limits and appropriate use

These charts suit dashboards, reflective tools, habit trackers, and storytelling. Petal area and tree width are decorative; compare petal length and tree height. Ring circumferences differ; compare percentages or arc angles. Rainbow colors identify weeks while opacity carries quantity, so color-only comparisons across arcs are approximate. Exact values are always available.

This release renders up to 1,000 observations per chart. Dense data, long labels, and many ring goals are better aggregated for legibility. Category labels may be shortened or sampled; accessible labels and the data table retain full text. River and Mountain space observations evenly; use explicit labels or aggregate into equal time intervals. Tidal Rhythm instead uses explicit positions within up to four supplied cycles. Sediment adds stacked composition. There is no pan/zoom or arbitrary multi-series overlay; selection announcements are built in, while streaming announcements belong to the application.

The library is DOM-based; instantiate after mount in React/Vue/Svelte and call `destroy()` on unmount. Importing the module is safe on a server, but constructing charts requires a browser. The renderer API expects trusted application code. Custom palettes accept 3- or 6-digit hex colors; test their contrast in your application. Accessibility support has automated and browser checks, but is not a substitute for testing your complete product with assistive technology.

## Project layout

- `src/` — public API, types, palettes, geometry, validation, fifty renderers
- `src/ecology.ts`, `src/ecology-catalog.ts`, `src/ecology-validation.ts` — thirty further encodings and their contracts
- `src/instruments.ts` — twelve research-inspired charts
- `src/readings.ts` — exact numeric, interval, stage, and cycle readings
- `demo/` and `index.html` — gallery and interactive playground
- `demo/docs/` and `docs/index.html` — 64 documentation pages, live examples, fuzzy search, and responsive navigation
- `demo/appearance.ts` — shared system-aware light/dark appearance, persisted across the site
- `tests/` — unit and DOM integration tests
- `docs/API.md` — API and extension reference
- `PLAN.md` — design rationale, acceptance criteria, follow-on scope
- `docs/NATURE_RESEARCH.md` — sourced research on historical and natural measurement, with proposed chart directions
- `dist/` — generated package files
- `docs/DOCUMENTATION_DESIGN.md` — documentation design references and implementation notes
- `docs/THIRD_PARTY.md` — website dependency license notices
- `site/` — generated static showcase and documentation

## License

[MIT](LICENSE).
