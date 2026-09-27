# NaturePlot 0.3 — fifty purposeful charts

## Delivery plan

Extend the twenty existing charts with thirty distinct encodings. Every addition must answer a different analytical question or require a meaningfully different data contract; a new silhouette alone does not qualify. Preserve existing APIs. Ship all fifty through the gallery, editable playground, searchable guides, exact readings and SVG export.

| New chart | Purpose and quantitative encoding |
|---|---|
| Honeycomb | Category × group heatmap; equal hexagons, value intensity |
| Mycelium | Directed weighted network; explicit source/destination relationships |
| Root Tree | Parent/child hierarchy; depth and topology, node area for quantity |
| Canopy | Grouped part-to-whole treemap; leaf area for contribution |
| Fern | Pareto priorities; descending lengths and cumulative percentage |
| Phyllotaxis | Composition in a sunflower seed head; 120 apportioned equal-area dots |
| Leaf Veins | Before/after paired change; two endpoints and a connecting vein |
| Lotus | Target-normalized multivariate profile; radial fractions |
| Petal Box | Five-number distribution summary; quartiles, median, whiskers |
| Raincloud | Supplied histogram bins; width and height encode interval and frequency density |
| Dew | Bubble scatter; x, value on y, optional weight as area |
| Wind Rose | Directional frequency; equal-angle sectors with area proportional to value |
| Dune | Grouped distribution ridgelines; supplied bin positions and frequency |
| Glacier | Signed waterfall; individual changes and running total |
| Sediment | Stacked composition over explicit positions; layers on a shared scale |
| Delta | One source split into destinations; conserved ribbon widths |
| Estuary | Many-to-many bipartite flow; source and destination totals |
| Pitcher | Sequential conversion funnel; non-increasing counts and stage retention |
| Firefly | Event raster; irregular positions by lane, intensity for magnitude |
| Migration | Ordered coordinate trajectory; route direction and stop size |
| Murmuration | Raw grouped observations; values on a shared axis with deterministic collision offsets |
| Coral Range | Estimate with uncertainty; low/high whiskers and central reading |
| Pebble | Empirical cumulative distribution; exact sample ranks, including ties |
| Nautilus | Multiple recurring cycles on one spiral; turns retain sequence |
| Frost | Signed symmetric correlation matrix; fixed −1 to +1 scale |
| Echo | Lag-one plot; each reading paired with its actual predecessor |
| Cairn | Contributions toward one common goal; stacked height and remaining gap |
| Daylight | Supplied daily sunrise/sunset windows; clock endpoints and duration by date |
| Isobar | Scalar field from a complete coordinate grid; interpolated contour segments |
| Bamboo | Stem-and-leaf distribution; each original integer remains individually inspectable |

## Evidence and interpretation

These are modern chart designs, not cultural reconstructions. Historical research informs how repeated processes, material records, and observed patterns become measurements. Biomimicry informs topology, modular cells, allocation, and information sensing. The library does not infer astronomical events, predict weather, optimize networks, or invent missing measurements.

Sources consulted:
- [NIST: early clocks](https://www.nist.gov/pml/time-and-frequency-division/popular-links/walk-through-time/walk-through-time-early-clocks): shadow and calibrated flow timekeeping.
- [Smithsonian: Marshallese stick chart](https://www.si.edu/object/stick-chart%3Anmnhanthropology_8503054): wave relationships recorded using sticks and shells; specifically Marshallese, not a generic pan-Pacific system.
- [AskNature: building a home](https://asknature.org/collection/how-does-nature-build-a-home/): hexagonal nest cells.
- [AskNature: Wild Creativity](https://asknature.org/collection/creatividad-silvestre/): adaptive slime-mold networks.
- [AskNature: xylem transport](https://asknature.org/strategy/xylem-conduits-transport-water/): connected conduits transport water through plants.
- [AskNature: bat echolocation](https://asknature.org/strategy/echolocation-pinpoints-target/): directional sensing from returning signals; Echo is a statistical analogy, not a sonar simulation.
- [USGS: water cycle](https://www.usgs.gov/water-science-school/water-cycle): stores and transfers motivate resource-flow charts.
- [NOAA: coral cores](https://flowergarden.noaa.gov/education/coralcores.html): growth bands as environmental records.
- [NPS: dunes](https://www.nps.gov/subjects/geology/aeolian-landforms.htm): wind-shaped accumulations inspire distribution silhouettes.
- [NPS: tree rings](https://www.nps.gov/articles/000/tree-rings.htm): linked growth records motivate ordered accumulation.
- [Met Office: synoptic charts](https://weather.metoffice.gov.uk/learn-about/weather/how-weather-works/synoptic-weather-chart): equal-pressure contour lines motivate scalar-field views.

## Shared interactions and readability

All fifty charts receive a visible inspector with previous/next observation controls, persistent click/tap/keyboard selection, clear selection, and a table toggle. Selected marks remain highlighted; exact details stay visible without hovering. Miniature decorative examples may opt out. Reduced motion is respected. Export remains a self-contained SVG.

Raise site body text to 16px, controls to 14px, and documentation body text to 16px. Keep chart SVGs at a readable minimum width inside their own scroll region on small screens; never shrink an entire labelled diagram into unreadable text. Increase small SVG labels and retain readable captions. Add gallery search and categories for the larger collection.

## Build and verification sequence

1. Record research and chart contracts (this document).
2. Add typed relationship, coordinate, paired and range fields with chart-specific validation.
3. Implement thirty renderers, each with exact marks and explicitly documented scales.
4. Add shared interactions and readable chart/site typography.
5. Add all samples, guides, navigation and gallery discovery; update release/API references.
6. Verify all fifty charts, quantitative semantics, bad input, selection controls, keyboard/table/export behavior, production bundles, and desktop/mobile browser layouts. Package locally; do not publish npm.

## Completion record

All thirty planned renderers are implemented; the built-in collection is exactly fifty. Each has a sample, runnable guide, documented encoding, input validation, exact readings, and SVG export. All fifty include the shared inspector. The site has sixty-four documentation pages, larger typography, ten chart categories, and gallery search.

301 tests pass, including per-chart selection controls, sample refreshes, geometry semantics, interval and hierarchy validation, missing data, constant scalar fields, tiny readings, and lifecycle cleanup. Typechecking, production builds, all-fifty ESM/IIFE package checks, and the NodeNext consumer check pass. Browser checks cover new-chart selection on mobile, gallery filtering, global documentation search, both appearances, and no page overflow. Chart-label boundary checks cover all fifty examples.

The package is a local v0.3.0 release. No npm publication or scientific prediction adapters are included.
