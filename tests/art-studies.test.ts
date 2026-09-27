import { afterEach, describe, expect, it } from 'vitest';
import { NaturePlot, themes, type ChartOptions } from '../src';
import { types, options } from '../demo/samples';
import { studyAtlases, studyDetails, studyLocation } from '../demo/study-catalog';
import { pages } from '../demo/docs/content';

const charts: NaturePlot[]=[];
afterEach(()=>{charts.forEach(c=>c.destroy());charts.length=0;document.body.replaceChildren();});
function make(input: ChartOptions) {
  const host=document.createElement('div'); document.body.append(host);
  const chart=new NaturePlot(host,{...input,animate:false}); charts.push(chart);return {chart,host};
}

it('provides exactly one live SVG preview and a design review for each of the 50 chart guides',()=>{
  const entries=studyAtlases.flatMap(a=>a.types);
  expect(entries).toHaveLength(50);expect(new Set(entries).size).toBe(50);
  expect([...entries].sort()).toEqual([...types].sort());
  for(const type of types) {
    const {atlas,index}=studyLocation(type);
    expect(index).toBeLessThan(atlas.rows*atlas.columns);
    expect(studyDetails[type].craft.length).toBeGreaterThan(70);
    const page=pages.find(p=>p.slug===type)!;
    const study=page.sections.find(s=>s.id==='nature-study')!;
    expect(study.html).toContain(`?study=${type}#nature-studies`);
    expect(study.html).toContain(`data-mini-chart="${type}"`);
    expect(study.html).not.toContain('<img');
  }
});

describe('decoration respects measurements',()=>{
  it('keeps funnel widths proportional at small scales and gives zero stages no painted width',()=>{
    const {host,chart}=make({type:'pitcher',data:[{value:4e-60},{value:1e-60},{value:0}]});
    const stages=[...host.querySelectorAll('.np-funnel-stage')];
    expect(stages).toHaveLength(2);
    const width=stages.map(s=>Number(s.getAttribute('width')));
    expect(width[0]/width[1]).toBeCloseTo(4);
    expect(host.querySelectorAll('.np-zero-marker')).toHaveLength(1);
    expect(chart.data).toHaveLength(3);
    chart.update({data:[{value:0},{value:0}]});
    expect(host.querySelector('.np-funnel-stage')).toBeNull();
    expect(host.querySelectorAll('.np-zero-marker')).toHaveLength(2);
  });
  it('preserves compass sector area ratios without a positive minimum for zero or missing values',()=>{
    const {host}=make({type:'wind-rose',data:[{angle:0,value:0},{angle:90,value:1e-60},{angle:180,value:4e-60},{angle:270,value:null}]});
    const sectors=[...host.querySelectorAll('.np-wind-sector')];
    expect(sectors).toHaveLength(2);
    const radii=sectors.map(s=>Number(s.getAttribute('d')!.match(/A([^,]+),/)![1]));
    expect(radii[1]**2/radii[0]**2).toBeCloseTo(4);
    expect(host.querySelectorAll('.np-zero-marker')).toHaveLength(1);
    expect(host.querySelectorAll('.np-missing-marker')).toHaveLength(1);
  });
});

it.each(types)('%s exports its dark artwork without image dependencies or duplicate interactive marks',type=>{
  const {chart,host}=make({...options(type),theme:{...themes.meadow,background:'#17221b',ink:'#e2eadb',muted:'#a6b79f',grid:'#364a3b'}});
  expect(host.querySelectorAll('.np-mark')).toHaveLength(chart.data.length);
  const svg=new DOMParser().parseFromString(chart.toSVG(),'image/svg+xml');
  expect(svg.querySelector('parsererror,image,foreignObject')).toBeNull();
  const ids=[...svg.querySelectorAll('[id]')].map(el=>el.id);
  expect(new Set(ids).size).toBe(ids.length);
  for(const el of svg.querySelectorAll('*')) for(const a of [...el.attributes]) {
    for(const match of a.value.matchAll(/url\(#([^)]*)\)/g)) expect(svg.getElementById(match[1])).not.toBeNull();
  }
  expect(svg.querySelector('clipPath .np-mark,defs [data-index]')).toBeNull();
  expect(chart.toSVG()).not.toMatch(/NaN|Infinity/);
});
