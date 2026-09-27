import type { RenderContext } from './types.js';
import { mixColor } from './artwork.js';

const forms = ['seed','leaf','sprout','bud','bamboo','pod','sunflower','flower','balance-stand','balance-beam','balance-pan','cord','knot','dial','star','firefly','swallow','starling','pebble','pebble-light','ripple'] as const;
type Form = typeof forms[number];
export function hasNaturalForm(c: RenderContext, key: string): boolean {
  return c.options.detail !== 'essential' && (forms as readonly string[]).includes(key);
}

/** Native paths and paint servers only. Each form is defined once per chart. */
function defineForm(c: RenderContext, key: Form, defs: SVGDefsElement, id: string, tint?:string): void {
  const g = c.el('symbol',{id,viewBox:'0 0 100 100',preserveAspectRatio:'none',overflow:'hidden'},defs);
  const ink=c.theme.ink, leaf=c.theme.colors[0], light=c.theme.background;
  const gradient=(name:string,base:string,radial=false)=>{
    const gid=`${id}-${name}`;
    if(defs.querySelector(`[id="${gid}"]`))return `url(#${gid})`;
    const paint=radial?c.el('radialGradient',{id:gid,cx:'.32',cy:'.25',r:'.8'},defs):c.el('linearGradient',{id:gid,x1:'0',y1:'0',x2:'1',y2:'.25'},defs);
    const stops=radial?[[0,mixColor(base,'#ffffff',.45)],[.45,base],[1,mixColor(base,'#101e18',.52)]]:[[0,mixColor(base,'#101e18',.55)],[.28,base],[.43,mixColor(base,'#ffffff',.5)],[.57,base],[1,mixColor(base,'#101e18',.45)]];
    stops.forEach(([offset,color])=>c.el('stop',{offset,'stop-color':color},paint));return `url(#${gid})`;
  };
  const path=(d:string,fill='none',stroke='none',width=1,parent:Element=g,attrs:Record<string,string|number>={})=>c.el('path',{d,fill,stroke,'stroke-width':width,'stroke-linejoin':'round','stroke-linecap':'round',...attrs},parent);
  const ellipse=(cx:number,cy:number,rx:number,ry:number,fill:string,parent:Element=g,attrs:Record<string,string|number>={})=>c.el('ellipse',{cx,cy,rx,ry,fill,...attrs},parent);
  const metal=()=>gradient('metal',mixColor(leaf,'#c49a53',.7));
  const leafShape=(parent:Element,fill:string)=>{
    path('M3 51C21 3 73 4 98 48C72 91 28 96 3 51Z',fill,leaf,.7,parent);
    path('M5 51Q53 49 95 48','none',mixColor(leaf,'#fff',.6),1.2,parent);
    for(let j=0;j<7;j++){const x=16+j*10;path(`M${x} 50Q${x+7} ${27-j*.4} ${x+17} ${17+Math.abs(3-j)*3}M${x} 50Q${x+8} ${74+j*.3} ${x+19} ${84-Math.abs(3-j)*3}`,'none',mixColor(leaf,'#fff',.4),.55,parent,{opacity:.65});}
  };
  if(key==='leaf') leafShape(g,gradient('leaf',leaf,true));
  else if(key==='seed') {
    const shell=tint??'#847050';
    path('M4 53C7 12 48 3 95 39Q104 48 94 58C45 98 11 91 4 53Z',gradient('shell',shell,true),mixColor(shell,'#17231a',.3),1);
    for(let j=0;j<5;j++)path(`M${15+j*3} ${24+j*9}Q${53+j*5} ${13+j*15} 93 48`,'none',mixColor(shell,j%2?'#17231a':'#ffffff',.4),1.5,g,{opacity:.8});
    ellipse(12,51,3,7,mixColor(shell,'#ffffff',.35));
  } else if(key==='sprout'||key==='bud'||key==='flower') {
    path('M49 89Q53 68 49 36','none',leaf,3);
    path('M50 83Q43 90 37 97M49 87L52 99M50 86Q58 89 62 96','none',mixColor(leaf,'#a7875b',.6),1.1);
    const left=c.el('g',{transform:'translate(7 28) rotate(26 22 20) scale(.43 .36)'},g);leafShape(left,gradient('blade',leaf,true));
    const right=c.el('g',{transform:'translate(51 15) rotate(-25 21 20) scale(.43 .38)'},g);leafShape(right,`url(#${id}-blade)`);
    if(key==='bud') {path('M49 41Q31 18 49 3Q69 17 49 41Z',gradient('bud',leaf,true),leaf,1);path('M49 8Q43 23 49 39','none',light,1,g,{opacity:.6});}
    if(key==='flower') {for(let j=0;j<8;j++){const p=c.el('g',{transform:`rotate(${j*45} 49 23)`},g);ellipse(49,11,6,13,gradient(`petal-${j}`,c.theme.colors[3%c.theme.colors.length],true),p);}ellipse(49,23,7,7,'#b79143');}
  } else if(key==='bamboo') {
    path('M24 1Q50-1 76 1L74 99Q50 100 26 99Z',gradient('culm',leaf),leaf,.8);
    for(let j=1;j<6;j++){const y=j*16;path(`M24 ${y}Q49 ${y+3} 76 ${y}`,'none',mixColor(leaf,'#dfdb99',.6),2);path(`M25 ${y+2}Q48 ${y+4} 74 ${y+2}`,'none',mixColor(leaf,'#14251d',.5),1);}
    path('M39 3L38 96M61 3L63 96','none',light,.8,g,{opacity:.18});
  } else if(key==='pod') {
    path('M1 49C18 3 76 3 99 49C74 96 22 96 1 49Z',gradient('pod',leaf,true),leaf,1.2);
    path('M4 49Q49 17 96 49Q51 79 4 49Z',mixColor(leaf,'#0e2719',.65));
    for(let j=0;j<5;j++)ellipse(19+j*15.5,50,8,18,gradient(`pea-${j}`,mixColor(leaf,'#d7d289',.5),true));
    path('M2 48Q50 35 98 48M3 51Q52 80 98 50','none',mixColor(leaf,'#f1e8b3',.7),1.5);
  } else if(key==='sunflower') {
    const paint=gradient('petal',mixColor(c.theme.colors[3%c.theme.colors.length],'#d8ad47',.7),true);
    for(let layer=0;layer<2;layer++)for(let j=0;j<24;j++){
      const a=j*15+layer*7.5, part=c.el('g',{transform:`rotate(${a} 50 50)`},g);
      path(`M45 29Q${39-layer} 14 50 ${2+layer*5}Q${62+layer} 14 55 29Z`,paint,'#a88439',.15,part);
      path(`M50 28Q48 14 50 ${5+layer*5}`,'none','#f5df95',.35,part,{opacity:.7});
    }
    ellipse(50,50,26,26,gradient('head','#685538',true));
  } else if(key==='balance-stand') {
    path('M42 4Q50 0 58 4L58 17Q63 29 58 46L57 68Q57 77 68 83L78 88L81 96Q51 102 19 96L22 88L32 83Q43 78 43 68L42 46Q37 28 42 17Z',gradient('wood','#8b6948'),'#5d4934',.6);
    for(const y of [19,67,82,88,95])path(`M${y>80?24:42} ${y}Q50 ${y+3} ${y>80?76:58} ${y}`,'none','#ddbc80',.7,g,{opacity:.6});
    ellipse(50,6,10,6,metal());
  } else if(key==='balance-beam') {
    path('M1 39Q23 37 44 29Q50 7 56 29Q78 37 99 39V64Q78 62 56 67Q50 93 44 67Q22 62 1 64Z',metal(),'#887344',.7);
    ellipse(50,49,7.5,35,metal());ellipse(50,49,4.3,22,gradient('pivot','#96814b',true));
    path('M3 43L40 37M60 37L97 43','none','#f4dd9d',.7);
  } else if(key==='balance-pan') {
    for(const x of [8,50,92]) {
      path(`M50 3L${x} 75`,'none','#8b784a',.8);
      for(let j=0;j<13;j++){const t=j/13;ellipse(50+(x-50)*t,4+70*t,1.1,1.8,'none',g,{stroke:'#c4ae76','stroke-width':.55});}
    }
    path('M3 75Q50 88 97 75Q93 96 50 99Q7 96 3 75Z',metal(),'#7c683b',.7);
    ellipse(50,75,47,7,metal(),g,{stroke:'#af965b','stroke-width':.8});
    path('M9 84Q47 97 91 84','none','#ead7a0',.8,g,{opacity:.8});
    ellipse(50,3,3,2,metal());
  } else if(key==='cord'||key==='knot') {
    const rope=gradient('flax',mixColor(leaf,'#ae9771',.7));
    if(key==='cord'){
      path('M32 0Q27 43 35 100L67 100Q61 53 68 0Z',rope);
      for(let j=0;j<25;j++)path(`M30 ${j*4}Q51 ${j*4+2} 68 ${j*4+1}`,'none','#725f44',.65,g,{opacity:.6});
      path('M44 0Q40 51 47 100','none','#e4d5af',1.5,g,{opacity:.6});
    }else{
      const d='M4 64C24 81 67 9 80 31C95 57 24 86 20 44C15 12 59 15 69 51C77 78 86 70 97 61';
      path(d,'none','#776549',17);path(d,'none',rope,14);path(d,'none','#e3d0a4',1.2,g,{'stroke-dasharray':'2 4'});
      path('M24 26Q36 35 41 59','none','#6d5b3d',2,g,{opacity:.8});
    }
  } else if(key==='dial') {
    ellipse(50,50,49,49,gradient('stone',mixColor(c.theme.grid,'#c4b78e',.5),true),g,{stroke:c.theme.muted,'stroke-width':.45});
    for(const r of [43,45,47])ellipse(50,50,r,r,'none',g,{stroke:c.theme.muted,'stroke-width':.2,opacity:.7});
    for(let j=0;j<90;j++){const a=j*2.4,r=Math.sqrt((j+.5)/90)*43;ellipse(50+Math.cos(a)*r,50+Math.sin(a)*r,.13,.17,c.theme.muted,g,{opacity:.23});}
    path('M48 51L53 21L56 53Z',metal(),'#8b774d',.3);
  } else if(key==='star') {
    const glow=c.el('radialGradient',{id:`${id}-glow`},defs);
    [[0,.85],[.2,.42],[1,0]].forEach(([offset,opacity])=>c.el('stop',{offset,'stop-color':c.theme.colors[3%c.theme.colors.length],'stop-opacity':opacity},glow));
    ellipse(50,50,49,49,`url(#${id}-glow)`);
    path('M50 9L54 44L91 50L54 54L50 91L46 54L9 50L46 45Z',gradient('star',c.theme.colors[3%c.theme.colors.length],true));ellipse(50,50,3,3,light);
  } else if(key==='firefly') {
    const wing=gradient('wing',mixColor(leaf,light,.55),true);
    for(const side of [-1,1]){const p=c.el('g',{transform:`translate(50 0) scale(${side} 1)`},g);path('M0 45Q21 12 43 23Q52 47 0 63Z',wing,leaf,.6,p,{opacity:.68});for(let j=0;j<4;j++)path(`M1 54Q${15+j*6} ${42-j*5} ${32+j*3} ${26+j*3}`,'none',leaf,.45,p,{opacity:.6});path('M2 44L22 58L29 75M2 54L17 70L16 86M2 34L14 31L24 16','none',ink,1.2,p);}
    ellipse(50,59,7,22,gradient('abdomen',leaf,true));ellipse(50,70,6,11,gradient('light',c.theme.colors[3%c.theme.colors.length],true));ellipse(50,36,8,8,ink);ellipse(50,25,5,6,ink);path('M47 23L40 10M53 23L60 10','none',ink,1);
  } else if(key==='swallow'||key==='starling') {
    const feather=gradient('feather',mixColor(leaf,ink,.7),true);
    for(const side of [-1,1]){const p=c.el('g',{transform:`translate(50 0) scale(${side} 1)`},g);path('M0 35C13 36 24 24 45 5L37 40L16 60L2 59Z',feather,ink,.6,p);for(let j=0;j<8;j++)path(`M${7+j*2} ${40+j*1.8}L${40-j*3} ${14+j*4.5}`,'none',mixColor(leaf,light,.5),.65,p,{opacity:.5});}
    path(key==='swallow'?'M44 65L35 98L50 83L65 98L55 64Z':'M43 64L36 90Q50 97 65 90L56 64Z',feather,ink,.4);
    ellipse(50,48,7,26,feather);ellipse(50,22,5,8,ink);path('M47 16L50 9L53 16Z',ink);path('M47 35Q43 52 49 66','none',light,1,g,{opacity:.4});
  } else if(key==='pebble'||key==='pebble-light') {
    const base=key==='pebble'?mixColor(leaf,'#71888b',.55):mixColor(leaf,'#c3ad83',.7);
    path('M3 55C-2 21 39 5 74 15C101 23 105 64 90 80C68 99 11 95 3 55Z',gradient('pebble',base,true),mixColor(base,ink,.3),.5);
    path('M13 25Q39 33 54 48T85 85M27 15Q35 41 61 57T91 71','none',mixColor(base,light,.7),1.1,g,{opacity:.75});
    path('M15 62Q12 34 40 23','none',light,1.6,g,{opacity:.32});
  } else if(key==='ripple') {
    for(let j=0;j<5;j++){const r=8+j*9;ellipse(50,50,r,r,'none',g,{stroke:leaf,'stroke-width':2.3-j*.3,opacity:.85-j*.14});path(`M${50-r*.78} ${50-r*.2}A${r*.81} ${r*.81} 0 0 1 ${50+r*.25} ${50-r*.78}`,'none',light,.8,g,{opacity:.8-j*.1});}
  }
}

