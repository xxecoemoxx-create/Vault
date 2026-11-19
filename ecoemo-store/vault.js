// ─────────────────────────────────────────────────────────────────────────────
// /vault — ENDLING VAULT. Occult tape deck: Web Audio visualizer, docked player,
// scrub/volume/queue, and three curated channels (Roots / Trunk / Canopy), each
// paired with its conservation reading and the matching tier drop.
// ─────────────────────────────────────────────────────────────────────────────

const CHANNELS = [
  {
    key: "roots",
    n: "01",
    name: "ROOTS",
    sub: "DEGRADATION",
    line: "Subterranean weight. Low tuning, soil and bedrock. What rots is not wasted, it is the next layer feeding the canopy.",
    story: "Mycelium moves carbon between trees, breaks down what falls, and holds the forest floor together. When the soil dies first, everything above it is already terminal.",
    cta: ["Wear the root tier", "/shop?tier=roots"]
  },
  {
    key: "trunk",
    n: "02",
    name: "TRUNK",
    sub: "EXTINCTION",
    line: "Core structural urgency. The frontline where a number stops being a population and becomes a last known range.",
    story: "Fewer than 20 red wolves run wild. Ten vaquitas remain. The trunk is where the whole structure either holds or comes down.",
    cta: ["Wear the trunk tier", "/shop?tier=trunk"]
  },
  {
    key: "canopy",
    n: "03",
    name: "CANOPY",
    sub: "RECLAMATION",
    line: "Soaring melodic hooks and progressive regrowth. Roots that climb instead of dragging down. Proof the ending is not written.",
    story: "Wolves returned to Yellowstone and the rivers changed shape. Condors came back from 22 birds. Reclamation is not a metaphor; it is documented.",
    cta: ["Wear the canopy tier", "/shop?tier=canopy"]
  }
];

