/**
 * Showcase-level declarative payloads for the OpenAI Intelligent UI × A2UI Lumina SxS Workbench.
 *
 * Keeping domain-specific SVG geometry, cartographic features, and sandboxed HTML documents here
 * (rather than baked into `src/components/`) proves that `AnnotatedDiagram`, `RouteMap`, and
 * `MicroApp` remain 100% domain-agnostic primitives while achieving full SxS parity.
 */

const SPOKE_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
const COGS = [22, 19.5, 17, 15, 13, 11.2, 9.6];

function buildWheelShapes(cx: number, cy: number, group: string): Array<Record<string, unknown>> {
  const shapes: Array<Record<string, unknown>> = [
    {
      kind: 'circle',
      group,
      cx,
      cy,
      r: 72,
      stroke: 'var(--lumina-fg-primary)',
      activeStroke: 'var(--lumina-accent-primary)',
      strokeWidth: 7,
    },
    {
      kind: 'circle',
      group,
      cx,
      cy,
      r: 64,
      stroke: 'var(--lumina-fg-tertiary)',
      strokeWidth: 2,
    },
  ];

  for (const deg of SPOKE_ANGLES) {
    const rad = (deg * Math.PI) / 180;
    shapes.push({
      kind: 'line',
      group,
      x1: cx,
      y1: cy,
      x2: Number((cx + Math.cos(rad) * 63).toFixed(1)),
      y2: Number((cy + Math.sin(rad) * 63).toFixed(1)),
      stroke: 'var(--lumina-fg-tertiary)',
      strokeWidth: 1.1,
    });
  }

  shapes.push({
    kind: 'circle',
    group,
    cx,
    cy,
    r: 7,
    fill: 'var(--lumina-bg-surface)',
    stroke: 'var(--lumina-fg-primary)',
    strokeWidth: 2.5,
  });

  return shapes;
}

