import { chartUseCases, type ChartOptions, type ChartType } from '../src';

/** Concrete demonstration scenarios. Numbers are illustrative, never observed business data. */
export function businessSample(preset: ChartOptions, fresh=false): ChartOptions {
  const type=preset.type as ChartType, data=preset.data.map(p=>({...p}));
  const labels: Partial<Record<ChartType,string[]>>={
    forest:['Online shop','Marketplace','Retail','Wholesale','Subscriptions','Events','Referrals'],
    bloom:['Clarity','Speed','Courtesy','Resolution','Follow-up','Availability'],
    tide:['Collected invoices'],rings:['Tickets resolved','Follow-ups','Orders shipped','Reviews completed'],
    'seed-ledger':['North team','South team','Online team','Retail team'], waterline:['Packaging stock'],
    sundial:['Opening shift','Appointments','Lunch cover','Afternoon shift','Late support'],
    'season-wheel':['Plan & research','Spring promotion','Summer promotion','Year-end campaign','Summer training'],
    phenology:['Contract signed','Account setup','Data imported','Team training','Go live'],
    'lunar-cycle':['Inspect','Clean','Lubricate','Calibrate','Review','Reset'],
    'water-clock':['Customer appointment'],balance:['Budget','Spending'],
    'star-cycle':['Kickoff','Check-in','Training','Review','Feedback','Renewal'],
    fern:['Damaged','Wrong item','Late delivery','Wrong size','Other'],
    phyllotaxis:['Home','Food','Clothing','Office','Other'],lotus:['Orders','Calls','Demos','Proposals','Reviews','Training'],
    'petal-box':['Provider A','Provider B','Provider C'],
    glacier:['Opening balance','Sales','Rent','Supplies','Services','Other income'],
    canopy:['Advertising','Research','Equipment','Software','Delivery','Packaging'],
  };
  if(labels[type])data.forEach((p,i)=>{p.label=labels[type]![i%labels[type]!.length];});
  if(type==='sundial')data.forEach(p=>{p.track=p.track==='Work'?'Appointments':'Coverage';});
  if(type==='season-wheel')data.forEach(p=>{p.track=p.track==='Garden'?'Marketing':'Training';});
  if(type==='river')data.forEach((p,i)=>{p.label=`Week ${i+1}`;p.value=(p.value??0)*20*(i===2||i===8?-1:1);});
  if(type==='canopy')data.forEach((p,i)=>{p.track=['Marketing','Marketing','Operations','Operations','Fulfillment','Fulfillment'][i];});
  if(type==='dune')data.forEach(p=>{const track={Morning:'New customers',Afternoon:'Returning',Evening:'Wholesale'}[p.track!];p.track=track;p.label=`${track} · ${p.position} items`;});
  if(type==='sediment')data.forEach(p=>{p.track={Reading:'Home',Watching:'Food',Making:'Office'}[p.track!]!;p.label=`${p.track} · week ${p.position}`;});
  if(type==='delta')data.forEach((p,i)=>{p.source='Incoming enquiries';p.destination=['Sales','Support','Accounts','Partnerships'][i];p.label=p.destination;});
  if(type==='estuary')data.forEach(p=>{p.destination={Website:'Sales',Mobile:'Customer care',Tools:'Finance'}[p.destination!]!;p.label=`${p.source} → ${p.destination}`;});
  if(type==='firefly')data.forEach(p=>{const tracks:Record<string,string>={Deploys:'Checkout',Feedback:'Website',Signups:'Fulfillment'};const old=p.track!;p.track=tracks[old]??old;p.label=p.label?.replace(old,p.track);});
  if(type==='daylight')data.forEach((p,i)=>{p.start=['09:00','09:00','08:30','09:00','10:00'][i%5];p.end=(fresh?['18:30','19:00','18:30','19:00','17:00']:['18:00','20:00','18:00','19:30','16:00'])[i%5];});
  if(type==='echo')data.forEach((p,i)=>{p.label=`Day ${i+1}`;});
  if(type==='dew')data.forEach((p,i)=>{p.label=`Campaign ${i+1}`;});
  if(type==='migration')data.forEach((p,i)=>{p.label=`Delivery ${i+1}`;});
  if(type==='isobar')data.forEach(p=>{p.label=`Sensor ${p.x}, ${p.y}`;});
  if(type==='bamboo')data.forEach((p,i)=>{p.label=`Assessment ${i+1}`;});
  // Counts stay discrete, including regenerated samples. Fractional hours and money are valid.
  const counted:ChartType[]=['rainbow','garden','forest','mountain','rings','waterline','growth-history','tidal-rhythm','honeycomb','mycelium','root-tree','fern','phyllotaxis','lotus','raincloud','dew','wind-rose','dune','delta','pitcher','migration','nautilus','echo'];
  if(counted.includes(type))data.forEach(p=>{if(typeof p.value==='number')p.value=Math.round(p.value);if(typeof p.weight==='number')p.weight=Math.round(p.weight);});
  if(type==='tide')data.forEach(p=>{p.value=(p.value??0)*500;p.target=p.target!*500;});
  const units:Partial<Record<ChartType,string>>={rainbow:'orders',garden:'orders',forest:'orders',river:'USD',bloom:'points',mountain:'orders',tide:'USD','seed-ledger':'h',waterline:'boxes','water-clock':'min',balance:'USD','cord-ledger':'h','growth-history':'members','tidal-rhythm':'visits','star-cycle':'priority',honeycomb:'tickets',mycelium:'tickets','root-tree':'tasks',canopy:'USD',fern:'returns',phyllotaxis:'orders','leaf-veins':'min','petal-box':'min',glacier:'USD',sediment:'USD',delta:'enquiries',estuary:'h',pitcher:'prospects',firefly:'severity',migration:'parcels',murmuration:'min','coral-range':'days',pebble:'min',nautilus:'contacts',echo:'orders',cairn:'USD',isobar:'°C',bamboo:'points'};
  return {...preset,data,title:chartUseCases[type].example,...(units[type]?{unit:units[type]}:{}),
    ...(type==='dew'?{xLabel:'Effort (hours)',yLabel:'Responses',weightLabel:'People reached'}:{}),
    ...(type==='migration'?{xLabel:'East / west (km)',yLabel:'North / south (km)'}:{}),
    ...(type==='isobar'?{xLabel:'Across room (m)',yLabel:'Along room (m)'}:{}),
    ...(type==='raincloud'?{xLabel:'Handling time (min)',yLabel:'Requests per minute'}:{}),
    ...(type==='firefly'?{xLabel:'Hour of day'}:{}),
    ...(type==='sediment'?{xLabel:'Week',yLabel:'Revenue (USD)'}:{}),
    ...(type==='waterline'?{thresholds:[{label:'Reorder',value:20},{label:'Working reserve',value:55},{label:'Storage limit',value:90}]}:{}),
  };
}
