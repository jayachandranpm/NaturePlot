# NaturePlot chart quality review

## Review plan

Review all 50 built-in charts against four questions:

1. **Purpose:** What question does it answer? Which comparison would this metaphor make harder?
2. **Measurement:** Does the stated encoding agree with the geometry? Preserve true zeros, distinguish missing data, retain exact readings, and use defensible domains.
3. **Craft:** Make the natural form recognizable with carefully drawn vector detail, readable scales and restrained material shading. Decorative detail must never move a measured endpoint or inflate a quantity.
4. **Use:** Exercise empty, zero, missing, small-magnitude, normal, and invalid data; verify keyboard/touch selection, exports, light/dark appearance, and mobile containment.

The deliverable is an improved library, explicit selection guidance for every chart, and regression tests for findings. NaturePlot is a collection of bounded visual encodings, not a universal replacement for conventional charts. Hand-authored, data-driven SVG preserves exact geometry and interactive records; generated bitmap artwork is not used as a data mark.

## Review findings and resolutions

Released locally as **v0.4.0**.

- **Purpose:** Every built-in now exposes `chartGuidance`: a distinct best-fit question, caveat, and alternative. The playground and all fifty documentation guides display it; the selection guide compares all fifty purposes. The Leaf Veins sample now compares one unit across teams instead of mixing unrelated measures.
- **Domains:** Automatic positive maxima use the data magnitude rather than flooring fractional values at one. All-zero histogram and stacked domains begin at zero. Migration and Isobar preserve equal coordinate scale, avoiding distorted angles and distances.
- **Zeros and missing observations:** Zero-sized dots receive hollow location symbols; missing dots use dashed symbols. Invisible hit areas make small dots and network threads easier to inspect. Cairn, Glacier, and flow nodes no longer inflate zero amounts into positive rectangles. Mycelium preserves positive weight ratios and differentiates zero from missing links with dash patterns.
- **Goals:** Cairn's geometry, tooltip, and exact table consistently use the one chart-level target.
- **Legends:** Dew now explains bubble area numerically; Wind Rose labels its radial values; Isobar keys the contour levels; Sediment names each layer; Dune states its common height scale. Calendar intensity legends show endpoints and the missing-data status.
- **Artwork:** Added botanical veins and branch detail, gentle SVG pigments, water-droplet highlights, shell chambers, lotus petal guides, and crystal facets. Frost uses an explicit blue/orange diverging key. Labels on filled leaves and cells choose contrasting ink; formerly pale numeric text now uses readable text colors. Decorative geometry does not alter measured endpoints, areas, or lengths.
- **Interaction:** Sediment and Dune emphasize the selected track. Persistent readings retain full precision even where visual labels use compact notation. A hidden HTML table no longer increases the chart's scroll height; this fixes selection-driven vertical jumps. Tooltips account for horizontal scroll position.
- **Export:** Downloaded SVGs are standalone static images with local paint servers, without dangling tooltip references, button roles, or interactive selection dimming.

## Boundaries and compatibility

Rings now permits 8 goals and Forest 24 categories, preventing unusably dense layouts. Numeric magnitudes in built-ins must be zero or within 1e-100 through 1e100; rescale more extreme units before plotting. The original twenty renderers now follow the same bounded magnitude policy as the thirty Living systems charts. Custom renderers keep generic finite-value validation.

NaturePlot still uses a readable minimum SVG width of 640px and local horizontal scrolling on narrow screens. Dense networks, arbitrary-depth hierarchies, astronomical calculations, geographic projections, inference, and statistical estimation are outside these renderers. Sample datasets are illustrative.

## Verification

