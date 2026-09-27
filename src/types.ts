import type { EcologyType } from './ecology-catalog.js';
export type ChartType = EcologyType | 'rainbow' | 'garden' | 'forest' | 'river' | 'bloom' | 'mountain' | 'tide' | 'rings'
  | 'seed-ledger' | 'waterline' | 'sundial' | 'season-wheel' | 'phenology' | 'lunar-cycle'
  | 'water-clock' | 'balance' | 'cord-ledger' | 'growth-history' | 'tidal-rhythm' | 'star-cycle';
export type ThemeName = 'meadow' | 'ocean' | 'autumn' | 'twilight';
export interface PointFields {
  label?: string;
  /** An ISO calendar date: YYYY-MM-DD. */
  date?: string;
  /** A positive capacity or goal. */
  target?: number;
  /** Exclusive-end interval: HH:mm for Sundial, ISO date for Season Wheel. */
  start?: string;
  end?: string;
  /** Interval lane or parent group for cords. */
  track?: string;
  observedAt?: string;
  expectedStart?: string;
  expectedEnd?: string;
  /** Position within a defined abstract cycle. */
  position?: number;
  /** Small-multiple cycle label for Tidal Rhythm. */
  cycle?: string;
  /** Supplied coordinates, range summaries, or paired readings. */
  x?: number;
  y?: number;
  weight?: number;
  angle?: number;
  baseline?: number;
  low?: number;
  q1?: number;
  q3?: number;
  high?: number;
  /** Explicit hierarchy and relationship identifiers. */
  id?: string;
  parent?: string;
  source?: string;
  destination?: string;
}
/** Numeric observation, also the normalized form returned by charts. */
export interface DataPoint extends PointFields { value: number | null }
export interface IntervalPoint extends PointFields { start: string; end: string; value?: number | null }
/** A stage may have an observed date, an expected window, or neither yet. */
export interface StagePoint extends PointFields { value?: number | null }
export type ChartDatum = DataPoint | IntervalPoint | StagePoint;
export interface Threshold { value: number; label: string }
export interface Theme {
  background: string;
  ink: string;
  muted: string;
  grid: string;
  colors: string[];
}
export interface ChartOptions {
  type: ChartType | (string & {});
  data: ChartDatum[];
  title?: string;
  description?: string;
  theme?: ThemeName | Theme;
  /** First calendar day, or inclusive lower domain for Phenology. */
  startDate?: string;
  /** Inclusive upper date domain for Phenology. */
  endDate?: string;
  days?: number;
  /** Positive shared numeric scale ceiling; must cover every data value. */
  max?: number;
  target?: number;
  unit?: string;
  /** Human-readable axis and bubble-size labels for Cartesian charts. */
  xLabel?: string;
  yLabel?: string;
  weightLabel?: string;
  /** Base denomination for seeds/knots. Large counts use labeled multiples. */
  unitsPerMark?: number;
  thresholds?: Threshold[];
  /** Gregorian year for Season Wheel; inferred from the first interval if absent. */
  year?: number;
  /** Sundial HH:mm cursor or Season Wheel ISO date cursor. */
  at?: string;
  /** Abstract cycle span. Defaults: lunar 30, star 12, tidal 24. */
  cycleLength?: number;
  cycleUnit?: string;
  /** Abstract-cycle cursor in [0, cycleLength). */
  cyclePosition?: number;
  timeMode?: 'remaining' | 'elapsed';
  growthMode?: 'thickness' | 'area';
  /** Native SVG detail level. Both modes preserve all measurements. */
  detail?: 'natural' | 'essential';
  /** @deprecated No image assets are used. Use detail instead. Retained for 0.6 callers. */
  artwork?: 'illustrated' | 'vector';
  animate?: boolean;
  showTable?: boolean;
  /** Show the persistent observation inspector and table controls. Default true. */
  interactive?: boolean;
  formatValue?: (value: number) => string;
  onSelect?: (point: Readonly<DataPoint>, index: number) => void;
}
export interface SundialOptions extends ChartOptions { type: 'sundial'; data: IntervalPoint[] }
export interface SeasonWheelOptions extends ChartOptions { type: 'season-wheel'; data: IntervalPoint[] }
export interface PhenologyOptions extends ChartOptions { type: 'phenology'; data: StagePoint[] }
export interface ChartMetadata {
  name: string;
  subtitle: string;
  description: string;
  encoding: string;
  category: 'Calendar' | 'Comparison' | 'Trend' | 'Progress' | 'Cycle' | 'Timeline' | 'Distribution' | 'Relationship' | 'Composition' | 'Spatial';
}
export interface RenderContext {
  svg: SVGSVGElement;
  data: DataPoint[];
  options: ChartOptions;
  theme: Theme;
  width: number;
  height: number;
  id: string;
  format: (value: number | null) => string;
  el: <K extends keyof SVGElementTagNameMap>(tag: K, attrs?: Record<string, string | number>, parent?: Element, text?: string) => SVGElementTagNameMap[K];
  mark: (element: SVGElement, point: DataPoint, index: number) => void;
}
export type ChartRenderer = (context: RenderContext) => void;
