/* Cat Café Tycoon — game logic, UI and 3D scene. */
(function(){
'use strict';
const KEY='catcafe-v1';
const OFFLINE_CAP=8*3600;

/* ======================= DATA ======================= */
const STATIONS=[
 {name:'Milk Bowl Bar',      desc:'Warm milk for sleepy kittens',  cost:4,           rev:1,           t:0.6,   r:1.07, mgr:1000,   fur:'#FFFFFF',inner:'#FFB3C9',eye:'#2B1B30',boss:'Mittens',      col:'#8EC9FF',prop:'milk'},
 {name:'Catnip Tea House',   desc:'Calming brews, very sniffable', cost:60,          rev:60,          t:3,     r:1.15, mgr:15000,  fur:'#FFA552',inner:'#FFD9B0',eye:'#2B1B30',boss:'Biscuit',      col:'#8FE0AA',prop:'tea'},
 {name:'Fish Taco Cart',     desc:'Tuna tacos, extra crunchy',     cost:720,         rev:540,         t:6,     r:1.14, mgr:1e5,    fur:'#B9B6C9',inner:'#FFC2D4',eye:'#2B1B30',boss:'Sir Whiskers', col:'#FFD66E',prop:'taco'},
 {name:'Yarn Ball Lounge',   desc:'Unravel in style',              cost:8640,        rev:4320,        t:12,    r:1.13, mgr:5e5,    fur:'#C48A5A',inner:'#F2C9A4',eye:'#2B1B30',boss:'Mochi',        col:'#FF9EC4',prop:'yarn'},
 {name:'Cat Tower Suites',   desc:'Five floors of scratch posts',  cost:103680,      rev:51840,       t:24,    r:1.12, mgr:1.2e6,  fur:'#FFE3B8',inner:'#FFB3C9',eye:'#2B1B30',boss:'Pumpkin',      col:'#C9A8F0',prop:'tower'},
 {name:'Sushi Counter',      desc:'Salmon nigiri, hold the rice',  cost:1244160,     rev:622080,      t:96,    r:1.11, mgr:1e7,    fur:'#4A4258',inner:'#8E7FA6',eye:'#FFD24D',boss:'Luna',         col:'#FFB38A',prop:'sushi'},
 {name:'Royal Nap Spa',      desc:'Heated cushions, sunbeam view', cost:14929920,    rev:7464960,     t:384,   r:1.10, mgr:1.11e8, fur:'#E8E0F5',inner:'#C9A8F0',eye:'#4A6FD1',boss:'Duchess',      col:'#B5A3FF',prop:'spa'},
 {name:'Moonlight Rooftop',  desc:'Stargazing for fancy felines',  cost:179159040,   rev:89579520,    t:1536,  r:1.09, mgr:5.55e8, fur:'#2F2A3A',inner:'#6B5A8A',eye:'#7CF0C8',boss:'Captain Paws', col:'#7C8CE0',prop:'scope'},
 {name:'Catnip Cruise',      desc:'All-you-can-eat tuna at sea',   cost:2149908480,  rev:1074954240,  t:6144,  r:1.08, mgr:1e10,   fur:'#F4F4F4',inner:'#9ED8F0',eye:'#2F7FD1',boss:'Admiral Fluff',col:'#6FD3E6',prop:'boat'},
 {name:'Purrsonal Space Station',desc:'Zero-gravity naps in orbit',cost:25798901760, rev:12899450880, t:36864, r:1.07, mgr:1e11,   fur:'#FFC94D',inner:'#FFE7A8',eye:'#2B1B30',boss:'Astro',        col:'#A9B2CC',prop:'space'}
];
STATIONS.forEach(s=>s.loc=0);
const FURPAL=[['#FFFFFF','#FFB3C9'],['#FFA552','#FFD9B0'],['#B9B6C9','#FFC2D4'],['#C48A5A','#F2C9A4'],['#FFE3B8','#FFB3C9'],['#E8E0F5','#C9A8F0'],['#F3E3C8','#7A5A48'],['#E0A060','#FFD9B0']];
const EXTRA=[
 {loc:1,bosses:['Sandy','Captain Coral','Bubbles','Wave','Sprinkles','Beacon'],list:[
   ['Coconut Milk Stand','Fresh coconut milk, served chilled','coconut','#7FD8C8'],['Shrimp Shack','Grilled shrimp on a stick','shrimp','#FF9F8A'],
   ['Sandcastle Suites','Five-tower sand mansions','castle','#F3D28B'],['Surf School','Learn to ride the waves','surf','#6FC3F0'],
   ['Tuna Ice Cream','A sundae made of tuna','icecream','#FFC2E0'],['Lighthouse Lounge','Best sunset view on the coast','lighthouse','#FF8E8E']]},
 {loc:2,bosses:['Frost','Maple','Pebble','Blizzard','Cookie','Aurora'],list:[
   ['Hot Cocoa Hut','Marshmallows on top','cocoa','#C98F6B'],['Salmon Smokehouse','Slow-smoked for fancy noses','fishrack','#E8875C'],
   ['Igloo Nap Pods','The coziest cold nap','igloo','#CFE8FF'],['Ski Lift Lounge','Warm blankets at the top','ski','#8FB7FF'],
   ['Snowball Arena','Friendly snowball fights','snowball','#DDE8FA'],['Aurora Spa','Hot springs under the lights','aurora','#9FE8C8']]},
 {loc:3,bosses:['Nova','Orbit','Comet','Nebula','Rocket','Stellar'],list:[
   ['Space Milk Bar','Milk from the Milky Way','spacemilk','#C7CEF5'],['Asteroid Sushi','Rolls dusted with stardust','asteroid','#B8ADA8'],
   ['Crater Hot Springs','Bubbling moon pools','spring','#9FD8FF'],['Zero-G Yarn Dome','Yarn floats in here','dome','#E5B8FF'],
   ['Comet Cruise Port','Day trips to Saturn','comet','#FFD38A'],['Galaxy Palace','The fanciest place in space','palace','#B48CFF']]}
];
{let gk=10;EXTRA.forEach(L=>L.list.forEach((d,j)=>{const cost=2.58e10*Math.pow(12,gk-9),t=[1.5,6,20,60,180,600][j],f=FURPAL[(gk*3)%FURPAL.length];
  STATIONS.push({name:d[0],desc:d[1],prop:d[2],col:d[3],cost,t,rev:cost*t/(3000*Math.pow(2,j)),r:1.12-0.008*j,mgr:cost*10,fur:f[0],inner:f[1],eye:'#2B1B30',boss:L.bosses[j],loc:L.loc});gk++}))}
const N=STATIONS.length;
const MILES=[25,50,100,200,300,400,500];

const LOCS=[
 {name:'Cozy Corner',tag:'Where it all began',art:'linear-gradient(135deg,#FF8FB5,#FFD0DF)',floor:'pink',wall:'#FF9FBF',win:'#BFE6FF',rug:'#FFE08A'},
 {name:'Sunny Beach',tag:'Sand, sea and shrimp',art:'linear-gradient(135deg,#3FB6EE,#F7E2B0)',floor:'sand',wall:'#9ED8F5',win:'#6FD0FF',rug:'#D9A877'},
 {name:'Snowy Lodge',tag:'Hot cocoa by the fire',art:'linear-gradient(135deg,#8A5A3A,#DCEBFF)',floor:'snowwood',wall:'#A8724A',win:'#F4FAFF',rug:'#D9544F'},
 {name:'Moon Base',tag:'Low gravity, high profits',art:'linear-gradient(135deg,#1C1640,#8C7CFF)',floor:'metal',wall:'#4A4A6A',win:'#1A1440',rug:'#5BC8FF',space:true}
];
LOCS.forEach((L,l)=>{L.st=[];STATIONS.forEach((s,i)=>{if(s.loc===l)L.st.push(i)});L.unlock=l?STATIONS[L.st[0]].cost*3:0});

const UPS=[];
const TIER=['Better Recipes','Secret Sauce','Chef\'s Kiss'];
STATIONS.forEach((b,i)=>[1e3,1e5,1e7].forEach((m,t)=>UPS.push({id:'s'+i+'_'+t,name:TIER[t],desc:b.name+' profit ×3',cost:b.cost*m*(i===0?25:1),kind:'st',i,x:3})));
[[1e6,'Cozy Cushions'],[1e9,'Neon Paw Sign'],[1e12,'Famous Food Critic'],[1e15,'Cat Café TV Show'],[1e18,'Intergalactic Franchise'],[1e21,'Seaside Billboard'],[1e24,'Snow Globe Souvenirs'],[1e27,'Moon Postcards'],[1e30,'Cat Café: The Movie']]
  .forEach(([c,n],k)=>UPS.push({id:'all'+k,name:n,desc:'Every station profit ×3',cost:c,kind:'all',x:3}));
[[250,'Fluffy Brush'],[2.5e4,'Premium Treats'],[2.5e6,'Golden Comb'],[2.5e9,'Royal Massage'],[2.5e13,'Cloud Pillow'],[2.5e18,'Starlight Brush']].forEach(([c,n],k)=>UPS.push({id:'pet'+k,name:n,desc:'Petting cats gives ×5 coins',cost:c,kind:'pet',x:5}));
[[5e5,'Lucky Bell'],[5e9,'Golden Doorbell']].forEach(([c,n],k)=>UPS.push({id:'gold'+k,name:n,desc:'Golden cats visit more often and give double',cost:c,kind:'gold',x:2}));
UPS.sort((a,b)=>a.cost-b.cost);

const RARITY=[{n:'Common',w:78,b:1},{n:'Rare',w:17,b:3},{n:'Epic',w:4,b:10},{n:'Legendary',w:1,b:25}];
const BREEDS=[
 {id:'snow',name:'Snowball',r:0,fur:'#FFFFFF',inner:'#FFB3C9'},
 {id:'ginger',name:'Ginger',r:0,fur:'#FFA552',inner:'#FFD9B0'},
 {id:'smokey',name:'Smokey',r:0,fur:'#B9B6C9',inner:'#FFC2D4'},
 {id:'cocoa',name:'Cocoa',r:0,fur:'#C48A5A',inner:'#F2C9A4'},
 {id:'midnight',name:'Midnight',r:0,fur:'#3A3340',inner:'#6B5A8A',eye:'#FFD24D'},
 {id:'butter',name:'Butter',r:0,fur:'#FFE3B8',inner:'#FFB3C9'},
 {id:'calico',name:'Calico',r:1,fur:'#FFFFFF',inner:'#FFB3C9',patch:'#FFA552',patch2:'#3A3340'},
 {id:'tux',name:'Tuxedo',r:1,fur:'#2F2A3A',inner:'#6B5A8A',eye:'#9BE36B',muzzle:'#FFFFFF'},
 {id:'siamese',name:'Siamese',r:1,fur:'#F3E3C8',inner:'#7A5A48',eye:'#4A8FE0',mask:'#7A5A48'},
 {id:'tabby',name:'Tabby',r:1,fur:'#E0A060',inner:'#FFD9B0',stripes:'#9A5A2A'},
 {id:'surfer',name:'Surfer Cat',r:1,fur:'#FFB36B',inner:'#FFD9B0',acc:'glasses',locs:[1]},
 {id:'snowcat',name:'Snow Cat',r:1,fur:'#F4F8FF',inner:'#BFD8FF',eye:'#4A8FE0',acc:'scarf',locs:[2]},
 {id:'astro',name:'Astro Cat',r:1,fur:'#C7C3D6',inner:'#FFC2D4',acc:'helmet',locs:[3]},
 {id:'bubble',name:'Bubblegum',r:2,fur:'#FF9EC9',inner:'#FFFFFF'},
 {id:'mintchip',name:'Mint Chip',r:2,fur:'#A8EFD0',inner:'#FFFFFF',patch:'#6B4A3A',patch2:'#6B4A3A'},
 {id:'royal',name:'Royal Cat',r:2,fur:'#FFFFFF',inner:'#C9A8F0',eye:'#4A6FD1',acc:'crown'},
 {id:'pumpkin',name:'Pumpkin Cat',r:2,fur:'#FF8A2A',inner:'#FFD9B0',acc:'witch',event:'spooky'},
 {id:'galaxy',name:'Galaxy Cat',r:3,fur:'#5B3FD1',inner:'#C9A8FF',eye:'#FFFFFF',glow:'#7F5CFF'},
 {id:'ghost',name:'Ghost Cat',r:3,fur:'#F2F2FF',inner:'#DCD6FF',eye:'#5A4A8A',ghost:true},
 {id:'rainbow',name:'Rainbow Cat',r:3,fur:'#FF6FAE',inner:'#FFFFFF',rainbow:true}
];
BREEDS.forEach(b=>{b.eye=b.eye||'#2B1B30'});
const BREED=Object.fromEntries(BREEDS.map(b=>[b.id,b]));

const DECOR=[
 {id:'catbed',name:'Cozy Cat Bed',desc:'A sleepy cat moves in',cost:500,b:5},
 {id:'post',name:'Scratching Post',desc:'Cats love a good scratch',cost:2e4,b:5},
 {id:'lamp',name:'Warm Floor Lamp',desc:'Glows softly at night',cost:2e5,b:5},
 {id:'painting',name:'Cat Portrait',desc:'A very serious painting',cost:3e6,b:5},
 {id:'shelf',name:'Bookshelf',desc:'Full of cat-themed novels',cost:5e7,b:5},
 {id:'tank',name:'Fish Tank',desc:'Golden cats visit 25% more often',cost:1e9,b:5},
 {id:'lights',name:'Fairy Lights',desc:'Twinkle along the wall at night',cost:2e10,b:5},
 {id:'jar',name:'Treat Jar',desc:'Rare cats visit twice as often',cost:5e11,b:5},
 {id:'fireplace',name:'Fireplace',desc:'Crackles all night long',cost:1e13,b:10},
 {id:'piano',name:'Tiny Piano',desc:'Customers stay to listen',cost:1e15,b:10},
 {id:'fountain',name:'Milk Fountain',desc:'An endless flow of milk',cost:1e18,b:15},
 {id:'statue',name:'Golden Cat Statue',desc:'The pride of your empire',cost:1e21,b:25}
];
const FLOORS=[{id:'default',name:'Location style',cost:0},{id:'pink',name:'Strawberry',cost:2e3},{id:'mint',name:'Mint Checks',cost:1e5},{id:'wood',name:'Oak Planks',cost:1e8},{id:'lilac',name:'Lilac Tiles',cost:1e11},{id:'stars',name:'Starry Night',cost:1e15}];
const FLOOR_CSS={pink:'repeating-conic-gradient(#FFC9DA 0 25%,#FFEFF4 0 50%) 0 0/18px 18px',mint:'repeating-conic-gradient(#BDEFD6 0 25%,#EFFFF6 0 50%) 0 0/18px 18px',
  wood:'repeating-linear-gradient(0deg,#D9A877 0 10px,#C8925F 10px 12px)',lilac:'repeating-conic-gradient(#D9C9FF 0 25%,#F4EEFF 0 50%) 0 0/18px 18px',
  stars:'radial-gradient(#FFF6B0 1px,transparent 1.5px) 0 0/10px 10px,#2A2350'};
const WALLS=[{id:'default',name:'Location style',cost:0},{id:'rose',name:'Rose',c:'#FF9FBF',cost:1e3},{id:'butter',name:'Butter',c:'#FFE08A',cost:5e4},{id:'sky',name:'Sky',c:'#9ED8F5',cost:5e7},{id:'mintw',name:'Mint',c:'#9FE3C0',cost:5e10},{id:'lilacw',name:'Lilac',c:'#C9B3FF',cost:5e14}];

/* ======================= STATE ======================= */
function fresh(){return{money:0,total:0,lifetime:0,pets:0,stations:STATIONS.map((s,i)=>({owned:i===0?1:0,prog:0,run:false,mgr:false})),
  ach:{},ups:{},paws:0,rebirths:0,golden:0,rushUntil:0,daily:{day:'',streak:0},buy:'1',tab:'cafe',sub:{shop:'up',more:'map'},last:Date.now(),offline:0,muted:false,zoomed:false,
  loc:0,locs:{0:true},decor:{},floors:{default:1},walls:{default:1},floor:'default',wall:'default',cats:{},newCats:false,q:null,gifts:0,questsDone:0,rareNext:0}}
let S;
function load(){try{const raw=localStorage.getItem(KEY);if(raw){const d=JSON.parse(raw);const f=fresh();
  const out=Object.assign(f,d,{stations:f.stations.map((s,i)=>Object.assign(s,(d.stations||[])[i]||{}))});
  if(!d.lifetime)out.lifetime=out.total;out.ups=out.ups||{};out.daily=out.daily||{day:'',streak:0};
  out.sub=Object.assign({shop:'up',more:'map'},d.sub||{});
  if(!['cafe','shop','cats','quests','more'].includes(out.tab))out.tab='cafe';
  if(!out.locs[out.loc])out.loc=0;return out}}catch(e){}return fresh()}
function save(){S.last=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
S=load();

/* ======================= MATH ======================= */
const achCount=()=>Object.keys(S.ach).length;
const rushOn=()=>Date.now()<S.rushUntil;
function upMult(kind,i){let m=1;for(const u of UPS)if(S.ups[u.id]&&u.kind===kind&&(kind!=='st'||u.i===i))m*=u.x;return m}
function decorPct(){let p=0;for(const d of DECOR)if(S.decor[d.id])p+=d.b;for(const f of FLOORS)if(f.id!=='default'&&S.floors[f.id])p+=2;for(const w of WALLS)if(w.id!=='default'&&S.walls[w.id])p+=2;return p}
function catPct(){let p=0;for(const b of BREEDS)if(S.cats[b.id])p+=RARITY[b.r].b;return p}
function gMult(noRush){return (1+0.1*achCount())*(1+0.02*S.paws)*upMult('all')*(1+decorPct()/100)*(1+catPct()/100)*(!noRush&&rushOn()?3:1)}
function speed(i){const o=S.stations[i].owned;let m=1;for(const x of MILES)if(o>=x)m*=2;return m}
const cycleT=i=>STATIONS[i].t/speed(i);
const payout=(i,noRush)=>STATIONS[i].rev*S.stations[i].owned*upMult('st',i)*gMult(noRush);
function ips(noRush,loc){let v=0;for(let i=0;i<N;i++){const s=S.stations[i];if(loc!==undefined&&STATIONS[i].loc!==loc)continue;if(s.mgr&&s.owned)v+=payout(i,noRush)/cycleT(i)}return v}
function costN(i,n){const b=STATIONS[i],o=S.stations[i].owned;return b.cost*Math.pow(b.r,o)*(Math.pow(b.r,n)-1)/(b.r-1)}
function maxN(i){const b=STATIONS[i],o=S.stations[i].owned;const first=b.cost*Math.pow(b.r,o);return Math.max(0,Math.floor(Math.log(S.money*(b.r-1)/first+1)/Math.log(b.r)))}
function buyCount(i){return S.buy==='max'?Math.max(1,maxN(i)):+S.buy}
function nextMile(o){for(const x of MILES)if(o<x)return x;return null}
const pawGain=()=>Math.floor(Math.sqrt(S.total/1e7));
const petValue=()=>Math.max(1,ips()*0.08)*upMult('pet');
const openedIn=l=>LOCS[l].st.filter(i=>S.stations[i].owned>0).length;
const opened=()=>S.stations.filter(s=>s.owned>0).length;
const mgrs=()=>S.stations.filter(s=>s.mgr).length;
const maxOwned=()=>Math.max(...S.stations.map(s=>s.owned));
const upCount=()=>Object.keys(S.ups).length;
const decorCount=()=>DECOR.filter(d=>S.decor[d.id]).length;
const catsFound=()=>BREEDS.filter(b=>S.cats[b.id]).length;
const locCount=()=>Object.keys(S.locs).length;
function spooky(){const d=new Date(),m=d.getMonth(),day=d.getDate();return (m===9&&day>=15)||(m===10&&day<=3)}

const U=['','K','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc','Ud','Dd','Td','Qad','Qid','Sxd','Spd'];
function fmt(n){if(!isFinite(n))return '∞';if(n<1000)return n<100&&n%1?n.toFixed(1).replace(/\.0$/,''):Math.floor(n).toString();
  const e=Math.min(U.length-1,Math.floor(Math.log10(n)/3));const v=n/Math.pow(1000,e);return (v<10?v.toFixed(2):v<100?v.toFixed(1):Math.floor(v))+U[e]}
function fmtT(s){if(s<10)return s.toFixed(s<1?2:1)+'s';if(s<60)return Math.round(s)+'s';if(s<3600){const m=Math.floor(s/60),r=Math.round(s%60);return m+'m'+(r?' '+r+'s':'')}
  const h=Math.floor(s/3600),m=Math.round((s%3600)/60);return h+'h'+(m?' '+m+'m':'')}
function earn(v){S.money+=v;S.total+=v;S.lifetime+=v;track('earn',v)}

/* ======================= SOUND ======================= */
let AC=null;
function audio(){if(S.muted)return null;if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}}if(AC.state==='suspended')AC.resume();return AC}
function tone(f,d,type,vol,slide,delay){const a=audio();if(!a)return;const t=a.currentTime+(delay||0);const o=a.createOscillator(),g=a.createGain();
  o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(f*slide,t+d);
  g.gain.setValueAtTime(vol||.1,t);g.gain.exponentialRampToValueAtTime(.0008,t+d);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+d+.03)}
