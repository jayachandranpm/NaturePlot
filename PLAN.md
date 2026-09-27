# NaturePlot.js — design and implementation plan

## Purpose

Make everyday data feel alive through useful, legible natural metaphors. Nature is the encoding, not decoration applied to an unrelated chart. Deliver a reusable, framework-independent JavaScript library and an interactive reference application.

## Release scope

| Type | Encoding | Appropriate use | Constraints |
| --- | --- | --- | --- |
| Rainbow | Seven concentric arcs represent weeks; seven segments represent days. Color intensity encodes daily values. | 49-day activity, practice, or wellbeing history | Uses actual consecutive dates; empty days are distinct from zero. |
| Garden | Three stems carry ten leaves each. Leaf color intensity encodes a day; a fourth stem holds overflow days. | Month calendars, habit or attendance tracking | Supports 28–31 days; actual dates and weekday labels are available on focus. |
| Forest | Tree height uses a common zero baseline and linear scale. | Category comparisons, weekly totals | Nonnegative data; silhouette width is decorative, not a second measure. |
| River | A filled curve connects observations on a linear numeric scale. | Daily trends and usage | Supports negative values with a zero baseline. |
| Bloom | Petal length uses a common radial scale. | Comparing several nonnegative dimensions | Length, not petal area, encodes value; useful for profiles, not part-to-whole. |
| Mountain | A straight ridgeline joins observations on linear axes. | Demand, workload, and activity | Supports negative values; peaks represent observations, not fabricated smoothing. |
| Tide | Horizontal water height encodes percent of a target. | A single progress or capacity measure | Fill clamps at 100%, but text and accessible values preserve over-target results. |
| Rings | Circular arc length encodes each category's progress against a target. | Several independent goals | Different circumference means raw arc lengths should not be compared. |

## Architecture

- TypeScript source; dependency-free runtime, DOM and SVG APIs only.
- ESM and browser IIFE distributions, bundled type declarations, explicit package exports.
- One public `NaturePlot` instance with `update`, `setTheme`, `toSVG`, `download`, and `destroy`; a `createChart` helper and named exports.
- Typed options, chart metadata, four curated palettes, and a documented renderer registry to add new metaphors.
- Shared safe DOM construction, numeric/date validation, scales, SVG geometry, labels, axes, legends, focusable marks, and tooltips.
- Responsive SVG viewBox, stable instance IDs, scoped styles, and local DOM ownership. No global CSS reset or HTML interpolation with user data.
- UTC calendar arithmetic and ISO date validation avoid daylight-saving and month-boundary errors.
- Data updates validate before replacing a chart. Empty data, zero values, missing days, and overflow are explicit.
- Exact values available through tooltips, keyboard focus, and an accessible data table. Reduced motion and accessible color contrast are baseline requirements.
- No telemetry, network requests, or framework dependency in the runtime.

## API outline

```js
import { NaturePlot } from 'natureplot';

const chart = new NaturePlot('#chart', {
  type: 'garden',
  title: 'A month of small steps',
  theme: 'meadow',
  startDate: '2026-09-01',
  days: 30,
  data: [{ date: '2026-09-01', value: 8 }],
  onSelect: point => console.log(point),
});

chart.update({ data: nextMonth });
chart.setTheme('ocean');
chart.download('my-garden.svg');
chart.destroy();
```

## Showcase

An editorial botanical style: warm paper, deep green, spacious cards, expressive serif headings, concise copy, and custom vector botanical details. The homepage features all eight live charts. A playground exposes chart type, theme, sample data, numeric editing, exact data, copyable usage, and SVG export. A getting-started section explains installation and the API. Desktop and mobile navigation must work.

## Implementation stages

1. **Plan:** record mappings, public contract, boundaries, and acceptance criteria before implementation.
2. **Core:** implement types, validation, helpers, themes, registry, renderers, lifecycle, interactions, and export.
3. **Experience:** implement gallery, presets, playground, editable data, documentation, and responsive styles.
4. **Verification:** test geometry semantics, calendar edge cases, invalid input, lifecycle cleanup, custom rendering, escaping, and export. Typecheck, production build, inspect packed files, and check the showcase in a real browser.

## Acceptance criteria

- Every gallery card is rendered through the published library API.
- Seven-week rainbow has exactly 49 dated cells. A 30-day garden has exactly three stems and 30 dated leaves.
- Every displayed value can be inspected without relying on color alone.
- Switching type, theme, and data is functional; data edits change chart values; downloaded SVG is self-contained.
- Library works without showcase CSS, works from ESM and a script tag, and produces type declarations.
- Invalid input produces actionable errors without corrupting an existing chart.
- Keyboard interactions and reduced-motion preferences are respected; narrow layouts do not overflow.
- README includes examples, all options and methods, extension guidance, limitations, and local development commands.

## Follow-on work