export function vaultPage(tracks, err) {
  const list = Array.isArray(tracks) ? tracks : [];
  const third = Math.max(1, Math.ceil(list.length / 3));
  const groups = [0, 1, 2].map((i) => list.slice(i * third, (i + 1) * third));

  const channels = CHANNELS.map((c, i) => {
    const rows = groups[i].map((t, j) => {
      const idx = i * third + j + 1;
      return '<button class="row" data-url="' + esc(t.url) + '" data-title="' + esc(t.title) + '"' +
        ' data-artist="' + esc(t.artist) + '">' +
        '<span class="r-i">' + String(idx).padStart(2, "0") + '</span>' +
        '<span class="r-t">' + esc(t.title) + '</span>' +
        '<span class="r-a">' + esc(t.artist || "unknown") + '</span>' +
        '<span class="r-d">' + esc(t.duration || "") + '</span>' +
        '<span class="r-p">&#9654;</span></button>';
    }).join("");
    return '<section class="channel" id="ch-' + c.key + '">' +
      '<div class="ch-head"><span class="ch-n">' + c.n + '</span>' +
      '<div><h2>' + c.name + ' // ' + c.sub + '</h2><p class="ch-line">' + c.line + '</p></div></div>' +
      '<p class="ch-story">' + c.story + '</p>' +
      '<div class="rows">' + (rows || '<p class="empty">No tracks on this channel yet.</p>') + '</div>' +
      '<a class="ch-cta" href="' + c.cta[1] + '">' + c.cta[0] + ' &rarr;</a></section>';
  }).join("");

  return '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Endling Vault &middot; The Subterranean Audio Deck | Eco Emo</title>' +
    '<meta name="description" content="Endling Vault: post-hardcore, metalcore and screamo for vanishing habitat. Three channels, live frequency visualizer, no paywall.">' +
    '<link rel="preconnect" href="https://fonts.googleapis.com">' +
    '<link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=UnifrakturMaguntia&family=Space+Mono:wght@400;700&family=Plus+Jakarta+Sans:wght@300;400;600&display=swap" rel="stylesheet">' +
    '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\'%3E%3Crect width=\'32\' height=\'32\' fill=\'%23070709\'/%3E%3Ctext x=\'16\' y=\'23\' font-size=\'17\' text-anchor=\'middle\' fill=\'%234ADE80\' font-family=\'serif\'%3E%C6%8EE%3C/text%3E%3C/svg%3E">' +
    '<style>' +
    '*{box-sizing:border-box;margin:0;padding:0}' +
    'body{background:#070709;color:#EFECE4;font-family:"Plus Jakarta Sans",system-ui,sans-serif;line-height:1.7;' +
    'overflow-x:clip;padding-bottom:120px}' +
    '.wrap{max-width:1000px;margin:0 auto;padding:28px 18px 40px}' +
    '.eyebrow{font-family:"Space Mono",monospace;font-size:9px;letter-spacing:.34em;text-transform:uppercase;color:#4ADE80}' +
    'h1{font-family:"Cinzel Decorative",serif;font-size:clamp(26px,5.4vw,50px);text-transform:uppercase;letter-spacing:.03em;' +
    'line-height:1;margin:12px 0 8px;text-shadow:0 1px 0 #000,3px 3px 0 rgba(139,30,36,.45)}' +
    '.lede{color:#a8a49a;font-size:15.5px;max-width:68ch}' +
    '.deck{margin-top:26px;border:1px solid rgba(239,236,228,.14);background:linear-gradient(180deg,#111215,#070709);' +
    'padding:14px;position:relative}' +
    '.deck:before{content:"// FREQUENCY MONITOR";position:absolute;top:-8px;left:12px;background:#070709;padding:0 6px;' +
    'font-family:"Space Mono",monospace;font-size:8px;letter-spacing:.24em;color:#8B1E24}' +
    'canvas#viz{display:block;width:100%;height:110px}' +
    '.readout{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;font-family:"Space Mono",monospace;font-size:9px;' +
    'letter-spacing:.16em;text-transform:uppercase;color:#6d6a62}' +
    '.readout b{color:#4ADE80}' +
    '.channel{margin-top:38px;border-top:1px solid rgba(239,236,228,.14);padding-top:20px}' +
    '.ch-head{display:flex;gap:14px;align-items:flex-start}' +
    '.ch-n{font-family:"Space Mono",monospace;font-size:11px;color:#8B1E24;padding-top:6px}' +
    '.ch-head h2{font-family:"Cinzel Decorative",serif;font-size:clamp(15px,2.6vw,21px);text-transform:uppercase;' +
    'letter-spacing:.05em}' +
    '.ch-line{font-size:13.5px;color:#a8a49a;margin-top:4px;max-width:70ch}' +
    '.ch-story{margin-top:10px;padding:12px 14px;border-left:2px solid rgba(139,30,36,.6);' +
    'font-size:13.5px;color:#c2bdb2;background:rgba(17,18,21,.6)}' +
    '.rows{margin-top:12px;display:grid;gap:2px}' +
    '.row{display:grid;grid-template-columns:34px 1fr 150px 52px 22px;gap:10px;align-items:center;width:100%;' +
    'background:transparent;border:1px solid transparent;border-bottom:1px solid rgba(239,236,228,.07);' +
    'padding:9px 6px;color:inherit;text-align:left;cursor:pointer;font:inherit}' +
    '.row:hover{background:rgba(30,77,54,.22);border-color:rgba(74,222,128,.24)}' +
    '.row.on{background:rgba(30,77,54,.34);border-color:rgba(74,222,128,.42)}' +
    '.r-i{font-family:"Space Mono",monospace;font-size:9px;color:#6d6a62}' +
    '.r-t{font-size:14px;color:#EFECE4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.r-a,.r-d{font-family:"Space Mono",monospace;font-size:9px;letter-spacing:.1em;color:#a8a49a;' +
    'overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.r-p{color:#4ADE80;font-size:10px;text-align:right}' +
    '.ch-cta{display:inline-block;margin-top:12px;font-family:"Space Mono",monospace;font-size:9px;letter-spacing:.2em;' +
    'text-transform:uppercase;color:#EFECE4;text-decoration:none;border:1px solid rgba(74,222,128,.4);padding:8px 12px}' +
    '.ch-cta:hover{background:#4ADE80;color:#070709}' +
    '.dock{position:fixed;left:0;right:0;bottom:0;z-index:300;background:rgba(7,7,9,.97);' +
    'border-top:1px solid rgba(74,222,128,.28);backdrop-filter:blur(12px);padding:10px 14px}' +
    '.dock-in{max-width:1000px;margin:0 auto;display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center}' +
    '.now{min-width:0}' +
    '.now .t{font-size:13.5px;color:#EFECE4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.now .a{font-family:"Space Mono",monospace;font-size:8.5px;letter-spacing:.18em;text-transform:uppercase;color:#6d6a62}' +
    '.ctr{display:flex;align-items:center;gap:6px}' +
    'button.p{background:#1E4D36;border:1px solid rgba(74,222,128,.5);color:#EFECE4;width:38px;height:38px;' +
    'border-radius:50%;cursor:pointer;font-size:12px;display:grid;place-items:center;flex-shrink:0}' +
    'button.p:hover{background:#4ADE80;color:#070709}' +
    'button.s{background:transparent;border:1px solid rgba(239,236,228,.18);color:#a8a49a;width:30px;height:30px;' +
    'cursor:pointer;font-size:10px;display:grid;place-items:center;flex-shrink:0}' +
    'button.s:hover{color:#4ADE80;border-color:rgba(74,222,128,.45)}' +
    '.bar{flex:1 1 auto;display:flex;align-items:center;gap:8px;min-width:0}' +
    '.track{position:relative;flex:1 1 auto;height:4px;background:rgba(239,236,228,.16);cursor:pointer;min-width:40px}' +
    '.fill{position:absolute;left:0;top:0;bottom:0;width:0;background:#4ADE80}' +
    '.tm{font-family:"Space Mono",monospace;font-size:8.5px;letter-spacing:.12em;color:#a8a49a;white-space:nowrap}' +
    '.vol{display:flex;align-items:center;gap:6px}' +
    'input[type=range]{width:74px;accent-color:#4ADE80}' +
    '.empty{color:#a8a49a;font-size:13px;padding:10px 0}' +
    '@media(max-width:720px){' +
    '.row{grid-template-columns:28px 1fr 44px 20px;gap:8px}.r-a{display:none}' +
    '.dock-in{grid-template-columns:1fr auto;gap:8px}.now{grid-column:1/2}.ctr{grid-column:1/-1;grid-row:2}' +
    '.vol{display:none}}' +
    '</style></head><body>' +
    '<div class="wrap"><div class="eyebrow">Subterranean audio deck &middot; &#477;E</div>' +
    '<h1>Endling Vault</h1>' +
    '<p class="lede">Post-hardcore, metalcore, nu-metal and screamo for vanishing habitat: acoustic tension, soaring hooks, ' +
    'crushing breakdowns. Three channels, no paywall, no login. Play it loud enough that something hears it.</p>' +
    (err ? '<p class="lede" style="color:#8B1E24">Tracklist served from cache: ' + esc(err) + '</p>' : "") +
    '<div class="deck"><canvas id="viz" width="900" height="110"></canvas>' +
    '<div class="readout"><span>Tracks <b>' + list.length + '</b></span>' +
    '<span>Channels <b>3</b></span><span>Engine <b id="eng">idle</b></span>' +
    '<span>State <b id="stt">stopped</b></span></div></div>' +
    channels +
    '<div style="margin-top:44px;border-top:1px solid rgba(239,236,228,.14);padding-top:16px;' +
    'font-family:\'Space Mono\',monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#6d6a62;' +
    'display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px">' +
    '<span>&#477;E &middot; Endling &middot; grieve the earth. save it anyway.</span>' +
    '<span><a href="/shop" style="color:#a8a49a;text-decoration:none">Shop</a> &middot; ' +
    '<a href="/conservation" style="color:#a8a49a;text-decoration:none">Conservation</a> &middot; ' +
    '<a href="/arcade" style="color:#a8a49a;text-decoration:none">Arcade</a></span></div>' +
    '</div>' +
    '<div class="dock"><div class="dock-in">' +
    '<div class="now"><div class="t" id="npT">Nothing loaded</div><div class="a" id="npA">select a channel</div></div>' +
    '<div class="ctr"><button class="p" id="prev" aria-label="Previous">&#9664;&#9664;</button>' +
    '<button class="p" id="play" aria-label="Play">&#9654;</button>' +
    '<button class="p" id="next" aria-label="Next">&#9654;&#9654;</button>' +
    '<div class="bar"><div class="track" id="seek"><div class="fill" id="fill"></div></div>' +
    '<span class="tm" id="tm">0:00 / 0:00</span></div></div>' +
    '<div class="vol"><span style="font-family:\'Space Mono\',monospace;font-size:8.5px;letter-spacing:.18em;color:#6d6a62">VOL</span>' +
    '<input id="vol" type="range" min="0" max="100" value="85" aria-label="Volume"></div>' +
    '</div></div>' +
    '<audio id="au" preload="none"></audio>' +
    '<script>(function(){' +
    'var au=document.getElementById("au"),play=document.getElementById("play"),prev=document.getElementById("prev"),' +
    'next=document.getElementById("next"),fill=document.getElementById("fill"),seek=document.getElementById("seek"),' +
    'tm=document.getElementById("tm"),vol=document.getElementById("vol"),npT=document.getElementById("npT"),' +
    'npA=document.getElementById("npA"),stt=document.getElementById("stt"),eng=document.getElementById("eng");' +
    'var queue=[],qi=-1,ctx=null,analyser=null,src=null,data=null,raf=0,corsRetried=false,vizSynth=false,curUrl=null;' +
    'function rows(){return [].slice.call(document.querySelectorAll(".row"));}' +
    'function fmt(s){if(!isFinite(s)||s<0)s=0;var m=Math.floor(s/60),x=Math.floor(s%60);' +
    'return m+":"+(x<10?"0":"")+x;}' +
    'function mark(i){rows().forEach(function(r,j){r.classList.toggle("on",j===i);});}' +
    'function buildQueue(){queue=rows().map(function(r){' +
    'return {url:r.dataset.url,title:r.dataset.title,artist:r.dataset.artist};});}' +
    'function load(i,autoplay){' +
    'if(!queue.length)buildQueue();if(i<0||i>=queue.length)return;qi=i;' +
    'var t=queue[i];curUrl=t.url;' +
    'if(!corsRetried)au.crossOrigin="anonymous";' +
    'au.src=t.url;npT.textContent=t.title;npA.textContent=(t.artist||"unknown")+"  //  "+String(i+1).padStart(2,"0")' +
    '+"/"+String(queue.length).padStart(2,"0");mark(i);' +
    'if(autoplay)playNow();}' +
    'function playNow(){' +
    'var pr=au.play();' +
    'if(pr&&pr.catch)pr.catch(function(){retryCors();});' +
    'ensureAudio();}' +
    'function retryCors(){' +
    'if(corsRetried)return;corsRetried=true;' +
    'try{au.removeAttribute("crossorigin");}catch(e){}au.src=curUrl;au.load();' +
    'var rr=au.play();if(rr&&rr.catch)rr.catch(function(){stt.textContent="tap play";});' +
    'vizSynth=true;eng.textContent="synth bars (cors blocked)";}' +
    'function ensureAudio(){' +
    'try{' +
    'if(!ctx){ctx=new (window.AudioContext||window.webkitAudioContext)();}' +
    'if(ctx.state==="suspended")ctx.resume();' +
    'if(!analyser){analyser=ctx.createAnalyser();analyser.fftSize=128;data=new Uint8Array(analyser.frequencyBinCount);}' +
    'if(!src){src=ctx.createMediaElementSource(au);src.connect(analyser);analyser.connect(ctx.destination);' +
    'eng.textContent="web audio";}' +
    '}catch(e){vizSynth=true;eng.textContent="synth bars (cors blocked)";}' +
    '}' +
    'au.addEventListener("playing",function(){stt.textContent="playing";play.innerHTML="&#10074;&#10074;";});' +
    'au.addEventListener("pause",function(){stt.textContent="paused";play.innerHTML="&#9654;";});' +
    'au.addEventListener("ended",function(){next.click();});' +
    'au.addEventListener("timeupdate",function(){' +
    'var d=au.duration||0;fill.style.width=(d?au.currentTime/d*100:0)+"%";' +
    'tm.textContent=fmt(au.currentTime)+" / "+fmt(d);});' +
    'play.addEventListener("click",function(){if(!au.src)load(0,true);' +
    'else if(au.paused)playNow();else au.pause();});' +
    'prev.addEventListener("click",function(){load(Math.max(0,qi-1),true);});' +
    'next.addEventListener("click",function(){load(qi+1>=queue.length?0:qi+1,true);});' +
    'seek.addEventListener("click",function(e){var r=seek.getBoundingClientRect();' +
    'var pct=(e.clientX-r.left)/r.width;if(isFinite(au.duration))au.currentTime=pct*au.duration;});' +
    'vol.addEventListener("input",function(){au.volume=vol.value/100;});' +
    'au.volume=0.85;' +
    'document.addEventListener("click",function(e){var r=e.target.closest(".row");if(!r)return;' +
    'buildQueue();var i=queue.findIndex(function(q){return q.url===r.dataset.url;});load(i,true);});' +
    // ── visualizer ─────────────────────────────────────────────────────────
    'var cv=document.getElementById("viz"),c2=cv.getContext("2d"),bars=48,t=0;' +
    'function draw(){' +
    'raf=requestAnimationFrame(draw);t+=0.05;' +
    'var W=cv.width,H=cv.height;c2.clearRect(0,0,W,H);' +
    'var vals=[];' +
    'if(analyser&&!vizSynth){analyser.getByteFrequencyData(data);' +
    'for(var i=0;i<bars;i++){vals.push(data[Math.floor(i*data.length/bars)]/255);}}' +
    'else{for(var j=0;j<bars;j++){vals.push(au.paused?0.03:(Math.abs(Math.sin(t*1.2+j*0.4))*0.55+0.05));}}' +
    'var bw=W/bars;' +
    'for(var k=0;k<bars;k++){' +
    'var v=vals[k],h=Math.max(2,v*H*0.9);' +
    'var x=k*bw+1;' +
    'var g=c2.createLinearGradient(0,H,0,H-h);' +
    'g.addColorStop(0,"rgba(30,77,54,.55)");g.addColorStop(.6,"rgba(74,222,128,.75)");g.addColorStop(1,"rgba(239,236,228,.9)");' +
    'c2.fillStyle=g;c2.fillRect(x,H-h,bw-2,h);}' +
    'c2.strokeStyle="rgba(139,30,36,.35)";c2.beginPath();c2.moveTo(0,H-1);c2.lineTo(W,H-1);c2.stroke();}' +
    'draw();buildQueue();' +
    '})();</script></body></html>';
}

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
