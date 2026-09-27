import { afterEach, expect, it, vi } from 'vitest';
import { NaturePlot, chartGuidance, chartUseCases, themes, type ChartOptions } from '../src';
import { options, types } from '../demo/samples';
import { studyControl } from '../demo/study-controls';
const charts:NaturePlot[]=[];
afterEach(()=>{charts.splice(0).forEach(chart=>chart.destroy());document.body.replaceChildren();});
function make(input:ChartOptions){const host=document.createElement('div');document.body.append(host);const chart=new NaturePlot(host,{...input,animate:false});charts.push(chart);return {chart,host};}

it('provides a concrete question, example and decision for every retained chart',()=>{
  expect(types).toHaveLength(50);expect(Object.keys(chartUseCases)).toHaveLength(50);
  expect(new Set(Object.values(chartUseCases).map(c=>c.question)).size).toBe(50);
  for(const type of types){const guide=chartGuidance[type];expect(guide.question.endsWith('?')).toBe(true);expect(guide.decision.length).toBeGreaterThan(40);expect(options(type).title).toBe(guide.example);}
});

it.each(types)('%s preserves data, selection, local SVG references and image-free exports in both detail levels',type=>{
  const {chart,host}=make(options(type));const data=chart.data;
  for(const detail of ['natural','essential'] as const){
    chart.update({detail});expect(chart.data).toEqual(data);expect(host.querySelectorAll('.np-mark')).toHaveLength(data.length);
    chart.select(0);expect(host.querySelector('.np-mark[aria-pressed=true]')?.getAttribute('data-index')).toBe('0');
    const svg=new DOMParser().parseFromString(chart.toSVG(),'image/svg+xml');
    expect(svg.querySelector('parsererror,image,foreignObject,.np-focus-halo,.np-specimen-hit,[tabindex]')).toBeNull();
    if(detail==='essential')expect(svg.querySelector('.np-ornament')).toBeNull();
    const ids=[...svg.querySelectorAll('[id]')].map(el=>el.id);expect(new Set(ids).size).toBe(ids.length);
    for(const el of svg.querySelectorAll('*'))for(const a of [...el.attributes]){
      expect(a.value).not.toMatch(/NaN|Infinity|data:image/);
      for(const match of a.value.matchAll(/url\(#([^)]*)\)/g))expect(svg.getElementById(match[1])).not.toBeNull();
      if(a.name==='href'){expect(a.value.startsWith('#')).toBe(true);expect(svg.getElementById(a.value.slice(1))).not.toBeNull();}
    }
  }
});

it('keeps material highlights theme-aware and natural components selectable',()=>{
  const select=vi.fn(),{chart,host}=make({...options('balance'),onSelect:select});
  const hit=host.querySelector('.np-mark[data-index="0"] [data-specimen="balance-pan"] .np-specimen-hit')!;
  expect(hit).not.toBeNull();hit.dispatchEvent(new MouseEvent('click',{bubbles:true}));expect(select).toHaveBeenCalledWith(expect.objectContaining({value:72}),0);
  const before=chart.toSVG();chart.setTheme(themes.twilight);expect(chart.toSVG()).not.toBe(before);expect(host.querySelector('image,img')).toBeNull();
});

it('preserves native quantity geometry through extreme, zero and missing values',()=>{
  const {chart,host}=make({type:'balance',data:[{value:4e-60},{value:1e-60}]});
  const widths=()=>[...host.querySelectorAll('.np-balance-amount')].map(el=>Number(el.getAttribute('width')));
  for(const detail of ['natural','essential'] as const){chart.update({detail,data:[{value:4e-60},{value:1e-60}]});expect(widths()[0]/widths()[1]).toBe(4);chart.update({data:[{value:0},{value:null}]});expect(widths()).toEqual([0,0]);}
});

it('allocates 120 actual seed anchors and no seeds to an empty total',()=>{
  const {host,chart}=make(options('phyllotaxis'));
  expect(host.querySelectorAll('.np-mark circle[r="4.5"]')).toHaveLength(120);
  chart.update({data:[{label:'Empty',value:0}]});expect(host.querySelectorAll('.np-mark [data-specimen="seed"]')).toHaveLength(0);
});

it('rejects invalid detail changes atomically and retains normalized input selection indexes',()=>{
  const onSelect=vi.fn(),{host,chart}=make({type:'pebble',data:[{value:30},{value:2},{value:14}],onSelect});
  chart.select(0);expect(onSelect).toHaveBeenLastCalledWith({value:30},0);
  const svg=host.querySelector('svg');expect(()=>chart.update({detail:'invalid' as 'natural'})).toThrow(/detail/);expect(host.querySelector('svg')).toBe(svg);
  for(const i of [-1,3,.5,NaN])expect(()=>chart.select(i)).toThrow();chart.destroy();expect(()=>chart.select(0)).toThrow();
});

it.each(types)('%s sample edits preserve valid domain constraints',type=>{
  const preset=options(type),index=type==='frost'?1:0,control=studyControl(preset,index)!;expect(control).toBeDefined();
  const {chart}=make(preset);
  for(const value of [control.min,control.max]){control.apply(value);expect(()=>chart.update(preset)).not.toThrow();chart.select(index);expect(studyControl(preset,index)?.value).toBe(value);}
});

it('uses whole numbers for sample counts and refreshes the opening-hours example',()=>{
  for(const fresh of [false,true])for(const type of types){const preset=options(type,fresh);if(['orders','visits','tickets','tasks','returns','enquiries','prospects','parcels','contacts','members','boxes'].includes(preset.unit??''))expect(preset.data.every(p=>p.value==null||Number.isInteger(p.value))).toBe(true);}
  expect(options('daylight',true).data).not.toEqual(options('daylight').data);
});

it('keeps time and frequency coordinates independent of the value unit',()=>{
  const {host}=make(options('firefly'));
  const ticks=[...host.querySelectorAll('svg text[y="309"]')].map(el=>el.textContent);
  expect(ticks).toEqual(['1','11.9','22.8']);expect(host.textContent).toContain('Hour of day');
  const dune=make({...options('dune'),unit:'orders'});
  expect([...dune.host.querySelectorAll('svg text[y="309"]')].map(el=>el.textContent)).toEqual(['0','20','40']);
});

it('puts long value units in the axis heading while keeping exact readings in the table',()=>{
  for(const type of ['forest','river','mountain'] as const){
    const {host}=make({type,unit:'fulfilled orders',data:[{label:'Week 1',value:1234567},{label:'Week 2',value:7654321}]});
    expect([...host.querySelectorAll('svg text[text-anchor="end"]')].every(el=>(el.textContent??'').length<=8)).toBe(true);
    expect(host.querySelector('svg')?.textContent).toContain('fulfilled orders');
    expect(host.querySelector('.np-table')?.textContent).toContain('1,234,567 fulfilled orders');
  }
});
