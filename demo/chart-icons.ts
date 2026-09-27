import type { ChartType } from '../src';
import type { IconName } from './icons';

/** One shared, explicit mapping for chart navigation and the chart pickers. */
export const chartIcons: Record<ChartType, IconName> = {
  rainbow: 'rainbow', garden: 'plant', forest: 'tree', river: 'waves',
  bloom: 'flower', mountain: 'mountains', tide: 'drop', rings: 'circles-four',
  'seed-ledger': 'grains', waterline: 'drop-half-bottom', sundial: 'sun',
  'season-wheel': 'compass', phenology: 'flower-tulip', 'lunar-cycle': 'moon',
  'water-clock': 'hourglass-medium', balance: 'scales', 'cord-ledger': 'path',
  'growth-history': 'tree', 'tidal-rhythm': 'wave-sine', 'star-cycle': 'star',
  honeycomb: 'hexagon', mycelium: 'share-network', 'root-tree': 'tree-structure',
  canopy: 'tree-evergreen', fern: 'plant', phyllotaxis: 'spiral', 'leaf-veins': 'leaf',
  lotus: 'flower-lotus', 'petal-box': 'flower', raincloud: 'cloud-rain', dew: 'drop',
  'wind-rose': 'wind', dune: 'mountains', glacier: 'snowflake', sediment: 'stack-simple',
  delta: 'git-branch', estuary: 'intersect', pitcher: 'potted-plant', firefly: 'bug-beetle',
  migration: 'path', murmuration: 'bird', 'coral-range': 'tree-structure', pebble: 'circles-three',
  nautilus: 'spiral', frost: 'snowflake', echo: 'waveform', cairn: 'stack',
  daylight: 'sun-horizon', isobar: 'circles-four', bamboo: 'plant'
};
