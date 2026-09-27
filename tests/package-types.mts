import NaturePlot, { createChart, type ChartOptions, type ThemeName } from 'natureplot';
const theme: ThemeName = 'meadow';
const options: ChartOptions = { type: 'forest', data: [{ value: 2 }], theme };
const chart: NaturePlot = createChart(document.createElement('div'), options);
chart.update({ data: [{ value: 3 }] }).setTheme('ocean');

import type { SundialOptions, SeasonWheelOptions, PhenologyOptions, ChartDatum, IntervalPoint, StagePoint } from 'natureplot';
const day: SundialOptions = { type: 'sundial', at: '12:00', data: [{ start: '09:00', end: '10:00', track: 'Work' }] };
const year: SeasonWheelOptions = { type: 'season-wheel', year: 2024, data: [{ start: '2024-02-01', end: '2024-03-01' }] };
const stages: PhenologyOptions = { type: 'phenology', data: [{ label: 'Planted', observedAt: '2026-03-01' }, { label: 'Unknown' }] };
const interval: IntervalPoint = day.data[0];
const stage: StagePoint = stages.data[0];
const datum: ChartDatum = interval;
createChart(document.createElement('div'), day);
createChart(document.createElement('div'), year);
createChart(document.createElement('div'), stages);
// @ts-expect-error A typed interval requires an exclusive end.
const incomplete: IntervalPoint = { start: '09:00' };

import type { DataPoint } from 'natureplot';
const exchange: DataPoint = { source: 'Design', destination: 'Build', value: 18 };
const intervalSummary: DataPoint = { low: 2, q1: 5, value: 8, q3: 11, high: 16 };
createChart(document.createElement('div'), { type: 'mycelium', data: [exchange], interactive: true });
createChart(document.createElement('div'), { type: 'petal-box', data: [intervalSummary] });
// @ts-expect-error Coordinates must be numeric.
const badCoordinate: DataPoint = { x: 'north', value: 1 };

import { chartGuidance, type ChartGuidance } from 'natureplot';
const guidance: ChartGuidance = chartGuidance.dew;
createChart(document.createElement('div'), {type:'dew',xLabel:'Hours',yLabel:'Score',weightLabel:'Reach',data:[{x:2,value:4,weight:3}]});

import { chartUseCases, type ChartUseCase } from 'natureplot';
const useCase: ChartUseCase = chartUseCases.balance;
chart.update({detail:'natural'}).select(0);
chart.update({detail:'essential'});
// @ts-expect-error Invalid detail levels must be rejected by TypeScript.
chart.update({detail:'photograph'});
