# The fifty-chart field guide

NaturePlot.js v0.4.0. Every chart has an explicit purpose, encoding, limitation, and alternative. All support themes, observation inspection, exact data tables, and standalone SVG export.

## 1. Rainbow (rainbow)

**Calendar.** Find consistent days across a 49-day habit or activity log.

**Encoding:** 7 arcs × 7 days. Color intensity represents the value; pale gray means no data.

**Read with care:** Different arc lengths make area comparisons unreliable. Read intensity within a date, not arc area.

See the API reference and live guide for input limits.

Alternative: Garden. Live guide: /docs/#/rainbow/fitness

## 2. Garden (garden)

**Calendar.** Review a month of daily routines, practice, or contributions.

**Encoding:** Each plant holds 10 consecutive dates. Leaf intensity represents value. A 31st day adds a sprout.

**Read with care:** Leaf position follows consecutive dates, not weekday columns. Intensity is better for patterns than close numeric comparisons.

See the API reference and live guide for input limits.

Alternative: Forest. Live guide: /docs/#/garden/fitness

## 3. Forest (forest)

**Comparison.** Compare a small set of category totals in the same unit.

**Encoding:** Tree height represents value on a shared linear scale starting at zero.

**Read with care:** Read tree height from zero. Crown area and branching do not measure additional quantities.

Up to 24 nonnegative categories.

Alternative: Seed Ledger. Live guide: /docs/#/forest/fitness

## 4. River (river)

**Trend.** Follow an ordered series with a gentle visual rhythm.

**Encoding:** Vertical position represents value. Curves pass through observations without overshoot; gaps remain gaps.

**Read with care:** Observations are equally spaced, even when date labels are irregular. The curve is an interpolation, not a forecast.

See the API reference and live guide for input limits.

Alternative: Mountain. Live guide: /docs/#/river/fitness

## 5. Bloom (bloom)

**Comparison.** Compare a handful of dimensions sharing one unit and scale.

**Encoding:** Petal length beyond the center represents value. Petal area is decorative, not a part-to-whole measure.

**Read with care:** Petal area is decorative. Use Lotus for different targets, or Forest for precise ranking.

See the API reference and live guide for input limits.

Alternative: Forest. Live guide: /docs/#/bloom/fitness

## 6. Mountain (mountain)

**Trend.** Find peaks and troughs in ordered observations.

**Encoding:** Each vertex is an observation on a linear scale. Straight slopes connect adjacent values.

**Read with care:** Horizontal distance means observation order, not elapsed time. Missing values break the slope.

See the API reference and live guide for input limits.

Alternative: Tidal Rhythm. Live guide: /docs/#/mountain/fitness

## 7. Tide (tide)

**Progress.** Communicate progress toward one positive goal.

**Encoding:** Water height represents the fraction of a target. Text preserves progress beyond 100%.

**Read with care:** Water height, not the area of the circular vessel, encodes progress. Above-goal values require the exact reading.

See the API reference and live guide for input limits.

Alternative: Waterline. Live guide: /docs/#/tide/fitness

## 8. Rings (rings)

**Progress.** Track up to eight independent goals with different targets.

**Encoding:** Arc angle represents percent of each target. Compare angles or percentages, not raw arc lengths.

**Read with care:** Compare sweep angles or percentages. Outer rings have longer circumferences and do not imply more progress.

Up to 8 nonnegative goal readings.

Alternative: Lotus. Live guide: /docs/#/rings/fitness

## 9. Seed Ledger (seed-ledger)

**Comparison.** Make small counts and fractional quantities tangible.

**Encoding:** One seed represents a labeled denomination. Filled seed area represents a fractional unit; rows preserve exact totals.

**Read with care:** Read the stated denomination: large quantities are bundled. These seeds are not always one unit each.

See the API reference and live guide for input limits.

Alternative: Forest. Live guide: /docs/#/seed-ledger/fitness

## 10. Waterline (waterline)

**Progress.** Monitor a capacity against user-defined thresholds.

**Encoding:** Water height represents value on a linear zero-to-capacity scale. Dashed lines mark supplied thresholds. Fill caps at capacity; exact values remain.

**Read with care:** The vessel saturates at capacity. Exact text retains an overflow; thresholds do not imply automatic alerts.

See the API reference and live guide for input limits.

Alternative: Tide. Live guide: /docs/#/waterline/fitness

## 11. Sundial (sundial)

**Timeline.** Plan activities inside one clock day, including simultaneous lanes.

