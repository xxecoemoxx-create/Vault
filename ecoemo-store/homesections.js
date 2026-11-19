// ─────────────────────────────────────────────────────────────────────────────
// HOME SECTIONS — the Ecosystem Anatomy explorer, curated drop strip and live
// impact telemetry. Worker-injected on "/" only, so the homepage gains the
// root → trunk → canopy selector without touching publicSite.ts.
// ─────────────────────────────────────────────────────────────────────────────

const TIERS = [
  {
    n: "01",
    key: "roots",
    name: "ROOTS",
    sub: "DEGRADATION",
    tag: "SUBTERRANEAN WEIGHT",
    body: "Low-tuned riffs, soil and bedrock defence. The tier for decay that keeps the forest alive: mycelium, bog, spore, rot. Doom tempo, no apology.",
    link: "/shop?tier=roots"
  },
  {
    n: "02",
    key: "trunk",
    name: "TRUNK",
    sub: "EXTINCTION",
    tag: "CORE STRUCTURAL URGENCY",
    body: "Frontline species preservation. Tally walls, reliquaries, the last known range. The tier where a number stops being a population.",
    link: "/shop?tier=trunk"
  },
  {
    n: "03",
    key: "canopy",
    name: "CANOPY",
    sub: "RECLAMATION",
    tag: "PROGRESSIVE REGROWTH",
    body: "Soaring melodic hooks and rewilding. Roots that climb instead of drag down. The tier that argues the ending is not written yet.",
    link: "/shop?tier=canopy"
  }
];

const DROPS = [
  ["FEATURED // HONEY BEE", "Pollinator defence is active", "/shop?featured=honey-bee"],
  ["LINE // SPECIES", "One design per vanishing species", "/shop?line=species"],
  ["LINE // ENDLING", "Band merch, breakdown-weight", "/shop?line=endling"],
  ["LINE // ECO", "Living goods for the practical grief", "/shop?line=eco"],
  ["LINE // ECOEMO", "Logo core, pins, stickers, staples", "/shop?line=ecoemo"]
];

function tierCard(t) {
  return '<a class="ee-tier" href="' + t.link + '" data-key="' + t.key + '">' +
    '<span class="ee-tier-n">' + t.n + '</span>' +
    '<span class="ee-tier-main"><span class="ee-tier-name">' + t.name + ' // ' + t.sub + '</span>' +
    '<span class="ee-tier-tag">' + t.tag + '</span>' +
    '<span class="ee-tier-body">' + t.body + '</span></span>' +
    '<span class="ee-tier-go">ENTER &rarr;</span></a>';
}

const dropStrip = DROPS.map((d) =>
  '<a class="ee-drop" href="' + d[2] + '"><span class="ee-drop-k">' + d[0] + '</span>' +
  '<span class="ee-drop-v">' + d[1] + '</span><span class="ee-drop-go">&rarr;</span></a>'
).join("");