export const BICYCLE_7SPEED_SHAPES: Array<Record<string, unknown>> = [
  // Ground reference line
  {
    kind: 'line',
    x1: 72,
    y1: 274,
    x2: 568,
    y2: 274,
    stroke: 'var(--lumina-border-hairline)',
    strokeWidth: 2,
    strokeDasharray: '6 6',
  },
  // Rear & front 700c wheels
  ...buildWheelShapes(160, 198, 'frame'),
  ...buildWheelShapes(478, 198, 'frame'),
  // 7-speed rear cassette sprockets (step 1..7 highlights active gear)
  ...COGS.map((r, idx) => ({
    kind: 'circle',
    group: 'drivetrain',
    step: idx + 1,
    cx: 160,
    cy: 198,
    r,
    stroke: 'var(--lumina-fg-secondary)',
    activeStroke: '#10A37F',
    strokeWidth: 1.4,
  })),
  // Animated chain loop + front 44T chainring + cranks & pedals
  {
    kind: 'path',
    group: 'drivetrain',
    d: 'M 160 183 L 278 180 A 24 24 0 1 1 278 228 L 160 213 Z',
    stroke: '#10A37F',
    activeStroke: '#10A37F',
    strokeWidth: 2.4,
    strokeDasharray: '5 3',
    animatedFlow: true,
  },
  {
    kind: 'circle',
    group: 'drivetrain',
    cx: 278,
    cy: 204,
    r: 24,
    fill: 'var(--lumina-bg-elevated)',
    fillOpacity: 0.65,
    stroke: 'var(--lumina-fg-primary)',
    activeStroke: '#10A37F',
    strokeWidth: 3,
  },
  {
    kind: 'line',
    group: 'drivetrain',
    x1: 260,
    y1: 178,
    x2: 296,
    y2: 230,
    stroke: 'var(--lumina-fg-primary)',
    strokeWidth: 4,
  },
  {
    kind: 'rect',
    group: 'drivetrain',
    x: 251,
    y: 174,
    width: 18,
    height: 6,
    rx: 2,
    fill: 'var(--lumina-fg-primary)',
    stroke: 'var(--lumina-fg-primary)',
    strokeWidth: 1,
  },
  {
    kind: 'rect',
    group: 'drivetrain',
    x: 287,
    y: 228,
    width: 18,
    height: 6,
    rx: 2,
    fill: 'var(--lumina-fg-primary)',
    stroke: 'var(--lumina-fg-primary)',
    strokeWidth: 1,
  },
  // Double-diamond chromoly frame + curved front fork
  {
    kind: 'path',
    group: 'frame',
    d: 'M 160 198 L 236 104 L 418 98 L 432 132 L 278 204 L 160 198 M 236 104 L 278 204',
    stroke: '#0071E3',
    activeStroke: '#0071E3',
    strokeWidth: 5.5,
  },
  {
    kind: 'path',
    group: 'frame',
    d: 'M 432 132 Q 452 168 478 198',
    stroke: '#0071E3',
    activeStroke: '#0071E3',
    strokeWidth: 5,
  },
  // Brake cables, rim calipers, cockpit handlebars & saddle
  {
    kind: 'path',
    group: 'control',
    d: 'M 412 64 C 446 76, 444 108, 446 142',
    stroke: '#D97706',
    activeStroke: '#D97706',
    strokeWidth: 2.2,
  },
  {
    kind: 'path',
    group: 'control',
    d: 'M 410 66 C 362 84, 270 96, 206 138',
    stroke: '#D97706',
    activeStroke: '#D97706',
    strokeWidth: 2.2,
    strokeDasharray: '4 2',
  },
  {
    kind: 'rect',
    group: 'control',
    x: 441,
    y: 136,
    width: 12,
    height: 12,
    rx: 3,
    fill: '#D97706',
    stroke: '#D97706',
    strokeWidth: 1,
  },
  {
    kind: 'rect',
    group: 'control',
    x: 198,
    y: 134,
    width: 12,
    height: 12,
    rx: 3,
    fill: '#D97706',
    stroke: '#D97706',
    strokeWidth: 1,
  },
  {
    kind: 'line',
    group: 'control',
    x1: 236,
    y1: 104,
    x2: 225,
    y2: 74,
    stroke: '#5E5CE6',
    strokeWidth: 4.5,
  },
  {
    kind: 'path',
    group: 'control',
    d: 'M 200 72 Q 226 66 252 73 Q 238 81 206 79 Z',
    fill: 'var(--lumina-fg-primary)',
    stroke: 'var(--lumina-fg-primary)',
    strokeWidth: 1,
  },
  {
    kind: 'path',
    group: 'control',
    d: 'M 418 98 L 408 62 Q 402 54 386 58',
    stroke: '#5E5CE6',
    activeStroke: '#5E5CE6',
    strokeWidth: 4.5,
  },
  {
    kind: 'line',
    group: 'control',
    x1: 376,
    y1: 58,
    x2: 396,
    y2: 60,
    stroke: 'var(--lumina-fg-primary)',
    strokeWidth: 6,
  },
];

export const SF_BAY_BOUNDS = {
  minLat: 37.735,
  maxLat: 37.832,
  minLng: -122.518,
  maxLng: -122.355,
};

export const SF_BAY_FEATURES: Array<Record<string, unknown>> = [
  { kind: 'water', x: 0, y: 0, width: 640, height: 340 },
  { kind: 'land', d: 'M 0 0 L 245 0 L 218 42 L 164 56 L 118 44 L 58 64 L 0 54 Z' },
  { kind: 'park', d: 'M 48 0 L 210 0 L 188 38 L 95 40 Z' },
  { kind: 'land', d: 'M 552 0 L 640 0 L 640 270 L 582 225 L 548 135 Z' },
  {
    kind: 'land',
    d: 'M 74 128 L 138 96 L 208 86 L 272 88 L 352 74 L 418 92 L 456 132 L 474 214 L 486 340 L 62 340 L 66 226 Z',
  },
  { kind: 'park', d: 'M 135 98 L 228 89 L 236 136 L 146 142 Z' },
  { kind: 'park', x: 68, y: 196, width: 168, height: 34 },
  { kind: 'park', x: 268, y: 248, r: 22 },
  ...[130, 162, 194, 226, 258, 290].map((y) => ({
    kind: 'road',
    x1: 76,
    y1: y,
    x2: 462,
    y2: y,
    strokeWidth: 1.2,
  })),
  ...[126, 172, 218, 264, 310, 356, 402].map((x) => ({
    kind: 'road',
    x1: x,
    y1: 92,
    x2: x,
    y2: 336,
    strokeWidth: 1.2,
  })),
  { kind: 'road', x1: 250, y1: 262, x2: 444, y2: 128, strokeWidth: 2.8 },
  { kind: 'bridge', x1: 172, y1: 52, x2: 176, y2: 98, strokeWidth: 3.5 },
  { kind: 'bridge', x1: 448, y1: 126, x2: 568, y2: 82, strokeWidth: 3 },
  { kind: 'label', x: 115, y: 176, text: 'RICHMOND' },
  { kind: 'label', x: 112, y: 256, text: 'SUNSET' },
  { kind: 'label', x: 355, y: 246, text: 'MISSION' },
  { kind: 'label', x: 590, y: 128, text: 'OAKLAND' },
];