- **411 passing tests**, including 110 quality-review regressions. All fifty charts exercise valid zero, empty, missing (or explicit rejection), and all four named palette states. Forty-eight continuous-valued charts also exercise very small quantities; Frost and Bamboo retain their specialized correlation/integer domains.
- Targeted assertions verify bubble-area ratios, spatial aspect ratio, zero histogram bars, shared Cairn targets, exact fractional domains, network width ratios, zero waterfall steps, series emphasis, atomic validation, and SVG reference integrity.
- TypeScript, library build, static site build, all fifty ESM and browser-bundle package cases, and NodeNext consumer types pass.
- Browser review covered the fifty exported sample drawings, all fifty live-chart label bounds, dark appearance, selection, series emphasis, chart guidance, and mobile page containment. The hidden-table fix was checked against actual client/scroll heights. Desktop sample labels remain within their SVG boundaries. These checks are not a claim of exhaustive validation of every possible input or a formal accessibility certification.
- `npm run review:charts` recreates the fifty-chart SVG contact sheets after building, at `/review/1.html` through `/review/5.html` on the preview server.

## Chart-by-chart purpose review

The matrix below records the decision guidance added for each reviewed chart. The shared checks above apply to every row; each renderer also retains its existing schema-specific tests.


| Chart | Best for | Limitation | Alternative |
| --- | --- | --- | --- |
| Rainbow | Find consistent days across a 49-day habit or activity log. | Different arc lengths make area comparisons unreliable. Read intensity within a date, not arc area. | Garden |
| Garden | Review a month of daily routines, practice, or contributions. | Leaf position follows consecutive dates, not weekday columns. Intensity is better for patterns than close numeric comparisons. | Forest |
| Forest | Compare a small set of category totals in the same unit. | Read tree height from zero. Crown area and branching do not measure additional quantities. | Seed Ledger |
| River | Follow an ordered series with a gentle visual rhythm. | Observations are equally spaced, even when date labels are irregular. The curve is an interpolation, not a forecast. | Mountain |
| Bloom | Compare a handful of dimensions sharing one unit and scale. | Petal area is decorative. Use Lotus for different targets, or Forest for precise ranking. | Forest |
| Mountain | Find peaks and troughs in ordered observations. | Horizontal distance means observation order, not elapsed time. Missing values break the slope. | Tidal Rhythm |
| Tide | Communicate progress toward one positive goal. | Water height, not the area of the circular vessel, encodes progress. Above-goal values require the exact reading. | Waterline |
| Rings | Track up to eight independent goals with different targets. | Compare sweep angles or percentages. Outer rings have longer circumferences and do not imply more progress. | Lotus |
| Seed Ledger | Make small counts and fractional quantities tangible. | Read the stated denomination: large quantities are bundled. These seeds are not always one unit each. | Forest |
| Waterline | Monitor a capacity against user-defined thresholds. | The vessel saturates at capacity. Exact text retains an overflow; thresholds do not imply automatic alerts. | Tide |
| Sundial | Plan activities inside one clock day, including simultaneous lanes. | This is a 24-hour clock-time schedule, not a solar calculation. Split intervals that cross midnight. | Daylight |
| Season Wheel | Compare annual windows, seasons, or project phases. | Arc distance uses actual Gregorian dates. Split intervals crossing the selected year; this is not an ancient calendar reconstruction. | Phenology |
| Phenology | Compare observed milestones with expected date windows. | Undated stages remain pending. The chart does not predict when a stage will occur. | Season Wheel |
| Lunar Cycle | Place recurring activity within an explicitly defined cycle. | Moon shapes illustrate abstract phase. They do not show observed lunar phase or a medical prediction. | Star Cycle |
| Water Clock | Show elapsed or remaining time in a single duration snapshot. | It is a calibrated visual vessel, not a running timer or a physical model of water flow. | Tide |
| Balance | Compare two nonnegative quantities and their difference. | The bars measure amounts; beam tilt only indicates direction. Decorative stones are not countable units. | Leaf Veins |
| Cord Ledger | Count contributions organized into a few named teams. | Keep each team contiguous. Knots use a shared denomination and do not reconstruct a historical writing system. | Seed Ledger |
| Growth History | Show known contributions accumulated in chronological order. | Choose thickness or area explicitly. Later rings have longer circumferences; read the companion bars for direct comparisons. | Glacier |
| Tidal Rhythm | Compare multiple observed cycles on a common position axis. | Cycle length and positions are supplied. The chart does not detect periodicity or predict tides. | Echo |
| Star Cycle | Place checkpoints around a repeating cycle. | Angle measures cycle position and brightness measures value; star area has no quantitative meaning. | Nautilus |
| Honeycomb | Compare activity for a small row-by-column matrix. | Absent cells are unmeasured, not zero. Use exact readings when small intensity differences matter. | Forest |
| Mycelium | Explore a small directed network with weighted connections. | Node positions are a layout, not distance or importance. Large networks need a dedicated graph tool. | Estuary |
| Root Tree | Trace a compact taxonomy or ownership hierarchy. | Each node measures its own value, not its subtree. Multiple roots are allowed; layout order does not rank importance. | Canopy |
| Canopy | Compare positive parts of a total within two grouping levels. | Zero parts have no area. Compare narrow cells with the inspector; this is not an arbitrary-depth treemap. | Phyllotaxis |
| Fern | Find high-impact categories and their cumulative share. | Display order is descending. The spores use a separate percentage scale from the frond lengths. | Forest |
| Phyllotaxis | Explain how a whole is divided among several categories. | 120 seed positions approximate proportions with rounding. Small shares can receive no dot; the table retains the exact value. | Canopy |
| Leaf Veins | Compare before and after across several measures in the same unit. | Both endpoints share a scale. Filled leaf area does not measure the change; missing new values retain the baseline only. | Forest |
| Lotus | Compare performance against a different target on each axis. | Axis order changes the polygon. It is not an overall score; values beyond 100% are preserved in exact readings. | Rings |
| Petal Box | Compare medians and supplied quartile summaries. | Whiskers are supplied bounds, not automatically calculated outliers or confidence intervals. | Murmuration |
| Raincloud | Compare frequencies across supplied numeric bins, including unequal widths. | Read area as frequency and height as density. Bin choices come from your analysis; no density estimate is fitted. | Pebble |
| Dew | Explore two measurements and an optional size variable. | Droplet area encodes weight. Overlap can obscure records; correlation does not establish cause. | Echo |
| Wind Rose | Compare amounts across 4, 8, or 16 compass directions. | Sector area encodes value, so radius is nonlinear. Directions must be evenly spaced and ordered clockwise. | Forest |
| Dune | Compare frequency profiles across up to four cohorts. | Ridge heights are supplied frequencies on a shared scale, not fitted densities. Nulls break the ridge. | Petal Box |
| Glacier | Explain how signed changes produce a final running total. | Changes must be known. Missing steps would make every subsequent total unknowable. | Growth History |
| Sediment | Read changing composition across aligned numeric positions. | Only the bottom layer has a flat baseline. Use Dune to compare individual profiles directly. | Dune |
| Delta | Explain one budget or supply split among destinations. | Ribbon width measures amount; branch position has no geographic meaning. Zero flows have no width. | Canopy |
| Estuary | Follow transfers from several sources to several destinations. | It is a two-column flow diagram, not a general multi-stage Sankey. Source and destination sets are distinct. | Mycelium |
| Pitcher | Find where a sequential funnel loses participants. | Counts must not increase. Retention is relative to the preceding stage; a zero denominator gives no percentage. | Forest |
| Firefly | Locate bursts and gaps in event streams. | Position is supplied event time; glow shows magnitude. Coincident events may overlap and remain in the inspector. | Honeycomb |
| Migration | Follow an ordered route through planar coordinates. | Coordinates use equal physical scale on both axes. This is not a geographic projection, and arrows do not infer unsupplied stops. | Dew |
| Murmuration | Compare raw observations across a few cohorts. | Vertical jitter has no numeric meaning. Crowded birds may overlap; use Petal Box for compact distribution summaries. | Petal Box |
| Coral Range | Compare estimates with explicitly supplied uncertainty bounds. | Bounds mean what your application defines. A displayed interval does not automatically imply statistical confidence. | Petal Box |
| Pebble | Read empirical percentiles without choosing bins. | Each sample has equal weight and ties share a cumulative height. This is not a fitted population distribution. | Raincloud |
| Nautilus | Preserve chronology across up to four repeating cycles. | Angle wraps at cycleLength; the spiral turn carries chronology. Radius itself is not a separate measurement. | Tidal Rhythm |
| Frost | Compare a supplied symmetric correlation matrix. | Correlation does not imply causation. The chart validates symmetry and range, not whether a matrix is statistically realizable. | Dew |
| Echo | Look for relationships between adjacent ordered readings. | Pairs use one observation of lag, not a fixed elapsed duration. A diagonal is equality, not a fitted trend. | River |
| Cairn | Show individual contributions toward one shared goal. | Stone height measures contribution; width is decorative. All contributors use the chart-level target. | Rings |
| Daylight | Compare opening and closing times across dated observations. | Times are supplied in a common local clock convention. The chart does not calculate sunrise or timezone shifts. | Sundial |
| Isobar | Explore equal-value contours in a small complete rectangular grid. | Contours interpolate within triangles and are not new measurements. Coordinate axes preserve equal scale; no extrapolation is made. | Dew |
| Bamboo | Inspect a small sample of integer scores without hiding original values. | Only integers from 0 to 99 are supported. A stem is tens and a leaf is units; repeated digits are distinct observations. | Pebble |