**Encoding:** Angle represents 24-hour clock time. Arc extent represents duration. This is a schedule dial, not a physical sundial or solar calculation.

**Read with care:** This is a 24-hour clock-time schedule, not a solar calculation. Split intervals that cross midnight.

See the API reference and live guide for input limits.

Alternative: Daylight. Live guide: /docs/#/sundial/fitness

## 12. Season Wheel (season-wheel)

**Calendar.** Compare annual windows, seasons, or project phases.

**Encoding:** Angle represents date within the selected year; arc extent represents duration. Month lengths and leap days are respected. No astronomical solar terms are calculated.

**Read with care:** Arc distance uses actual Gregorian dates. Split intervals crossing the selected year; this is not an ancient calendar reconstruction.

See the API reference and live guide for input limits.

Alternative: Phenology. Live guide: /docs/#/season-wheel/fitness

## 13. Phenology (phenology)

**Timeline.** Compare observed milestones with expected date windows.

**Encoding:** Horizontal position represents date. Sprouts mark observed dates; shaded spans show expected windows; empty circles mean not observed.

**Read with care:** Undated stages remain pending. The chart does not predict when a stage will occur.

See the API reference and live guide for input limits.

Alternative: Season Wheel. Live guide: /docs/#/phenology/fitness

## 14. Lunar Cycle (lunar-cycle)

**Cycle.** Place recurring activity within an explicitly defined cycle.

**Encoding:** Angle represents cycle position; outer stem length represents value. Moon symbols are illustrative and do not encode completion or calculate lunar phase.

**Read with care:** Moon shapes illustrate abstract phase. They do not show observed lunar phase or a medical prediction.

See the API reference and live guide for input limits.

Alternative: Star Cycle. Live guide: /docs/#/lunar-cycle/fitness

## 15. Water Clock (water-clock)

**Progress.** Show elapsed or remaining time in a single duration snapshot.

**Encoding:** Water height represents remaining duration in a constant-area vessel. Input convention is explicitly elapsed or remaining. This chart is a snapshot, not a timer.

**Read with care:** It is a calibrated visual vessel, not a running timer or a physical model of water flow.

See the API reference and live guide for input limits.

Alternative: Tide. Live guide: /docs/#/water-clock/fitness

## 16. Balance (balance)

**Comparison.** Compare two nonnegative quantities and their difference.

**Encoding:** Bar lengths use one linear scale. Beam tilt indicates the direction of the difference only; stones are decorative. Difference is right minus left.

**Read with care:** The bars measure amounts; beam tilt only indicates direction. Decorative stones are not countable units.

See the API reference and live guide for input limits.

Alternative: Leaf Veins. Live guide: /docs/#/balance/fitness

## 17. Cord Ledger (cord-ledger)

**Comparison.** Count contributions organized into a few named teams.

**Encoding:** One knot represents a labeled denomination. Partial knot area represents a fraction. Parent tracks group contiguous cords. This is not a historical khipu decoder.

**Read with care:** Keep each team contiguous. Knots use a shared denomination and do not reconstruct a historical writing system.

See the API reference and live guide for input limits.

Alternative: Seed Ledger. Live guide: /docs/#/cord-ledger/fitness

## 18. Growth History (growth-history)

**Trend.** Show known contributions accumulated in chronological order.

**Encoding:** Layer order follows input chronology. Ring thickness or area, as configured, represents period contribution; linked bars use a shared linear scale. Unknown periods have no quantitative layer.

**Read with care:** Choose thickness or area explicitly. Later rings have longer circumferences; read the companion bars for direct comparisons.

See the API reference and live guide for input limits.

Alternative: Glacier. Live guide: /docs/#/growth-history/fitness

## 19. Tidal Rhythm (tidal-rhythm)

**Trend.** Compare multiple observed cycles on a common position axis.

**Encoding:** Horizontal position represents position within each supplied cycle. Vertical position uses a shared numeric scale across cycles. Lines connect observations; this does not predict tides.

**Read with care:** Cycle length and positions are supplied. The chart does not detect periodicity or predict tides.

See the API reference and live guide for input limits.

Alternative: Echo. Live guide: /docs/#/tidal-rhythm/fitness

## 20. Star Cycle (star-cycle)

**Cycle.** Place checkpoints around a repeating cycle.

**Encoding:** Angular position represents cycle position. Star intensity represents value; exact values and cycle positions remain available. The arrangement is an abstract checkpoint map.

**Read with care:** Angle measures cycle position and brightness measures value; star area has no quantitative meaning.

