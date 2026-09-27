import { chartUseCases, type ChartUseCase } from './use-cases.js';
import type { ChartType } from "./types.js";

/** Human-readable decision support; alternatives name other built-in renderers. */
export interface ChartGuidance extends ChartUseCase {
  bestFor: string;
  caution: string;
  alternative: ChartType;
}
const entries: Record<ChartType, [string, string, ChartType]> = {
  rainbow: [
    "Find consistent days across a 49-day habit or activity log.",
    "Different arc lengths make area comparisons unreliable. Read intensity within a date, not arc area.",
    "garden",
  ],
  garden: [
    "Review a month of daily routines, practice, or contributions.",
    "Leaf position follows consecutive dates, not weekday columns. Intensity is better for patterns than close numeric comparisons.",
    "forest",
  ],
  forest: [
    "Compare a small set of category totals in the same unit.",
    "Read tree height from zero. Crown area and branching do not measure additional quantities.",
    "seed-ledger",
  ],
  river: [
    "Follow an ordered series with a gentle visual rhythm.",
    "Observations are equally spaced, even when date labels are irregular. The curve is an interpolation, not a forecast.",
    "mountain",
  ],
  bloom: [
    "Compare a handful of dimensions sharing one unit and scale.",
    "Petal area is decorative. Use Lotus for different targets, or Forest for precise ranking.",
    "forest",
  ],
  mountain: [
    "Find peaks and troughs in ordered observations.",
    "Horizontal distance means observation order, not elapsed time. Missing values break the slope.",
    "tidal-rhythm",
  ],
  tide: [
    "Communicate progress toward one positive goal.",
    "Water height, not the area of the circular vessel, encodes progress. Above-goal values require the exact reading.",
    "waterline",
  ],
  rings: [
    "Track up to eight independent goals with different targets.",
    "Compare sweep angles or percentages. Outer rings have longer circumferences and do not imply more progress.",
    "lotus",
  ],
  "seed-ledger": [
    "Make small counts and fractional quantities tangible.",
    "Read the stated denomination: large quantities are bundled. These seeds are not always one unit each.",
    "forest",
  ],
  waterline: [
    "Monitor a capacity against user-defined thresholds.",
    "The vessel saturates at capacity. Exact text retains an overflow; thresholds do not imply automatic alerts.",
    "tide",
  ],
  sundial: [
    "Plan activities inside one clock day, including simultaneous lanes.",
    "This is a 24-hour clock-time schedule, not a solar calculation. Split intervals that cross midnight.",
    "daylight",
  ],
  "season-wheel": [
    "Compare annual windows, seasons, or project phases.",
    "Arc distance uses actual Gregorian dates. Split intervals crossing the selected year; this is not an ancient calendar reconstruction.",
    "phenology",
  ],
  phenology: [
    "Compare observed milestones with expected date windows.",
    "Undated stages remain pending. The chart does not predict when a stage will occur.",
    "season-wheel",
  ],
  "lunar-cycle": [
    "Place recurring activity within an explicitly defined cycle.",
    "Moon shapes illustrate abstract phase. They do not show observed lunar phase or a medical prediction.",
    "star-cycle",
  ],
  "water-clock": [
    "Show elapsed or remaining time in a single duration snapshot.",
    "It is a calibrated visual vessel, not a running timer or a physical model of water flow.",
    "tide",
  ],
  balance: [
    "Compare two nonnegative quantities and their difference.",
    "The bars measure amounts; beam tilt only indicates direction. Decorative stones are not countable units.",
    "leaf-veins",
  ],
  "cord-ledger": [
    "Count contributions organized into a few named teams.",
    "Keep each team contiguous. Knots use a shared denomination and do not reconstruct a historical writing system.",
    "seed-ledger",
  ],
  "growth-history": [
    "Show known contributions accumulated in chronological order.",
    "Choose thickness or area explicitly. Later rings have longer circumferences; read the companion bars for direct comparisons.",
    "glacier",
  ],
  "tidal-rhythm": [
    "Compare multiple observed cycles on a common position axis.",
    "Cycle length and positions are supplied. The chart does not detect periodicity or predict tides.",
    "echo",
  ],
  "star-cycle": [
    "Place checkpoints around a repeating cycle.",
    "Angle measures cycle position and brightness measures value; star area has no quantitative meaning.",
    "nautilus",
  ],
  honeycomb: [
    "Compare activity for a small row-by-column matrix.",
    "Absent cells are unmeasured, not zero. Use exact readings when small intensity differences matter.",
    "forest",
  ],
  mycelium: [
    "Explore a small directed network with weighted connections.",
    "Node positions are a layout, not distance or importance. Large networks need a dedicated graph tool.",
    "estuary",
  ],
  "root-tree": [
    "Trace a compact taxonomy or ownership hierarchy.",
    "Each node measures its own value, not its subtree. Multiple roots are allowed; layout order does not rank importance.",
    "canopy",
  ],
  canopy: [
    "Compare positive parts of a total within two grouping levels.",
    "Zero parts have no area. Compare narrow cells with the inspector; this is not an arbitrary-depth treemap.",
    "phyllotaxis",
  ],
  fern: [
    "Find high-impact categories and their cumulative share.",
    "Display order is descending. The spores use a separate percentage scale from the frond lengths.",
    "forest",
  ],
  phyllotaxis: [
    "Explain how a whole is divided among several categories.",
    "120 seed positions approximate proportions with rounding. Small shares can receive no dot; the table retains the exact value.",
    "canopy",
  ],
  "leaf-veins": [
    "Compare before and after across several measures in the same unit.",
    "Both endpoints share a scale. Filled leaf area does not measure the change; missing new values retain the baseline only.",
    "forest",
  ],
  lotus: [
    "Compare performance against a different target on each axis.",
    "Axis order changes the polygon. It is not an overall score; values beyond 100% are preserved in exact readings.",
    "rings",
  ],
  "petal-box": [
    "Compare medians and supplied quartile summaries.",
    "Whiskers are supplied bounds, not automatically calculated outliers or confidence intervals.",
    "murmuration",
  ],
  raincloud: [
    "Compare frequencies across supplied numeric bins, including unequal widths.",
    "Read area as frequency and height as density. Bin choices come from your analysis; no density estimate is fitted.",
    "pebble",
  ],
  dew: [
    "Explore two measurements and an optional size variable.",
    "Droplet area encodes weight. Overlap can obscure records; correlation does not establish cause.",
    "echo",
  ],
  "wind-rose": [
    "Compare amounts across 4, 8, or 16 compass directions.",
    "Sector area encodes value, so radius is nonlinear. Directions must be evenly spaced and ordered clockwise.",
    "forest",
  ],
  dune: [
    "Compare frequency profiles across up to four cohorts.",
    "Ridge heights are supplied frequencies on a shared scale, not fitted densities. Nulls break the ridge.",
    "petal-box",
  ],
  glacier: [
    "Explain how signed changes produce a final running total.",
    "Changes must be known. Missing steps would make every subsequent total unknowable.",
    "growth-history",
  ],
  sediment: [
    "Read changing composition across aligned numeric positions.",
    "Only the bottom layer has a flat baseline. Use Dune to compare individual profiles directly.",
    "dune",
  ],
  delta: [
    "Explain one budget or supply split among destinations.",
    "Ribbon width measures amount; branch position has no geographic meaning. Zero flows have no width.",
    "canopy",
  ],
  estuary: [
    "Follow transfers from several sources to several destinations.",
    "It is a two-column flow diagram, not a general multi-stage Sankey. Source and destination sets are distinct.",
    "mycelium",
  ],
  pitcher: [
    "Find where a sequential funnel loses participants.",
    "Counts must not increase. Retention is relative to the preceding stage; a zero denominator gives no percentage.",
    "forest",
  ],
  firefly: [
    "Locate bursts and gaps in event streams.",
    "Position is supplied event time; glow shows magnitude. Coincident events may overlap and remain in the inspector.",
    "honeycomb",
  ],
  migration: [
    "Follow an ordered route through planar coordinates.",
    "Coordinates use equal physical scale on both axes. This is not a geographic projection, and arrows do not infer unsupplied stops.",
    "dew",
  ],
  murmuration: [
    "Compare raw observations across a few cohorts.",
    "Vertical jitter has no numeric meaning. Crowded birds may overlap; use Petal Box for compact distribution summaries.",
    "petal-box",
  ],
  "coral-range": [
    "Compare estimates with explicitly supplied uncertainty bounds.",
    "Bounds mean what your application defines. A displayed interval does not automatically imply statistical confidence.",
    "petal-box",
  ],
  pebble: [
    "Read empirical percentiles without choosing bins.",
    "Each sample has equal weight and ties share a cumulative height. This is not a fitted population distribution.",
    "raincloud",
  ],
  nautilus: [
    "Preserve chronology across up to four repeating cycles.",
    "Angle wraps at cycleLength; the spiral turn carries chronology. Radius itself is not a separate measurement.",
    "tidal-rhythm",
  ],
  frost: [
    "Compare a supplied symmetric correlation matrix.",
    "Correlation does not imply causation. The chart validates symmetry and range, not whether a matrix is statistically realizable.",
    "dew",
  ],
  echo: [
    "Look for relationships between adjacent ordered readings.",
    "Pairs use one observation of lag, not a fixed elapsed duration. A diagonal is equality, not a fitted trend.",
    "river",
  ],
  cairn: [
    "Show individual contributions toward one shared goal.",
    "Stone height measures contribution; width is decorative. All contributors use the chart-level target.",
    "rings",
  ],
  daylight: [
    "Compare opening and closing times across dated observations.",
    "Times are supplied in a common local clock convention. The chart does not calculate sunrise or timezone shifts.",
    "sundial",
  ],
  isobar: [
    "Explore equal-value contours in a small complete rectangular grid.",
    "Contours interpolate within triangles and are not new measurements. Coordinate axes preserve equal scale; no extrapolation is made.",
    "dew",
  ],
  bamboo: [
    "Inspect a small sample of integer scores without hiding original values.",
    "Only integers from 0 to 99 are supported. A stem is tens and a leaf is units; repeated digits are distinct observations.",
    "pebble",
  ],
};
export const chartGuidance = Object.fromEntries(
  Object.entries(entries).map(([type, [bestFor, caution, alternative]]) => [
    type,
    { bestFor, caution, alternative, ...chartUseCases[type as ChartType] },
  ]),
) as Record<ChartType, ChartGuidance>;
