import { businessSample } from './business-samples';
import { chartUseCases } from '../src';
import { ecologyTypes, type EcologyType } from '../src/ecology-catalog';
import { ecologyOptions, ecologyNames, ecologyUseCases } from './ecology-samples';
import type { ChartOptions, ChartType, ChartDatum } from '../src';

export const types = ['rainbow', 'garden', 'forest', 'river', 'bloom', 'mountain', 'tide', 'rings', 'seed-ledger', 'waterline', 'sundial', 'season-wheel', 'phenology', 'lunar-cycle', 'water-clock', 'balance', 'cord-ledger', 'growth-history', 'tidal-rhythm', 'star-cycle', ...ecologyTypes] as const;
export const useCases: Record<ChartType, string> = { ...ecologyUseCases, rainbow: '49 DAYS OF MINDFULNESS', garden: 'SEPTEMBER’S DAILY RITUAL', forest: 'A WEEK OF DEEP WORK', river: 'YOUR CREATIVE RHYTHM', bloom: 'A LITTLE LIFE BALANCE', mountain: 'TWELVE WEEKS OF MOVEMENT', tide: 'READING GOAL, IN PROGRESS', rings: 'GOALS FOR A NEW SEASON', 'seed-ledger': 'THE LITTLE THINGS THAT ADD UP', waterline: 'ROOM FOR THE NEXT RAIN', sundial: 'A DAY WITH ROOM TO BREATHE', 'season-wheel': 'A YEAR IN THE GARDEN', phenology: 'FROM SEED TO FIRST HARVEST', 'lunar-cycle': 'YOUR OWN CREATIVE CYCLE', 'water-clock': 'A MOMENT TO FOCUS', balance: 'WHAT COMES IN, WHAT GOES OUT', 'cord-ledger': 'MANY HANDS, SHARED PROGRESS', 'growth-history': 'FIVE YEARS OF SMALL STEPS', 'tidal-rhythm': 'THE RHYTHM OF EACH DAY', 'star-cycle': 'THINGS TO RETURN TO' };
export const names: Record<ChartType, string> = { ...ecologyNames, rainbow: 'Mindful moments', garden: 'Daily rituals', forest: 'Deep work', river: 'Creative flow', bloom: 'A balanced life', mountain: 'Moving forward', tide: 'Books this year', rings: 'Seasonal intentions', 'seed-ledger': 'A week of small wins', waterline: 'Rainwater reserve', sundial: 'An intentional day', 'season-wheel': 'A growing year', phenology: 'The tomato journal', 'lunar-cycle': 'A creative rhythm', 'water-clock': 'A focused moment', balance: 'Weekly resource balance', 'cord-ledger': 'Community contributions', 'growth-history': 'Learning over the years', 'tidal-rhythm': 'Three daily rhythms', 'star-cycle': 'Quarterly touchpoints' };
let seed = 42;
const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const date = (day: number) => { const d = new Date('2026-09-01T00:00:00Z'); d.setUTCDate(day); return d.toISOString().slice(0, 10); };
export function sample(type: ChartType, fresh = false): ChartDatum[] {
  if ((ecologyTypes as readonly string[]).includes(type)) return ecologyOptions(type as EcologyType, fresh).data;
  const values = (base: number[]) => fresh ? base.map(v => Math.max(1, Math.round(v * (.5 + random())))) : base;
  if (type === 'rainbow' || type === 'garden') return Array.from({ length: type === 'garden' ? 30 : 49 }, (_, i) => ({ date: date(i + 1), value: Math.round(2 + random() * 8) }));
  if (type === 'forest') return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, i) => ({ label, value: values([4, 6, 4.8, 8, 6.5, 3.5, 5])[i] }));
  if (type === 'river') return values([25, 35, 30, 52, 46, 65, 56, 78, 64, 75, 58, 70]).map((value, i) => ({ label: `Sep ${i * 2 + 1}`, value }));
  if (type === 'bloom') return ['Mind', 'Movement', 'Rest', 'Connection', 'Creativity', 'Nutrition'].map((label, i) => ({ label, value: values([8, 7, 9, 6, 8, 6.5])[i] }));
  if (type === 'mountain') return values([18, 42, 25, 68, 36, 85, 52, 66, 33, 72, 41, 55]).map((value, i) => ({ label: `W${i + 1}`, value }));
  if (type === 'tide') return [{ label: 'Books this year', value: fresh ? Math.round(2 + random() * 22) : 18, target: 24 }];
  if (type === 'rings') return ['Mindfulness', 'Movement', 'Reading', 'Creating'].map((label, i) => ({ label, value: fresh ? Math.round(15 + random() * 85) : [85, 64, 72, 48][i], target: 100 }));
  if (type === 'seed-ledger') return ['Pages read', 'Tasks done', 'Ideas noted', 'Walks taken'].map((label, i) => ({ label, value: fresh ? Math.round((3 + random() * 34) * 2) / 2 : [23, 16, 8.5, 5][i] }));
  if (type === 'waterline') return [{ label: 'Rainwater reserve', value: fresh ? Math.round(15 + random() * 83) : 68, target: 100 }];
  if (type === 'water-clock') return [{ label: 'A focus session', value: fresh ? Math.round(random() * 25) : 9, target: 25 }];
  if (type === 'sundial') return [
    { label: 'Morning walk', start: fresh ? '06:30' : '07:00', end: '08:00', track: 'Life' },
    { label: 'Deep work', start: '09:00', end: fresh ? '12:00' : '11:30', track: 'Work' },
    { label: 'Lunch outside', start: '12:00', end: '13:00', track: 'Life' },
    { label: 'Make & create', start: '14:00', end: fresh ? '17:30' : '17:00', track: 'Work' },
    { label: 'An evening read', start: '20:00', end: '21:30', track: 'Life' },
  ];
  if (type === 'season-wheel') return [
    { label: 'Prepare the soil', start: '2026-01-15', end: '2026-03-01', track: 'Garden' },
    { label: 'Sow & tend', start: '2026-03-01', end: fresh ? '2026-05-15' : '2026-06-01', track: 'Garden' },
    { label: 'Gather & share', start: '2026-06-01', end: '2026-09-15', track: 'Garden' },
    { label: 'Rest the beds', start: '2026-10-01', end: '2027-01-01', track: 'Garden' },
    { label: 'Summer journal', start: '2026-06-15', end: '2026-08-15', track: 'Creative' },
  ];
  if (type === 'phenology') return [
    { label: 'Sown', observedAt: '2026-03-01', expectedStart: '2026-03-01', expectedEnd: '2026-03-05' },
    { label: 'Germination', observedAt: fresh ? '2026-03-15' : '2026-03-12', expectedStart: '2026-03-08', expectedEnd: '2026-03-17' },
    { label: 'First true leaves', observedAt: '2026-03-26', expectedStart: '2026-03-20', expectedEnd: '2026-04-01' },
    { label: 'First flower', expectedStart: '2026-04-10', expectedEnd: '2026-04-25', ...(fresh ? { observedAt: '2026-04-18' } : {}) },
    { label: 'First harvest', expectedStart: '2026-05-01', expectedEnd: '2026-05-20' },
  ];
  if (type === 'lunar-cycle') return ['Gather', 'Explore', 'Sketch', 'Make', 'Review', 'Rest'].map((label, i) => ({ label, position: i * 5, value: fresh ? Math.round(2 + random() * 8) : [3, 6, 8, 10, 5, 2][i] }));
  if (type === 'star-cycle') return ['Reflect', 'Learn', 'Connect', 'Review', 'Share', 'Reset'].map((label, i) => ({ label, position: i * 2, value: fresh ? Math.round(1 + random() * 9) : [8, 5, 7, 9, 6, 3][i] }));
  if (type === 'balance') return [{ label: 'Replenished', value: fresh ? Math.round(30 + random() * 60) : 72 }, { label: 'Used', value: fresh ? Math.round(30 + random() * 60) : 54 }];
  if (type === 'cord-ledger') return ['Maya', 'Leo', 'Ari', 'Sam', 'Noor', 'Kai'].map((label, i) => ({ label, track: i < 3 ? 'Garden crew' : 'Kitchen crew', value: fresh ? Math.round((2 + random() * 16) * 2) / 2 : [12, 8, 16, 10, 7.5, 14][i] }));
  if (type === 'growth-history') return ['2022', '2023', '2024', '2025', '2026'].map((label, i) => ({ label, value: fresh ? Math.round(15 + random() * 70) : [20, 35, 28, 50, 67][i] }));
  if (type === 'tidal-rhythm') return ['Monday', 'Tuesday', 'Wednesday'].flatMap((cycle, day) => [0, 3, 6, 9, 12, 15, 18, 21, 24].map((position, i) => ({ label: `${String(position).padStart(2, '0')}:00`, cycle, position, value: fresh ? Math.round(5 + random() * 75) : Math.round([12, 8, 16, 44, 65, 40, 58, 31, 14][i] * [1, .78, 1.15][day]) })));
  return [];

}
function originalOptions(type: ChartType, fresh = false): ChartOptions {
  if ((ecologyTypes as readonly string[]).includes(type)) return ecologyOptions(type as EcologyType, fresh);
  const data = sample(type, fresh);
  return { type, data, title: names[type], theme: ['river', 'tide', 'waterline', 'water-clock', 'tidal-rhythm'].includes(type) ? 'ocean' : ['lunar-cycle', 'star-cycle'].includes(type) ? 'twilight' : 'meadow',
    ...(['rainbow', 'garden'].includes(type) ? { startDate: '2026-09-01', days: type === 'garden' ? 30 : 49, max: 10 } : {}),
    ...(type === 'bloom' ? { max: Math.max(10, ...data.map(point => point.value ?? 0)) } : {}),
    ...(type === 'forest' ? { unit: 'h' } : {}),
    ...(type === 'waterline' ? { unit: 'L', thresholds: [{ label: 'Refill soon', value: 20 }, { label: 'Comfortable reserve', value: 55 }, { label: 'High water', value: 90 }] } : {}),
    ...(type === 'sundial' ? { at: '13:30' } : {}),
    ...(type === 'season-wheel' ? { year: 2026, at: '2026-09-21' } : {}),
    ...(type === 'phenology' ? { startDate: '2026-03-01', endDate: '2026-05-25' } : {}),
    ...(type === 'lunar-cycle' ? { cycleLength: 30, cycleUnit: 'days', cyclePosition: 12, max: 10 } : {}),
    ...(type === 'water-clock' ? { timeMode: 'elapsed' as const, unit: 'min' } : {}),
    ...(type === 'cord-ledger' || type === 'seed-ledger' ? { unitsPerMark: 1 } : {}),
    ...(type === 'growth-history' ? { growthMode: 'thickness' as const, unit: 'h' } : {}),
    ...(type === 'tidal-rhythm' ? { cycleLength: 24, cycleUnit: 'h' } : {}),
    ...(type === 'star-cycle' ? { cycleLength: 12, cycleUnit: 'weeks', cyclePosition: 5, max: 10 } : {}),
  };
}

/** update() merges options; explicitly clear settings before choosing another type. */
export const resetChartOptions: Partial<ChartOptions> = {
  xLabel: undefined, yLabel: undefined, weightLabel: undefined, startDate: undefined, endDate: undefined, days: undefined, max: undefined, target: undefined, unit: undefined,
  unitsPerMark: undefined, thresholds: undefined, year: undefined, at: undefined, cycleLength: undefined,
  cycleUnit: undefined, cyclePosition: undefined, timeMode: undefined, growthMode: undefined,
};

export function options(type: ChartType, fresh=false):ChartOptions { return businessSample(originalOptions(type,fresh),fresh); }
for(const type of types){names[type]=chartUseCases[type].example;useCases[type]=chartUseCases[type].example.toUpperCase();}