See the API reference and live guide for input limits.

Alternative: Nautilus. Live guide: /docs/#/star-cycle/fitness

## 21. Honeycomb (honeycomb)

**Comparison.** Compare activity for a small row-by-column matrix.

**Encoding:** Equal cells; intensity represents value. Rows are tracks; columns are labels.

**Read with care:** Absent cells are unmeasured, not zero. Use exact readings when small intensity differences matter.

Up to 6 tracks × 6 labels, one observation per pair. Nonnegative values or null; absent cells are unmeasured.

Inspiration: The modular hexagonal cells of bee and wasp nests.

Alternative: Forest. Live guide: /docs/#/honeycomb/fitness

## 22. Mycelium (mycelium)

**Relationship.** Explore a small directed network with weighted connections.

**Encoding:** Curved links connect source to destination; line width encodes weight. Nodes are identifiers, not quantities; long dashes mean zero and short dashes mean unknown weight.

**Read with care:** Node positions are a layout, not distance or importance. Large networks need a dedicated graph tool.

Up to 18 directed links and 10 nodes. source and destination are required, distinct, and unique as a pair. Nonnegative values or null.

Inspiration: Adaptive biological networks, including fungal and slime-mold networks; no optimization is computed.

Alternative: Estuary. Live guide: /docs/#/mycelium/fitness

## 23. Root Tree (root-tree)

**Relationship.** Trace a compact taxonomy or ownership hierarchy.

**Encoding:** Depth follows parent links; node area represents its own value, never an inferred subtree total.

**Read with care:** Each node measures its own value, not its subtree. Multiple roots are allowed; layout order does not rank importance.

Up to 16 uniquely identified nodes, 4 depth levels, and at most 5 nodes per level. id is required; parent must exist; cycles are rejected. Nonnegative values or null.

Inspiration: Branching root systems and plant transport networks.

Alternative: Canopy. Live guide: /docs/#/root-tree/fitness

## 24. Canopy (canopy)

**Composition.** Compare positive parts of a total within two grouping levels.

**Encoding:** Nested rectangles allocate area first to tracks, then to observations within each track.

**Read with care:** Zero parts have no area. Compare narrow cells with the inspector; this is not an arbitrary-depth treemap.

Up to 12 observations in at most 4 tracks. All quantities must be known and nonnegative. Zero-area contributions remain in the inspector.

Inspiration: A canopy partitioned into neighboring crowns; rectangular areas are a modern abstraction.

Alternative: Phyllotaxis. Live guide: /docs/#/canopy/fitness

## 25. Fern (fern)

**Comparison.** Find high-impact categories and their cumulative share.

**Encoding:** Descending frond lengths show values; spores on a second axis show cumulative share.

**Read with care:** Display order is descending. The spores use a separate percentage scale from the frond lengths.

Up to 8 known nonnegative quantities, sorted descending for display. Input indexes remain stable for callbacks.

Inspiration: A fern frond arranges repeated leaflets along a central stem.

Alternative: Forest. Live guide: /docs/#/fern/fitness

## 26. Phyllotaxis (phyllotaxis)

**Composition.** Explain how a whole is divided among several categories.

**Encoding:** 120 equal dots follow a golden-angle spiral. Largest-remainder allocation approximates each category share.

**Read with care:** 120 seed positions approximate proportions with rounding. Small shares can receive no dot; the table retains the exact value.

Up to 8 known nonnegative parts. Dots are rounded shares, not literal counts; exact totals remain in the table. All-zero data draws no allocated dots.

Inspiration: Repeated seed placement in plant heads; this is a mathematical packing metaphor, not a claim about every species.

Alternative: Canopy. Live guide: /docs/#/phyllotaxis/fitness

## 27. Leaf Veins (leaf-veins)

**Comparison.** Compare before and after across several measures in the same unit.

**Encoding:** Paired endpoints share one linear axis: baseline is the old reading and value is the new reading.

**Read with care:** Both endpoints share a scale. Filled leaf area does not measure the change; missing new values retain the baseline only.

Up to 6 observations. Every baseline must be finite. Signed readings and null new values are supported.

Inspiration: Veins connect two sides of a leaf; here they connect paired observations.

Alternative: Forest. Live guide: /docs/#/leaf-veins/fitness

## 28. Lotus (lotus)

**Progress.** Compare performance against a different target on each axis.

**Encoding:** Each axis is value / target, capped at 100%; a dashed ring is the goal. Polygon shape depends on axis order.

