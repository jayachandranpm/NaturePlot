# NaturePlot v0.2.0 — complete the research collection

## Scope

Implement all twelve chart proposals in NATURE_RESEARCH.md, alongside the original eight. Deliver each renderer through the same library API, gallery, JSON playground, searchable documentation, keyboard interaction, exact data table, and SVG export.

| Chart | Quantitative contract | Input / bounds |
| --- | --- | --- |
| Seed Ledger | Countable seeds with an explicit denomination; fractions retain their exact value | Up to 6 nonnegative categories; at most 40 seeds per row, with labeled automatic bundling |
| Waterline | Linear height versus capacity, with explicit threshold markers | One nonnegative value and positive target; up to 6 thresholds within capacity |
| Sundial | Angular clock time and interval duration; separate tracks | HH:mm intervals within one day; up to 12 intervals and 4 nonoverlapping tracks; optional time cursor |
| Season Wheel | Angular position from actual dates within the selected Gregorian year | Date intervals with exclusive end; leap years; up to 12 intervals and 4 tracks |
| Phenology | Observed milestones and expected windows on a date axis | Up to 6 stages; missing observations remain unknown; optional explicit date domain |
| Lunar Cycle | Position in an abstract cycle; separate radial length for values | Up to 24 observations, explicit cycle length/positions; no ephemeris claims |
| Water Clock | Remaining water height versus an elapsed/remaining duration convention | One nonnegative value and positive duration; no automatic ticking |
| Balance | Shared-scale bars compare amounts; beam tilt is a directional cue | Exactly two nonnegative or missing values; signed right-minus-left difference |
| Cord Ledger | Countable knots on grouped cords with an explicit denomination | Up to 8 categories; labeled bundling; optional contiguous parent tracks |
| Growth History | Ordered annular layers; radial thickness or area encodes contribution | Up to 10 nonnegative periods; linked straight bars support comparison |
| Tidal Rhythm | Small-multiple cycles with a shared numeric scale and explicit positions | Up to 4 cycles, 48 points each; negatives and gaps; increasing positions per cycle |
| Star Cycle | Recurring checkpoints by angular position; intensity for value | Up to 24 observations; explicit cycle length and positions |

These are contemporary visualizations informed by the research, not reconstructed cultural artifacts. Scientific solar/lunar adapters remain a separate optional capability, consistent with the research roadmap.

## Implementation sequence

1. Add typed temporal and cycle inputs, measurement options, validation, defensive copying, and exact accessible metadata.
2. Build shared geometry helpers and twelve real renderers. Preserve the original eight APIs and behaviors.
3. Add distinct sample use cases, dynamic category counts, complete JSON examples, and safe option resets in the playground.
4. Add twelve documentation guides, option/data reference material, historical implementation status, and release notes.
5. Verify measurement semantics, dates and interval boundaries, missing data, fractions, bounds, atomic updates, and export. Build and inspect the library package and responsive browser experience.

## Acceptance criteria

- Every new chart has meaningful data encoding, a visible measurement key, and exact readings.
- Invalid temporal, quantity, and track data fails before replacing an existing chart.
- Input arrays, thresholds, and returned normalized data cannot mutate the existing chart.
- Day/year intervals do not silently wrap; interval ends are exclusive. Same-track overlaps are rejected.
- Missing values do not become zero, completed intervals, or observed milestones.
- Every example can switch themes, show its data, regenerate samples, and export standalone SVG.
- Existing consumers and all previous tests remain supported. Runtime stays free of dependencies and network requests.

## Completion

All twelve charts are implemented in v0.2.0. The collection contains twenty renderers and thirty-four documentation pages. All 108 tests, both production builds, ESM/browser bundle checks for every chart, and the TypeScript consumer check pass. Browser inspection covers all new charts, editable settings, sample regeneration, mobile layouts, documentation search, and both appearances.