export function naturalSpecimen(c: RenderContext, key: string, parent: Element | undefined, x:number,y:number,width:number,height:number,attrs:Record<string,string|number>={},tint?:string):SVGGElement|null {
  if(!hasNaturalForm(c,key)||width<=0||height<=0)return null;
  let defs=c.svg.querySelector<SVGDefsElement>('defs');if(!defs)defs=c.el('defs');
  const id=`${c.id}-form-${key}${tint?`-${tint.slice(1)}`:''}`;
  if(!c.svg.querySelector(`[id="${id}"]`))defineForm(c,key as Form,defs,id,tint);
  const group=c.el('g',{class:'np-specimen','data-specimen':key,'aria-hidden':'true',...attrs},parent);
  if(parent)c.el('rect',{x,y,width,height,fill:'transparent','pointer-events':'all',class:'np-specimen-hit'},group);
  c.el('use',{href:`#${id}`,x,y,width,height,'pointer-events':'none'},group);return group;
}

export function focusHalo(c:RenderContext,parent:Element,x:number,y:number,radius:number):void {
  c.el('circle',{cx:x,cy:y,r:radius,fill:'none',stroke:c.theme.ink,'stroke-width':1.5,'stroke-dasharray':'3 4',opacity:0,class:'np-focus-halo','aria-hidden':'true','pointer-events':'none'},parent);
}