**Read with care:** Axis order changes the polygon. It is not an overall score; values beyond 100% are preserved in exact readings.

3–8 nonnegative readings. Each positive target falls back to chart target or 100. Null readings break the polygon. Over-goal values stay exact.

Inspiration: Radial arrangement of lotus petals; unlike Bloom, each axis has its own target.

Alternative: Rings. Live guide: /docs/#/lotus/fitness

## 29. Petal Box (petal-box)

**Distribution.** Compare medians and supplied quartile summaries.

**Encoding:** Whiskers span low–high; the petal body spans q1–q3; its line is the median (value).

**Read with care:** Whiskers are supplied bounds, not automatically calculated outliers or confidence intervals.

Up to 6 known summaries satisfying low ≤ q1 ≤ value ≤ q3 ≤ high. These are supplied extrema, not automatically computed outliers.

Inspiration: A seed pod opening around its center inspires the distribution silhouette.

Alternative: Murmuration. Live guide: /docs/#/petal-box/fitness

## 30. Raincloud (raincloud)

**Distribution.** Compare frequencies across supplied numeric bins, including unequal widths.

**Encoding:** Horizontal width is the bin interval. Height is frequency / bin width, so area represents frequency.

**Read with care:** Read area as frequency and height as density. Bin choices come from your analysis; no density estimate is fitted.

Up to 12 ordered, non-overlapping bins with low < high and known nonnegative frequencies. Gaps between bins remain gaps.

Inspiration: Rainfall falling from a cloud; frequency bars form the visible cloud profile.

Alternative: Pebble. Live guide: /docs/#/raincloud/fitness

## 31. Dew (dew)

**Relationship.** Explore two measurements and an optional size variable.

**Encoding:** x is horizontal; value is vertical; optional weight controls droplet area. Hollow markers mean zero weight; dashed markers mean missing values.

**Read with care:** Droplet area encodes weight. Overlap can obscure records; correlation does not establish cause.

Up to 40 readings with finite x. Signed values and null are supported. weight defaults to 1 and must be nonnegative. Missing readings sit in a separate rail.

Inspiration: Dew droplets provide small, distinct lenses onto individual observations.

Alternative: Echo. Live guide: /docs/#/dew/fitness

## 32. Wind Rose (wind-rose)

**Spatial.** Compare amounts across 4, 8, or 16 compass directions.

**Encoding:** Equally spaced compass sectors use area proportional to value, with north at the top and clockwise angles.

**Read with care:** Sector area encodes value, so radius is nonlinear. Directions must be evenly spaced and ordered clockwise.

4, 8, or 16 observations. angle must equal index × 360 / count. Nonnegative values or null. Values need not sum to 100.

Inspiration: Compass directions and observed winds; no weather predictions are generated.

Alternative: Forest. Live guide: /docs/#/wind-rose/fitness

## 33. Dune (dune)

**Distribution.** Compare frequency profiles across up to four cohorts.

**Encoding:** Each track has a ridge; position determines horizontal distance and height uses a common value scale.

**Read with care:** Ridge heights are supplied frequencies on a shared scale, not fitted densities. Nulls break the ridge.

Up to 4 tracks with 2–16 strictly increasing positions each. Nonnegative values or null; null breaks a ridge. Heights are supplied frequencies, not fitted densities.

Inspiration: Wind-shaped ridges in dune fields inspire the aligned silhouettes.

Alternative: Petal Box. Live guide: /docs/#/dune/fitness

## 34. Glacier (glacier)

**Trend.** Explain how signed changes produce a final running total.

**Encoding:** Floating ice steps show signed contributions; their endpoints track the running sum from zero.

**Read with care:** Changes must be known. Missing steps would make every subsequent total unknowable.

Up to 10 known signed changes. Unknown changes are rejected because later cumulative totals would be unknowable.

Inspiration: A stepped glacier landscape becomes a signed waterfall; it is not a glacier mass model.

Alternative: Growth History. Live guide: /docs/#/glacier/fitness

## 35. Sediment (sediment)

**Composition.** Read changing composition across aligned numeric positions.

**Encoding:** Layer thickness is value at each position; stacked boundaries show the total on one linear scale.

**Read with care:** Only the bottom layer has a flat baseline. Use Dune to compare individual profiles directly.

Up to 4 tracks sharing 2–16 identical increasing positions. All values must be known and nonnegative. Linear interpolation is visual, not extra observations.

Inspiration: Deposited layers preserve sequences; chart thickness represents supplied contributions.

Alternative: Dune. Live guide: /docs/#/sediment/fitness

