import { enhanceSelect, syncSelect } from './select';
import { chartIcons } from './chart-icons';
import { NaturePlot, chartTypes, chartGuidance, type ChartType, type ThemeName } from '../src';
import { icon } from './icons';
import { studyControl } from './study-controls';
import { options, resetChartOptions, types } from './samples';
import { displayPalette, appearanceEvent } from './appearance';
import { studyAtlases, studyDetails, studyLocation } from './study-catalog';

export function mountNatureStudies(): void {
  const host = document.querySelector<HTMLElement>('#nature-studies');
  if (!host) return;
  const picker = host.querySelector<HTMLElement>('.study-picker')!;
  const atlasPicker = host.querySelector<HTMLElement>('.study-atlases')!;
  const selectChart = host.querySelector<HTMLSelectElement>('#study-chart-picker')!;
  const requested = new URLSearchParams(location.search).get('study');
  let active: ChartType = types.includes(requested as ChartType) ? requested as ChartType : 'fern';
  let activeAtlas = '';
  let detail: 'natural' | 'essential' = 'natural';
  let selectedIndex = 0;
  const controls = document.createElement('div'); controls.className='study-controls';
  controls.innerHTML=`<div class="study-toolbar"><div role="group" aria-label="Chart detail"><button type="button" data-detail="natural" aria-pressed="true">Natural</button><button type="button" data-detail="essential" aria-pressed="false">Essential</button></div><button type="button" class="study-resample">New sample ${icon('arrows-clockwise')}</button></div><div class="study-adjustment"><label for="study-value"><span class="study-value-label"></span><output for="study-value"></output></label><input id="study-value" type="range"><p>Move the slider to change the chart. Select another observation to edit it.</p></div>`;
  host.querySelector('.study-chart')!.before(controls);
  const slider=controls.querySelector<HTMLInputElement>('input')!;
  function refreshControl(): void {
    const control=studyControl(preset,selectedIndex);
    controls.querySelector<HTMLElement>('.study-adjustment')!.hidden=!control;
    if(!control)return;
    slider.min=String(control.min);slider.max=String(control.max);slider.step=String(control.step);slider.value=String(control.value);
    slider.setAttribute('aria-valuetext',control.format(control.value));
    controls.querySelector('.study-value-label')!.textContent=control.label;
    controls.querySelector('output')!.textContent=control.format(control.value);
  }
  const selected=(_point: unknown,index:number)=>{selectedIndex=index;refreshControl();};
  let preset = options(active);
  const chart = new NaturePlot(host.querySelector<HTMLElement>('.study-chart')!, { ...preset, theme: displayPalette(preset.theme as ThemeName), animate: false, detail, onSelect:selected });
  slider.addEventListener('input',()=>{
    const control=studyControl(preset,selectedIndex); if(!control)return;
    control.apply(Number(slider.value));
    chart.update({...preset,theme:displayPalette(preset.theme as ThemeName),detail,animate:false});
    chart.select(selectedIndex);refreshControl();
  });
  controls.querySelectorAll<HTMLButtonElement>('[data-detail]').forEach(button=>button.addEventListener('click',()=>{
    detail=button.dataset.detail as typeof detail;
    controls.querySelectorAll('[data-detail]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    chart.update({detail});
  }));
  controls.querySelector('.study-resample')!.addEventListener('click',()=>{
    preset=options(active,true);selectedIndex=0;
    chart.update({...resetChartOptions,...preset,theme:displayPalette(preset.theme as ThemeName),detail,animate:false});refreshControl();
  });
  const atlasButtons = studyAtlases.map(atlas => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'study-atlas-choice';
    button.textContent = `${atlas.name} · ${atlas.types.length}`;
    button.setAttribute('aria-controls','study-specimens');
    button.addEventListener('click',()=>select(atlas.types[0], true));
    atlasPicker.append(button);
    return button;
  });
  for (const type of types) {
    const option = document.createElement('option');
    option.value=type; option.textContent=chartTypes[type].name;
    selectChart.append(option);
  }
  enhanceSelect(selectChart, chartIcons);
  selectChart.addEventListener('change',()=>select(selectChart.value as ChartType,true));

  function select(type: ChartType, remember = false): void {
    active=type;
    const { atlas }=studyLocation(active), study=studyDetails[active];
    if (activeAtlas!==atlas.id) {
      activeAtlas=atlas.id;
      picker.replaceChildren();
      atlas.types.forEach((t,i)=>{
        const button=document.createElement('button');
        button.type='button'; button.className='study-choice'; button.dataset.study=t;
        button.setAttribute('aria-label',`Study ${chartTypes[t].name}`);
        button.setAttribute('aria-controls','study-reading');
        const number=document.createElement('span'); number.className='study-index'; number.textContent=String(types.indexOf(t)+1).padStart(2,'0');
        const name=document.createElement('span');name.className='study-choice-name';name.textContent=chartTypes[t].name;
        const thumb=document.createElement('span');thumb.className='study-thumb';thumb.setAttribute('aria-hidden','true');
        const mount=document.createElement('div');const preview=new NaturePlot(mount,{...options(t),theme:displayPalette(options(t).theme as ThemeName),interactive:false,animate:false});
        thumb.innerHTML=preview.toSVG();preview.destroy();
        button.append(thumb,number,name);
        button.addEventListener('click',()=>select(t,true));picker.append(button);
      });
      host!.querySelector('.study-atlas-caption')!.textContent=`${atlas.name.toUpperCase()} · ${atlas.types.length} STUDIES`;
    }
    preset=options(active);selectedIndex=0;refreshControl();
    chart.update({...resetChartOptions,...preset,theme:displayPalette(preset.theme as ThemeName),detail,animate:false});
    atlasButtons.forEach((button,i)=>button.setAttribute('aria-pressed',String(studyAtlases[i].id===activeAtlas)));
    picker.querySelectorAll<HTMLButtonElement>('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.study===active)));
    selectChart.value=active;
    syncSelect(selectChart);
    host!.querySelector('.study-observation')!.textContent=study.observation;
    host!.querySelector('.study-title')!.textContent=chartTypes[active].name;
    host!.querySelector('.study-translation')!.textContent=chartTypes[active].encoding;
    host!.querySelector('.study-purpose')!.textContent=chartGuidance[active].question;
    host!.querySelector('.study-decision')!.textContent=chartGuidance[active].decision;
    host!.querySelector('.study-example')!.textContent=chartGuidance[active].example+' · illustrative data';
    host!.querySelector('.study-craft')!.textContent=study.craft;
    host!.querySelector('.study-caution')!.textContent=chartGuidance[active].caution;
    host!.querySelector<HTMLAnchorElement>('.study-guide')!.href=`./docs/#/${active}`;
    host!.querySelector<HTMLAnchorElement>('.study-playground')!.href=`?chart=${active}#playground`;
    if(remember) {
      const url=new URL(location.href);url.searchParams.set('study',active);history.replaceState(null,'',url);
    }
  }
  select(active);
  window.addEventListener(appearanceEvent,()=>{
    const saved=preset, index=selectedIndex;
    const hadSelection=!!host.querySelector('.study-chart .np-mark[aria-pressed="true"]');
    activeAtlas='';select(active); // Repaint the small previews in the new palette.
    preset=saved;selectedIndex=index;
    chart.update({...preset,theme:displayPalette(preset.theme as ThemeName),detail});
    if(hadSelection)chart.select(index);
    refreshControl();
  });
}