export const PIXEL_PALACE_HTML = `<style>
.stage{background:radial-gradient(circle at 50% 15%,#1c2033 0%,#121522 100%);color:#f6efe6;padding:16px;display:flex;flex-direction:column;align-items:center;gap:11px;min-height:100%}
.brand{display:flex;align-items:center;gap:8px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.brand-t{font-size:14px;font-weight:800;letter-spacing:.16em;color:#f2c97d}
.ed{font-size:10px;font-weight:700;padding:3px 8px;border-radius:5px;background:#b34766;color:#fff5f8}
.modes{display:inline-flex;gap:6px}
.mbtn{border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.05);color:rgba(255,255,255,.8);font-family:ui-monospace,monospace;font-size:11px;font-weight:700;letter-spacing:.06em;padding:5px 12px;border-radius:7px;cursor:pointer}
.mbtn.on{background:#eac67a;border-color:#eac67a;color:#1c1714}
.shell{width:min(100%,342px);border-radius:22px 22px 40px 22px;background:linear-gradient(180deg,#f1d6bc 0%,#e5c4a5 100%);border:2px solid #cda989;box-shadow:inset 0 2px 0 rgba(255,255,255,.55),0 16px 32px rgba(0,0,0,.42);padding:13px 15px 18px;color:#2c2420;display:flex;flex-direction:column;gap:10px}
.bezel{display:flex;justify-content:space-between;font-family:ui-monospace,monospace;font-size:10.5px;font-weight:800;letter-spacing:.12em;color:#5c4b3e}
.frame{background:#30313d;border-radius:12px 12px 20px 12px;padding:9px;color:#d6e3b5;display:flex;flex-direction:column;gap:5px}
.hud{display:flex;justify-content:space-between;font-family:ui-monospace,monospace;font-size:10.5px;color:#c5ced8;font-variant-numeric:tabular-nums}
.lcd{position:relative;border-radius:6px;overflow:hidden;background:#abc39b;border:2px solid #22291f}
canvas{width:100%;height:auto;display:block;image-rendering:pixelated}
.ov{position:absolute;inset:0;background:rgba(168,194,152,.88);color:#223026;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:12px;gap:6px;font-family:ui-monospace,monospace}
.ov.hide{display:none}
.cta{margin-top:4px;border:0;border-radius:6px;background:#223026;color:#e6f2dc;font-family:ui-monospace,monospace;font-size:11px;font-weight:800;padding:7px 14px;cursor:pointer}
.ctrls{display:flex;align-items:center;justify-content:space-between;padding:4px 8px 0}
.dpad{display:grid;grid-template-columns:repeat(3,29px);grid-template-rows:repeat(3,29px);align-items:center;justify-items:center}
.key{width:29px;height:29px;border:0;border-radius:5px;background:#2b2e3d;color:#e2e6f0;font-size:10px;cursor:pointer;box-shadow:0 2px 0 #181a24}
.hub{width:29px;height:29px;background:#2b2e3d;color:#777d94;display:inline-flex;align-items:center;justify-content:center;font-size:10px}
.ab{display:inline-flex;gap:12px;transform:rotate(-18deg)}
.rnd{width:38px;height:38px;border-radius:999px;border:0;background:linear-gradient(180deg,#bf4768 0%,#9c3351 100%);color:#fff;font-family:ui-monospace,monospace;font-weight:800;font-size:12px;box-shadow:0 3px 0 #661c32;cursor:pointer}
</style>
<div class="stage">
  <div class="brand"><span class="brand-t">PIXEL PALACE</span><span class="ed">1989 EDITION</span></div>
  <div class="modes" role="group">
    <button class="mbtn on" data-m="snake">SNAKE</button>
    <button class="mbtn" data-m="breakout">BREAKOUT</button>
    <button class="mbtn" data-m="pong">PONG</button>
  </div>
  <div class="shell">
    <div class="bezel"><span>PIXELBOY <span style="color:#b83353">★</span></span><span>8-BIT SYSTEM</span></div>
    <div class="frame">
      <div class="hud"><span id="sc">SCORE 000</span><span id="bs">BEST 000</span></div>
      <div class="lcd">
        <canvas id="cv" width="240" height="220"></canvas>
        <div class="ov" id="ov">
          <div id="ot" style="font-size:16px;font-weight:800;letter-spacing:.1em">SNAKE</div>
          <div id="od" style="font-size:10.5px">EAT THE FRUIT · AVOID WALLS</div>
          <button class="cta" id="startBtn">▶ START GAME</button>
        </div>
      </div>
      <div class="hud"><span id="st">● POWER STANDBY</span><span id="lv">LEVEL 01</span></div>
    </div>
    <div class="ctrls">
      <div class="dpad">
        <span></span><button class="key" data-d="up">▲</button><span></span>
        <button class="key" data-d="left">◀</button><span class="hub">✦</span><button class="key" data-d="right">▶</button>
        <span></span><button class="key" data-d="down">▼</button><span></span>
      </div>
      <div class="ab">
        <button class="rnd" id="btnB">B</button>
        <button class="rnd" id="btnA">A</button>
      </div>
    </div>
  </div>
</div>
<script>
const cv=document.getElementById('cv'),x=cv.getContext('2d'),ov=document.getElementById('ov'),ot=document.getElementById('ot'),od=document.getElementById('od'),scEl=document.getElementById('sc'),bsEl=document.getElementById('bs'),stEl=document.getElementById('st'),startBtn=document.getElementById('startBtn');
let mode='snake',running=false,score=0,best={snake:0,breakout:0,pong:0};
let snake=[{x:7,y:6},{x:6,y:6},{x:5,y:6}],dir={x:1,y:0},ndir={x:1,y:0},food={x:11,y:6},acc=0;
let px=90,bx=120,by=150,vx=2.3,vy=-2.4,bricks=[],py=85,ay=85;
function init(){
  score=0;scEl.textContent='SCORE 000';bsEl.textContent='BEST '+String(best[mode]).padStart(3,'0');
  snake=[{x:7,y:6},{x:6,y:6},{x:5,y:6}];dir={x:1,y:0};ndir={x:1,y:0};food={x:11,y:6};
  px=92;bx=120;by=150;vx=2.2;vy=-2.4;py=85;ay=85;
  bricks=[];for(let r=0;r<4;r++)for(let c=0;c<7;c++)bricks.push({x:10+c*32,y:18+r*14,on:true});
  paint();
}
function setMode(m){
  mode=m;running=false;
  document.querySelectorAll('.mbtn').forEach(b=>b.classList.toggle('on',b.dataset.m===m));
  ot.textContent=m.toUpperCase();
  od.textContent=m==='snake'?'EAT THE FRUIT · AVOID WALLS':m==='breakout'?'BREAK ALL THE BRICKS · MOVE ◀ ▶':'FIRST TO 7 POINTS · MOVE ▲ ▼';
  startBtn.textContent='▶ START GAME';ov.classList.remove('hide');stEl.textContent='● POWER STANDBY';
  init();
}
function paint(){
  x.fillStyle='#abc39b';x.fillRect(0,0,240,220);
  x.strokeStyle='rgba(34,48,38,.08)';
  for(let i=0;i<240;i+=15){x.beginPath();x.moveTo(i,0);x.lineTo(i,220);x.stroke();}
  x.fillStyle='#223026';
  if(mode==='snake'){
    x.fillRect(food.x*15+3,food.y*15+3,9,9);
    snake.forEach((p,i)=>x.fillRect(p.x*15+1,p.y*15+1,13,13));
  }else if(mode==='breakout'){
    bricks.forEach(b=>{if(b.on)x.fillRect(b.x,b.y,28,9);});
    x.fillRect(px,202,54,7);x.fillRect(bx-4,by-4,8,8);
  }else{
    x.fillRect(10,py,7,44);x.fillRect(223,ay,7,44);x.fillRect(bx-4,by-4,8,8);
  }
}
function addScore(n){score+=n;if(score>best[mode])best[mode]=score;scEl.textContent='SCORE '+String(score).padStart(3,'0');bsEl.textContent='BEST '+String(best[mode]).padStart(3,'0');}
function over(msg){running=false;ot.textContent=msg;startBtn.textContent='↻ PLAY AGAIN';ov.classList.remove('hide');stEl.textContent='● POWER OVER';}
let last=0;
function loop(ts){
  if(!running)return;
  const dt=last?Math.min(40,ts-last):16;last=ts;
  if(mode==='snake'){
    acc+=dt;if(acc>=125){acc=0;dir=ndir;const h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
      if(h.x<0||h.x>=16||h.y<0||h.y>=14||snake.some(s=>s.x===h.x&&s.y===h.y)){over('GAME OVER');return;}
      snake.unshift(h);if(h.x===food.x&&h.y===food.y){addScore(1);food={x:Math.floor(Math.random()*15),y:Math.floor(Math.random()*13)};}else snake.pop();
    }
  }else if(mode==='breakout'){
    bx+=vx;by+=vy;if(bx<6||bx>234)vx=-vx;if(by<6)vy=-vy;
    if(by>=198&&bx>=px&&bx<=px+54)vy=-Math.abs(vy);
    bricks.forEach(b=>{if(b.on&&bx>=b.x&&bx<=b.x+28&&by>=b.y&&by<=b.y+9){b.on=false;vy=-vy;addScore(1);}});
    if(by>220){over('BALL LOST');return;}
  }else{
    bx+=vx;by+=vy;if(by<6||by>214)vy=-vy;ay+=(by-(ay+22))*0.08;
    if(bx<=18&&by>=py&&by<=py+44)vx=Math.abs(vx);
    if(bx>=220&&by>=ay&&by<=ay+44)vx=-Math.abs(vx);
    if(bx>240){addScore(1);bx=120;by=110;}if(bx<0){over('CPU SCORES');return;}
  }
  paint();requestAnimationFrame(loop);
}
function toggle(){
  if(!running){if(ot.textContent.includes('OVER')||ot.textContent.includes('LOST'))init();running=true;last=0;ov.classList.add('hide');stEl.textContent='● POWER ON';requestAnimationFrame(loop);}
  else{running=false;ot.textContent='PAUSED';startBtn.textContent='▶ RESUME';ov.classList.remove('hide');stEl.textContent='● POWER PAUSED';}
}
function steer(d){
  if(mode==='snake'){const m={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}}[d];if(m&&!(m.x===-dir.x&&m.y===-dir.y))ndir=m;}
  else if(mode==='breakout'){px=Math.max(0,Math.min(186,px+(d==='left'?-22:d==='right'?22:0)));paint();}
  else{py=Math.max(0,Math.min(176,py+(d==='up'?-22:d==='down'?22:0)));paint();}
}
document.querySelectorAll('.mbtn').forEach(b=>b.onclick=()=>setMode(b.dataset.m));
document.querySelectorAll('.key').forEach(b=>b.onclick=()=>steer(b.dataset.d));
startBtn.onclick=toggle;document.getElementById('btnA').onclick=toggle;document.getElementById('btnB').onclick=()=>setMode(mode);
window.onkeydown=e=>{const m={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'}[e.key];if(m){e.preventDefault();steer(m);}};
init();
</script>`;