export const HOME_CSS = '<style id="ee-home-sections">' +
  '.ee-anatomy{max-width:1100px;margin:56px auto 0;padding:0 20px;position:relative}' +
  '.ee-anatomy-head{display:flex;align-items:flex-end;gap:14px;flex-wrap:wrap;margin-bottom:6px}' +
  '.ee-anatomy-head .k{font-family:"Space Mono",monospace;font-size:9px;letter-spacing:.3em;text-transform:uppercase;color:#4ADE80}' +
  '.ee-anatomy-head h2{font-family:"Cinzel Decorative",serif;font-size:clamp(19px,3vw,30px);letter-spacing:.04em;' +
  'text-transform:uppercase;margin:0}' +
  '.ee-anatomy-head p{flex:1 1 100%;color:#a8a49a;font-size:14.5px;max-width:76ch;margin:4px 0 18px}' +
  '.ee-tree{position:relative;display:grid;gap:14px;padding-left:34px}' +
  '.ee-tree:before{content:"";position:absolute;left:13px;top:6px;bottom:26px;width:1px;' +
  'background:linear-gradient(180deg,rgba(74,222,128,.5),rgba(30,77,54,.55) 45%,rgba(139,30,36,.45))}' +
  '.ee-tree:after{content:"";position:absolute;left:7px;bottom:0;width:13px;height:13px;border-radius:50%;' +
  'background:radial-gradient(circle,rgba(74,222,128,.65),rgba(74,222,128,0) 70%)}' +
  '.ee-tier{position:relative;display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;' +
  'padding:16px 18px;border:1px solid rgba(239,236,228,.14);background:rgba(17,18,21,.66);' +
  'text-decoration:none;color:inherit;transition:transform .3s,border-color .3s,box-shadow .3s,background .3s}' +
  '.ee-tier:before{content:"";position:absolute;left:-21px;top:50%;width:21px;height:1px;background:rgba(74,222,128,.35)}' +
  '.ee-tier:hover{transform:translateX(4px);border-color:rgba(74,222,128,.4);' +
  'box-shadow:0 14px 38px rgba(0,0,0,.6),inset 0 0 40px rgba(30,77,54,.4)}' +
  '.ee-tier:hover:before{background:#4ADE80}' +
  '.ee-tier-n{font-family:"Space Mono",monospace;font-size:11px;letter-spacing:.1em;color:#8B1E24}' +
  '.ee-tier-main{display:grid;gap:3px;min-width:0}' +
  '.ee-tier-name{font-family:"Cinzel Decorative",serif;font-size:clamp(15px,2.1vw,19px);letter-spacing:.05em;text-transform:uppercase}' +
  '.ee-tier-tag{font-family:"Space Mono",monospace;font-size:8.5px;letter-spacing:.24em;color:#4ADE80;text-transform:uppercase}' +
  '.ee-tier-body{font-size:13.5px;color:#a8a49a;line-height:1.6}' +
  '.ee-tier-go{font-family:"Space Mono",monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase;' +
  'color:#a8a49a;white-space:nowrap}' +
  '.ee-drops{display:grid;grid-template-columns:repeat(auto-fit,minmax(196px,1fr));gap:10px;margin-top:34px}' +
  '.ee-drop{position:relative;display:grid;gap:4px;padding:14px 14px 16px;border:1px solid rgba(239,236,228,.14);' +
  'background:linear-gradient(180deg,rgba(17,18,21,.85),rgba(7,7,9,.7));text-decoration:none;color:inherit;' +
  'transition:transform .28s,border-color .28s}' +
  '.ee-drop:hover{transform:translateY(-4px);border-color:rgba(139,30,36,.55)}' +
  '.ee-drop-k{font-family:"Space Mono",monospace;font-size:8px;letter-spacing:.2em;text-transform:uppercase;color:#8B1E24}' +
  '.ee-drop-v{font-size:13.5px;color:#EFECE4;line-height:1.5}' +
  '.ee-drop-go{position:absolute;right:12px;bottom:10px;color:#4ADE80;font-size:13px}' +
  '.ee-telemetry{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-top:26px;' +
  'padding:16px;border:1px dashed rgba(74,222,128,.28)}' +
  '.ee-tel{display:grid;gap:2px}' +
  '.ee-tel b{font-family:"Space Mono",monospace;font-size:clamp(18px,3vw,26px);color:#4ADE80;letter-spacing:.02em}' +
  '.ee-tel span{font-family:"Space Mono",monospace;font-size:8px;letter-spacing:.2em;text-transform:uppercase;color:#6d6a62}' +
  '.ee-tel a{color:#a8a49a;text-decoration:none;border-bottom:1px solid rgba(239,236,228,.2)}' +
  '.ee-tel a:hover{color:#4ADE80}' +
  '@media(max-width:620px){.ee-tree{padding-left:24px}.ee-tree:before{left:9px}' +
  '.ee-tier{grid-template-columns:auto 1fr;padding:14px}.ee-tier-go{grid-column:2;justify-self:start}' +
  '.ee-tier:before{left:-15px;width:15px}}' +
  '</style>';

export const HOME_HTML =
  '<section class="ee-anatomy"><div class="ee-anatomy-head">' +
  '<span class="k">// Ecosystem anatomy</span>' +
  '<h2 class="ee-slash">Wear the reclamation. Defend the wild.</h2>' +
  '<p>Every design lives on one of three tiers. It is the same tree: what is underground, what is dying at the core, ' +
  'and what is growing back over the wound. Pick where you want to stand.</p></div>' +
  '<div class="ee-tree">' + TIERS.map(tierCard).join("") + '</div>' +
  '<div class="ee-drops">' + dropStrip + '</div>' +
  '<div class="ee-telemetry" id="eeTel">' +
  '<div class="ee-tel"><b id="telSpec">40</b><span>Species tracked</span></div>' +
  '<div class="ee-tel"><b id="telArts">24</b><span>Field dispatches</span></div>' +
  '<div class="ee-tel"><b id="telPledge">15%</b><span>Pledged per order</span></div>' +
  '<div class="ee-tel"><b id="telDisb">$0</b><span>Disbursed <a href="/conservation">ledger</a></span></div>' +
  '</div></section>';

export const HOME_JS = '<script id="ee-home-js">(function(){' +
  'fetch("/api/impact").then(function(r){return r.json()}).then(function(d){' +
  'if(!d)return;' +
  'function set(id,v){var el=document.getElementById(id);if(el&&v!==undefined&&v!==null)el.textContent=v;}' +
  'if(d.species)set("telSpec",d.species+" SPECIES");' +
  'if(d.articles)set("telArts",d.articles+" DISPATCHES");' +
  'if(d.disbursed!==undefined)set("telDisb","$"+Number(d.disbursed).toFixed(0)+" DISBURSED");' +
  'if(d.accrued!==undefined)set("telPledge",(d.pledge||15)+"% PLEDGED");' +
  '}).catch(function(){});})();</script>';