React/Vue wrappers, time-series pan/zoom, comparative series, localization, additional natural encodings, and user-tested screen-reader experiences can follow the first release. These are not implied to be delivered in this implementation. Public npm publication requires a separate release decision.

## Completion record — 2026-09-21

- All four implementation stages are complete. Eight renderers share the same framework-independent API and power the showcase.
- The library and showcase typecheck and production builds pass.
- 31 semantic and DOM tests pass, including calendars, negative trends, input validation, updates, keyboard selection, export serialization, and download URL cleanup.
- Built ESM and browser IIFE smoke tests pass. A NodeNext TypeScript consumer resolves the packaged declarations.
- Browser checks cover all eight chart types, category filters, chart selection, all main playground views, theme updates, data editing, error recovery, code copying, and responsive stacking. The mobile overflow found during inspection was corrected.
- SVG content and download wiring are verified in tests. The in-app browser displayed the export confirmation but did not expose a download event to the browser test tool; a saved-file download was not independently confirmed there.
- The installable `natureplot-0.1.0.tgz` archive includes runtime bundles, declarations, API documentation, README, and MIT license. Public npm publication remains a separate release step.

## Research-led next direction — 2026-09-21

A sourced follow-up brief is available in [Nature as a measuring instrument](docs/NATURE_RESEARCH.md). It connects historical and natural measurement mechanisms to proposed chart encodings, while distinguishing documented evidence from modern design inventions. Recommended next additions: Seed Ledger, Waterline, Sundial (schedule mode), and Season Wheel (calendar mode). These are planned additions; the v0.1.0 renderer inventory is unchanged.

## Completion record — v0.2.0

All twelve concepts in the research brief are now implemented, bringing the library to twenty chart types. See the [remaining charts plan](docs/REMAINING_CHARTS_PLAN.md) for their input contracts and acceptance criteria.

- Added typed intervals, observed stages, cycle positions, threshold readings, grouped ledgers, and two growth encodings through the existing API.
- All twenty charts have live gallery examples, editable playground data and settings, searchable guides, keyboard selection, exact data tables, and SVG export. The documentation now contains thirty-four pages.
- 108 tests pass, covering quantitative geometry, temporal boundaries, missing data, validation, safe updates, documentation, and existing behaviors. Typechecks and production builds pass. ESM and browser IIFE smoke checks instantiate all twenty charts; a NodeNext consumer verifies the declarations.
- Browser checks cover all twelve additions, sample regeneration, data tables, settings updates and error recovery, global search, dark/light palettes, and mobile layouts without horizontal page overflow. A New charts filter and direct playground links make the additions easy to explore.
- Sundial is a clock schedule; Lunar Cycle and Star Cycle use application-defined cycles. Scientific astronomical calculations and public npm publication remain outside this release.


## Completion record — v0.3.0

Delivered the [fifty-chart plan](docs/FIFTY_CHARTS_PLAN.md): thirty distinct additional charts, shared observation controls across all fifty, readable minimum chart sizing, larger site/docs text, gallery search, and thirty new documentation guides. The source-linked research covers historical natural measurement, biomimicry, environmental records, and spatial fields. See [the catalog](docs/CHART_CATALOG.md) for every purpose and encoding. All 301 tests, typechecks, builds, and fifty-chart bundle checks pass; desktop/mobile browser checks confirm the expanded experience.

## Quality review — v0.4.0

Revisited all fifty encodings and added chart-specific purpose, limitations, and alternatives. Corrected quantitative edge cases, planar aspect ratios, zero-area rendering, shared-target readings, SVG export semantics, and hidden-table scrolling. Refined vector materials, botanical detail, legends, and text contrast. See [the quality review](docs/QUALITY_REVIEW.md) for validation and compatibility details.

## Image-guided refinement — v0.4.1

1. Generate an original nature study with six distinct material/form references. Completed; prompt and provenance in docs/ART_DIRECTION.md.
2. Translate its detail into live SVG while preserving scales and measured bounds. Completed for Fern, Dew, Growth History, Coral Range, Nautilus, and Sundial; shared droplets also improve Root Tree and Migration.
3. Integrate the actual generated asset into an interactive specimen-to-chart study and the documentation. Completed.
4. Verify the full collection, package, keyboard controls, appearance, and responsive containment. See docs/QUALITY_REVIEW.md.


## Complete image-guided collection — v0.5.0

Completed the five-stage plan in [Fifty chart studies](docs/COMPLETE_ART_STUDIES.md). Four new generated atlases add 44 visual references to the original six. Every chart has a recorded art decision, meaningful use case, measurement boundary, specimen explorer entry, and documentation specimen. The earlier six treatments were reviewed and retained, with finer Sundial ticks; the other 44 renderers received distinct refinements.

The quantitative review corrected Pitcher stage widths and Wind Rose zero-area behavior. The library continues to export self-contained vector charts without raster dependencies. All 50 examples were reviewed in light and dark palettes, and all 50 explorer selections and observation controls were exercised in the browser. The full suite has 464 passing checks.