export const DRUM_LAB_HTML = `<style>
.lab{background:#121318;color:#f3f4f6;padding:16px;display:flex;flex-direction:column;gap:12px;min-height:100%}
.hdr{display:flex;align-items:center;justify-content:space-between}
.ttl{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:15px;font-weight:800;letter-spacing:.08em}
.sub{font-size:12px;color:#9ca3af;margin-top:2px}
.rdy{font-family:ui-monospace,monospace;font-size:11px;font-weight:700;padding:3px 9px;border-radius:999px;background:rgba(16,163,127,.18);color:#34d399}
.pnl{background:#1b1d24;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:10px}
.tr{display:flex;align-items:center;gap:8px}
.btn{display:inline-flex;align-items:center;gap:6px;border-radius:8px;padding:6px 12px;font-size:12.5px;font-weight:650;cursor:pointer;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);color:#e5e7eb}
.btn.play{border:0;background:#10a37f;color:#fff}
.btn.play.on{background:#f59e0b;color:#111827}
.knobs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.knob{display:flex;flex-direction:column;gap:4px;font-family:ui-monospace,monospace;font-size:11px;color:#9ca3af}
.knob strong{color:#f9fafb;font-variant-numeric:tabular-nums}
.knob input{width:100%;accent-color:#10a37f}
.row{display:grid;grid-template-columns:56px 1fr;align-items:center;gap:8px;margin-top:5px}
.tname{display:inline-flex;align-items:center;gap:6px;font-family:ui-monospace,monospace;font-size:11px;font-weight:700;color:#d1d5db}
.dot{width:8px;height:8px;border-radius:999px}
.steps{display:grid;grid-template-columns:repeat(16,minmax(0,1fr));gap:4px}
.cell{height:25px;border-radius:5px;border:1px solid rgba(255,255,255,.1);background:#262934;padding:0;cursor:pointer}
.cell.hd{outline:2px solid #fff;outline-offset:1px}
.pads{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.pad{background:#1b1d24;border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:8px 10px;color:#f3f4f6;font-size:12px;text-align:left;display:flex;justify-content:space-between;align-items:center;cursor:pointer}
.pad kbd{font-family:ui-monospace,monospace;font-size:10.5px;padding:1px 5px;border-radius:4px;background:rgba(255,255,255,.08);color:#9ca3af}
</style>
<div class="lab">
  <div class="hdr">
    <div><div class="ttl">DRUM / LAB 01</div><div class="sub">Rhythm playground · 16-step WebAudio machine</div></div>
    <span class="rdy">● READY</span>
  </div>
  <div class="pnl">
    <div class="tr">
      <button class="btn play" id="playBtn">▶ Play</button>
      <button class="btn" id="stopBtn">■ Stop</button>
      <button class="btn" id="randBtn" style="margin-left:auto">🎲 Randomize</button>
    </div>
    <div class="knobs">
      <label class="knob"><span>TEMPO <strong id="tv">120 BPM</strong></span><input id="tempo" type="range" min="70" max="180" value="120"></label>
      <label class="knob"><span>SWING <strong id="sv">0%</strong></span><input id="swing" type="range" min="0" max="60" value="0"></label>
      <label class="knob"><span>VOLUME <strong id="vv">75%</strong></span><input id="vol" type="range" min="0" max="100" value="75"></label>
    </div>
  </div>
  <div class="pnl">
    <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px">
      <div><strong>Step sequencer</strong> <span style="font-size:11.5px;color:#9ca3af;margin-left:6px">Tap cells to program groove</span></div>
      <button class="btn" id="clrBtn" style="padding:4px 9px;font-size:11.5px">Clear</button>
    </div>
    <div id="matrix"></div>
  </div>
  <div class="pads" id="pads"></div>
</div>
<script>
const TRACKS=[
  {id:'kick',s:'KICK',n:'Kick',k:'A',c:'#D7846E',f:62,init:[0,4,8,12]},
  {id:'snare',s:'SNARE',n:'Snare',k:'S',c:'#DBB266',f:185,init:[4,12]},
  {id:'ch',s:'CH',n:'Closed Hat',k:'D',c:'#80A6D6',f:640,init:[0,2,4,6,8,10,12,14]},
  {id:'oh',s:'OH',n:'Open Hat',k:'F',c:'#9B8FD6',f:520,init:[6,14]},
  {id:'clap',s:'CLAP',n:'Clap',k:'G',c:'#96C29C',f:310,init:[4,12]},
  {id:'tom',s:'TOM',n:'Tom',k:'H',c:'#C985B4',f:118,init:[]}
];
let grid=TRACKS.map(t=>Array.from({length:16},(_,i)=>t.init.includes(i)));
let ctx=null,playing=false,head=0,timer=null,tempo=120,vol=75;
function hit(tr){
  try{if(!ctx)ctx=new (window.AudioContext||window.webkitAudioContext)();if(vol<=0)return;
    const t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();
    o.type=tr.id==='ch'||tr.id==='oh'?'square':'triangle';
    o.frequency.setValueAtTime(tr.f*1.6,t);o.frequency.exponentialRampToValueAtTime(Math.max(30,tr.f*0.55),t+0.11);
    g.gain.setValueAtTime((vol/100)*0.22,t);g.gain.exponentialRampToValueAtTime(0.001,t+(tr.id==='oh'?0.22:0.12));
    o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+0.24);
  }catch(e){}
}
const mx=document.getElementById('matrix'),pd=document.getElementById('pads');
function render(){
  mx.innerHTML='';
  TRACKS.forEach((tr,r)=>{
    const row=document.createElement('div');row.className='row';
    row.innerHTML='<span class="tname"><span class="dot" style="background:'+tr.c+'"></span>'+tr.s+'</span>';
    const st=document.createElement('div');st.className='steps';
    for(let s=0;s<16;s++){
      const b=document.createElement('button');
      b.className='cell'+(playing&&head===s?' hd':'');
      b.setAttribute('aria-label',tr.n+' step '+(s+1));
      if(grid[r][s])b.style.background=tr.c;
      b.onclick=()=>{grid[r][s]=!grid[r][s];render();};
      st.appendChild(b);
    }
    row.appendChild(st);mx.appendChild(row);
  });
}
TRACKS.forEach(tr=>{
  const b=document.createElement('button');b.className='pad';
  b.innerHTML='<span><span class="dot" style="display:inline-block;margin-right:6px;background:'+tr.c+'"></span><strong>'+tr.n+'</strong></span><kbd>'+tr.k+'</kbd>';
  b.onclick=()=>hit(tr);pd.appendChild(b);
});
function restartTimer(){
  clearInterval(timer);if(!playing)return;
  timer=setInterval(()=>{head=(head+1)%16;TRACKS.forEach((tr,r)=>{if(grid[r][head])hit(tr);});render();},Math.max(60,Math.round(60000/tempo/4)));
}
const playBtn=document.getElementById('playBtn');
playBtn.onclick=()=>{playing=!playing;playBtn.classList.toggle('on',playing);playBtn.textContent=playing?'❚❚ Pause':'▶ Play';restartTimer();render();};
document.getElementById('stopBtn').onclick=()=>{playing=false;head=0;playBtn.classList.remove('on');playBtn.textContent='▶ Play';clearInterval(timer);render();};
document.getElementById('randBtn').onclick=()=>{grid=TRACKS.map((_,r)=>Array.from({length:16},(__,s)=>r===0?s%4===0||Math.random()<.15:Math.random()<.24));render();};
document.getElementById('clrBtn').onclick=()=>{grid=TRACKS.map(()=>Array(16).fill(false));render();};
document.getElementById('tempo').oninput=e=>{tempo=Number(e.target.value);document.getElementById('tv').textContent=tempo+' BPM';restartTimer();};
document.getElementById('swing').oninput=e=>{document.getElementById('sv').textContent=e.target.value+'%';};
document.getElementById('vol').oninput=e=>{vol=Number(e.target.value);document.getElementById('vv').textContent=vol+'%';};
render();
</script>`;