let lastCoinSfx=0;
const sfx={
  coin(){const n=performance.now();if(n-lastCoinSfx<120)return;lastCoinSfx=n;tone(988,.07,'square',.03);tone(1319,.12,'square',.03,0,.055)},
  buy(){tone(523,.08,'triangle',.1);tone(784,.13,'triangle',.1,0,.07)},
  pet(){tone(520,.28,'sine',.08,1.7);tone(780,.2,'triangle',.035,1.3,.05)},
  meow(){tone(700,.12,'triangle',.07,1.5);tone(1050,.3,'triangle',.06,.6,.1)},
  level(){[523,659,784,1047].forEach((f,k)=>tone(f,.16,'triangle',.09,0,k*.08))},
  gold(){[784,988,1175,1568,1976].forEach((f,k)=>tone(f,.14,'sine',.08,0,k*.06))},
  tap(){tone(420,.06,'triangle',.06,1.4)},
  no(){tone(220,.12,'square',.035,.8)},
  gift(){[392,523,659,784,1047,1319].forEach((f,k)=>tone(f,.18,'triangle',.08,0,k*.07))}
};

/* ======================= 2D ART ======================= */
let svgN=0;
function catSVG(fur,inner,eye,o){o=o||{};const dark='#2B1B30';const id='g'+(svgN++);
  const furFill=o.rainbow?`url(#${id})`:fur;
  let s=`<svg viewBox="0 0 64 64" aria-hidden="true"${o.ghost?' opacity=".72"':''}>`;
  if(o.rainbow)s+=`<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF6FAE"/><stop offset=".35" stop-color="#FFD24D"/><stop offset=".65" stop-color="#6FE0A8"/><stop offset="1" stop-color="#7FA8FF"/></linearGradient></defs>`;
  if(o.acc==='helmet')s+=`<circle cx="32" cy="34" r="30" fill="#BFE6FF" fill-opacity=".35" stroke="#9ED8F5" stroke-width="2"/>`;
  s+=`<path d="M9 30 L13 5 L30 18 Z" fill="${furFill}"/><path d="M55 30 L51 5 L34 18 Z" fill="${furFill}"/>
  <path d="M14 24 L16 12 L25 18 Z" fill="${o.mask||inner}"/><path d="M50 24 L48 12 L39 18 Z" fill="${o.mask||inner}"/>
  <ellipse cx="32" cy="37" rx="24" ry="21" fill="${furFill}" stroke="${dark}" stroke-opacity=".12" stroke-width="1.5"/>`;
  if(o.patch)s+=`<ellipse cx="20" cy="27" rx="8" ry="6.5" fill="${o.patch}"/>`;
  if(o.patch2)s+=`<ellipse cx="45" cy="47" rx="6" ry="5" fill="${o.patch2}"/>`;
  if(o.mask)s+=`<ellipse cx="32" cy="41" rx="12" ry="10" fill="${o.mask}" opacity=".75"/>`;
  if(o.muzzle)s+=`<ellipse cx="32" cy="45" rx="11" ry="9" fill="${o.muzzle}"/>`;
  if(o.stripes)s+=`<path d="M26 19 L28 26 M32 18 L32 26 M38 19 L36 26" stroke="${o.stripes}" stroke-width="2.5" stroke-linecap="round"/>`;
  if(o.glow)s+=`<circle cx="22" cy="24" r="1.2" fill="#FFF6B0"/><circle cx="44" cy="26" r="1" fill="#FFF6B0"/><circle cx="40" cy="50" r="1.2" fill="#FFF6B0"/><circle cx="18" cy="46" r=".9" fill="#FFF6B0"/>`;
  s+=`<ellipse cx="23" cy="35" rx="3.4" ry="4.2" fill="${eye}"/><ellipse cx="41" cy="35" rx="3.4" ry="4.2" fill="${eye}"/>
  <circle cx="24.2" cy="33.4" r="1.3" fill="#FFFFFF"/><circle cx="42.2" cy="33.4" r="1.3" fill="#FFFFFF"/>`;
  if(o.acc==='glasses')s+=`<rect x="16" y="30" width="13" height="9" rx="3" fill="#2B1B30"/><rect x="35" y="30" width="13" height="9" rx="3" fill="#2B1B30"/><path d="M29 33h6" stroke="#2B1B30" stroke-width="2"/>`;
  s+=`<path d="M29.6 42 L34.4 42 L32 44.6 Z" fill="#FF7A9C"/>
  <path d="M32 44.6 Q29 48.4 26 46.2 M32 44.6 Q35 48.4 38 46.2" stroke="${eye==='#2B1B30'?dark:eye}" stroke-width="1.7" fill="none" stroke-linecap="round"/>
  <ellipse cx="16.5" cy="43" rx="4.2" ry="2.6" fill="#FF8FB0" opacity=".5"/><ellipse cx="47.5" cy="43" rx="4.2" ry="2.6" fill="#FF8FB0" opacity=".5"/>`;
  if(o.acc==='scarf')s+=`<path d="M12 52 Q32 62 52 52 L52 58 Q32 66 12 58 Z" fill="#E8454F"/><rect x="40" y="55" width="7" height="9" rx="2" fill="#E8454F"/>`;
  if(o.acc==='crown')s+=`<path d="M20 16 L22 4 L27 11 L32 2 L37 11 L42 4 L44 16 Z" fill="#FFC233" stroke="#D99100" stroke-width="1"/>`;
  if(o.acc==='witch')s+=`<path d="M14 18 L50 18 L46 14 L36 13 L30 0 L22 13 L18 14 Z" fill="#3B2350"/><rect x="21" y="12.5" width="15" height="3" fill="#FFB000"/>`;
  return s+'</svg>'}
const breedSVG=b=>catSVG(b.fur,b.inner,b.eye,b);
const stationSVG=b=>catSVG(b.fur,b.inner,b.eye);
const pawSVG='<svg viewBox="0 0 24 24" fill="#3A2500" aria-hidden="true"><ellipse cx="12" cy="16" rx="4.6" ry="3.8"/><circle cx="6" cy="10.5" r="2.1"/><circle cx="9.6" cy="6.6" r="2.1"/><circle cx="14.4" cy="6.6" r="2.1"/><circle cx="18" cy="10.5" r="2.1"/></svg>';
const giftSVG='<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="8" y="26" width="48" height="32" rx="6" fill="#FF5E99"/><rect x="5" y="18" width="54" height="12" rx="4" fill="#FF8FB5"/><rect x="28" y="18" width="8" height="40" fill="#FFD24D"/><path d="M32 18c-6-12-20-10-14-2 3 3 10 2 14 2zM32 18c6-12 20-10 14-2-3 3-10 2-14 2z" fill="#FFD24D"/></svg>';
const pumpkinSVG='<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="38" rx="26" ry="20" fill="#FF8A2A"/><ellipse cx="32" cy="38" rx="10" ry="20" fill="#FF9F45"/><rect x="29" y="10" width="6" height="10" rx="2" fill="#5A7A2A"/><path d="M20 34l6-5 4 6zM44 34l-6-5-4 6zM22 44q10 8 20 0l-4 1-2-3-2 3-4-3-2 3-2-3z" fill="#3B1E10"/></svg>';
const DECOR_ICON={
 catbed:'<ellipse cx="20" cy="26" rx="16" ry="8" fill="#FF8FB5"/><ellipse cx="20" cy="24" rx="11" ry="5" fill="#FFE3EC"/><ellipse cx="20" cy="21" rx="7" ry="4" fill="#FFA552"/>',
 post:'<rect x="17" y="8" width="6" height="24" fill="#D9A877"/><rect x="10" y="30" width="20" height="5" rx="2" fill="#B5A3FF"/><rect x="11" y="6" width="18" height="4" rx="2" fill="#B5A3FF"/><circle cx="28" cy="18" r="3" fill="#FF5E99"/>',
 lamp:'<path d="M12 6h16l-4 10h-8z" fill="#FFD24D"/><rect x="19" y="16" width="2" height="16" fill="#86698C"/><ellipse cx="20" cy="33" rx="7" ry="2.5" fill="#86698C"/>',
 painting:'<rect x="7" y="7" width="26" height="26" rx="2" fill="#D99100"/><rect x="10" y="10" width="20" height="20" fill="#FFF3C4"/><circle cx="20" cy="22" r="6" fill="#FFA552"/><path d="M14 18l2-6 4 4 4-4 2 6z" fill="#FFA552"/>',
 shelf:'<rect x="8" y="5" width="24" height="30" rx="2" fill="#C8925F"/><rect x="11" y="9" width="4" height="9" fill="#FF5E99"/><rect x="16" y="9" width="4" height="9" fill="#5CC48A"/><rect x="21" y="10" width="4" height="8" fill="#8EC9FF"/><rect x="11" y="22" width="5" height="9" fill="#FFD24D"/><rect x="17" y="22" width="4" height="9" fill="#B5A3FF"/>',
 tank:'<rect x="6" y="10" width="28" height="20" rx="3" fill="#9ED8F5"/><ellipse cx="16" cy="20" rx="4" ry="2.5" fill="#FF8A2A"/><path d="M12 20l-3-3v6z" fill="#FF8A2A"/><ellipse cx="26" cy="24" rx="3" ry="2" fill="#FFD24D"/>',
 lights:'<path d="M4 12q16 12 32 0" stroke="#86698C" stroke-width="1.5" fill="none"/><circle cx="9" cy="16" r="3" fill="#FFD24D"/><circle cx="16" cy="19" r="3" fill="#FF8FB5"/><circle cx="24" cy="19" r="3" fill="#8EC9FF"/><circle cx="31" cy="16" r="3" fill="#8FE0AA"/>',
 jar:'<rect x="11" y="12" width="18" height="22" rx="5" fill="#BFE6FF"/><rect x="10" y="8" width="20" height="5" rx="2" fill="#FF5E99"/><circle cx="17" cy="24" r="2.5" fill="#C48A5A"/><circle cx="23" cy="28" r="2.5" fill="#C48A5A"/><circle cx="22" cy="20" r="2.5" fill="#C48A5A"/>',
 fireplace:'<rect x="5" y="8" width="30" height="26" rx="2" fill="#B9B6C9"/><rect x="11" y="16" width="18" height="18" fill="#3B2340"/><path d="M20 18c5 5 6 9 0 14-6-5-5-9 0-14z" fill="#FF8A2A"/><path d="M20 24c2 2 3 4 0 7-3-3-2-5 0-7z" fill="#FFD24D"/>',
 piano:'<rect x="5" y="12" width="30" height="16" rx="2" fill="#2B1B30"/><rect x="7" y="20" width="26" height="6" fill="#FFFFFF"/><path d="M11 20v4M15 20v4M21 20v4M25 20v4M29 20v4" stroke="#2B1B30" stroke-width="2"/>',
 fountain:'<ellipse cx="20" cy="32" rx="15" ry="4" fill="#E9E4F5"/><rect x="18" y="14" width="4" height="18" fill="#E9E4F5"/><ellipse cx="20" cy="15" rx="8" ry="3" fill="#FFFFFF"/><path d="M14 14q-4 6-6 16M26 14q4 6 6 16" stroke="#9ED8F5" stroke-width="2" fill="none"/>',
 statue:'<rect x="10" y="28" width="20" height="8" rx="2" fill="#E9E4F5"/><ellipse cx="20" cy="22" rx="8" ry="8" fill="#FFC233"/><path d="M13 18l2-8 4 5 2 0 4-5 2 8z" fill="#FFC233"/>'
};
const decorSVG=id=>`<svg viewBox="0 0 40 40" aria-hidden="true">${DECOR_ICON[id]}</svg>`;
const ICON={
  on:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
  off:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>',
  zin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.5-4.5M10.5 7.5v6M7.5 10.5h6"/></svg>',
  zout:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.5-4.5M7.5 10.5h6"/></svg>'
};