## 36. Delta (delta)

**Composition.** Explain one budget or supply split among destinations.

**Encoding:** One incoming ribbon splits into outgoing ribbons. Each width is proportional to its quantity.

**Read with care:** Ribbon width measures amount; branch position has no geographic meaning. Zero flows have no width.

Up to 7 known nonnegative links sharing one source and distinct destinations. Zero links remain inspectable.

Inspiration: River deltas branch a main channel into distributaries.

Alternative: Canopy. Live guide: /docs/#/delta/fitness

## 37. Estuary (estuary)

**Relationship.** Follow transfers from several sources to several destinations.

**Encoding:** Bipartite ribbons have conserved widths; nodes show sums of their incident links.

**Read with care:** It is a two-column flow diagram, not a general multi-stage Sankey. Source and destination sets are distinct.

Up to 16 known nonnegative links with at most 5 sources and 5 destinations. Directed pairs must be unique. Left and right node sets are separate.

Inspiration: River and sea exchanges inspire a modern many-to-many flow diagram.

Alternative: Mycelium. Live guide: /docs/#/estuary/fitness

## 38. Pitcher (pitcher)

**Progress.** Find where a sequential funnel loses participants.

**Encoding:** Successive widths show remaining count relative to the first stage; labels show retention from the preceding stage.

**Read with care:** Counts must not increase. Retention is relative to the preceding stage; a zero denominator gives no percentage.

2–7 known nonnegative counts in non-increasing order. All-zero data has no measurable conversion percentage.

Inspiration: A pitcher plant’s narrowing chamber inspires the funnel silhouette.

Alternative: Forest. Live guide: /docs/#/pitcher/fitness

## 39. Firefly (firefly)

**Timeline.** Locate bursts and gaps in event streams.

**Encoding:** Horizontal position is event time; tracks separate event streams; glow intensity is magnitude.

**Read with care:** Position is supplied event time; glow shows magnitude. Coincident events may overlap and remain in the inspector.

Up to 60 events in at most 5 tracks. position is required and may be irregular. Nonnegative values or null. Coincident events remain separate in the inspector.

Inspiration: Brief firefly signals inspire discrete events, not an interpolated trend.

Alternative: Honeycomb. Live guide: /docs/#/firefly/fitness

## 40. Migration (migration)

**Spatial.** Follow an ordered route through planar coordinates.

**Encoding:** x and y locate each stop; arrows preserve input order; stop area represents value.

**Read with care:** Coordinates use equal physical scale on both axes. This is not a geographic projection, and arrows do not infer unsupplied stops.

2–20 known nonnegative readings, each with finite x and y. Coordinates are planar in the same unit, with equal scale on both axes; not projected latitude/longitude.

Inspiration: Animal migration inspires an ordered path; the chart does not infer a real route.

Alternative: Dew. Live guide: /docs/#/migration/fitness

## 41. Murmuration (murmuration)

**Distribution.** Compare raw observations across a few cohorts.

**Encoding:** Horizontal position represents value; vertical offsets separate nearby birds within each track and have no numeric meaning.

**Read with care:** Vertical jitter has no numeric meaning. Crowded birds may overlap; use Petal Box for compact distribution summaries.

Up to 60 signed readings in at most 4 tracks. Null values use a separate rail. Crowded points may overlap; use the inspector for every record.

Inspiration: A flock remains many individual birds; each mark preserves one observation.

Alternative: Petal Box. Live guide: /docs/#/murmuration/fitness

## 42. Coral Range (coral-range)

**Comparison.** Compare estimates with explicitly supplied uncertainty bounds.

**Encoding:** Branch endpoints mark low and high; the central polyp marks value on a common numeric scale.

**Read with care:** Bounds mean what your application defines. A displayed interval does not automatically imply statistical confidence.

Up to 6 observations with finite low ≤ value ≤ high. A null center is allowed within a known range. These bounds are not assumed to be confidence intervals.

Inspiration: Branching coral provides a range silhouette; bounds remain application-defined.

Alternative: Petal Box. Live guide: /docs/#/coral-range/fitness

## 43. Pebble (pebble)

**Distribution.** Read empirical percentiles without choosing bins.

**Encoding:** A right-continuous step shows the empirical cumulative distribution; ties share the fraction at or below that value.

**Read with care:** Each sample has equal weight and ties share a cumulative height. This is not a fitted population distribution.

Up to 60 known signed samples. All observations are retained, including ties. This is an empirical sample, not a fitted probability model.