## v0.4.1 — Image-guided art direction

Generated an original six-specimen nature atlas and saved the exact generation prompt in [ART_DIRECTION.md](./ART_DIRECTION.md). The atlas is embedded in a keyboard-operable specimen picker beside real chart examples, and appears in the documentation field notes. It is identified as generated visual inspiration rather than scientific evidence.

Translated the reference into measured vector geometry: compound fern pinnae, a labeled Fern amount scale, secondary droplet reflections, bark and engraving for Growth History, tapered Coral Range branches confined to the interval, softly filled Nautilus chambers, and a textured Sundial face. Shared droplet rendering also improves Root Tree and Migration. None of these treatments adds a raster dependency to the package or changes data schemas.

All 411 automated checks pass after the artwork changes. TypeScript checks and production builds pass.

## v0.5.0 — All fifty nature studies

The image-guided review now covers the full collection. Four new atlases contain 44 specimens, joined by the six original references. All 50 chart guides include the natural form, the applied vector treatment, and its measurement boundary. The explorer groups the collection into five families and supports direct links to every study. Exact prompts, saved assets, and the chart-by-chart decisions are recorded in [COMPLETE_ART_STUDIES.md](./COMPLETE_ART_STUDIES.md).

Refinements include clipped leaf veins, needle sprays, water currents, sand and rock engraving, ice fractures, glass and vessel rims, braided cords, seed seams, directional birds, and crystal branches. The six previously reviewed treatments remain, with finer Sundial reference ticks. Engraving does not create extra interactive marks or add raster assets to chart exports.

Two measurement defects found during the review were corrected:

- **Pitcher:** a fixed outward bulge made stage widths non-proportional and gave zero stages a painted width. Positive stages now use exact proportional chamber widths; zero stages have only a hollow inspection marker.
- **Wind Rose:** a minimum radius assigned positive area to zero and very small values. Sector radius now follows the square root of the actual value ratio without a floor. Zero and missing readings have distinct unfilled markers.

All 464 automated checks pass, including 50 dark SVG exports, exact specimen coverage, reference integrity, and regressions for those two geometry fixes. Browser verification covered all 50 light and dark examples, all 50 study switches, and observation selection on every chart. The narrow layout contains chart scrolling without page overflow. Native vector output, data tables, and keyboard controls remain available across the collection.

The v0.5.0 TypeScript checks, production builds, and ESM/browser-IIFE package checks pass for all 50 renderers. The local archive includes the complete review and prompts alongside the library and declarations.