/* ======================= QUESTS ======================= */
function dayKey(d){return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function nice(v){const p=Math.pow(10,Math.floor(Math.log10(v)));return Math.ceil(v/p)*p}
const QT={
 pet:{label:g=>`Pet ${g} cats`,goal:r=>[20,30,40][r%3]},
 serve:{label:g=>`Serve ${g} orders by tapping`,goal:r=>[25,40,60][r%3]},
 buy:{label:g=>`Buy ${g} stations`,goal:r=>[30,50,80][r%3]},
 earn:{label:g=>`Earn ${fmt(g)} coins`,goal:()=>nice(Math.max(5000,ips(true)*900))},
 gold:{label:()=>'Catch a golden cat',goal:()=>1},
 up:{label:g=>`Buy ${g} upgrade${g>1?'s':''}`,goal:r=>[1,2,3][r%3]},
 rare:{label:()=>'Pet a rare (or rarer) cat',goal:()=>1},
 newcat:{label:()=>'Discover a new cat breed',goal:()=>1},
 decor:{label:()=>'Buy something in the Decor shop',goal:()=>1}
};
function ensureQuests(){const today=dayKey(new Date());if(S.q&&S.q.day===today)return;
  let pool=Object.keys(QT);
  if(BREEDS.every(b=>S.cats[b.id]||!breedAvail(b)))pool=pool.filter(t=>t!=='newcat');
  if(decorCount()===DECOR.length)pool=pool.filter(t=>t!=='decor');
  let h=hash(today+'cats');const list=[];
  while(list.length<3&&pool.length){const k=h%pool.length;const t=pool.splice(k,1)[0];h=Math.imul(h^(h>>>13),2654435761)>>>0;list.push({t,g:QT[t].goal(h>>>3),p:0,claimed:false})}
  S.q={day:today,list,bonus:false}}
function track(t,n){if(!S.q)return;for(const q of S.q.list){if(q.t!==t||q.p>=q.g)continue;q.p=Math.min(q.g,q.p+n);
  if(q.p>=q.g){toast('Quest complete!',QT[q.t].label(q.g)+' · claim your gift');sfx.level();if(S.tab==='quests')render()}}}
function openGift(){if(S.gifts<1)return;S.gifts--;sfx.gift();const r=Math.random();let html;
  if(r<0.55){const v=Math.max(500,ips(true)*1500)+S.money*0.03;earn(v);html=`${giftSVG}<h3>Coins!</h3><p>The box was full of shiny coins.</p><div class="big num"><span class="coin">$</span>${fmt(v)}</div>`}
  else if(r<0.8){S.rushUntil=Math.max(Date.now(),S.rushUntil)+120000;html=`${giftSVG}<h3>Catnip Rush!</h3><p>All profits ×3 for 2 minutes.</p>`}
  else{S.rareNext=(S.rareNext||0)+1;const b=BREED.calico;html=`${catSVG(b.fur,b.inner,b.eye,b)}<h3>A rare cat is coming!</h3><p>The next cat through the door will be rare or better. Pet it to add it to your collection.</p>`}
  modal(html,'Yay!',()=>{if(S.tab==='quests')render()})}

/* ======================= AWARDS ======================= */
const ACH=[
 {id:'first',t:'First Customer',d:'Earn your first coin',p:()=>[S.lifetime,1]},
 {id:'pet10',t:'Good Kitty',d:'Pet 10 cats',p:()=>[S.pets,10]},
 {id:'milk10',t:'Milk Run',d:'Own 10 Milk Bowl Bars',p:()=>[S.stations[0].owned,10]},
 {id:'mgr1',t:'Boss Cat',d:'Hire your first manager',p:()=>[mgrs(),1]},
 {id:'k1',t:'Tip Jar',d:'Earn 1K coins in total',p:()=>[S.lifetime,1e3]},
 {id:'cat5',t:'Cat Spotter',d:'Discover 5 cat breeds',p:()=>[catsFound(),5]},
 {id:'up1',t:'Fancy Upgrade',d:'Buy your first upgrade',p:()=>[upCount(),1]},
 {id:'decor1',t:'Home Sweet Home',d:'Buy your first decoration',p:()=>[decorCount(),1]},
 {id:'open4',t:'Growing Menu',d:'Open 4 different stations',p:()=>[opened(),4]},
 {id:'gold1',t:'Lucky Day',d:'Catch a golden cat',p:()=>[S.golden,1]},
 {id:'quest1',t:'Helpful Paw',d:'Finish a daily quest',p:()=>[S.questsDone,1]},
 {id:'any25',t:'Zoomies',d:'Own 25 of any station',p:()=>[maxOwned(),25]},
 {id:'m1',t:'Fat Cat',d:'Earn 1M coins in total',p:()=>[S.lifetime,1e6]},
 {id:'pet100',t:'Purr Machine',d:'Pet 100 cats',p:()=>[S.pets,100]},
 {id:'mgr4',t:'Middle Management',d:'Hire 4 managers',p:()=>[mgrs(),4]},
 {id:'away',t:'Welcome Back',d:'Collect earnings from while you were away',p:()=>[S.offline,1]},
 {id:'daily3',t:'Regular',d:'Reach a 3-day visit streak',p:()=>[S.daily.streak,3]},
 {id:'rare1',t:'Ooh, Shiny',d:'Discover a rare cat',p:()=>[BREEDS.filter(b=>b.r>=1&&S.cats[b.id]).length,1]},
 {id:'any100',t:'Nine Lives Deep',d:'Own 100 of any station',p:()=>[maxOwned(),100]},
 {id:'up10',t:'Interior Designer',d:'Buy 10 upgrades',p:()=>[upCount(),10]},
 {id:'decor5',t:'Cozy Vibes',d:'Own 5 decorations',p:()=>[decorCount(),5]},
 {id:'reb1',t:'Born Again',d:'Rebirth for the first time',p:()=>[S.rebirths,1]},
 {id:'b1',t:'Cat Billionaire',d:'Earn 1B coins in total',p:()=>[S.lifetime,1e9]},
 {id:'open8',t:'Full Menu',d:'Open 8 stations',p:()=>[opened(),8]},
 {id:'cat12',t:'Cat Collector',d:'Discover 12 cat breeds',p:()=>[catsFound(),12]},
 {id:'quest10',t:'Quest Master',d:'Finish 10 daily quests',p:()=>[S.questsDone,10]},
 {id:'gold10',t:'Gold Rush',d:'Catch 10 golden cats',p:()=>[S.golden,10]},
 {id:'beach',t:'Beach Day',d:'Open the Sunny Beach café',p:()=>[S.locs[1]?1:0,1]},
 {id:'mgr8',t:'Cat Corporation',d:'Hire 8 managers',p:()=>[mgrs(),8]},
 {id:'daily7',t:'Best Customer',d:'Reach a 7-day visit streak',p:()=>[S.daily.streak,7]},
 {id:'leg1',t:'Legend!',d:'Discover a legendary cat',p:()=>[BREEDS.filter(b=>b.r===3&&S.cats[b.id]).length,1]},
 {id:'pet1k',t:'Professional Petter',d:'Pet 1,000 cats',p:()=>[S.pets,1000]},
 {id:'open10',t:'To the Stars',d:'Open all 10 Cozy Corner stations',p:()=>[openedIn(0),10]},
 {id:'t1',t:'Feline Empire',d:'Earn 1T coins in total',p:()=>[S.lifetime,1e12]},
 {id:'decorall',t:'Dream Café',d:'Own every decoration',p:()=>[decorCount(),DECOR.length]},
 {id:'snow',t:'Snow Day',d:'Open the Snowy Lodge',p:()=>[S.locs[2]?1:0,1]},
 {id:'paw100',t:'Golden Paws',d:'Own 100 Golden Paws',p:()=>[S.paws,100]},
 {id:'mgr10',t:'Everyone\'s a Boss',d:'Hire 10 managers',p:()=>[mgrs(),10]},
 {id:'up30',t:'Fully Loaded',d:'Buy 30 upgrades',p:()=>[upCount(),30]},
 {id:'moon',t:'One Small Paw',d:'Open the Moon Base',p:()=>[S.locs[3]?1:0,1]},
 {id:'catall',t:'Gotta Pet Them All',d:'Discover every cat breed',p:()=>[catsFound(),BREEDS.length]},
 {id:'any400',t:'Max Floof',d:'Own 400 of any station',p:()=>[maxOwned(),400]},
 {id:'qa1',t:'Galactic Whiskers',d:'Earn 1Qa coins in total',p:()=>[S.lifetime,1e15]}
];
function checkAch(){let any=false;for(const a of ACH){if(S.ach[a.id])continue;const[v,g]=a.p();if(v>=g){S.ach[a.id]=Date.now();any=true;
  toast('Award: '+a.t,'+10% profit on everything');sfx.level()}}if(any&&S.tab==='more'&&S.sub.more==='ach')render()}

/* ======================= UI HELPERS ======================= */
const $=id=>document.getElementById(id);
const view=$('view');
let toastEl=null,toastTimer=0;
function toast(msg,sub){if(toastEl)toastEl.remove();toastEl=document.createElement('div');toastEl.className='toast';toastEl.innerHTML=msg+(sub?'<small>'+sub+'</small>':'');
  document.body.appendChild(toastEl);clearTimeout(toastTimer);toastTimer=setTimeout(()=>{toastEl&&toastEl.remove();toastEl=null},2600)}
function floatAt(x,y,text,cls){const f=document.createElement('div');f.className='fl'+(cls?' '+cls:'');f.textContent=text;
  f.style.left=(x+(Math.random()*24-12))+'px';f.style.top=(y-10)+'px';document.body.appendChild(f);setTimeout(()=>f.remove(),900)}
const modalQ=[];let modalOpen=false;
function modal(html,btnText,onOk){modalQ.push({html,btnText,onOk});if(!modalOpen)nextModal()}
function nextModal(){const m=modalQ.shift();if(!m){modalOpen=false;return}modalOpen=true;
  const el=document.createElement('div');el.className='modal';el.innerHTML=`<div class="card" role="dialog" aria-modal="true">${m.html}<button class="buy" id="mok">${m.btnText}</button></div>`;
  document.body.appendChild(el);el.querySelector('#mok').onclick=()=>{audio();m.onOk&&m.onOk();el.remove();update(true);checkAch();nextModal()}}
const coinI='<span class="coin">$</span>';
const segHTML=(key,opts)=>`<div class="sub"><div class="seg wide" role="group">${opts.map(([v,l])=>`<button data-sub="${key}:${v}" aria-pressed="${S.sub[key]===v}">${l}<span class="dot" id="sd-${v}" hidden></span></button>`).join('')}</div></div>`;

/* ======================= PANELS ======================= */
function render(){
  document.querySelectorAll('.tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===S.tab));
  if(S.tab==='cats')S.newCats=false;
  ({cafe:renderCafe,shop:renderShop,cats:renderCats,quests:renderQuests,more:renderMore})[S.tab]();
  $('mute').innerHTML=S.muted?ICON.off:ICON.on;$('zoom').innerHTML=S.zoomed?ICON.zout:ICON.zin;$('locname').textContent=LOCS[S.loc].name;
  update(true);
}
function renderCafe(){
  const L=LOCS[S.loc];
  const segs=['1','10','100','max'].map(v=>`<button data-buy="${v}" aria-pressed="${S.buy===v}">${v==='max'?'Max':'x'+v}</button>`).join('');
  let h=`<div class="bar"><h2>${L.name}</h2><div class="seg" role="group" aria-label="Buy amount">${segs}</div></div><div class="list">`;
  let shown=false;
  L.st.forEach(i=>{const b=STATIONS[i],s=S.stations[i];
    if(s.owned>0){h+=`<div class="st" id="st${i}">
      <button class="av" data-tap="${i}" aria-label="Serve at ${b.name}">${stationSVG(b)}<span class="cnt num" id="cnt${i}"></span></button>
      <div class="head"><span class="name">${b.name}</span><span class="chip${s.mgr?' on':''}">${s.mgr?b.boss+' runs it':'Tap to serve'}</span></div>
      <div class="prog"><i id="bar${i}"></i><span class="num" id="pay${i}"></span></div>
      <div class="row"><span class="time num" id="tm${i}"></span><button class="buy" data-b="${i}" id="buy${i}"><span id="bx${i}">x1</span><span class="c num">${coinI}<span id="bc${i}"></span></span></button></div>
      <div class="mile num" id="ml${i}"></div></div>`}
    else if(!shown){shown=true;h+=`<div class="st locked" id="st${i}"><div class="av">${stationSVG(b)}</div>
      <div class="head"><span class="name">${b.name}</span><span class="chip">New</span></div><div class="desc">${b.desc}</div>
      <div class="row"><button class="buy" data-open="${i}" id="op${i}"><span>Open station</span><span class="c num">${coinI}${fmt(b.cost)}</span></button></div></div>`}
  });
  const hidden=L.st.length-openedIn(S.loc)-(shown?1:0);
  if(hidden>0)h+=`<p class="note" style="text-align:center">${hidden} more station${hidden>1?'s':''} to discover here</p>`;
  const nextLoc=LOCS.findIndex((x,l)=>!S.locs[l]);
  if(nextLoc>0&&openedIn(S.loc)===L.st.length)h+=`<button class="buy alt" data-goto="more:map" style="justify-content:center">Ready for a new café? See the World map</button>`;
  view.innerHTML=h+'</div>';
}
function upIcon(u){if(u.kind==='all')return '<div class="ico all">×3</div>';if(u.kind==='pet')return '<div class="ico pet">♥×5</div>';
  if(u.kind==='gold')return '<div class="ico pet">★×2</div>';const b=STATIONS[u.i];return `<div class="ico">${stationSVG(b)}</div>`}
const availUps=()=>UPS.filter(u=>!S.ups[u.id]&&(u.kind!=='st'||S.stations[u.i].owned>0));
function renderShop(){
  let h=segHTML('shop',[['up','Upgrades'],['mgr','Managers'],['decor','Decor']]);
  if(S.sub.shop==='up'){const avail=availUps().slice(0,15);
    h+=`<div class="list"><div class="summary"><b class="num">${upCount()}/${UPS.length}</b><span>Upgrades last until you rebirth</span></div>`;
    if(!avail.length)h+='<p class="note">Open more stations to unlock more upgrades.</p>';
    for(const u of avail){h+=`<div class="mg">${upIcon(u)}<div class="info"><div class="who">${u.name}</div><div class="what">${u.desc}</div></div>
      <button class="buy" data-up="${u.id}" id="u_${u.id}"><span class="c num">${coinI}${fmt(u.cost)}</span></button></div>`}
    h+='</div>'}
  else if(S.sub.shop==='mgr'){const L=LOCS[S.loc];
    h+=`<div class="list"><p class="note">Managers keep a station serving by itself, even while the app is closed or you're at another café. You collect up to 8 hours of coins when you come back. Showing managers for ${L.name}.</p>`;
    L.st.forEach(i=>{const b=STATIONS[i],s=S.stations[i],open=s.owned>0;
      h+=`<div class="mg${s.mgr?' done':''}"><div class="av" style="grid-row:auto">${stationSVG(b)}</div>
        <div class="info"><div class="who">${b.boss}</div><div class="what">${open?'Runs the '+b.name:'Open the '+b.name+' first'}</div></div>
        <button class="buy" data-hire="${i}" id="hr${i}" ${s.mgr||!open?'disabled':''}>${s.mgr?'Hired':`<span class="c num">${coinI}${fmt(b.mgr)}</span>`}</button></div>`});
    h+='</div>'}
  else{
    h+=`<div class="list"><div class="summary"><b class="num">+${decorPct()}%</b><span>Profit from decor<br>Decor stays when you rebirth</span></div><div class="h3">Furniture</div>`;
    for(const d of DECOR){const own=!!S.decor[d.id];
      h+=`<div class="mg${own?' done':''}"><div class="ico">${decorSVG(d.id)}</div><div class="info"><div class="who">${d.name}</div><div class="what">${d.desc} · +${d.b}% profit</div></div>
        <button class="buy" data-decor="${d.id}" id="dc_${d.id}" ${own?'disabled':''}>${own?'Placed':`<span class="c num">${coinI}${fmt(d.cost)}</span>`}</button></div>`}
    const L=LOCS[S.loc];
    h+=`<div class="h3">Floors</div><p class="note">Each floor you own adds +2% profit. Tap one you own to use it.</p><div class="swatches">`;
    for(const f of FLOORS){const own=!!S.floors[f.id],sel=S.floor===f.id;const bg=f.id==='default'?L.art:FLOOR_CSS[f.id];
      h+=`<div class="sw${sel?' sel':''}"><i style="background:${bg}"></i><b>${f.name}</b><button class="buy${own?' alt':''}" data-floor="${f.id}" id="fl_${f.id}">${sel?'In use':own?'Use':`<span class="c num">${coinI}${fmt(f.cost)}</span>`}</button></div>`}
    h+=`</div><div class="h3">Walls</div><div class="swatches">`;
    for(const w of WALLS){const own=!!S.walls[w.id],sel=S.wall===w.id;const bg=w.id==='default'?L.wall:w.c;
      h+=`<div class="sw${sel?' sel':''}"><i style="background:${bg}"></i><b>${w.name}</b><button class="buy${own?' alt':''}" data-wall="${w.id}" id="wl_${w.id}">${sel?'In use':own?'Use':`<span class="c num">${coinI}${fmt(w.cost)}</span>`}</button></div>`}
    h+='</div></div>'}
  view.innerHTML=h;
}
function breedWhere(b){if(b.event)return 'Spooky Season only';if(b.locs)return 'Only at '+LOCS[b.locs[0]].name;return 'Any café'}
function breedAvail(b,l){if(b.event&&!spooky())return false;if(b.locs&&l!==undefined&&!b.locs.includes(l))return false;return true}
function renderCats(){
  const found=catsFound();
  let h=`<div class="bar"><h2>Cat Collection</h2></div><div class="list"><div class="summary"><b class="num">${found}/${BREEDS.length}</b><span>+${catPct()}% profit from cats<br>Pet a new kind of cat to collect it</span></div>
  <p class="note">Common +1% · <span class="rr1">Rare +3%</span> · <span class="rr2">Epic +10%</span> · <span class="rr3">Legendary +25%</span>. Cats you haven't collected yet have a NEW bubble over their head.</p><div class="cats">`;
  for(const b of BREEDS){const n=S.cats[b.id]||0;
    h+=`<div class="cat r${b.r}${n?'':' no'}">${breedSVG(b)}<b>${n?b.name:'???'}</b><small class="rr${b.r}">${RARITY[b.r].n}</small><span class="where">${n?'Petted '+fmt(n)+'×':breedWhere(b)}</span></div>`}
  view.innerHTML=h+'</div></div>';
}
function renderQuests(){
  ensureQuests();
  let h=`<div class="bar"><h2>Daily Quests</h2><span class="chip num" id="qreset"></span></div><div class="list">`;
  if(spooky())h+=`<div class="event">${pumpkinSVG}<div><b>Spooky Season</b><span>Pumpkins have appeared in your cafés, and the Pumpkin Cat is visiting until November 3. Ghost Cats are 3× more common too.</span></div></div>`;
  S.q.list.forEach((q,k)=>{const done=q.p>=q.g;
    h+=`<div class="qs${done?' done':''}"><div class="qt"><b>${QT[q.t].label(q.g)}</b><span class="num" id="qt${k}">${fmt(q.p)} / ${fmt(q.g)}</span></div>
      <div class="pb"><i id="qb${k}" style="width:${Math.min(100,q.p/q.g*100)}%"></i></div>
      ${q.claimed?'<button class="buy" disabled>Gift claimed</button>':`<button class="buy" data-claim="${k}" id="qc${k}" ${done?'':'disabled'}>${done?'Claim gift':'Reward: 1 gift box'}</button>`}</div>`});
  const all=S.q.list.every(q=>q.claimed);
  h+=`<div class="qs"><div class="qt"><b>Finish all 3 quests</b><span>Bonus gift</span></div>${S.q.bonus?'<button class="buy" disabled>Bonus claimed</button>':`<button class="buy" data-bonus="1" ${all?'':'disabled'}>${all?'Claim bonus gift':'Claim all 3 gifts first'}</button>`}</div>`;
  h+=`<div class="giftrow"><span id="giftart">${giftSVG}</span><div class="info"><div class="who num">${S.gifts} gift box${S.gifts===1?'':'es'}</div><div class="note">Coins, a Catnip Rush, or a rare cat visit</div></div><button class="buy alt" id="opengift" style="flex:none" ${S.gifts?'':'disabled'}>Open</button></div>`;
  h+=`<p class="note">Daily visit streak: ${S.daily.streak} day${S.daily.streak===1?'':'s'}. New quests arrive every day at midnight.</p>`;
  view.innerHTML=h+'</div>';
}
function renderMore(){
  let h=segHTML('more',[['map','World'],['reb','Rebirth'],['ach','Awards']]);
  if(S.sub.more==='map'){h+='<div class="list">';
    LOCS.forEach((L,l)=>{const un=!!S.locs[l],here=S.loc===l,prevOk=l===0||S.locs[l-1];
      h+=`<div class="loc${un?'':' lock'}"><div class="art" style="background:${L.art}"><b>${L.name}</b>${here?'<small>You are here</small>':''}</div><div class="body">
        <p>${L.tag} · ${L.st.length} stations${un?' · '+openedIn(l)+' open · '+fmt(ips(false,l))+' / sec':''}</p>
        ${here?'':un?`<button class="buy alt" data-visit="${l}">Visit ${L.name}</button>`:prevOk?`<button class="buy" data-unlock="${l}" id="lk${l}"><span>Unlock</span><span class="c num">${coinI}${fmt(L.unlock)}</span></button>`:`<button class="buy" disabled>Unlock ${LOCS[l-1].name} first</button>`}
      </div></div>`});
    h+='<p class="note">Every café keeps earning while you visit another one, as long as its stations have managers.</p></div>'}
  else if(S.sub.more==='reb'){const g=pawGain();
    h+=`<div class="list"><div class="reb">${pawSVG}<div class="big num">${fmt(S.paws)} Golden Paws</div><p>Each Golden Paw gives +2% profit forever. You have +${fmt(S.paws*2)}% right now.</p>
      <button class="buy" id="rebirth" ${g<1?'disabled':''}>${g<1?'Not ready yet':'Rebirth for +'+fmt(g)+' Golden Paws'}</button></div><p class="note" id="rebnote"></p>
      <p class="note">Rebirth starts your cafés over: coins, stations, managers, upgrades and extra locations reset. You keep Golden Paws, decor, your cat collection, awards, quests and streak.</p></div>`}
  else{const n=achCount();
    h+=`<div class="list"><div class="summary"><b class="num">${n}/${ACH.length}</b><span>+${n*10}% profit<br>(+10% per award)</span></div>
    <div class="stats"><div class="stat"><b class="num">${fmt(S.lifetime)}</b><span>Coins earned ever</span></div><div class="stat"><b class="num">${fmt(S.pets)}</b><span>Cats petted</span></div>
    <div class="stat"><b class="num">${S.golden}</b><span>Golden cats caught</span></div><div class="stat"><b class="num">${S.questsDone}</b><span>Quests finished</span></div></div><div class="grid">`;
    for(const a of ACH){const got=!!S.ach[a.id];const[v,g]=a.p();const pct=got?100:Math.min(100,v/g*100);
      h+=`<div class="ac${got?' got':''}"><div class="t">${a.t}</div><div class="d">${a.d}</div><div class="d num">${got?'Unlocked':fmt(Math.min(v,g))+' / '+fmt(g)}</div><div class="pb"><i style="width:${pct}%"></i></div></div>`}
    h+=`</div><button class="reset" id="reset">Erase all progress</button></div>`}
  view.innerHTML=h;
}

let lastText=0;
function canAffordShop(){return availUps().some(u=>S.money>=u.cost)}
function canHire(){return STATIONS.some((b,i)=>!S.stations[i].mgr&&S.stations[i].owned>0&&S.money>=b.mgr)}
function canDecor(){return DECOR.some(d=>!S.decor[d.id]&&S.money>=d.cost)}
function questReady(){return S.q&&(S.q.list.some(q=>q.p>=q.g&&!q.claimed)||(!S.q.bonus&&S.q.list.every(q=>q.claimed)))||S.gifts>0}
function canUnlock(){return LOCS.some((L,l)=>l>0&&!S.locs[l]&&S.locs[l-1]&&S.money>=L.unlock)}
function update(force){
  if(S.tab==='cafe')for(const i of LOCS[S.loc].st){const bar=$('bar'+i);if(!bar)continue;const s=S.stations[i];const fast=cycleT(i)<0.15&&(s.run||s.mgr);bar.style.transform='scaleX('+(fast?1:Math.min(1,s.prog))+')'}
  const now=performance.now();if(!force&&now-lastText<120)return;lastText=now;
  $('money').textContent=fmt(S.money);$('ips').textContent=fmt(ips())+' / sec';
  const r=$('rush');if(rushOn()){r.hidden=false;r.textContent='Catnip Rush ×3 · '+Math.ceil((S.rushUntil-Date.now())/1000)+'s'}else r.hidden=true;
  const sUp=canAffordShop(),sMg=canHire(),sDc=canDecor(),reb=pawGain()>=Math.max(1,S.paws*0.5),unl=canUnlock();
  $('dot-shop').hidden=!(sUp||sMg||sDc);$('dot-cats').hidden=!S.newCats;$('dot-quests').hidden=!questReady();$('dot-more').hidden=!(reb||unl);
  const sd=(id,v)=>{const e=$('sd-'+id);if(e)e.hidden=!v};sd('up',sUp);sd('mgr',sMg);sd('decor',sDc);sd('reb',reb);sd('map',unl);
  if(S.tab==='cafe'){
    for(const i of LOCS[S.loc].st){const b=STATIONS[i],s=S.stations[i];
      if(s.owned>0){if(!$('cnt'+i))continue;const n=buyCount(i),c=costN(i,n);
        $('cnt'+i).textContent=s.owned;$('pay'+i).textContent='+'+fmt(payout(i));
        const ct=cycleT(i);$('tm'+i).textContent=s.run||s.mgr?fmtT(Math.max(0,(1-s.prog)*ct)):fmtT(ct);
        $('bx'+i).textContent='x'+n;$('bc'+i).textContent=fmt(c);$('buy'+i).disabled=S.money<c;
        document.querySelector('[data-tap="'+i+'"]').classList.toggle('tap',!s.mgr&&!s.run);
        const nm=nextMile(s.owned);$('ml'+i).innerHTML=nm?`Next speed boost at <b>${nm}</b> owned (${s.owned}/${nm}) · 2× faster`:'Max speed reached';
      }else{const op=$('op'+i);if(op)op.disabled=S.money<b.cost}}}
  else if(S.tab==='shop'){
    if(S.sub.shop==='mgr'){for(const i of LOCS[S.loc].st){const s=S.stations[i],h=$('hr'+i);if(h&&!s.mgr&&s.owned>0)h.disabled=S.money<STATIONS[i].mgr}}
    else if(S.sub.shop==='up'){for(const u of UPS){const el=$('u_'+u.id);if(el)el.disabled=S.money<u.cost}}
    else{for(const d of DECOR){const el=$('dc_'+d.id);if(el&&!S.decor[d.id])el.disabled=S.money<d.cost}
      for(const f of FLOORS){const el=$('fl_'+f.id);if(el&&!S.floors[f.id])el.disabled=S.money<f.cost}
      for(const w of WALLS){const el=$('wl_'+w.id);if(el&&!S.walls[w.id])el.disabled=S.money<w.cost}}}
  else if(S.tab==='quests'&&S.q){S.q.list.forEach((q,k)=>{const t=$('qt'+k),b=$('qb'+k);if(t)t.textContent=fmt(q.p)+' / '+fmt(q.g);if(b)b.style.width=Math.min(100,q.p/q.g*100)+'%';
      const c=$('qc'+k);if(c&&!q.claimed&&q.p>=q.g&&c.disabled){c.disabled=false;c.textContent='Claim gift'}});
    const d=new Date(),m=new Date(d);m.setHours(24,0,0,0);const left=(m-d)/1000;const qr=$('qreset');if(qr)qr.textContent='New in '+fmtT(left)}
  else if(S.tab==='more'){
    if(S.sub.more==='reb'){const g=pawGain(),note=$('rebnote');if(note){const next=Math.pow(g+1,2)*1e7;note.textContent=`Earned this run: ${fmt(S.total)} coins. Next Golden Paw at ${fmt(next)}.`;
      const b=$('rebirth');if(b&&!b.classList.contains('arm')){b.disabled=g<1;b.textContent=g<1?'Not ready yet':'Rebirth for +'+fmt(g)+' Golden Paws'}}}
    else if(S.sub.more==='map'){LOCS.forEach((L,l)=>{const b=$('lk'+l);if(b)b.disabled=S.money<L.unlock})}}
}

/* ======================= ACTIONS ======================= */
function serve(i,fromScene){const s=S.stations[i];if(!s.owned)return;if(s.mgr){if(fromScene)toast(STATIONS[i].boss+' runs this one','It serves by itself');return}
  if(!s.run){s.run=true;s.prog=0;sfx.tap();Scene.poke(i);track('serve',1)}}
function openStation(i){const b=STATIONS[i];if(S.money<b.cost||S.stations[i].owned)return false;S.money-=b.cost;S.stations[i].owned=1;sfx.level();toast(b.name+' is open!',b.desc);track('buy',1);render();return true}
function petCat(x,y,breedId){const v=petValue();earn(v);S.pets++;sfx.pet();floatAt(x,y,'♥','heart');floatAt(x,y-18,'+'+fmt(v));track('pet',1);
  const b=BREED[breedId];if(b){const first=!S.cats[b.id];S.cats[b.id]=(S.cats[b.id]||0)+1;if(b.r>=1)track('rare',1);
    if(first){S.newCats=true;track('newcat',1);sfx.meow();setTimeout(sfx.gold,150);
      modal(`${breedSVG(b)}<span class="tag rr${b.r}">${RARITY[b.r].n}</span><h3>New cat: ${b.name}!</h3><p>Added to your collection. +${RARITY[b.r].b}% profit forever.</p>`,'Aww',()=>{});Scene.refreshBadges()}}
  update(true)}
function catchGold(x,y){if(!Scene.goldActive())return;Scene.endGold();S.golden++;const gm=upMult('gold')*(S.decor.tank?1.25:1);sfx.gold();track('gold',1);
  if(Math.random()<.5){S.rushUntil=Math.max(Date.now(),S.rushUntil)+45000*upMult('gold');toast('Catnip Rush!','All profits ×3 for '+(45*upMult('gold'))+' seconds')}
  else{const v=(Math.max(100,ips(true)*120)+S.money*0.05)*gm;earn(v);floatAt(x,y,'+'+fmt(v),'big');toast('The golden cat left a gift','+'+fmt(v)+' coins')}
  $('goldbar').hidden=true;update(true);checkAch()}
function goLoc(l){if(!S.locs[l]||S.loc===l)return;S.loc=l;Scene.setLoc();S.tab='cafe';render();view.scrollTop=0;sfx.level();toast('Welcome to '+LOCS[l].name,LOCS[l].tag)}

document.addEventListener('click',e=>{
  const t=e.target.closest('button');if(!t)return;audio();
  if(t.dataset.tab){S.tab=t.dataset.tab;render();view.scrollTop=0;return}
  if(t.dataset.sub){const[k,v]=t.dataset.sub.split(':');S.sub[k]=v;render();return}
  if(t.dataset.goto){const[k,v]=t.dataset.goto.split(':');S.tab=k;S.sub[k]=v;render();view.scrollTop=0;return}
  if(t.dataset.buy){S.buy=t.dataset.buy;render();return}
  if(t.dataset.tap!==undefined){serve(+t.dataset.tap);return}
  if(t.dataset.b!==undefined){const i=+t.dataset.b,n=buyCount(i),c=costN(i,n);if(S.money>=c&&n>0){const before=nextMile(S.stations[i].owned);
    S.money-=c;S.stations[i].owned+=n;sfx.buy();Scene.poke(i);track('buy',n);if(before&&S.stations[i].owned>=before){sfx.level();toast(STATIONS[i].name+' is 2× faster!',S.stations[i].owned+' owned')}update(true)}return}
  if(t.dataset.open!==undefined){openStation(+t.dataset.open);return}
  if(t.dataset.hire!==undefined){const i=+t.dataset.hire,b=STATIONS[i],s=S.stations[i];if(!s.mgr&&s.owned&&S.money>=b.mgr){S.money-=b.mgr;s.mgr=true;s.run=true;
    sfx.level();toast(b.boss+' joined the team!','The '+b.name+' now runs by itself');render()}return}
  if(t.dataset.up){const u=UPS.find(x=>x.id===t.dataset.up);if(u&&!S.ups[u.id]&&S.money>=u.cost){S.money-=u.cost;S.ups[u.id]=1;sfx.buy();track('up',1);toast(u.name,u.desc);render()}return}
  if(t.dataset.decor){const d=DECOR.find(x=>x.id===t.dataset.decor);if(d&&!S.decor[d.id]&&S.money>=d.cost){S.money-=d.cost;S.decor[d.id]=1;sfx.level();track('decor',1);toast(d.name+' placed!','+'+d.b+'% profit · see it in your café');Scene.refreshDecor();render()}return}
  if(t.dataset.floor){const f=FLOORS.find(x=>x.id===t.dataset.floor);if(!f)return;if(!S.floors[f.id]){if(S.money<f.cost)return;S.money-=f.cost;S.floors[f.id]=1;sfx.buy();track('decor',1)}S.floor=f.id;Scene.refreshDecor();render();return}
  if(t.dataset.wall){const w=WALLS.find(x=>x.id===t.dataset.wall);if(!w)return;if(!S.walls[w.id]){if(S.money<w.cost)return;S.money-=w.cost;S.walls[w.id]=1;sfx.buy();track('decor',1)}S.wall=w.id;Scene.refreshDecor();render();return}
  if(t.dataset.claim!==undefined){const q=S.q.list[+t.dataset.claim];if(q&&q.p>=q.g&&!q.claimed){q.claimed=true;S.gifts++;S.questsDone++;sfx.gift();render();const a=$('giftart');if(a)a.classList.add('shake')}return}
  if(t.dataset.bonus){if(!S.q.bonus&&S.q.list.every(q=>q.claimed)){S.q.bonus=true;S.gifts++;sfx.gift();render()}return}
  if(t.id==='opengift'){openGift();render();return}
  if(t.dataset.visit!==undefined){goLoc(+t.dataset.visit);return}
  if(t.dataset.unlock!==undefined){const l=+t.dataset.unlock,L=LOCS[l];if(!S.locs[l]&&S.locs[l-1]&&S.money>=L.unlock){S.money-=L.unlock;S.locs[l]=true;S.stations[L.st[0]].owned=Math.max(1,S.stations[L.st[0]].owned);sfx.gift();
    modal(`<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="4" y="14" width="56" height="40" rx="10" fill="#FF8FB5"/><path d="M32 22a10 10 0 0 0-10 10c0 7 10 16 10 16s10-9 10-16a10 10 0 0 0-10-10zm0 13a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" fill="#FFFFFF"/></svg><h3>${L.name} is open!</h3><p>${L.tag}. Your first ${STATIONS[L.st[0]].name} is ready.</p>`,'Let\'s go',()=>goLoc(l))}return}
  if(t.id==='locpill'){S.tab='more';S.sub.more='map';render();view.scrollTop=0;return}
  if(t.id==='mute'){S.muted=!S.muted;if(!S.muted)sfx.tap();render();return}
  if(t.id==='zoom'){S.zoomed=!S.zoomed;Scene.setZoom(S.zoomed?1.9:1);render();return}
  if(t.id==='goldbar'){const r=t.getBoundingClientRect();catchGold(r.left+r.width/2,r.top);return}
  if(t.id==='rebirth'){const g=pawGain();if(g<1)return;
    if(!t.classList.contains('arm')){t.classList.add('arm');t.textContent='Tap again to rebirth';setTimeout(()=>{if(t.isConnected){t.classList.remove('arm');update(true)}},3000);return}
    const keep={ach:S.ach,paws:S.paws+g,rebirths:S.rebirths+1,lifetime:S.lifetime,pets:S.pets,golden:S.golden,daily:S.daily,muted:S.muted,offline:S.offline,zoomed:S.zoomed,
      decor:S.decor,floors:S.floors,walls:S.walls,floor:S.floor,wall:S.wall,cats:S.cats,q:S.q,gifts:S.gifts,questsDone:S.questsDone,sub:S.sub};
    S=Object.assign(fresh(),keep,{tab:'cafe'});save();sfx.gold();Scene.setLoc();render();toast('Reborn with '+fmt(S.paws)+' Golden Paws','+'+fmt(S.paws*2)+'% profit forever');return}
  if(t.id==='reset'){if(t.classList.contains('arm')){const m=S.muted;S=fresh();S.muted=m;ensureQuests();save();Scene.setLoc();render();toast('Café erased','Starting fresh with one Milk Bowl Bar')}
    else{t.classList.add('arm');t.textContent='Tap again to erase everything';setTimeout(()=>{if(t.isConnected){t.classList.remove('arm');t.textContent='Erase all progress'}},3000)}return}
});

/* ======================= 3D SCENE ======================= */
const Scene=(function(){
  const T=window.THREE;const cv=$('cv'),stage=$('stage');let R=null;
  try{if(T)R=new T.WebGLRenderer({canvas:cv,antialias:true})}catch(e){R=null}
  const api={poke(){},setLoc(){},setZoom(){},goldActive:()=>false,endGold(){},frame(){},screenOf(){return null},refreshDecor(){},refreshBadges(){}};
  if(!R){stage.style.height='120px';$('hint').textContent='3D view not available on this device';return api}
  R.setPixelRatio(Math.min(2,window.devicePixelRatio||1));R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;
  const scene=new T.Scene();scene.background=new T.Color('#FFE6EF');
  function setBg(){const L=LOCS[S.loc];if(L.space){scene.background.set('#120E26');return}const c=getComputedStyle(document.documentElement).getPropertyValue('--scene').trim();if(c)scene.background.set(c)}
  try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',setBg)}catch(e){}
  const cam=new T.OrthographicCamera(-10,10,10,-10,0.1,200);
  const target=new T.Vector3(0,0,0.4);let zoom=S.zoomed?1.9:1,pan={x:0,z:0};
  const camDir=new T.Vector3(1.4,13,12).normalize();
  function placeCam(){const tg=target.clone().add(new T.Vector3(pan.x,0,pan.z));cam.position.copy(tg).addScaledVector(camDir,40);cam.lookAt(tg);cam.zoom=zoom;cam.updateProjectionMatrix()}

  const hemi=new T.HemisphereLight(0xffffff,0xffc7dc,0.5);scene.add(hemi);
  const sun=new T.DirectionalLight(0xfff1e0,0.62);sun.position.set(5,16,6);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
  Object.assign(sun.shadow.camera,{left:-14,right:14,top:14,bottom:-14,near:1,far:45});sun.shadow.bias=-0.002;scene.add(sun);
  const warm=new T.PointLight(0xffb070,0,30,1.5);warm.position.set(0,6,1);scene.add(warm);

  const matC={};const M=(c,o)=>{const k=c+(o?JSON.stringify(o):'');return matC[k]||(matC[k]=new T.MeshStandardMaterial(Object.assign({color:c,roughness:.75,metalness:0},o||{})))};
  const SPH=new T.SphereGeometry(1,18,14),BOX=new T.BoxGeometry(1,1,1),CYL=new T.CylinderGeometry(1,1,1,20),CONE=new T.ConeGeometry(1,1,4),RCONE=new T.ConeGeometry(1,1,18);
  const HEMI=new T.SphereGeometry(1,18,10,0,Math.PI*2,0,Math.PI/2),ICO=new T.IcosahedronGeometry(1,0);
  const TAIL=new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(0,0.3,-0.42),new T.Vector3(0.05,0.45,-0.68),new T.Vector3(0.18,0.75,-0.7),new T.Vector3(0.12,0.95,-0.58)]),12,0.065,8,false);
  const SHARED=new Set([SPH,BOX,CYL,CONE,RCONE,HEMI,ICO,TAIL]);
  function mesh(geo,mat,sx,sy,sz,x,y,z,shadow){const m=new T.Mesh(geo,mat);m.scale.set(sx,sy,sz);m.position.set(x||0,y||0,z||0);if(shadow!==false){m.castShadow=true;m.receiveShadow=true}return m}
  function dispose(g){g.traverse(o=>{if(o.geometry&&!SHARED.has(o.geometry))o.geometry.dispose();if(o.material&&o.material.map)o.material.map.dispose();if(o.material&&o.userData.own)o.material.dispose()})}

  /* ---- textures ---- */
  function floorTex(kind){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');let rep=[6.7,9.1];
    const checker=(a,b)=>{x.fillStyle=a;x.fillRect(0,0,128,128);x.fillStyle=b;x.fillRect(0,0,64,64);x.fillRect(64,64,64,64)};
    const planks=(a,b)=>{x.fillStyle=a;x.fillRect(0,0,128,128);x.fillStyle=b;for(let k=0;k<4;k++){x.fillRect(0,k*32,128,2);x.fillRect(((k*53)%128),k*32,2,32)}rep=[3.4,9]};
    if(kind==='pink')checker('#FFEFF4','#FFC9DA');else if(kind==='mint')checker('#EFFFF6','#BDEFD6');else if(kind==='lilac')checker('#F4EEFF','#D9C9FF');
    else if(kind==='wood')planks('#E0B286','#C08A5C');else if(kind==='snowwood')planks('#B98458','#9A6A44');
    else if(kind==='sand'){x.fillStyle='#F7E2B0';x.fillRect(0,0,128,128);for(let k=0;k<160;k++){x.fillStyle=k%2?'#EED39A':'#FFF0C8';x.fillRect(Math.random()*128,Math.random()*128,2,2)}rep=[4,5]}
    else if(kind==='metal'){x.fillStyle='#7F8399';x.fillRect(0,0,128,128);x.fillStyle='#6A6E86';x.fillRect(0,0,128,3);x.fillRect(0,0,3,128);x.fillStyle='#9A9EB4';x.fillRect(6,6,4,4);x.fillRect(118,118,4,4);rep=[5,7]}
    else if(kind==='stars'){x.fillStyle='#2A2350';x.fillRect(0,0,128,128);for(let k=0;k<40;k++){x.fillStyle=k%3?'#FFF6B0':'#C9B3FF';x.fillRect(Math.random()*128,Math.random()*128,2,2)}rep=[5,7]}
    const tx=new T.CanvasTexture(c);tx.wrapS=tx.wrapT=T.RepeatWrapping;tx.repeat.set(rep[0],rep[1]);tx.magFilter=T.NearestFilter;return tx}
  function sprite(draw,w,h,sx,sy){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'));
    const sp=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),depthTest:false,transparent:true}));sp.scale.set(sx,sy,1);sp.renderOrder=10;sp.userData.own=true;return sp}
  function pillPath(x,w,h,r){x.beginPath();x.moveTo(r,4);x.arcTo(w-4,4,w-4,h-4,r);x.arcTo(w-4,h-4,4,h-4,r);x.arcTo(4,h-4,4,4,r);x.arcTo(4,4,w-4,4,r);x.fill()}
  function label(text,bg,fg){return sprite(x=>{x.fillStyle=bg;pillPath(x,360,96,40);x.fillStyle=fg;x.font='800 46px "Baloo 2", system-ui, sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(text,180,52)},360,96,2.9,0.77)}
  const newBadge=()=>sprite(x=>{x.fillStyle='#FF5E99';pillPath(x,160,80,34);x.beginPath();x.moveTo(70,74);x.lineTo(80,92);x.lineTo(90,74);x.fill();x.fillStyle='#FFFFFF';x.font='800 40px "Baloo 2", system-ui, sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('NEW',80,44)},160,96,1.0,0.6);
  const starBadge=c=>sprite(x=>{x.fillStyle=c;x.beginPath();for(let k=0;k<10;k++){const a=k*Math.PI/5-Math.PI/2,r=k%2?18:40;x.lineTo(48+Math.cos(a)*r,48+Math.sin(a)*r)}x.closePath();x.fill();x.strokeStyle='#FFFFFF';x.lineWidth=5;x.stroke()},96,96,0.5,0.5);
  const zzz=()=>sprite(x=>{x.fillStyle='#FFFFFF';x.strokeStyle='#3B2340';x.lineWidth=6;x.font='800 54px "Baloo 2", system-ui, sans-serif';x.strokeText('z',10,80);x.fillText('z',10,80);x.font='800 40px "Baloo 2", system-ui, sans-serif';x.strokeText('z',48,46);x.fillText('z',48,46)},96,96,0.7,0.7);
  const RCOL=['#FFFFFF','#2F9BEA','#A64DF5','#FFB000'];

  /* ---- cat model ---- */
  function makeCat(b,gold){
    const g=new T.Group();let fm;
    if(gold)fm=M('#FFD24D',{emissive:'#FFB000',emissiveIntensity:.55,metalness:.3,roughness:.35});
    else if(b.ghost){fm=new T.MeshStandardMaterial({color:b.fur,transparent:true,opacity:.55,emissive:'#CFC8FF',emissiveIntensity:.5,roughness:.5});fm.userData={};}
    else if(b.rainbow){fm=new T.MeshStandardMaterial({color:b.fur,roughness:.5,emissive:'#331133',emissiveIntensity:.3});g.userData.rainbow=fm}
    else if(b.glow)fm=M(b.fur,{emissive:b.glow,emissiveIntensity:.45,roughness:.4});
    else fm=M(b.fur);
    const own=b.ghost||b.rainbow;
    const add=(m,parent)=>{if(own&&m.material===fm)m.userData.own=true;(parent||g).add(m);return m};
    add(mesh(SPH,fm,0.42,0.36,0.5,0,0.36,0));
    const head=new T.Group();head.position.set(0,0.8,0.22);g.add(head);
    add(mesh(SPH,fm,0.34,0.31,0.32,0,0,0),head);
    add(mesh(CONE,fm,0.13,0.24,0.13,-0.18,0.3,-0.02),head);add(mesh(CONE,fm,0.13,0.24,0.13,0.18,0.3,-0.02),head);
    const inn=M(b.mask||b.inner);head.add(mesh(CONE,inn,0.07,0.14,0.05,-0.18,0.28,0.06,false));head.add(mesh(CONE,inn,0.07,0.14,0.05,0.18,0.28,0.06,false));
    const em=M(b.eye,{roughness:.3});head.add(mesh(SPH,em,0.055,0.07,0.04,-0.12,0.04,0.29,false));head.add(mesh(SPH,em,0.055,0.07,0.04,0.12,0.04,0.29,false));
    head.add(mesh(SPH,M('#FF7A9C'),0.04,0.03,0.03,0,-0.06,0.32,false));
    head.add(mesh(SPH,M('#FF9DB8'),0.06,0.035,0.02,-0.2,-0.07,0.25,false));head.add(mesh(SPH,M('#FF9DB8'),0.06,0.035,0.02,0.2,-0.07,0.25,false));
    if(b.patch){g.add(mesh(SPH,M(b.patch),0.2,0.16,0.22,-0.18,0.52,-0.1,false));head.add(mesh(SPH,M(b.patch),0.15,0.14,0.12,-0.14,0.12,0.16,false))}
    if(b.patch2)g.add(mesh(SPH,M(b.patch2),0.17,0.14,0.18,0.2,0.48,-0.25,false));
    if(b.muzzle){g.add(mesh(SPH,M(b.muzzle),0.24,0.24,0.14,0,0.4,0.38,false));head.add(mesh(SPH,M(b.muzzle),0.17,0.12,0.1,0,-0.1,0.24,false))}
    if(b.mask)head.add(mesh(SPH,M(b.mask),0.2,0.16,0.1,0,-0.04,0.26,false));
    if(b.stripes)for(const zz of [-0.25,-0.05,0.15])g.add(mesh(BOX,M(b.stripes),0.5,0.05,0.07,0,0.7,zz,false));
    if(b.acc==='glasses'){const k=M('#1B1220',{roughness:.2});head.add(mesh(BOX,k,0.14,0.09,0.03,-0.12,0.05,0.31,false));head.add(mesh(BOX,k,0.14,0.09,0.03,0.12,0.05,0.31,false));head.add(mesh(BOX,k,0.1,0.02,0.02,0,0.07,0.32,false))}
    if(b.acc==='scarf'){const sc=new T.Mesh(new T.TorusGeometry(0.27,0.07,8,18),M('#E8454F'));sc.rotation.x=Math.PI/2;sc.position.set(0,0.62,0.18);g.add(sc);g.add(mesh(BOX,M('#E8454F'),0.1,0.25,0.06,0.15,0.48,0.4,false))}
    if(b.acc==='helmet'){const hm=new T.Mesh(SPH,new T.MeshStandardMaterial({color:'#CFEFFF',transparent:true,opacity:.28,roughness:.1,metalness:.2}));hm.userData.own=true;hm.scale.setScalar(0.48);hm.position.y=0.05;head.add(hm)}
    if(b.acc==='crown'){const cm=M('#FFC233',{metalness:.5,roughness:.3,emissive:'#7A5000',emissiveIntensity:.3});head.add(mesh(CYL,cm,0.15,0.08,0.15,0,0.32,0,false));for(let k=0;k<5;k++){const a=k/5*Math.PI*2;head.add(mesh(CONE,cm,0.04,0.1,0.04,Math.cos(a)*0.12,0.41,Math.sin(a)*0.12,false))}}
    if(b.acc==='witch'){const wm=M('#3B2350');head.add(mesh(CYL,wm,0.34,0.025,0.34,0,0.28,0,false));head.add(mesh(RCONE,wm,0.2,0.45,0.2,0,0.5,-0.03));head.add(mesh(CYL,M('#FFB000'),0.205,0.05,0.205,0,0.33,0,false))}
    const tail=new T.Mesh(TAIL,fm);tail.castShadow=true;if(own)tail.userData.own=true;g.add(tail);
    add(mesh(SPH,fm,0.11,0.08,0.13,-0.18,0.07,0.36));add(mesh(SPH,fm,0.11,0.08,0.13,0.18,0.07,0.36));
    g.userData.head=head;g.userData.tail=tail;return g}

  /* ---- station props ---- */
  function prop(kind){const g=new T.Group();const y=1.0;const A=m=>{g.add(m);return m};const tor=(r,t,arc,c,o)=>{const m=new T.Mesh(new T.TorusGeometry(r,t,8,20,arc||Math.PI*2),M(c,o));m.castShadow=true;return A(m)};
    switch(kind){
    case 'milk':A(mesh(CYL,M('#FFFFFF'),0.42,0.18,0.42,-0.3,y+0.09,0));A(mesh(CYL,M('#FFFDF5',{roughness:.3}),0.36,0.02,0.36,-0.3,y+0.18,0,false));A(mesh(CYL,M('#8EC9FF'),0.16,0.6,0.16,0.5,y+0.3,0));A(mesh(CYL,M('#FFFFFF'),0.1,0.15,0.1,0.5,y+0.68,0));break;
    case 'tea':A(mesh(SPH,M('#5CC48A'),0.38,0.32,0.38,0,y+0.3,0));A(mesh(CYL,M('#5CC48A'),0.06,0.4,0.06,0.42,y+0.38,0)).rotation.z=-0.9;A(mesh(SPH,M('#FFFFFF'),0.09,0.09,0.09,0,y+0.64,0));A(mesh(CYL,M('#FFFFFF'),0.14,0.14,0.14,-0.7,y+0.07,0.1));break;
    case 'taco':for(const dx of [-0.5,0,0.5]){const tc=A(mesh(CYL,M('#F2B544'),0.26,0.12,0.26,dx,y+0.24,0));tc.rotation.x=Math.PI/2;A(mesh(SPH,M('#6FCB6F'),0.18,0.08,0.06,dx,y+0.33,0,false))}break;
    case 'yarn':[['#FF5E99',-0.45],['#8EC9FF',0.05],['#FFD66E',0.55]].forEach(([c,dx])=>A(mesh(SPH,M(c),0.24,0.24,0.24,dx,y+0.24,0)));break;
    case 'tower':for(let k=0;k<4;k++){A(mesh(CYL,M('#E9D3B4'),0.1,0.45,0.1,0,y+0.22+k*0.45,0));A(mesh(CYL,M(k%2?'#C9A8F0':'#FFFFFF'),0.42-k*0.05,0.08,0.42-k*0.05,0,y+0.45+k*0.45,0))}break;
    case 'sushi':A(mesh(BOX,M('#C48A5A'),1.5,0.08,0.5,0,y+0.04,0));for(const dx of [-0.5,0,0.5]){A(mesh(BOX,M('#FFFFFF'),0.3,0.14,0.2,dx,y+0.15,0));A(mesh(BOX,M('#FF8A5C'),0.32,0.06,0.22,dx,y+0.25,0))}break;
    case 'spa':A(mesh(SPH,M('#9C86FF'),0.6,0.16,0.42,-0.2,y+0.14,0));A(mesh(CYL,M('#FFF3C4'),0.08,0.25,0.08,0.65,y+0.13,0));A(mesh(SPH,M('#FFC94D',{emissive:'#FFB000',emissiveIntensity:1}),0.05,0.08,0.05,0.65,y+0.32,0,false));break;
    case 'scope':A(mesh(CYL,M('#3B3F6B'),0.12,1.1,0.12,0,y+0.6,0)).rotation.z=-0.7;A(mesh(CYL,M('#B9B6C9'),0.04,0.5,0.04,0,y+0.25,0));A(mesh(SPH,M('#FFF6B0',{emissive:'#FFE680',emissiveIntensity:.8}),0.1,0.1,0.1,-0.7,y+0.9,0,false));break;
    case 'boat':A(mesh(BOX,M('#FFFFFF'),1.3,0.3,0.5,0,y+0.15,0));A(mesh(BOX,M('#2F7FD1'),1.3,0.08,0.52,0,y+0.04,0));A(mesh(CYL,M('#FF5E5E'),0.12,0.4,0.12,0.2,y+0.5,0));break;
    case 'space':{const ring=tor(0.5,0.07,0,'#A9B2CC',{metalness:.4,roughness:.4});ring.position.y=y+0.7;ring.rotation.x=1.2;A(mesh(SPH,M('#FFFFFF',{metalness:.3,roughness:.4}),0.22,0.22,0.22,0,y+0.7,0));g.userData.spin=ring;break}
    case 'coconut':A(mesh(SPH,M('#8A5A3A'),0.3,0.28,0.3,-0.35,y+0.28,0));A(mesh(CYL,M('#FFFFFF'),0.2,0.02,0.2,-0.35,y+0.55,0,false));A(mesh(CYL,M('#FF5E99'),0.03,0.5,0.03,-0.25,y+0.72,0)).rotation.z=-0.35;
      A(mesh(SPH,M('#8A5A3A'),0.24,0.22,0.24,0.45,y+0.22,0));A(mesh(RCONE,M('#FFD24D'),0.22,0.12,0.22,0.5,y+0.75,0));A(mesh(CYL,M('#FFFFFF'),0.015,0.35,0.015,0.5,y+0.55,0,false));break;
    case 'shrimp':for(const dx of [-0.5,0,0.5]){A(mesh(CYL,M('#D9A877'),0.025,0.6,0.025,dx,y+0.3,0,false));const s=tor(0.14,0.065,Math.PI*1.4,'#FF8A6A');s.position.set(dx,y+0.5,0)}break;
    case 'castle':A(mesh(BOX,M('#F3D28B'),1.2,0.3,0.5,0,y+0.15,0));for(const dx of [-0.5,0,0.5]){const hh=dx?0.4:0.6;A(mesh(CYL,M('#EBC777'),0.14,hh,0.14,dx,y+0.3+hh/2,0));A(mesh(RCONE,M('#FF7F7F'),0.17,0.22,0.17,dx,y+0.41+hh,0))}break;
    case 'surf':A(mesh(SPH,M('#FF6FAE'),0.18,0.7,0.05,-0.3,y+0.68,-0.15)).rotation.z=0.25;A(mesh(SPH,M('#5BC8FF'),0.17,0.62,0.05,0.25,y+0.6,-0.15)).rotation.z=-0.2;A(mesh(BOX,M('#FFFFFF'),0.04,0.9,0.055,0.25,y+0.6,-0.12,false)).rotation.z=-0.2;break;
    case 'icecream':for(const[dx,c] of [[-0.35,'#FFB3D1'],[0.35,'#BFE6FF']]){A(mesh(RCONE,M('#E8B06A'),0.16,0.4,0.16,dx,y+0.22,0)).rotation.x=Math.PI;A(mesh(SPH,M(c),0.2,0.18,0.2,dx,y+0.52,0));A(mesh(SPH,M('#FF5E5E'),0.05,0.05,0.05,dx,y+0.72,0,false))}break;
    case 'lighthouse':for(let k=0;k<3;k++)A(mesh(CYL,M(k%2?'#FFFFFF':'#FF5E5E'),0.24-k*0.04,0.32,0.24-k*0.04,0,y+0.16+k*0.32,0));A(mesh(SPH,M('#FFF3A0',{emissive:'#FFD24D',emissiveIntensity:1}),0.14,0.14,0.14,0,y+1.08,0,false));A(mesh(RCONE,M('#3B2340'),0.18,0.18,0.18,0,y+1.27,0));break;
    case 'cocoa':for(const dx of [-0.35,0.4]){A(mesh(CYL,M('#FFFFFF'),0.2,0.3,0.2,dx,y+0.15,0));A(mesh(CYL,M('#7A4A2A'),0.17,0.02,0.17,dx,y+0.3,0,false));A(mesh(BOX,M('#FFF8F0'),0.08,0.08,0.08,dx-0.05,y+0.34,0.03,false));A(mesh(BOX,M('#FFE3EC'),0.08,0.08,0.08,dx+0.06,y+0.34,-0.03,false))}break;
    case 'fishrack':A(mesh(CYL,M('#8A5A3A'),0.04,0.9,0.04,-0.6,y+0.45,0));A(mesh(CYL,M('#8A5A3A'),0.04,0.9,0.04,0.6,y+0.45,0));A(mesh(CYL,M('#8A5A3A'),0.03,1.25,0.03,0,y+0.88,0)).rotation.z=Math.PI/2;
      for(const dx of [-0.35,0,0.35]){A(mesh(SPH,M('#FF8A5C'),0.09,0.22,0.05,dx,y+0.6,0));A(mesh(CONE,M('#FF8A5C'),0.07,0.12,0.03,dx,y+0.35,0)).rotation.z=Math.PI}break;
    case 'igloo':A(mesh(HEMI,M('#F4FAFF'),0.55,0.5,0.45,0,y,0));A(mesh(HEMI,M('#5A6A8A'),0.18,0.25,0.1,0,y,0.42,false));break;
    case 'ski':A(mesh(RCONE,M('#F4FAFF'),0.6,0.9,0.4,0,y+0.45,0));A(mesh(RCONE,M('#BFD8FF'),0.25,0.3,0.18,0,y+0.75,0));A(mesh(BOX,M('#E8454F'),0.15,0.12,0.12,-0.45,y+0.55,0.2,false));break;
    case 'snowball':for(const[dx,dy] of [[-0.3,0],[0,0],[0.3,0],[-0.15,0.24],[0.15,0.24],[0,0.46]])A(mesh(SPH,M('#FFFFFF'),0.15,0.15,0.15,dx,y+0.15+dy,0));break;
    case 'aurora':{const a1=tor(0.5,0.06,Math.PI,'#6FFFC0',{emissive:'#3FD69A',emissiveIntensity:.9});a1.position.set(0,y+0.1,0);const a2=tor(0.36,0.05,Math.PI,'#C79BFF',{emissive:'#9A6AF0',emissiveIntensity:.9});a2.position.set(0,y+0.1,0.05);break}
    case 'spacemilk':A(mesh(CYL,M('#FFFFFF'),0.17,0.55,0.17,-0.3,y+0.28,0));A(mesh(CYL,M('#5BC8FF',{emissive:'#3FA9F5',emissiveIntensity:.8}),0.1,0.1,0.1,-0.3,y+0.6,0,false));A(mesh(SPH,M('#FFF6B0',{emissive:'#FFE680',emissiveIntensity:1}),0.07,0.07,0.07,0.35,y+0.6,0,false));A(mesh(SPH,M('#FFF6B0',{emissive:'#FFE680',emissiveIntensity:1}),0.05,0.05,0.05,0.55,y+0.4,0.1,false));break;
    case 'asteroid':A(mesh(ICO,M('#8F8A8A',{roughness:1}),0.32,0.26,0.3,-0.3,y+0.22,0));A(mesh(ICO,M('#A39C98',{roughness:1}),0.22,0.2,0.22,0.4,y+0.18,0));A(mesh(BOX,M('#FFFFFF'),0.2,0.1,0.14,-0.3,y+0.5,0));A(mesh(BOX,M('#FF8A5C'),0.21,0.05,0.15,-0.3,y+0.57,0,false));break;
    case 'spring':A(mesh(CYL,M('#5BC8FF',{emissive:'#2F9BEA',emissiveIntensity:.5,roughness:.2}),0.55,0.06,0.4,0,y+0.04,0,false));for(const[dx,dy] of [[-0.2,0.25],[0.15,0.4],[0.3,0.2]]){const b=new T.Mesh(SPH,new T.MeshStandardMaterial({color:'#FFFFFF',transparent:true,opacity:.5}));b.userData.own=true;b.scale.setScalar(0.09);b.position.set(dx,y+dy,0);A(b)}break;
    case 'dome':{const d=new T.Mesh(SPH,new T.MeshStandardMaterial({color:'#E5F4FF',transparent:true,opacity:.3,roughness:.1}));d.userData.own=true;d.scale.setScalar(0.5);d.position.y=y+0.5;A(d);const yb=A(mesh(SPH,M('#FF5E99'),0.18,0.18,0.18,0,y+0.55,0));g.userData.float=yb;break}
    case 'comet':A(mesh(SPH,M('#FFB34D',{emissive:'#FF8A00',emissiveIntensity:.8}),0.2,0.2,0.2,0.35,y+0.55,0,false));{const tl=new T.Mesh(RCONE,new T.MeshStandardMaterial({color:'#FFE38A',transparent:true,opacity:.6,emissive:'#FFD24D',emissiveIntensity:.6}));tl.userData.own=true;tl.scale.set(0.18,0.8,0.18);tl.rotation.z=Math.PI/2+0.4;tl.position.set(-0.1,y+0.4,0);A(tl)}break;
    case 'palace':A(mesh(BOX,M('#B48CFF'),1.1,0.35,0.45,0,y+0.18,0));for(const dx of [-0.45,0,0.45]){const hh=dx?0.35:0.55;A(mesh(CYL,M('#9C70F0'),0.12,hh,0.12,dx,y+0.35+hh/2,0));A(mesh(RCONE,M('#FFC233',{metalness:.5,roughness:.3}),0.15,0.2,0.15,dx,y+0.45+hh,0))}break;
    }
    return g}

  /* ---- world building ---- */
  let world=null,st={},pickables=[],winMats=[],fairy=[],lampLights=[],flames=[],sleepers=[],tables=[],floaters=[];
  const POS=j=>[j%2?3:-3,6.4-3.2*Math.floor(j/2)];
  function plant(g,x,z){const p=new T.Group();p.add(mesh(CYL,M('#E8875C'),0.38,0.6,0.38,0,0.3,0));p.add(mesh(SPH,M('#5CC48A'),0.55,0.6,0.55,0,0.95,0));p.add(mesh(SPH,M('#4AB079'),0.35,0.4,0.35,0.25,1.35,0.1));p.position.set(x,0,z);g.add(p)}
  function palm(g,x,z){const p=new T.Group();for(let k=0;k<4;k++)p.add(mesh(CYL,M(k%2?'#B98458':'#A06E44'),0.14-k*0.015,0.5,0.14-k*0.015,k*0.06,0.25+k*0.5,0));
    for(let k=0;k<6;k++){const lf=mesh(SPH,M(k%2?'#4AB079':'#5CC48A'),0.75,0.06,0.22,0,2.1,0);const a=k/6*Math.PI*2;lf.position.set(0.2+Math.cos(a)*0.55,2.05,Math.sin(a)*0.55);lf.rotation.set(0,-a,-0.35);p.add(lf)}
    p.add(mesh(SPH,M('#8A5A3A'),0.12,0.12,0.12,0.25,1.95,0.1));p.position.set(x,0,z);g.add(p)}
  function pine(g,x,z){const p=new T.Group();p.add(mesh(CYL,M('#8A5A3A'),0.12,0.4,0.12,0,0.2,0));for(let k=0;k<3;k++){p.add(mesh(RCONE,M('#2F8A5A'),0.7-k*0.18,0.8,0.7-k*0.18,0,0.7+k*0.5,0));p.add(mesh(RCONE,M('#FFFFFF'),0.3-k*0.08,0.25,0.3-k*0.08,0,1.0+k*0.5,0,false))}p.position.set(x,0,z);g.add(p)}
  function umbrella(g,x,z,c){const p=new T.Group();p.add(mesh(CYL,M('#FFFFFF'),0.04,1.8,0.04,0,0.9,0));p.add(mesh(RCONE,M(c),1.1,0.45,1.1,0,1.9,0));p.add(mesh(BOX,M('#FFFFFF'),0.6,0.12,1.4,0.9,0.3,0.2));p.add(mesh(BOX,M(c),0.6,0.05,1.4,0.9,0.38,0.2,false));p.position.set(x,0,z);g.add(p)}
  function table(g,x,z){const p=new T.Group();p.add(mesh(CYL,M('#FFFFFF'),0.6,0.08,0.6,0,0.72,0));p.add(mesh(CYL,M('#C9A27E'),0.07,0.7,0.07,0,0.36,0));
    const seats=[];for(const a of [0,2.1,4.2]){p.add(mesh(CYL,M('#FF9EC4'),0.22,0.4,0.22,Math.cos(a)*0.95,0.2,Math.sin(a)*0.95));seats.push({x:x+Math.cos(a)*0.95,z:z+Math.sin(a)*0.95,face:Math.atan2(-Math.cos(a),-Math.sin(a)),busy:false})}
    p.position.set(x,0,z);g.add(p);tables.push(...seats)}
  function sleeperCat(g,x,z,breedId,rot){const b=BREED[breedId];const c=makeCat(b);c.scale.set(0.72,0.5,0.72);c.position.set(x,0.18,z);c.rotation.y=rot||0;c.userData.head.rotation.x=0.5;
    c.traverse(m=>{if(m.isMesh)m.userData.kind='sleep',m.userData.breed=breedId});g.add(c);const zz=zzz();zz.position.set(x+0.3,1.0,z);g.add(zz);sleepers.push({c,zz,x,z,t:Math.random()*6})}

  function buildDecor(g){const L=LOCS[S.loc];const D=S.decor;
    if(D.catbed){const p=new T.Group();const bed=new T.Mesh(new T.TorusGeometry(0.5,0.18,10,20),M('#FF8FB5'));bed.rotation.x=Math.PI/2;bed.position.y=0.15;bed.castShadow=true;p.add(bed);p.add(mesh(CYL,M('#FFE3EC'),0.5,0.1,0.5,0,0.08,0));p.position.set(-5.6,0,8.0);g.add(p);sleeperCat(g,-5.6,8.0,'butter',0.6)}
    if(D.post){const p=new T.Group();p.add(mesh(BOX,M('#B5A3FF'),0.9,0.1,0.9,0,0.05,0));p.add(mesh(CYL,M('#D9A877',{roughness:1}),0.14,1.5,0.14,0,0.8,0));p.add(mesh(BOX,M('#B5A3FF'),0.7,0.1,0.7,0,1.55,0));p.add(mesh(CYL,M('#FFFFFF'),0.01,0.4,0.01,0.3,1.3,0,false));p.add(mesh(SPH,M('#FF5E99'),0.1,0.1,0.1,0.3,1.08,0));p.position.set(5.7,0,8.0);g.add(p)}
    if(D.lamp){const p=new T.Group();p.add(mesh(CYL,M('#86698C'),0.25,0.05,0.25,0,0.03,0));p.add(mesh(CYL,M('#86698C'),0.03,1.6,0.03,0,0.8,0));const sh=new T.Mesh(RCONE,new T.MeshStandardMaterial({color:'#FFE08A',emissive:'#FFB000',emissiveIntensity:.2,side:T.DoubleSide}));sh.userData.own=true;sh.scale.set(0.35,0.35,0.35);sh.position.y=1.7;p.add(sh);
      const pl=new T.PointLight(0xffc878,0,6,2);pl.position.y=1.5;p.add(pl);lampLights.push({pl,sh});p.position.set(-6.1,0,-4.9);g.add(p)}
    if(D.painting){const p=new T.Group();p.add(mesh(BOX,M('#D99100',{metalness:.4,roughness:.4}),1.3,1.1,0.08,0,0,0,false));
      const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.fillStyle='#FFF3C4';x.fillRect(0,0,128,128);x.fillStyle='#FFA552';x.beginPath();x.ellipse(64,76,34,30,0,0,7);x.fill();x.beginPath();x.moveTo(32,60);x.lineTo(38,24);x.lineTo(56,48);x.fill();x.beginPath();x.moveTo(96,60);x.lineTo(90,24);x.lineTo(72,48);x.fill();x.fillStyle='#2B1B30';x.fillRect(48,70,6,10);x.fillRect(74,70,6,10);
      const cm=new T.MeshStandardMaterial({map:new T.CanvasTexture(c)});cm.userData={};const cv2=new T.Mesh(new T.PlaneGeometry(1.1,0.9),cm);cv2.userData.own=true;cv2.position.z=0.05;p.add(cv2);p.position.set(-2.25,1.45,-8.46);g.add(p)}
    if(D.shelf){const p=new T.Group();p.add(mesh(BOX,M('#C8925F'),0.5,1.9,1.4,0,0.95,0));const cols=['#FF5E99','#5CC48A','#8EC9FF','#FFD24D','#B5A3FF','#FF8A5C'];
      for(let r=0;r<3;r++)for(let k=0;k<5;k++)p.add(mesh(BOX,M(cols[(r*5+k)%6]),0.12,0.4,0.18,-0.28,0.4+r*0.58,-0.5+k*0.24,false));p.position.set(6.4,0,-4.9);g.add(p)}
    if(D.tank){const p=new T.Group();p.add(mesh(BOX,M('#C8925F'),0.6,0.7,1.5,0,0.35,0));const gl=new T.Mesh(BOX,new T.MeshStandardMaterial({color:'#9ED8F5',transparent:true,opacity:.55,roughness:.1,emissive:'#3F8FC0',emissiveIntensity:.2}));gl.userData.own=true;gl.scale.set(0.55,0.7,1.4);gl.position.y=1.05;p.add(gl);
      for(let k=0;k<3;k++){const f=mesh(SPH,M(k%2?'#FFD24D':'#FF8A2A'),0.06,0.06,0.12,0,1.0,0,false);p.add(f);floaters.push({m:f,k,base:1.0})}p.position.set(-6.3,0,1.6);g.add(p)}
    if(D.lights){const cols=['#FFD24D','#FF8FB5','#8EC9FF','#8FE0AA'];for(let k=0;k<17;k++){const x=-6.4+k*0.8;const yy=2.25-Math.sin((k%4)/4*Math.PI)*0.18;const bm=new T.MeshStandardMaterial({color:cols[k%4],emissive:cols[k%4],emissiveIntensity:.5});bm.userData={};const b=new T.Mesh(SPH,bm);b.userData.own=true;b.scale.setScalar(0.08);b.position.set(x,yy,-8.42);g.add(b);fairy.push(b)}}
    if(D.jar){const p=new T.Group();p.add(mesh(CYL,M('#C8925F'),0.35,0.8,0.35,0,0.4,0));const jr=new T.Mesh(CYL,new T.MeshStandardMaterial({color:'#DFF2FF',transparent:true,opacity:.5,roughness:.1}));jr.userData.own=true;jr.scale.set(0.24,0.4,0.24);jr.position.y=1.0;p.add(jr);p.add(mesh(CYL,M('#FF5E99'),0.26,0.07,0.26,0,1.23,0));
      for(let k=0;k<5;k++)p.add(mesh(SPH,M('#C48A5A'),0.06,0.06,0.06,Math.cos(k)*0.1,0.88+k*0.05,Math.sin(k)*0.1,false));p.position.set(6.3,0,1.6);g.add(p)}
    if(D.fireplace){const p=new T.Group();p.add(mesh(BOX,M('#B9B6C9'),2.2,1.7,0.6,0,0.85,0));p.add(mesh(BOX,M('#2B1B30'),1.3,0.9,0.62,0,0.6,0.02,false));p.add(mesh(BOX,M('#E9E4F5'),2.5,0.15,0.75,0,1.72,0.05));
      for(const[dx,sz,c] of [[-0.2,0.28,'#FF8A2A'],[0.2,0.24,'#FF8A2A'],[0,0.18,'#FFD24D']]){const fm=new T.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:1});fm.userData={};const f=new T.Mesh(RCONE,fm);f.userData.own=true;f.scale.set(sz,sz*2,sz);f.position.set(dx,0.45+sz,0.15);p.add(f);flames.push(f)}
      const fl=new T.PointLight(0xff8a3a,0.8,7,2);fl.position.set(0,0.8,0.8);p.add(fl);flames.push(fl);p.position.set(0,0,-8.2);g.add(p)}
    if(D.piano){const p=new T.Group();p.add(mesh(BOX,M('#2B1B30',{roughness:.3}),1.4,1.0,0.6,0,0.6,0));p.add(mesh(BOX,M('#FFFFFF'),1.3,0.06,0.25,0,0.75,0.4));p.add(mesh(BOX,M('#2B1B30'),1.4,0.08,0.3,0,0.8,0.42));
      for(const dx of [-0.55,0.55])p.add(mesh(BOX,M('#2B1B30'),0.08,0.7,0.3,dx,0.35,0.4));p.add(mesh(BOX,M('#FF9EC4'),0.6,0.4,0.35,0,0.2,1.0));p.rotation.y=Math.PI/2;p.position.set(-5.9,0,-6.9);g.add(p)}
    if(D.fountain){const p=new T.Group();p.add(mesh(CYL,M('#E9E4F5'),0.6,0.3,0.6,0,0.15,0));p.add(mesh(CYL,M('#FFFFFF',{roughness:.2}),0.5,0.04,0.5,0,0.31,0,false));p.add(mesh(CYL,M('#E9E4F5'),0.08,0.7,0.08,0,0.65,0));p.add(mesh(CYL,M('#E9E4F5'),0.3,0.08,0.3,0,1.0,0));
      const wm=new T.MeshStandardMaterial({color:'#FFFFFF',transparent:true,opacity:.7,emissive:'#FFFFFF',emissiveIntensity:.2});wm.userData={};const w=new T.Mesh(SPH,wm);w.userData.own=true;w.scale.set(0.12,0.2,0.12);w.position.y=1.15;p.add(w);floaters.push({m:w,k:9,base:1.15,pulse:true});p.position.set(3.0,0,8.9);g.add(p)}
    if(D.statue){const p=new T.Group();p.add(mesh(BOX,M('#E9E4F5'),0.8,0.5,0.8,0,0.25,0));const c=makeCat(BREED.snow,true);c.position.y=0.5;c.scale.setScalar(0.9);p.add(c);p.position.set(-3.0,0,8.9);g.add(p)}
    if(spooky()){for(const[x,z,s] of [[-1.3,9.1,0.32],[1.3,9.1,0.26],[-6.2,-7.2,0.3],[6.2,4.2,0.25]]){const p=new T.Group();p.add(mesh(SPH,M('#FF8A2A'),s,s*0.8,s,0,s*0.8,0));p.add(mesh(CYL,M('#5A7A2A'),0.04,0.15,0.04,0,s*1.65,0));
      const fm=new T.MeshStandardMaterial({color:'#FFD24D',emissive:'#FFB000',emissiveIntensity:1});fm.userData={};const face=new T.Mesh(BOX,fm);face.userData.own=true;face.scale.set(s*0.8,s*0.2,0.02);face.position.set(0,s*0.65,s*0.98);p.add(face);p.position.set(x,0,z);g.add(p)}}
  }

  function buildWorld(){
    if(world){scene.remove(world);dispose(world)}
    world=new T.Group();scene.add(world);st={};pickables=[];winMats=[];fairy=[];lampLights=[];flames=[];sleepers=[];tables=[];floaters=[];
    const L=LOCS[S.loc],l=S.loc,g=world;setBg();
    const fk=S.floor!=='default'?S.floor:L.floor;const wc=S.wall!=='default'?WALLS.find(w=>w.id===S.wall).c:L.wall;
    const fm=new T.MeshStandardMaterial({map:floorTex(fk),roughness:.9});fm.userData={};const floor=new T.Mesh(new T.PlaneGeometry(13.4,18.2),fm);floor.userData.own=true;floor.rotation.x=-Math.PI/2;floor.position.set(0,0,0.4);floor.receiveShadow=true;g.add(floor);
    const wm=new T.MeshStandardMaterial({color:wc,roughness:.85});wm.userData={};const wall=(sx,sy,sz,x,y,z)=>{const m=new T.Mesh(BOX,wm);m.userData.own=true;m.scale.set(sx,sy,sz);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;g.add(m)};
    wall(14.2,2.4,0.4,0,1.2,-8.7);wall(0.4,1.1,18.2,-6.9,0.55,0.4);wall(0.4,1.1,18.2,6.9,0.55,0.4);
    g.add(mesh(BOX,M('#FFFFFF',{roughness:.6}),14.3,0.22,0.5,0,2.45,-8.7));
    for(const wx of [-4.5,0,4.5]){if(wx===0&&S.decor.fireplace)continue;
      const m=new T.MeshStandardMaterial({color:L.win,emissive:L.win,emissiveIntensity:.2});m.userData={};winMats.push(m);const w=new T.Mesh(BOX,m);w.userData.own=true;w.scale.set(2.0,1.2,0.1);w.position.set(wx,1.4,-8.47);g.add(w);
      g.add(mesh(BOX,M('#FFFFFF'),2.2,0.12,0.18,wx,0.76,-8.45));
      if(l===1)g.add(mesh(BOX,M('#3FB6EE',{emissive:'#2F9BEA',emissiveIntensity:.3}),2.0,0.4,0.04,wx,1.0,-8.4,false));
      if(l===2)g.add(mesh(BOX,M('#FFFFFF'),2.0,0.25,0.04,wx,0.92,-8.4,false));
      if(l===3){for(let k=0;k<3;k++)g.add(mesh(SPH,M('#FFF6B0',{emissive:'#FFF6B0',emissiveIntensity:1}),0.04,0.04,0.02,wx-0.7+k*0.6,1.2+(k%2)*0.4,-8.4,false))}}
    g.add(mesh(BOX,M('#FF5E99'),2.4,0.04,1.0,0,0.02,9.0,false));
    // aisle rug
    g.add(mesh(BOX,M(L.rug,l===3?{emissive:L.rug,emissiveIntensity:.5}:undefined),1.5,0.03,16.4,0,0.015,0.6,false));
    const lounge=L.st.length<=6;
    if(l===0){plant(g,-6.0,-7.9);plant(g,6.0,-7.9);plant(g,-6.0,8.7);plant(g,6.0,8.7)}
    else if(l===1){palm(g,-6.0,-7.9);palm(g,6.0,-7.9);palm(g,6.1,8.7);umbrella(g,-3.6,-6.6,'#FF6FAE');umbrella(g,2.4,-6.9,'#5BC8FF');
      g.add(mesh(SPH,M('#FFFFFF'),0.25,0.2,0.18,-6.1,0.1,8.7));g.add(mesh(SPH,M('#FFB3D1'),0.18,0.12,0.14,-5.7,0.08,8.9))}
    else if(l===2){pine(g,-6.0,-7.9);pine(g,6.0,-7.9);pine(g,6.0,8.7);
      const sm=new T.Group();sm.add(mesh(SPH,M('#FFFFFF'),0.45,0.45,0.45,0,0.45,0));sm.add(mesh(SPH,M('#FFFFFF'),0.32,0.32,0.32,0,1.1,0));sm.add(mesh(RCONE,M('#FF8A2A'),0.05,0.2,0.05,0,1.1,0.38)).rotation.x=Math.PI/2;sm.add(mesh(CYL,M('#2B1B30'),0.22,0.25,0.22,0,1.5,0));sm.position.set(-6.0,0,8.7);g.add(sm);
      g.add(mesh(BOX,M('#D9544F'),4.5,0.03,3.0,0,0.02,-5.2,false));for(const dx of [-2.6,2.6]){g.add(mesh(BOX,M('#8A5A3A'),1.0,0.5,0.9,dx,0.25,-5.6));g.add(mesh(BOX,M('#D9544F'),1.0,0.7,0.25,dx,0.6,-6.05))}}
    else{for(const[x,z,s] of [[-3,-5.5,0.9],[2.8,-6.2,0.6],[-5,4.8,0.5],[4.6,-3,0.5]])g.add(mesh(CYL,M('#5E6178'),s,0.05,s,x,0.03,z,false));
      for(const[x,z,c] of [[-2.4,-6.8,'#7CF0C8'],[2.2,-4.6,'#C79BFF'],[-6,-7.6,'#5BC8FF'],[6,-7.6,'#7CF0C8'],[6,8.6,'#C79BFF'],[-6,8.6,'#5BC8FF']])g.add(mesh(CONE,M(c,{emissive:c,emissiveIntensity:.7}),0.25,0.9,0.25,x,0.45,z));
      const pl=new T.Group();pl.add(mesh(SPH,M('#FF9F6A'),1.0,1.0,1.0,0,0,0,false));const rg=new T.Mesh(new T.TorusGeometry(1.5,0.12,8,40),M('#FFD38A'));rg.rotation.x=1.3;pl.add(rg);pl.position.set(-1.5,3.2,-11);g.add(pl);
      const sg=new T.BufferGeometry();const pts=[];for(let k=0;k<220;k++)pts.push((Math.random()-.5)*60,Math.random()*25+2,-12-Math.random()*20);sg.setAttribute('position',new T.Float32BufferAttribute(pts,3));
      const stars=new T.Points(sg,new T.PointsMaterial({color:0xFFF6D0,size:0.18}));stars.userData.own=true;g.add(stars)}
    table(g,-5.6,4.8);table(g,5.6,4.8);table(g,-5.6,-1.6);table(g,5.6,-1.6);if(lounge){table(g,-2.4,-3.6);table(g,2.4,-3.6)}
    // stations
    L.st.forEach((i,j)=>{const b=STATIONS[i];const[x,z]=POS(j);
      const sg=new T.Group();sg.position.set(x,0,z);g.add(sg);const built=new T.Group();sg.add(built);
      built.add(mesh(BOX,M(b.col),2.3,0.95,1.0,0,0.475,0));built.add(mesh(BOX,M('#FFFFFF'),2.45,0.1,1.12,0,1.0,0));
      const p=prop(b.prop);built.add(p);
      const barista=makeCat({fur:b.fur,inner:b.inner,eye:b.eye});barista.position.set(0,0.38,-1.05);built.add(barista);
      const hat=new T.Group();hat.add(mesh(CYL,M('#2B1B30'),0.24,0.22,0.24,0,0,0));hat.add(mesh(CYL,M('#2B1B30'),0.36,0.03,0.36,0,-0.1,0));hat.add(mesh(CYL,M('#FF5E99'),0.245,0.05,0.245,0,-0.05,0,false));hat.position.set(0,0.42,0);barista.userData.head.add(hat);
      built.add(mesh(BOX,M('#3B2340'),1.7,0.14,0.14,0,2.45,-0.4,false));
      const fg=new T.Mesh(new T.BoxGeometry(1,1,1).translate(0.5,0,0),M('#FFBE2E',{emissive:'#FFA000',emissiveIntensity:.35}));fg.scale.set(1.6,0.1,0.16);fg.position.set(-0.8,2.45,-0.38);built.add(fg);
      const pad=new T.Group();sg.add(pad);const padM=new T.MeshStandardMaterial({color:'#FFFFFF',transparent:true,opacity:.5});padM.userData={};const pd=new T.Mesh(BOX,padM);pd.userData.own=true;pd.scale.set(2.3,0.04,1.0);pd.position.y=0.02;pad.add(pd);
      const plus=new T.Group();plus.add(mesh(BOX,M('#FF5E99'),0.6,0.06,0.14,0,0.05,0,false));plus.add(mesh(BOX,M('#FF5E99'),0.14,0.06,0.6,0,0.05,0,false));pad.add(plus);
      const pick=new T.Mesh(new T.BoxGeometry(2.6,2.4,1.9),new T.MeshBasicMaterial({visible:false}));pick.position.set(0,1.1,-0.35);pick.userData={kind:'st',i};sg.add(pick);pickables.push(pick);
      st[i]={g:sg,built,pad,padM,plus,barista,hat,fg,prop:p,priceLabel:null,sig:'',pop:0,x,z}});
    buildDecor(g);
    resetCustomers();applyDaylight(true);
  }

  function refreshStation(i){const s=S.stations[i],o=st[i];if(!o)return;const L=LOCS[S.loc];const nextLocked=L.st.find(k=>S.stations[k].owned===0);
    const sig=(s.owned>0)+'|'+s.mgr+'|'+(nextLocked===i);if(sig===o.sig)return;const wasOpen=o.sig&&o.sig[0]==='t';o.sig=sig;
    o.built.visible=s.owned>0;o.pad.visible=s.owned===0;o.hat.visible=s.mgr;o.plus.visible=nextLocked===i;o.padM.opacity=nextLocked===i?.7:.3;
    if(o.priceLabel){o.g.remove(o.priceLabel);dispose(o.priceLabel);o.priceLabel=null}
    if(s.owned===0&&nextLocked===i){o.priceLabel=label('Open: '+fmt(STATIONS[i].cost),'#FF5E99','#FFFFFF');o.priceLabel.position.set(0,1.1,0);o.g.add(o.priceLabel)}
    if(s.owned>0&&!wasOpen&&o.sig)o.pop=1}

  /* ---- customers & resident cats ---- */
  const DOOR=new T.Vector3(0,0,9.8);const custs=[];
  for(let k=0;k<18;k++){const g=new T.Group();g.visible=false;scene.add(g);custs.push({g,model:null,breed:null,badge:null,state:'off',path:[],target:0,seat:null,timer:Math.random()*4,spd:2+Math.random()*0.8,happy:0,res:k>=16})}
  function pickBreed(){const l=S.loc;const w=RARITY.map(r=>r.w);if(S.decor.jar){w[1]*=2;w[2]*=2;w[3]*=2}
    if(S.rareNext>0){w[0]=0;S.rareNext--}
    const tot=w.reduce((a,b)=>a+b,0);let r=Math.random()*tot,rar=0;for(;rar<4;rar++){r-=w[rar];if(r<=0)break}rar=Math.min(3,rar);
    let pool=BREEDS.filter(b=>b.r===rar&&breedAvail(b,l));
    if(rar===3&&spooky()){pool=pool.concat([BREED.ghost,BREED.ghost])}
    if(!pool.length)pool=BREEDS.filter(b=>b.r===0);return pool[Math.floor(Math.random()*pool.length)]}
  function setModel(c,b){if(c.model){c.g.remove(c.model);dispose(c.model)}if(c.badge){c.g.remove(c.badge);dispose(c.badge);c.badge=null}
    c.breed=b;c.model=makeCat(b);c.model.scale.setScalar(c.res?0.8:0.78);c.g.add(c.model);
    c.model.traverse(m=>{if(m.isMesh){m.userData.kind='cust';m.userData.k=custs.indexOf(c)}});badgeFor(c)}
  function badgeFor(c){if(c.badge){c.g.remove(c.badge);dispose(c.badge);c.badge=null}const b=c.breed;if(!b)return;
    if(!S.cats[b.id])c.badge=newBadge();else if(b.r>=1)c.badge=starBadge(RCOL[b.r]);
    if(c.badge){c.badge.position.y=1.55;c.g.add(c.badge)}}
  function pathTo(i,j){const[x,z]=POS(j);const sz=z+1.35;const spot=new T.Vector3(x+(Math.random()-.5)*1.2,0,sz);
    return [new T.Vector3((Math.random()-.5)*0.8,0,8.4),new T.Vector3((Math.random()-.5)*0.8,0,sz),spot]}
  function pathToSeat(seat){return [new T.Vector3((Math.random()-.5)*0.6,0,8.4),new T.Vector3((Math.random()-.5)*0.6,0,seat.z),new T.Vector3(seat.x,0,seat.z)]}
  function spawnCust(c){const L=LOCS[S.loc];const owned=[];L.st.forEach((i,j)=>{if(S.stations[i].owned)owned.push(j)});if(!owned.length)return;
    setModel(c,pickBreed());c.g.position.copy(DOOR);c.g.visible=true;c.seat=null;
    const free=tables.filter(s=>!s.busy);
    if(free.length&&Math.random()<0.3){const s=free[Math.floor(Math.random()*free.length)];s.busy=true;c.seat=s;c.path=pathToSeat(s)}
    else{const j=owned[Math.floor(Math.random()*owned.length)];c.target=j;c.path=pathTo(L.st[j],j)}
    c.state='walk'}
  const NAPSPOTS=[[0,-2],[0,2],[-0.5,6],[0.4,-6],[-1,8.4],[1,4.6]];
  function spawnRes(c,k){setModel(c,BREED[k?'ginger':'snow']);const p=NAPSPOTS[k];c.g.position.set(p[0],0,p[1]);c.g.visible=true;c.state='nap';c.timer=3+Math.random()*6}
  function resetCustomers(){tables.forEach(s=>s.busy=false);custs.forEach((c,k)=>{c.g.visible=false;c.state='off';c.timer=Math.random()*2.5;c.seat=null;if(c.res)spawnRes(c,k-16)})}
  const turn=(g,ang,dt,rate)=>{g.rotation.y+=((ang-g.rotation.y+Math.PI*3)%(Math.PI*2)-Math.PI)*Math.min(1,dt*rate)};
  function stepCust(c,dt,time){
    if(c.state==='off'){c.timer-=dt;if(c.timer<=0)spawnCust(c);return}
    const g=c.g,m=c.model,moon=LOCS[S.loc].space;
    if(c.state==='walk'||c.state==='leave'||c.state==='wander'){const tgt=c.path[0];
      if(!tgt){if(c.state==='leave'){g.visible=false;c.state='off';c.timer=1+Math.random()*3}
        else if(c.state==='wander'){c.state='nap';c.timer=5+Math.random()*10}
        else if(c.seat){c.state='sit';c.timer=6+Math.random()*8+(S.decor.piano?4:0)}
        else{c.state='wait';c.timer=1.5+Math.random()*2.5}return}
      const d=tgt.clone().sub(g.position);d.y=0;const len=d.length();const mv=(c.state==='wander'?0.9:c.spd)*dt;
      if(len<=mv){g.position.x=tgt.x;g.position.z=tgt.z;c.path.shift()}else{g.position.addScaledVector(d,mv/len);turn(g,Math.atan2(d.x,d.z),dt,10)}
      m.position.y=Math.abs(Math.sin(time*(moon?5:11)+c.spd*5))*(moon?0.5:0.09);m.scale.y=m.scale.x;m.userData.tail.rotation.z=Math.sin(time*8)*0.25}
    else if(c.state==='wait'){m.position.y=0;turn(g,Math.PI,dt,8);m.userData.tail.rotation.z=Math.sin(time*3+c.spd)*0.35;c.timer-=dt;
      if(c.timer<=0){c.state='leave';const p=pathTo(0,c.target).slice(0,-1).reverse();p.push(DOOR.clone());c.path=p}}
    else if(c.state==='sit'){m.position.y=0.38;turn(g,c.seat.face,dt,8);m.userData.tail.rotation.z=Math.sin(time*2+c.spd)*0.4;m.userData.head.rotation.y=Math.sin(time*0.7+c.spd)*0.3;c.timer-=dt;
      if(c.timer<=0){c.seat.busy=false;c.state='leave';c.path=[new T.Vector3((Math.random()-.5)*0.6,0,c.seat.z),new T.Vector3(0,0,8.4),DOOR.clone()];c.seat=null;m.userData.head.rotation.y=0}}
    else if(c.state==='nap'){m.position.y=0;const br=1+Math.sin(time*2+c.spd)*0.03;m.scale.y=m.scale.x*0.7*br;m.userData.tail.rotation.z=Math.sin(time*1.2)*0.15;c.timer-=dt;
      if(c.timer<=0){const p=NAPSPOTS[Math.floor(Math.random()*NAPSPOTS.length)];c.path=[new T.Vector3(0,0,g.position.z),new T.Vector3(0,0,p[1]),new T.Vector3(p[0],0,p[1])];c.state='wander'}}
    if(c.happy>0){c.happy-=dt;m.userData.head.rotation.z=Math.sin(c.happy*20)*0.25}else m.userData.head.rotation.z=0;
    if(m.userData.rainbow)m.userData.rainbow.color.setHSL((time*0.15+c.spd)%1,0.75,0.65);
    if(c.badge)c.badge.position.y=1.55+Math.sin(time*3+c.spd)*0.06}

  /* ---- golden cat ---- */
  const gold=makeCat(BREED.snow,true);gold.scale.setScalar(1.05);gold.visible=false;scene.add(gold);gold.traverse(m=>{if(m.isMesh)m.userData.kind='gold'});
  let goldT=-1,nextGold=performance.now()+60000;const sparkle=new T.PointLight(0xFFC94D,0,4);gold.add(sparkle);sparkle.position.y=1;
  function endGold(){goldT=-1;gold.visible=false;$('goldbar').hidden=true;const gm=upMult('gold')*(S.decor.tank?1.25:1);nextGold=performance.now()+(120000+Math.random()*180000)/gm}

  /* ---- day & night ---- */
  let lastDay=-1;
  function daylight(){const d=new Date();const h=d.getHours()+d.getMinutes()/60;return Math.max(0,Math.min(1,0.5+0.62*Math.cos((h-13)/24*Math.PI*2)))}
  const cDay=new T.Color('#FFF1E0'),cDusk=new T.Color('#FFA070'),cNight=new T.Color('#9FB0FF'),tmp=new T.Color(),winNight=new T.Color('#24306A');
  function applyDaylight(force){const d=LOCS[S.loc].space?0.35:daylight();if(!force&&Math.abs(d-lastDay)<0.01)return;lastDay=d;
    sun.intensity=0.22+0.42*d;hemi.intensity=0.3+0.22*d;warm.intensity=(1-d)*0.85;
    if(d>0.5)tmp.copy(cDusk).lerp(cDay,(d-0.5)*2);else tmp.copy(cNight).lerp(cDusk,d*2);sun.color.copy(tmp);
    const L=LOCS[S.loc];winMats.forEach(m=>{m.color.set(L.win).lerp(winNight,1-d);m.emissive.set(L.space?'#3A2F7A':L.win).lerp(winNight,1-d);m.emissiveIntensity=0.2+(1-d)*0.4});
    lampLights.forEach(o=>{o.pl.intensity=(1-d)*1.3;o.sh.material.emissiveIntensity=0.2+(1-d)*1.0});
    fairy.forEach(b=>{b.material.emissiveIntensity=0.35+(1-d)*1.2})}

  /* ---- resize & camera fit ---- */
  const corners=[];for(const x of [-7.1,7.1])for(const y of [0,2.6])for(const z of [-8.9,9.6])corners.push(new T.Vector3(x,y,z));
  function resize(){const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;R.setSize(w,h,false);const asp=w/h;
    const z0=zoom,p0=pan;zoom=1;pan={x:0,z:0};placeCam();cam.updateMatrixWorld();
    let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const c of corners){const v=c.clone().applyMatrix4(cam.matrixWorldInverse);x0=Math.min(x0,v.x);x1=Math.max(x1,v.x);y0=Math.min(y0,v.y);y1=Math.max(y1,v.y)}
    const topF=Math.min(.3,96/h),botF=Math.min(.15,26/h);let fw=(x1-x0)*1.03,fh=(y1-y0)/(1-topF-botF);
    if(fw/fh<asp)fw=fh*asp;else fh=fw/asp;
    const cx=(x0+x1)/2,slack=fh-(y1-y0)-(topF+botF)*fh;
    cam.left=cx-fw/2;cam.right=cx+fw/2;cam.bottom=y0-botF*fh-slack/2;cam.top=cam.bottom+fh;
    zoom=z0;pan=p0;placeCam()}
  new ResizeObserver(resize).observe(stage);resize();

  /* ---- input ---- */
  const ptrs=new Map();let moved=0,pinch0=0,zoom0=1;
  function clampPan(){const lim=(1-1/zoom);pan.x=Math.max(-6.5*lim,Math.min(6.5*lim,pan.x));pan.z=Math.max(-9*lim,Math.min(9*lim,pan.z))}
  cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(ptrs.size===1)moved=0;else if(ptrs.size===2){const[a,b]=[...ptrs.values()];pinch0=Math.hypot(a.x-b.x,a.y-b.y);zoom0=zoom;moved=99}});
  cv.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;const p=ptrs.get(e.pointerId);const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
    if(ptrs.size===2){const[a,b]=[...ptrs.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);if(pinch0){zoom=Math.max(1,Math.min(2.6,zoom0*d/pinch0));S.zoomed=zoom>1.2;clampPan();placeCam()}}
    else if(ptrs.size===1){moved+=Math.abs(dx)+Math.abs(dy);if(zoom>1.01&&moved>6){const k=(cam.right-cam.left)/cam.zoom/stage.clientWidth;pan.x-=dx*k;pan.z-=dy*k*1.25;clampPan();placeCam()}}});
  cv.addEventListener('pointerup',e=>{if(!ptrs.has(e.pointerId))return;ptrs.delete(e.pointerId);if(ptrs.size===0){if(moved<8)tap(e.clientX,e.clientY);pinch0=0;$('zoom').innerHTML=S.zoomed?ICON.zout:ICON.zin}});
  cv.addEventListener('pointercancel',e=>{ptrs.delete(e.pointerId);pinch0=0});
  const ray=new T.Raycaster(),nv=new T.Vector2();
  function tap(cx,cy){audio();const r=cv.getBoundingClientRect();nv.set((cx-r.left)/r.width*2-1,-(cy-r.top)/r.height*2+1);ray.setFromCamera(nv,cam);
    const objs=[];if(gold.visible)gold.traverse(m=>{if(m.isMesh)objs.push(m)});custs.forEach(c=>{if(c.g.visible&&c.model)c.model.traverse(m=>{if(m.isMesh)objs.push(m)})});
    sleepers.forEach(s=>s.c.traverse(m=>{if(m.isMesh)objs.push(m)}));
    let hit=ray.intersectObjects(objs,false)[0];
    if(hit){const u=hit.object.userData;if(u.kind==='gold'){catchGold(cx,cy);return}
      if(u.kind==='cust'){const c=custs[u.k];c.happy=0.6;petCat(cx,cy,c.breed&&c.breed.id);badgeFor(c);return}
      if(u.kind==='sleep'){petCat(cx,cy,u.breed);return}}
    hit=ray.intersectObjects(pickables,false)[0];
    if(hit){const i=hit.object.userData.i;const s=S.stations[i];const L=LOCS[S.loc];
      if(s.owned)serve(i,true);
      else if(L.st.find(k=>S.stations[k].owned===0)===i){if(!openStation(i)){sfx.no();toast('Need '+fmt(STATIONS[i].cost)+' coins','to open the '+STATIONS[i].name)}}
      else{sfx.no();toast('Locked','Open the stations before this one first')}
      if(S.tab==='cafe'){const card=$('st'+i);if(card){card.classList.add('flash');setTimeout(()=>card.classList.remove('flash'),400)}}}
    hideHint()}
  let hinted=false;function hideHint(){if(hinted)return;hinted=true;$('hint').style.opacity=0;setTimeout(()=>$('hint').hidden=true,700)}
  setTimeout(hideHint,9000);

  const v3=new T.Vector3();
  function screenOf(i){const o=st[i];if(!o)return null;v3.set(o.x,1.6,o.z);v3.project(cam);const r=cv.getBoundingClientRect();return{x:r.left+(v3.x+1)/2*r.width,y:r.top+(1-v3.y)/2*r.height}}

  /* ---- frame ---- */
  let time=0,dayT=0;
  function frame(dt){time+=dt;dayT+=dt;if(dayT>2){dayT=0;applyDaylight(false)}
    for(const i of LOCS[S.loc].st){refreshStation(i);const o=st[i],s=S.stations[i];if(!o||!s.owned)continue;
      const working=s.run||s.mgr;const fast=cycleT(i)<0.15&&working;o.fg.scale.x=1.6*Math.max(0.001,fast?1:Math.min(1,s.prog));
      const bh=o.barista.userData.head;bh.position.y=0.8+(working?Math.abs(Math.sin(time*8+i))*0.06:Math.sin(time*1.5+i)*0.015);
      o.barista.userData.tail.rotation.z=Math.sin(time*(working?6:2)+i)*0.3;
      if(o.prop.userData.spin)o.prop.userData.spin.rotation.z+=dt*(working?2:0.4);
      if(o.prop.userData.float)o.prop.userData.float.position.y=1.55+Math.sin(time*2+i)*0.12;
      if(o.pop>0){o.pop=Math.max(0,o.pop-dt*2.5);const k=1+Math.sin(o.pop*Math.PI)*0.18;o.built.scale.set(k,k,k)}}
    for(const k in st){const o=st[k];if(o.priceLabel)o.priceLabel.position.y=1.1+Math.sin(time*3)*0.08}
    const want=Math.min(16,2+openedIn(S.loc)*2+(rushOn()?4:0));
    custs.forEach((c,k)=>{if(!c.res&&k>=want&&c.state==='off')return;stepCust(c,dt,time)});
    sleepers.forEach(s=>{s.t+=dt;s.zz.position.y=1.0+(s.t*0.4%1)*0.5;s.zz.material.opacity=1-(s.t*0.4%1);s.c.scale.y=0.5+Math.sin(s.t*2)*0.02});
    flames.forEach((f,k)=>{if(f.isLight)f.intensity=0.7+Math.sin(time*13)*0.15+Math.sin(time*7)*0.1;else f.scale.y=f.scale.x*2*(0.85+Math.sin(time*10+k*2)*0.15)});
    floaters.forEach(f=>{if(f.pulse){f.m.scale.y=0.2+Math.sin(time*6)*0.04;return}const a=time*0.8+f.k*2.1;f.m.position.set(Math.sin(a)*0.15,f.base+Math.sin(a*1.7)*0.15,Math.cos(a)*0.5);f.m.rotation.y=a+Math.PI/2});
    fairy.forEach((b,k)=>{b.scale.setScalar(0.08+Math.max(0,Math.sin(time*2+k))*0.02)});
    const now=performance.now();
    if(goldT<0&&now>nextGold&&!modalOpen){goldT=0;gold.visible=true;$('goldbar').hidden=false;sfx.gold()}
    if(goldT>=0){goldT+=dt;const k=goldT/16;gold.position.set(-7.5+15*k,Math.abs(Math.sin(time*9))*0.12,8.4);gold.rotation.y=Math.PI/2;sparkle.intensity=1+Math.sin(time*6)*0.5;if(k>=1)endGold()}
    R.render(scene,cam)}

  buildWorld();
  return{poke(i){if(st[i])st[i].pop=1},setLoc(){buildWorld()},refreshDecor(){buildWorld()},refreshBadges(){custs.forEach(badgeFor)},
    setZoom(z){zoom=z;pan={x:0,z:0};placeCam()},goldActive:()=>goldT>=0,endGold,frame,screenOf};
})();