Inspiration: Pebbles accumulate downstream; each reading contributes equally to cumulative probability.

Alternative: Raincloud. Live guide: /docs/#/pebble/fitness

## 44. Nautilus (nautilus)

**Cycle.** Preserve chronology across up to four repeating cycles.

**Encoding:** Angle represents position modulo cycleLength; spiral turn retains cycle number; dot area shows value.

**Read with care:** Angle wraps at cycleLength; the spiral turn carries chronology. Radius itself is not a separate measurement.

Up to 36 nonnegative readings, strictly increasing positions from 0 to less than 4 × cycleLength. cycleLength defaults to 12.

Inspiration: Successive shell chambers inspire a spiral timeline; no biological growth law is inferred.

Alternative: Tidal Rhythm. Live guide: /docs/#/nautilus/fitness

## 45. Frost (frost)

**Relationship.** Compare a supplied symmetric correlation matrix.

**Encoding:** Cells show values from −1 to +1; color distinguishes sign and intensity magnitude. Diagonal cells are one.

**Read with care:** Correlation does not imply causation. The chart validates symmetry and range, not whether a matrix is statistically realizable.

A complete symmetric matrix of 2–6 variables using track for row and label for column. Mirrored values must agree; symmetric null pairs are allowed.

Inspiration: A repeating crystalline lattice suggests symmetry; correlation never implies causation.

Alternative: Dew. Live guide: /docs/#/frost/fitness

## 46. Echo (echo)

**Relationship.** Look for relationships between adjacent ordered readings.

**Encoding:** Each point pairs the preceding value on x with the current value on y; a diagonal marks equality.

**Read with care:** Pairs use one observation of lag, not a fixed elapsed duration. A diagonal is equality, not a fitted trend.

2–40 signed observations. Nulls break pairs. The first record has no predecessor and is shown in the inspector rail. No significance or causality is inferred.

Inspiration: Returning sounds inspire comparison with what came before; this is not an echolocation model.

Alternative: River. Live guide: /docs/#/echo/fitness

## 47. Cairn (cairn)

**Progress.** Show individual contributions toward one shared goal.

**Encoding:** Stacked stone heights show contributions on a shared goal scale; the dashed line is the chart-level target, shared by every contributor.

**Read with care:** Stone height measures contribution; width is decorative. All contributors use the chart-level target.

Up to 8 known nonnegative contributions and a positive chart target (default 100). The scale expands for over-goal totals; exact excess is retained.

Inspiration: A cairn is assembled stone by stone; the stones here record contributions, not dates.

Alternative: Rings. Live guide: /docs/#/cairn/fitness

## 48. Daylight (daylight)

**Timeline.** Compare opening and closing times across dated observations.

**Encoding:** Each row shares a 24-hour axis; warm bands run from start to exclusive end; labels state duration.

**Read with care:** Times are supplied in a common local clock convention. The chart does not calculate sunrise or timezone shifts.

Up to 7 unique ISO dates with increasing HH:mm start/end in one day. Only end may be 24:00. No location or astronomical calculation is performed.

Inspiration: Historical shadow observations motivated careful attention to changing daylight.

Alternative: Sundial. Live guide: /docs/#/daylight/fitness

## 49. Isobar (isobar)

**Spatial.** Explore equal-value contours in a small complete rectangular grid.

**Encoding:** Nodes retain measured values; lines interpolate equal values at 25%, 50%, and 75% of the observed range.

**Read with care:** Contours interpolate within triangles and are not new measurements. Coordinate axes preserve equal scale; no extrapolation is made.

Complete 2–8 by 2–8 grid of unique finite x/y coordinates and known finite values. Contours use piecewise-linear triangles; they are estimates between nodes.

Inspiration: Isobars connect equal pressure; the same encoding works for other scalar fields.

Alternative: Dew. Live guide: /docs/#/isobar/fitness

## 50. Bamboo (bamboo)

**Distribution.** Inspect a small sample of integer scores without hiding original values.

**Encoding:** The stem is tens; each leaf is units. A key explains how to reconstruct the number.

**Read with care:** Only integers from 0 to 99 are supported. A stem is tens and a leaf is units; repeated digits are distinct observations.

Up to 60 integer values from 0 to 99, with at most 18 leaves per stem. Values are sorted within stems; repeated digits are distinct observations.

Inspiration: Segmented bamboo stems inspire a modern statistical stem-and-leaf plot, not an ancient invention.

Alternative: Pebble. Live guide: /docs/#/bamboo/fitness

