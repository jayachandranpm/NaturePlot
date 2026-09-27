import type { ChartOptions } from '../src';

export interface StudyControl {
  label: string; min: number; max: number; step: number; value: number;
  format: (value: number) => string;
  apply: (value: number) => void;
}
/** Edit a real field while respecting the chosen encoding's domain constraints. */
export function studyControl(preset: ChartOptions, index: number): StudyControl | undefined {
  const point = preset.data[index];
  if (!point) return;
  const label = point.label ?? `Observation ${index + 1}`;
  const numeric = (min: number, max: number, step = 1, field: 'value'|'x' = 'value', noun = 'Amount'): StudyControl => ({
    label: `${label} · ${noun}`, min, max, step, value: point[field] ?? min,
    format: v => `${v}${preset.unit ? ` ${preset.unit}` : ''}`,
    apply: v => { point[field] = v; },
  });
  switch (preset.type) {
    case 'balance': return numeric(0, 100);
    case 'cord-ledger': return numeric(0, 20, .5);
    case 'seed-ledger': return numeric(0, 40, .5);
    case 'phyllotaxis': return numeric(0, 100);
    case 'leaf-veins': return numeric(0, 30, 1, 'value', 'After');
    case 'petal-box': return numeric(point.q1!, point.q3!, 1, 'value', 'Median');
    case 'bamboo': return numeric(0, 99, 1, 'value', 'Score');
    case 'murmuration': case 'pebble': case 'echo': return numeric(0, 40, 1, 'value', 'Reading');
    case 'firefly': return numeric(0, 10, .5, 'value', 'Intensity');
    case 'isobar': return numeric(10, 35, .5, 'value', 'Field reading');
    case 'migration': return { ...numeric(0, 10, .25, 'x', 'East / west'), format: v => `${v} on the x axis` };
    case 'star-cycle': return { label:'Cycle cursor', min:0, max:11.75, step:.25, value:preset.cyclePosition ?? 0, format:v=>`Week ${v}`, apply:v=>{preset.cyclePosition=v;} };
    case 'sundial': {
      const time = (v: number) => `${String(Math.floor(v/60)).padStart(2,'0')}:${String(v%60).padStart(2,'0')}`;
      const [h,m] = (preset.at ?? '12:00').split(':').map(Number);
      return { label:'Time cursor', min:0,max:1439,step:1,value:h*60+m,format:time,apply:v=>{preset.at=time(v);} };
    }
    case 'phenology': {
      const start = Date.parse(preset.startDate!), day=86400000;
      const date = (v: number) => new Date(start+v*day).toISOString().slice(0,10);
      return {label:`${label} · Observed date`,min:0,max:Math.round((Date.parse(preset.endDate!)-start)/day),step:1,
        value:Math.round((Date.parse(point.observedAt ?? point.expectedStart ?? preset.startDate!)-start)/day),
        format:date,apply:v=>{point.observedAt=date(v);} };
    }
    case 'season-wheel': {
      const start=Date.UTC(preset.year!,0,1),end=Date.UTC(preset.year!+1,0,1),day=86400000;
      const date=(v:number)=>new Date(start+v*day).toISOString().slice(0,10);
      return {label:'Date cursor',min:0,max:(end-start)/day-1,step:1,value:(Date.parse(preset.at!)-start)/day,format:date,apply:v=>{preset.at=date(v);}};
    }
    case 'lunar-cycle': return {label:'Cycle cursor',min:0,max:preset.cycleLength!-.25,step:.25,value:preset.cyclePosition??0,format:v=>`${v} ${preset.cycleUnit??'units'}`,apply:v=>{preset.cyclePosition=v;}};
    case 'daylight': {
      const minute=(t:string)=>{const [h,m]=t.split(':').map(Number);return h*60+m;};
      const time=(v:number)=>`${String(Math.floor(v/60)).padStart(2,'0')}:${String(v%60).padStart(2,'0')}`;
      return {label:`${label} · Closing time`,min:minute(point.start!)+1,max:1440,step:1,value:minute(point.end!),format:time,apply:v=>{point.end=time(v);}};
    }
    case 'frost': {
      if(point.track===point.label)return; // A correlation diagonal remains one.
      return {...numeric(-1,1,.05,'value','Correlation'),apply:v=>{point.value=v;const mirror=preset.data.find(p=>p.track===point.label&&p.label===point.track);if(mirror)mirror.value=v;}};
    }
    case 'coral-range': return numeric(point.low!,point.high!,.5,'value','Central estimate');
    case 'pitcher': return numeric(preset.data[index+1]?.value??0,index?preset.data[index-1].value!:Math.max(1500,point.value??0),1,'value','People at stage');
    default: {
      if(typeof point.value!=='number')return;
      const signed=['river','mountain','glacier','tidal-rhythm'].includes(preset.type);
      const largest=Math.max(1,...preset.data.map(p=>Math.abs(p.value??0)));
      const maximum=preset.max??(preset.type==='water-clock'||preset.type==='waterline'?point.target??100:Math.ceil(largest*1.5));
      return numeric(signed?-maximum:0,maximum,1,'value',preset.timeMode==='elapsed'?'Elapsed':'Amount');
    }
  }
}