/* ======================= LOOP ======================= */
let prev=performance.now(),achT=0,saveT=0;const lastFloat=new Array(N).fill(0);
function payFloat(i,v){if(STATIONS[i].loc!==S.loc)return;const n=performance.now();if(n-lastFloat[i]<450)return;lastFloat[i]=n;const p=Scene.screenOf(i);if(p)floatAt(p.x,p.y,'+'+fmt(v))}
function tick(now){
  const dt=Math.min(0.25,(now-prev)/1000);prev=now;
  for(let i=0;i<N;i++){const s=S.stations[i];if(!s.owned||!(s.run||s.mgr))continue;
    s.prog+=dt/cycleT(i);
    if(s.prog>=1){if(s.mgr){const c=Math.floor(s.prog);s.prog-=c;const v=payout(i)*c;earn(v);payFloat(i,v)}
      else{s.prog=0;s.run=false;const v=payout(i);earn(v);lastFloat[i]=0;payFloat(i,v);sfx.coin();Scene.poke(i)}}}
  Scene.frame(dt);
  achT+=dt;if(achT>.5){achT=0;checkAch()}
  saveT+=dt;if(saveT>5){saveT=0;save()}
  update(false);
  requestAnimationFrame(tick);
}

/* ======================= OFFLINE + DAILY ======================= */
function welcome(){
  const away=Math.min(OFFLINE_CAP,(Date.now()-(S.last||Date.now()))/1000);
  if(away>=30){const v=ips(true)*away;if(v>0)modal(`${catSVG('#FFA552','#FFD9B0','#2B1B30')}<h3>Welcome back!</h3><p>Your managers kept the cafés open for ${fmtT(away)}.</p><div class="big num">${coinI}${fmt(v)}</div>`,'Collect',()=>{earn(v);S.offline++;sfx.coin()})}
  const today=dayKey(new Date());
  if(S.daily.day!==today){const y=new Date();y.setDate(y.getDate()-1);
    const streak=S.daily.day===dayKey(y)?S.daily.streak+1:1;const day=Math.min(streak,7);
    const v=Math.max(50,ips(true)*300)*day;
    const bars=Array.from({length:7},(_,k)=>`<i class="${k<day?'on':''}"></i>`).join('');
    S.daily={day:today,streak};
    modal(`${catSVG('#FFFFFF','#FFB3C9','#2B1B30')}<h3>Daily treat · Day ${streak}</h3><p>Come back every day for bigger rewards (up to day 7). New quests are ready too!</p><div class="days">${bars}</div><div class="big num">${coinI}${fmt(v)}</div>`,'Claim',()=>{earn(v);sfx.level()})}
  ensureQuests();
}

/* ======================= BOOT ======================= */
render();
welcome();
S.last=Date.now();
requestAnimationFrame(t=>{prev=t;requestAnimationFrame(tick)});
document.addEventListener('visibilitychange',()=>{if(document.hidden)save();else{prev=performance.now();welcome();S.last=Date.now();if(S.tab==='quests')render()}});
window.addEventListener('pagehide',save);
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))}
})();
