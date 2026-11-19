export const ARCADE_PAGE = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Arcade &mdash; Endling: Survival Momentum + Eldritch Chiropractor | Eco Emo</title>
<meta name="description" content="Two hand-built 2D cabinet games from Eco Emo: Endling: Survival Momentum, a momentum runner for vanishing habitat, and Eldritch Chiropractor, a ragdoll spine-alignment game.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=UnifrakturMaguntia&family=Space+Mono:wght@400;700&family=Plus+Jakarta+Sans:wght@300;400;600&display=swap" rel="stylesheet">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23070709'/%3E%3Ctext x='16' y='23' font-size='17' text-anchor='middle' fill='%234ADE80' font-family='serif'%3E%C6%8EE%3C/text%3E%3C/svg%3E">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#070709;color:#EFECE4;font-family:"Plus Jakarta Sans",system-ui,sans-serif;line-height:1.7;overflow-x:clip}
.wrap{max-width:1080px;margin:0 auto;padding:30px 18px 70px}
.eyebrow{font-family:"Space Mono",monospace;font-size:9px;letter-spacing:.34em;text-transform:uppercase;color:#4ADE80}
h1{font-family:"Cinzel Decorative",serif;font-size:clamp(26px,5.6vw,52px);line-height:1.02;letter-spacing:.02em;
text-transform:uppercase;margin:12px 0 10px;text-shadow:0 1px 0 #000,3px 3px 0 rgba(139,30,36,.45)}
.lede{color:#a8a49a;font-size:16px;max-width:70ch}
.cab{margin-top:40px;border:1px solid rgba(239,236,228,.16);background:linear-gradient(180deg,#111215,#070709);
padding:14px;position:relative}
.cab:before,.cab:after{content:"";position:absolute;width:12px;height:12px;border:1px solid rgba(239,236,228,.4);opacity:.55}
.cab:before{top:-6px;left:-6px;border-right:none;border-bottom:none}
.cab:after{bottom:-6px;right:-6px;border-left:none;border-top:none}
.cab-head{display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:10px}
.cab-title{font-family:"Cinzel Decorative",serif;font-size:clamp(15px,2.6vw,21px);letter-spacing:.05em;text-transform:uppercase}
.cab-sub{font-family:"Space Mono",monospace;font-size:8.5px;letter-spacing:.22em;text-transform:uppercase;color:#8B1E24}
.screen{position:relative;border:2px solid #1b1d21;background:#05060a;border-radius:6px;overflow:hidden;
box-shadow:inset 0 0 70px rgba(0,0,0,.95),0 0 0 8px #0b0c0f,0 0 0 9px rgba(239,236,228,.1)}
.screen:after{content:"";position:absolute;inset:0;pointer-events:none;z-index:5;
background:repeating-linear-gradient(180deg,rgba(0,0,0,.28) 0 1px,rgba(0,0,0,0) 1px 3px),radial-gradient(ellipse at center,rgba(0,0,0,0) 55%,rgba(0,0,0,.6) 100%)}
canvas{display:block;width:100%;height:auto;touch-action:none}
.overlay{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
background:rgba(5,6,10,.86);z-index:6;text-align:center;padding:18px}
.overlay.hide{display:none}
.cab.fs{position:fixed;inset:0;z-index:9999;margin:0;padding:8px;background:#070709;
display:flex;flex-direction:column;justify-content:center;overflow:auto}
.cab.fs .screen,.cab.fs .cab-head,.cab.fs .hud,.cab.fs .board{width:100%;max-width:1240px;margin-left:auto;margin-right:auto}
.cab.fs canvas{width:auto;height:auto;max-width:100%;max-height:calc(100vh - 150px);margin:0 auto}
.cab.fs .board{display:none}
body.fs-on{overflow:hidden}
.overlay h3{font-family:"Cinzel Decorative",serif;font-size:clamp(15px,3vw,22px);letter-spacing:.05em;text-transform:uppercase}
.overlay p{font-size:13px;color:#a8a49a;max-width:46ch}
.overlay .keys{font-family:"Space Mono",monospace;font-size:9px;letter-spacing:.16em;color:#4ADE80;text-transform:uppercase}
button.act{font-family:"Space Mono",monospace;font-size:10px;letter-spacing:.24em;text-transform:uppercase;
padding:11px 18px;background:#1E4D36;color:#EFECE4;border:1px solid rgba(74,222,128,.5);cursor:pointer}
button.act:hover{background:#4ADE80;color:#070709}
button.act:disabled{opacity:.4;cursor:default}
.hud{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:10px}
.hud .stat{font-family:"Space Mono",monospace;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#a8a49a;
border:1px solid rgba(239,236,228,.14);padding:6px 9px}
.hud .stat b{color:#4ADE80;font-size:12px;margin-left:6px}
.pad{display:flex;gap:8px;margin-left:auto}
.pad button{font-family:"Space Mono",monospace;font-size:9px;letter-spacing:.16em;text-transform:uppercase;
padding:8px 14px;background:#111215;color:#EFECE4;border:1px solid rgba(239,236,228,.18);cursor:pointer;touch-action:none}
.pad button:active{background:rgba(74,222,128,.25);border-color:#4ADE80}
.board{list-style:none;margin-top:12px;border-top:1px dashed rgba(74,222,128,.25);padding-top:8px}
.board li{display:flex;justify-content:space-between;font-family:"Space Mono",monospace;font-size:9.5px;letter-spacing:.14em;
color:#a8a49a;padding:3px 0}
.board li span:last-child{color:#EFECE4}
.board li:first-child span:last-child{color:#4ADE80}
.foot{margin-top:44px;border-top:1px solid rgba(239,236,228,.14);padding-top:16px;
font-family:"Space Mono",monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#6d6a62;
display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px}
.foot a{color:#a8a49a;text-decoration:none}.foot a:hover{color:#4ADE80}
@media(max-width:560px){.wrap{padding:22px 12px 56px}.pad{width:100%;margin-left:0}.pad button{flex:1}}
</style></head><body>
<div class="wrap">
<div class="eyebrow">Cabinet build &middot; &#477;E</div>
<h1>Arcade</h1>
<p class="lede">Two machines, both hand-built in canvas. One is about surviving a shrinking corridor. The other is about
putting a spine back where it belongs. Both keep your best run in this browser.</p>

<section class="cab" id="cab1">
  <div class="cab-head">
    <span class="cab-title">01 // Endling: Survival Momentum</span>
    <span class="cab-sub">Roots &rarr; Canopy &middot; momentum runner</span>
  </div>
  <div class="screen" id="s1">
    <canvas id="c1" width="900" height="340"></canvas>
    <div class="overlay" id="ov1">
      <h3>Survival Momentum</h3>
      <p>Jump the red gates, grab the species orbs, dash straight through anything you cannot clear. The corridor gets faster the longer you last.</p>
      <span class="keys">SPACE / TAP = JUMP &middot; SHIFT / X = DASH &middot; TAP RIGHT SIDE = DASH</span>
      <button class="act" id="start1">Insert coin</button>
    </div>
  </div>
  <div class="hud">
    <span class="stat">Score<b id="sc1">0</b></span>
    <span class="stat">Best<b id="bs1">0</b></span>
    <span class="stat">Rescued<b id="rs1">0</b></span>
    <div class="pad"><button id="jumpBtn1">Jump</button><button id="dashBtn1">Dash</button><button id="fs1">Full</button></div>
  </div>
  <ul class="board" id="bd1"></ul>
</section>

<section class="cab" id="cab2">
  <div class="cab-head">
    <span class="cab-title">02 // Eldritch Chiropractor</span>
    <span class="cab-sub">Trunk &middot; ragdoll spine alignment</span>
  </div>
  <div class="screen" id="s2">
    <canvas id="c2" width="900" height="380"></canvas>
    <div class="overlay" id="ov2">
      <h3>Eldritch Chiropractor</h3>
      <p>Drag a vertebra onto the glowing numbered marker before the clock dies. Markers fill in order, so always aim for the one that is lit. Quick snaps build the combo.</p>
      <span class="keys">DRAG VERTEBRA &rarr; LIT MARKER &middot; MOUSE OR FINGER</span>
      <button class="act" id="start2">Begin the adjustment</button>
    </div>
  </div>
  <div class="hud">
    <span class="stat">Score<b id="sc2">0</b></span>
    <span class="stat">Best<b id="bs2">0</b></span>
    <span class="stat">Combo<b id="cb2">x1</b></span>
    <span class="stat">Time<b id="tm2">60</b></span>
    <div class="pad"><button id="fs2">Full</button></div>
  </div>
  <ul class="board" id="bd2"></ul>
</section>

<div class="foot"><span>&#477;E &middot; Eco Emo Arcade &middot; no accounts, no ads, no tracking</span>
<span><a href="/shop">Shop</a> &middot; <a href="/vault">Vault</a> &middot; <a href="/">Surface</a></span></div>
</div>

<script>
(function(){
  "use strict";
  var LS1="ee_sm_scores_v1", LS2="ee_ch_scores_v1";
  function load(k){try{return JSON.parse(localStorage.getItem(k)||"[]")}catch(e){return []}}
  function save(k,a){try{localStorage.setItem(k,JSON.stringify(a))}catch(e){}}
  function push(k,score){
    var a=load(k);
    a.push({s:Math.max(0,Math.floor(score)),d:new Date().toISOString().slice(0,10)});
    a.sort(function(x,y){return y.s-x.s;});
    a=a.slice(0,5);save(k,a);return a;
  }
  function board(el,k){
    if(!el)return;
    var a=load(k);
    el.innerHTML=a.length
      ? a.map(function(r,i){return '<li><span>'+(i+1)+' &middot; '+r.d+'</span><span>'+r.s+'</span></li>';}).join('')
      : '<li><span>no runs logged</span><span>&mdash;</span></li>';
  }
  var AC=null;
  function ac(){
    if(AC===false)return null;
    if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){AC=false;}}
    if(AC&&AC.state==="suspended"){try{AC.resume();}catch(e){}}
    return AC||null;
  }
  function blip(freq,dur,type,gain){
    var c=ac();if(!c)return;
    try{
      var o=c.createOscillator(),g=c.createGain();
      o.type=type||"square";o.frequency.value=freq;
      g.gain.value=0;o.connect(g);g.connect(c.destination);
      var t=c.currentTime;
      g.gain.linearRampToValueAtTime(gain||.04,t+0.006);
      g.gain.exponentialRampToValueAtTime(0.0001,t+(dur||.1));
      o.start(t);o.stop(t+(dur||.1)+0.02);
    }catch(e){}
  }
  function crunch(){
    var c=ac();if(!c)return;
    try{
      var n=Math.floor(c.sampleRate*0.16),buf=c.createBuffer(1,n,c.sampleRate),d=buf.getChannelData(0);
      for(var i=0;i<n;i++){d[i]=(Math.random()*2-1)*Math.pow(1-i/n,3);}
      var s=c.createBufferSource();s.buffer=buf;
      var g=c.createGain();g.gain.value=0.16;
      var f=c.createBiquadFilter();f.type="lowpass";f.frequency.value=1500;
      s.connect(f);f.connect(g);g.connect(c.destination);s.start();
    }catch(e){}
  }
  function wireFs(cabId,btnId){
    var cab=document.getElementById(cabId),btn=document.getElementById(btnId);
    if(!cab||!btn)return;
    btn.addEventListener("click",function(){
      var on=cab.classList.toggle("fs");
      btn.textContent=on?"Exit":"Full";
      if(on){document.body.classList.add("fs-on");}
      else{document.body.classList.remove("fs-on");}
    });
    document.addEventListener("keydown",function(e){
      if(e.key==="Escape"&&cab.classList.contains("fs")){
        cab.classList.remove("fs");btn.textContent="Full";document.body.classList.remove("fs-on");
      }
    });
  }
  wireFs("cab1","fs1");wireFs("cab2","fs2");

  // ═════════════════════════════════════════════════════════════════════════
  // GAME 01 — ENDLING: SURVIVAL MOMENTUM
  // ═════════════════════════════════════════════════════════════════════════
  (function(){
    var cv=document.getElementById("c1");if(!cv)return;
    var ctx=cv.getContext("2d");
    var W=900,H=340,GROUND=H-52;
    var ov=document.getElementById("ov1"),startBtn=document.getElementById("start1"),ovBtn=ov.querySelector("button");
    var scEl=document.getElementById("sc1"),bsEl=document.getElementById("bs1"),rsEl=document.getElementById("rs1");
    var GRAV=0.62,JUMPV=-9.0,MAXJ=2,DASHN=12,DASHCD=52;
    var running=false,over=false,paused=false,dist=0,score=0,rescued=0,speed=3.4;
    var gates=[],orbs=[],parts=[],bg=[],spawnAt=0,raf=0,last=0,hint="";
    var p={x:150,y:0,vx:0,vy:0,w:26,h:30,jumps:0,dash:0,cd:0,inv:0,buf:0};
    for(var i=0;i<26;i++){bg.push({x:Math.random()*W,y:Math.random()*GROUND,s:Math.random()*1.6+0.4});}
    function rnd(n){return Math.floor(Math.random()*n);}
    function best(v){bsEl.textContent=v;}
    function reset(){
      running=true;over=false;paused=false;dist=0;score=0;rescued=0;speed=3.4;
      p.y=GROUND-p.h;p.vy=0;p.jumps=0;p.dash=0;p.cd=0;p.inv=0;p.buf=0;
      gates=[];orbs=[];parts=[];spawnAt=180;hint="";
      ov.classList.add("hide");scEl.textContent="0";rsEl.textContent="0";
      last=0;if(!raf)loop(performance.now());
    }
    function jump(){
      if(!running)return;
      if(p.jumps<MAXJ){
        p.vy=JUMPV;p.jumps++;p.buf=0;
        blip(p.jumps===1?330:450,.07,"square",.035);
      }else{p.buf=7;}
    }
    function dash(){
      if(!running||p.cd>0)return;
      p.dash=DASHN;p.cd=DASHCD;p.inv=DASHN+2;
      blip(150,.13,"sawtooth",.045);
    }
    function over_(msg){
      running=false;over=true;
      blip(90,.45,"sawtooth",.08);
      var a=push(LS1,score);board(document.getElementById("bd1"),LS1);
      best(a.length?Math.max(a[0].s,0):0);
      ov.querySelector("h3").textContent="Corridor closed \u00b7 "+Math.floor(score);
      ov.querySelector("p").textContent=msg||("Rescued "+rescued+" of the wild before the habitat closed.");
      ovBtn.textContent="Run again";
      ov.classList.remove("hide");
    }
    function spawn(){
      if(dist<spawnAt)return;
      // a full jump arc covers ~29 frames; keep gaps clearable at current speed
      var air=Math.round((2*Math.abs(JUMPV)/GRAV)*speed);
      spawnAt=dist+air+90+rnd(150);
      if(Math.random()<0.52){
        gates.push({x:W+30,w:22,h:26+rnd(30)});
      }else{
        var r=Math.random();
        var y=r<0.52?GROUND-46:(r<0.86?GROUND-72:GROUND-104);
        orbs.push({x:W+30,y:y,r:10,t:Math.random()*6});
      }
    }
    function loop(t){
      raf=requestAnimationFrame(loop);
      if(!last){last=t;}
      var dt=(t-last)/16.6667;last=t;
      if(dt>3){dt=3;} if(dt<=0){dt=1;}
      if(running&&!paused){update(dt);}else{idle(dt);}
      draw();
    }
    function idle(dt){
      for(var i=0;i<bg.length;i++){bg[i].x-=bg[i].s*0.35*dt;if(bg[i].x<-4){bg[i].x=W+4;}}
    }
    function update(dt){
      var i,g,o;
      for(i=0;i<bg.length;i++){bg[i].x-=bg[i].s*1.1*dt;if(bg[i].x<-4){bg[i].x=W+4;}}
      dist+=speed*dt;
      score+=speed*0.09*dt;
      speed=3.4+Math.min(2.6,dist/1500);
      if(p.cd>0){p.cd-=dt;}
      if(p.dash>0){p.dash-=dt;}
      if(p.inv>0){p.inv-=dt;}
      p.vy+=GRAV*dt;
      if(p.dash>0){p.vy=0;}
      p.y+=p.vy*dt;
      if(p.y>GROUND-p.h){
        p.y=GROUND-p.h;
        if(p.vy>1){for(var q=0;q<3;q++){parts.push({x:p.x+6,y:GROUND,vx:(Math.random()-.5)*1.6,vy:-Math.random()*1.4,l:16});}}
        p.vy=0;p.jumps=0;
        if(p.buf>0){p.buf=0;jump();}
      }else if(p.buf>0){p.buf-=dt;}
      spawn();
      var scroll=speed+(p.dash>0?9:0);
      for(i=gates.length-1;i>=0;i--){
        g=gates[i];g.x-=scroll*dt;
        if(g.x<-60){gates.splice(i,1);continue;}
        if(p.inv<=0&&p.x+p.w>g.x+5&&p.x<g.x+g.w-5&&p.y+p.h>GROUND-g.h+2&&p.y<GROUND){
          if(p.dash>0){
            gates.splice(i,1);score+=40;blip(240,.11,"square",.05);
            for(var w=0;w<10;w++){parts.push({x:g.x,y:GROUND-g.h/2,vx:(Math.random()-.5)*4,vy:(Math.random()-.5)*4,l:22});}
          }else{
            over_("Hit a closure gate at "+Math.floor(dist)+"m. Dash breaks them, jumping clears them.");return;
          }
        }
      }
      for(i=orbs.length-1;i>=0;i--){
        o=orbs[i];o.x-=scroll*dt;o.t+=0.09*dt;
        if(o.x<-30){orbs.splice(i,1);continue;}
        var dx=(p.x+p.w/2)-o.x,dy=(p.y+p.h/2)-o.y;
        if(dx*dx+dy*dy<30*30){
          orbs.splice(i,1);score+=25;rescued++;
          rsEl.textContent=rescued;blip(680,.1,"triangle",.05);
          for(var k=0;k<8;k++){parts.push({x:o.x,y:o.y,vx:(Math.random()-.5)*3,vy:(Math.random()-.5)*3,l:20});}
        }
      }
      for(i=parts.length-1;i>=0;i--){
        var pt=parts[i];pt.x+=pt.vx*dt;pt.y+=pt.vy*dt;pt.l-=dt;
        if(pt.l<=0){parts.splice(i,1);}
      }
      scEl.textContent=Math.floor(score);
    }
    function draw(){
      ctx.clearRect(0,0,W,H);
      var g=ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,"#06070b");g.addColorStop(.55,"#0a0f12");g.addColorStop(1,"#0b1410");
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(74,222,128,.10)";ctx.lineWidth=1;
      for(var i=0;i<bg.length;i++){
        var b=bg[i];
        ctx.beginPath();ctx.moveTo(b.x,GROUND);ctx.lineTo(b.x+(b.s>1?5:-5),b.y);ctx.stroke();
      }
      ctx.fillStyle="#0d1512";ctx.fillRect(0,GROUND,W,H-GROUND);
      ctx.strokeStyle="rgba(239,236,228,.22)";
      ctx.beginPath();ctx.moveTo(0,GROUND+.5);ctx.lineTo(W,GROUND+.5);ctx.stroke();
      ctx.strokeStyle="rgba(139,30,36,.35)";
      ctx.beginPath();
      for(var x=0;x<W;x+=90){ctx.moveTo(x,GROUND+6);ctx.lineTo(x+40,GROUND+6);}
      ctx.stroke();
      for(var j=0;j<gates.length;j++){
        var gt=gates[j];
        ctx.fillStyle="#1a0d10";ctx.fillRect(gt.x,GROUND-gt.h,gt.w,gt.h);
        ctx.strokeStyle="#8B1E24";ctx.lineWidth=1.5;
        ctx.strokeRect(gt.x+.5,GROUND-gt.h+.5,gt.w-1,gt.h-1);
        ctx.beginPath();
        for(var yy=GROUND-gt.h+8;yy<GROUND;yy+=14){ctx.moveTo(gt.x+4,yy);ctx.lineTo(gt.x+gt.w-4,yy+6);}
        ctx.stroke();
      }
      for(var m=0;m<orbs.length;m++){
        var o=orbs[m],pulse=1+Math.sin(o.t)*0.14;
        ctx.beginPath();ctx.arc(o.x,o.y,o.r*pulse,0,6.2832);
        ctx.fillStyle="rgba(74,222,128,.18)";ctx.fill();
        ctx.strokeStyle="#4ADE80";ctx.lineWidth=1.5;ctx.stroke();
        ctx.beginPath();ctx.arc(o.x,o.y,3.4,0,6.2832);ctx.fillStyle="#EFECE4";ctx.fill();
      }
      for(var pi=0;pi<parts.length;pi++){
        var pa=parts[pi];
        ctx.globalAlpha=Math.max(0,pa.l/20);
        ctx.fillStyle="#4ADE80";ctx.fillRect(pa.x,pa.y,2,2);ctx.globalAlpha=1;
      }
      if(!(p.inv>0&&Math.floor(p.inv/2)%2===0)){
        ctx.save();ctx.translate(p.x,p.y);
        if(p.dash>0){ctx.strokeStyle="rgba(74,222,128,.5)";ctx.beginPath();ctx.moveTo(-26,10);ctx.lineTo(-4,10);ctx.stroke();}
        ctx.fillStyle=p.dash>0?"#4ADE80":"#EFECE4";
        ctx.beginPath();
        ctx.moveTo(2,26);ctx.lineTo(4,14);ctx.lineTo(12,10);ctx.lineTo(22,12);
        ctx.lineTo(26,18);ctx.lineTo(22,26);ctx.lineTo(16,26);ctx.lineTo(14,18);
        ctx.lineTo(10,26);ctx.closePath();ctx.fill();
        ctx.beginPath();ctx.moveTo(22,12);ctx.lineTo(30,6);ctx.lineTo(28,13);ctx.closePath();ctx.fill();
        ctx.fillStyle="#8B1E24";ctx.fillRect(24,13,3,2);
        ctx.restore();
      }
      ctx.fillStyle="rgba(239,236,228,.5)";
      ctx.font="10px 'Space Mono',monospace";
      ctx.fillText("DIST "+Math.floor(dist)+"   SPD "+speed.toFixed(1),14,20);
      ctx.fillStyle=p.cd>0?"rgba(139,30,36,.8)":"rgba(74,222,128,.85)";
      ctx.fillText(p.cd>0?"DASH CHARGING":"DASH READY",14,34);
      if(paused&&running){
        ctx.fillStyle="rgba(6,7,11,.72)";ctx.fillRect(0,0,W,H);
        ctx.fillStyle="#EFECE4";ctx.font="13px 'Space Mono',monospace";
        ctx.fillText("PAUSED \u00b7 back to the window to resume",W/2-150,H/2);
      }
      if(!running&&!over){
        ctx.fillStyle="rgba(239,236,228,.35)";ctx.font="10px 'Space Mono',monospace";
        ctx.fillText("STANDBY",14,H-14);
      }
    }
    startBtn.addEventListener("click",reset);
    document.addEventListener("keydown",function(e){
      var t=e.target.tagName;
      if(t==="INPUT"||t==="TEXTAREA")return;
      var inView=document.getElementById("s1").getBoundingClientRect().top<window.innerHeight*0.9;
      if(e.code==="Space"||e.code==="ArrowUp"||e.code==="KeyW"){
        if(inView){e.preventDefault();jump();}
      }
      if(e.code==="ShiftLeft"||e.code==="ShiftRight"||e.code==="KeyX"){
        if(inView){e.preventDefault();dash();}
      }
      if(e.code==="Enter"&&over){reset();}
    });
    cv.addEventListener("pointerdown",function(e){
      if(!running)return;
      e.preventDefault();
      var r=cv.getBoundingClientRect();
      if((e.clientX-r.left)/r.width>0.72){dash();}else{jump();}
    });
    document.getElementById("jumpBtn1").addEventListener("click",jump);
    document.getElementById("dashBtn1").addEventListener("click",dash);
    document.addEventListener("visibilitychange",function(){
      paused=!!document.hidden;
      if(!paused){last=0;}
    });
    best(load(LS1).length?load(LS1)[0].s:0);
    board(document.getElementById("bd1"),LS1);
    draw();
  })();

  // ═════════════════════════════════════════════════════════════════════════
  // GAME 02 — ELDRITCH CHIROPRACTOR
  // ═════════════════════════════════════════════════════════════════════════
  (function(){
    var cv=document.getElementById("c2");if(!cv)return;
    var ctx=cv.getContext("2d");
    var W=900,H=380,SEG=34,TOP=62,SNAP=30,MAGNET=64;
    var ov=document.getElementById("ov2"),startBtn=document.getElementById("start2"),ovBtn=ov.querySelector("button");
    var scEl=document.getElementById("sc2"),bsEl=document.getElementById("bs2"),
        cbEl=document.getElementById("cb2"),tmEl=document.getElementById("tm2");
    var nodes=[],targets=[],drag=null,score=0,combo=1,chain=0,timeLeft=60;
    var running=false,over=false,paused=false,raf=0,last=0,flash=0,msg="",msgTone="good",sel=0;
    function rnd(n){return Math.floor(Math.random()*n);}
    function nextPending(){
      for(var i=0;i<targets.length;i++){if(!targets[i].done){return i;}}
      return -1;
    }
    function reset(){
      nodes=[];targets=[];drag=null;score=0;combo=1;chain=0;timeLeft=60;sel=0;
      running=true;over=false;paused=false;flash=0;msg="";msgTone="good";
      var cx=W/2;
      for(var i=0;i<9;i++){
        var side=(i%2?1:-1);
        var x=cx+side*(52+rnd(40))+Math.sin(i*1.1)*10,y=TOP+i*SEG;
        nodes.push({x:x,y:y,px:x,py:y,lock:i===0,pin:null});
      }
      for(var j=1;j<9;j++){targets.push({x:cx+Math.sin(j*0.62)*34,y:TOP+j*SEG,done:false});}
      ov.classList.add("hide");
      scEl.textContent="0";cbEl.textContent="x1";tmEl.textContent="60";
      last=0;if(!raf)loop(performance.now());
    }
    function end(reason){
      running=false;over=true;drag=null;
      var a=push(LS2,score);board(document.getElementById("bd2"),LS2);
      bsEl.textContent=a.length?a[0].s:0;
      blip(reason==="clear"?520:80,.5,reason==="clear"?"triangle":"sine",.07);
      ov.querySelector("h3").textContent=(reason==="clear"?"Spine aligned \u00b7 ":"Clock died \u00b7 ")+Math.floor(score);
      ov.querySelector("p").textContent=reason==="clear"
        ? "Every vertebra seated. The spine remembers. So does the leaderboard."
        : "You ran out of time with "+score+" points on the board. The lit marker is always the one to chase.";
      ovBtn.textContent="Again";
      ov.classList.remove("hide");
    }
    function step(dt){
      var i,n,dx,dy,dist2,f;
      for(i=1;i<nodes.length;i++){
        n=nodes[i];
        if(n.pin){
          n.x+=(n.pin.x-n.x)*0.32*dt;n.y+=(n.pin.y-n.y)*0.32*dt;
          n.px=n.x;n.py=n.y;continue;
        }
        if(n.held){n.px=n.x;n.py=n.y;continue;}
        var vx=(n.x-n.px)*0.9,vy=(n.y-n.py)*0.9;
        n.px=n.x;n.py=n.y;
        n.x+=vx*dt;n.y+=(vy+0.24*dt)*dt;
        if(n.y>H-16){n.y=H-16;}
        if(n.x<14){n.x=14;} if(n.x>W-14){n.x=W-14;}
      }
      for(var it=0;it<7;it++){
        for(i=1;i<nodes.length;i++){
          var p1=nodes[i-1],p2=nodes[i];
          dx=p2.x-p1.x;dy=p2.y-p1.y;dist2=Math.sqrt(dx*dx+dy*dy)||0.001;
          f=(dist2-SEG)/dist2*0.5;
          if(!p1.lock&&!p1.pin){p1.x+=dx*f;p1.y+=dy*f;}
          if(!p2.pin){p2.x-=dx*f;p2.y-=dy*f;}
        }
      }
      nodes[0].x=W/2;nodes[0].y=TOP;
    }
    function trySnap(i,magnet){
      if(!running||i<1)return false;
      var k=nextPending();
      if(k<0)return false;
      var t=targets[k],n=nodes[i];
      var dx=n.x-t.x,dy=n.y-t.y;
      var lim=magnet?MAGNET:SNAP;
      if(dx*dx+dy*dy>lim*lim){
        if(flash<=0&&dx*dx+dy*dy<90*90){
          msg="MARKER "+((k+1)<10?"0":"")+(k+1)+" IS THE LIT ONE";msgTone="bad";flash=24;
        }
        return false;
      }
      t.done=true;
      n.pin={x:t.x,y:t.y};
      var gain=100*combo;
      score+=gain;chain++;
      combo=Math.min(8,1+Math.floor(chain/2));
      cbEl.textContent="x"+combo;
      scEl.textContent=Math.floor(score);
      flash=16;msg="+"+gain+" CRUNCH \u00b7 JOINT "+((k+1)<10?"0":"")+(k+1);msgTone="good";
      crunch();blip(300+chain*40,.08,"triangle",.045);
      if(nextPending()<0){score+=250;end("clear");return true;}
      return true;
    }
    function loop(t){
      raf=requestAnimationFrame(loop);
      if(!last){last=t;}
      var dt=(t-last)/16.6667;last=t;
      if(dt>3){dt=3;} if(dt<=0){dt=1;}
      if(running&&!paused){
        step(dt);
        if(flash>0){flash-=dt;}
        timeLeft-=dt/60;
        tmEl.textContent=String(Math.max(0,Math.ceil(timeLeft)));
        if(timeLeft<=0){end("time");}
      }
      draw();
    }
    function draw(){
      ctx.clearRect(0,0,W,H);
      var g=ctx.createRadialGradient(W/2,H/2,20,W/2,H/2,W/2);
      g.addColorStop(0,"#0a1112");g.addColorStop(1,"#05060a");
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      if(flash>0&&msgTone==="bad"){ctx.fillStyle="rgba(139,30,36,"+(flash/60)+")";ctx.fillRect(0,0,W,H);}
      var k=nextPending();
      for(var i=0;i<targets.length;i++){
        var t=targets[i],lit=(i===k&&running);
        ctx.beginPath();ctx.arc(t.x,t.y,lit?22:17,0,6.2832);
        if(t.done){
          ctx.strokeStyle="rgba(74,222,128,.3)";ctx.lineWidth=1;
        }else if(lit){
          ctx.strokeStyle="rgba(74,222,128,.95)";ctx.lineWidth=2.4;
        }else{
          ctx.strokeStyle="rgba(239,236,228,.16)";ctx.lineWidth=1;
        }
        ctx.stroke();
        if(t.done){
          ctx.fillStyle="rgba(74,222,128,.45)";ctx.font="9px 'Space Mono',monospace";
          ctx.fillText("OK",t.x-6,t.y+3);
        }else if(lit){
          ctx.beginPath();ctx.arc(t.x,t.y,4+Math.sin(Date.now()/260)*1.6,0,6.2832);
          ctx.fillStyle="rgba(74,222,128,.9)";ctx.fill();
          ctx.fillStyle="rgba(74,222,128,.85)";ctx.font="9px 'Space Mono',monospace";
          ctx.fillText(((i+1)<10?"0":"")+(i+1),t.x-6,t.y-26);
        }
      }
      if(drag!==null&&k>=0){
        var tg=targets[k];
        ctx.save();ctx.setLineDash([4,6]);
        ctx.strokeStyle="rgba(74,222,128,.55)";ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(nodes[drag].x,nodes[drag].y);ctx.lineTo(tg.x,tg.y);ctx.stroke();
        ctx.restore();
      }
      ctx.strokeStyle="rgba(74,222,128,.26)";ctx.lineWidth=7;ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(nodes[0].x,nodes[0].y);
      for(var a=1;a<nodes.length;a++){ctx.lineTo(nodes[a].x,nodes[a].y);}
      ctx.stroke();
      ctx.strokeStyle="#EFECE4";ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(nodes[0].x,nodes[0].y);
      for(var b=1;b<nodes.length;b++){ctx.lineTo(nodes[b].x,nodes[b].y);}
      ctx.stroke();
      for(var m=0;m<nodes.length;m++){
        var n=nodes[m];
        ctx.beginPath();ctx.arc(n.x,n.y,m===0?7:5.5,0,6.2832);
        ctx.fillStyle=m===0?"#8B1E24":((drag===m||sel===m)?"#4ADE80":(n.pin?"rgba(74,222,128,.75)":"#EFECE4"));
        ctx.fill();
      }
      ctx.fillStyle="#EFECE4";
      ctx.beginPath();ctx.arc(nodes[0].x,nodes[0].y-13,9,0,6.2832);ctx.fill();
      ctx.fillStyle="#070709";
      ctx.beginPath();ctx.arc(nodes[0].x-3.4,nodes[0].y-15,2.2,0,6.2832);ctx.fill();
      ctx.beginPath();ctx.arc(nodes[0].x+3.4,nodes[0].y-15,2.2,0,6.2832);ctx.fill();
      if(msg&&flash>0){
        ctx.globalAlpha=Math.min(1,flash/10);
        ctx.fillStyle=msgTone==="bad"?"#8B1E24":"#4ADE80";
        ctx.font="12px 'Space Mono',monospace";ctx.fillText(msg,20,26);
        ctx.globalAlpha=1;
      }
      if(paused&&running){
        ctx.fillStyle="rgba(5,6,10,.72)";ctx.fillRect(0,0,W,H);
        ctx.fillStyle="#EFECE4";ctx.font="13px 'Space Mono',monospace";
        ctx.fillText("PAUSED \u00b7 back to the window to resume",W/2-150,H/2);
      }
      if(!running&&!over){
        ctx.fillStyle="rgba(239,236,228,.3)";ctx.font="10px 'Space Mono',monospace";
        ctx.fillText("AWAITING PATIENT",20,26);
      }
    }
    function nearest(x,y){
      var best=-1,bd=Infinity;
      for(var i=1;i<nodes.length;i++){
        var n=nodes[i],dx=n.x-x,dy=n.y-y,d=dx*dx+dy*dy;
        if(d<bd){bd=d;best=i;}
      }
      return best;
    }
    function pos(e){
      var r=cv.getBoundingClientRect();
      return {x:(e.clientX-r.left)*(W/r.width),y:(e.clientY-r.top)*(H/r.height)};
    }
    cv.addEventListener("pointerdown",function(e){
      if(!running)return;
      e.preventDefault();
      var p=pos(e),i=nearest(p.x,p.y);
      if(i>0){
        if(nodes[i].pin){return;}
        drag=i;
        try{cv.setPointerCapture(e.pointerId);}catch(err){}
        blip(210,.05,"square",.03);
      }
    });
    cv.addEventListener("pointermove",function(e){
      if(drag===null||!running)return;
      e.preventDefault();
      var p=pos(e),n=nodes[drag];
      n.px=n.x;n.py=n.y;n.x=p.x;n.y=p.y;
      if(trySnap(drag)){drag=null;}
    });
    function release(){
      if(drag!==null&&running){
        if(!trySnap(drag,true)){
          msg="DROP IT ON THE LIT MARKER";msgTone="bad";flash=18;
        }
      }
      drag=null;
    }
    cv.addEventListener("pointerup",release);
    cv.addEventListener("pointercancel",release);
    cv.addEventListener("pointerleave",function(e){if(e.buttons===0){release();}});
    startBtn.addEventListener("click",reset);
    function freeNodes(){var a=[];for(var i=1;i<nodes.length;i++){if(!nodes[i].pin){a.push(i);}}return a;}
    function hold(i){
      for(var j=1;j<nodes.length;j++){nodes[j].held=false;}
      sel=i;if(i>0&&nodes[i]){nodes[i].held=true;}
    }
    document.addEventListener("keydown",function(e){
      var t=e.target.tagName;
      if(t==="INPUT"||t==="TEXTAREA")return;
      if(e.code==="Enter"&&over){reset();return;}
      if(!running)return;
      var sec=document.getElementById("s2").getBoundingClientRect();
      if(sec.top>window.innerHeight*0.9)return;
      var m=/^Digit([1-8])$/.exec(e.code);
      if(m){
        var want=parseInt(m[1],10);
        if(nodes[want]&&!nodes[want].pin){e.preventDefault();hold(want);blip(240,.05,"square",.03);}
        return;
      }
      var step=16;
      if(e.code==="ArrowLeft"||e.code==="ArrowRight"||e.code==="ArrowUp"||e.code==="ArrowDown"){
        if(!sel||!nodes[sel]||nodes[sel].pin){
          var free=freeNodes();
          if(!free.length)return;
          sel=free[0];hold(sel);
        }
        e.preventDefault();
        var n=nodes[sel];
        if(n.pin)return;
        if(!n.held){hold(sel);}
        if(e.code==="ArrowLeft"){n.x-=step;}
        if(e.code==="ArrowRight"){n.x+=step;}
        if(e.code==="ArrowUp"){n.y-=step;}
        if(e.code==="ArrowDown"){n.y+=step;}
        n.x=Math.max(14,Math.min(W-14,n.x));n.y=Math.max(14,Math.min(H-16,n.y));
        trySnap(sel);
        return;
      }
      if(e.code==="Space"){
        if(!sel||!nodes[sel]||nodes[sel].pin){
          var f2=freeNodes();if(f2.length){sel=f2[0];hold(sel);}
        }
        if(sel&&nodes[sel]&&!nodes[sel].pin){
          e.preventDefault();
          var ok=trySnap(sel);
          if(!ok){msg="TOO FAR FROM THE LIT MARKER";msgTone="bad";flash=18;}
          nodes[sel].held=false;
        }
      }
    });
    document.addEventListener("visibilitychange",function(){
      paused=!!document.hidden;
      if(!paused){last=0;}
    });
    bsEl.textContent=load(LS2).length?load(LS2)[0].s:0;
    board(document.getElementById("bd2"),LS2);
    draw();
  })();
})();
</script>
</body></html>
`;
