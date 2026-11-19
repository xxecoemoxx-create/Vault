// ─────────────────────────────────────────────────────────────────────────────
// SHOP UI — the tactile command filter bar for /shop.
// Injected only on the shop route. Reads ?tier= ?line= ?featured= ?category= ?q=,
// joins every rendered product card to its DB metadata (tags the storefront does
// not print), and keeps the URL in sync as filters change.
// ─────────────────────────────────────────────────────────────────────────────

export const SHOP_UI = '<style id="ee-shop-ui">' +
  '.ee-filters{position:relative;margin:0 0 26px;padding:14px 14px 12px;border:1px solid rgba(239,236,228,.14);' +
  'background:linear-gradient(180deg,rgba(17,18,21,.9),rgba(7,7,9,.72))}' +
  '.ee-filters:before{content:"// COMMAND FILTER";position:absolute;top:-8px;left:12px;background:#070709;' +
  'padding:0 6px;font-family:"Space Mono",monospace;font-size:8px;letter-spacing:.24em;color:#4ADE80}' +
  '.ee-f-search{display:flex;gap:8px;align-items:center;margin-bottom:10px;flex-wrap:wrap}' +
  '.ee-f-search input{flex:1 1 240px;min-width:0;background:#0a0b0d;border:1px solid rgba(239,236,228,.16);' +
  'color:#EFECE4;font-family:"Space Mono",monospace;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;' +
  'padding:10px 12px}' +
  '.ee-f-search input::placeholder{color:#6d6a62;text-transform:uppercase}' +
  '.ee-f-search input:focus{outline:none;border-color:#4ADE80}' +
  '.ee-f-count{font-family:"Space Mono",monospace;font-size:9px;letter-spacing:.2em;color:#a8a49a;white-space:nowrap}' +
  '.ee-f-group{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px;align-items:center}' +
  '.ee-f-group .ee-f-label{font-family:"Space Mono",monospace;font-size:8px;letter-spacing:.22em;' +
  'text-transform:uppercase;color:#6d6a62;margin-right:4px;min-width:52px}' +
  '.ee-f-group button{font-family:"Space Mono",monospace;font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;' +
  'padding:6px 9px;background:#111215;color:#a8a49a;border:1px solid rgba(239,236,228,.14);cursor:pointer;' +
  'transition:color .2s,border-color .2s,background .2s}' +
  '.ee-f-group button:hover{color:#EFECE4;border-color:rgba(74,222,128,.35)}' +
  '.ee-f-group button.on{color:#070709;background:#4ADE80;border-color:#4ADE80;font-weight:700}' +
  '.ee-f-empty{display:none;padding:26px 14px;text-align:center;border:1px dashed rgba(74,222,128,.3);' +
  'font-family:"Space Mono",monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#a8a49a}' +
  '@media(max-width:560px){.ee-f-group .ee-f-label{min-width:100%}}' +
  '</style>' +

  '<script id="ee-shop-ui-js">(function(){' +
  'var d=document;' +
  'var cards=[].slice.call(d.querySelectorAll(".product-card"));' +
  'if(!cards.length)return;' +
  'var tierOf={roots:"degradation",trunk:"extinction",canopy:"reclamation"};var CATMAP={apparel:/apparel|headwear|sweatshirt|tee|hoodie/i,accessories:/accessor|sticker|pin|plush|camping|camping/i,slides:/slide|footwear|sandal|slipper/i,home:/home|print|art|wallpaper|poster/i};' +
  'var meta={},loaded=false;' +
  'function idOf(card){var b=card.querySelector(".buy-btn");if(!b)return "";' +
  'var m=/ecoBuy\\([\'"]([^\'"]+)[\'"]/.exec(b.getAttribute("onclick")||"");return m?m[1]:"";}' +
  'function textOf(card){return (card.textContent||"").toLowerCase();}' +
  'cards.forEach(function(c){c.setAttribute("data-ee-id",idOf(c));});' +
  'function buildBar(){' +
  'var grid=d.querySelector(".card-grid")||cards[0].parentNode;' +
  'var wrap=d.createElement("div");wrap.className="ee-filters";' +
  'wrap.innerHTML=\'<div class="ee-f-search"><input id="eeQ" type="search" placeholder="SEARCH SPECIMEN, GARMENT, OR TIER..." aria-label="Search products"><span class="ee-f-count" id="eeCount"></span></div>\' +' +
  '\'<div class="ee-f-group" data-g="tier"><span class="ee-f-label">TIER</span>\' +' +
  '\'<button data-v="" class="on">ALL TIERS</button><button data-v="degradation">ROOTS // DEGRADATION</button>\' +' +
  '\'<button data-v="extinction">TRUNK // EXTINCTION</button><button data-v="reclamation">CANOPY // RECLAMATION</button></div>\' +' +
  '\'<div class="ee-f-group" data-g="cat"><span class="ee-f-label">FORM</span>\' +' +
  '\'<button data-v="" class="on">ALL</button><button data-v="apparel">APPAREL</button>\' +' +
  '\'<button data-v="accessories">ACCESSORIES</button><button data-v="slides">SLIDES</button>\' +' +
  '\'<button data-v="home">ART &amp; HOME</button></div>\' +' +
  '\'<div class="ee-f-group" data-g="line"><span class="ee-f-label">LINE</span>\' +' +
  '\'<button data-v="" class="on">ALL LINES</button><button data-v="featured">FEATURED</button>\' +' +
  '\'<button data-v="species">SPECIES</button><button data-v="endling">ENDLING</button>\' +' +
  '\'<button data-v="eco">ECO</button><button data-v="ecoemo">ECOEMO</button></div>\';' +
  'grid.parentNode.insertBefore(wrap,grid);' +
  'var empty=d.createElement("div");empty.className="ee-f-empty";empty.id="eeEmpty";' +
  'empty.textContent="NO SPECIMEN MATCHES THAT FILTER.";grid.parentNode.appendChild(empty);' +
  'wrap.addEventListener("click",function(e){var b=e.target.closest("button[data-v]");if(!b)return;' +
  'var g=b.parentNode.getAttribute("data-g");' +
  '[].forEach.call(b.parentNode.querySelectorAll("button"),function(x){x.classList.remove("on")});' +
  'b.classList.add("on");state[g]=b.getAttribute("data-v");apply();});' +
  'var q=wrap.querySelector("#eeQ");var t=null;' +
  'q.addEventListener("input",function(){clearTimeout(t);t=setTimeout(function(){state.q=q.value.trim();apply();},180);});' +
  'return {wrap:wrap,q:q,empty:empty};}' +
  'var state={tier:"",cat:"",line:"",q:""};' +
  'function setPill(g,v){var grp=document.querySelector(\'.ee-f-group[data-g="\'+g+\'"]\');if(!grp)return;' +
  '[].forEach.call(grp.querySelectorAll("button"),function(x){' +
  'x.classList.toggle("on",(x.getAttribute("data-v")||"")===v);});}' +
  'function apply() {' +
  'var shown=0,qt=state.q.toLowerCase();' +
  'var fq=state.line==="featured"?"":state.line;' +
  'cards.forEach(function(c){' +
  'var m=meta[c.getAttribute("data-ee-id")]||{};' +
  'var txt=textOf(c);' +
  'var ok=true;' +
  'if(state.tier){var want=state.tier;' +
  'ok=ok&&((m.tier||"").toLowerCase()===want||txt.indexOf(want)>-1);}' +
  'if(state.cat){var rx=CATMAP[state.cat]||new RegExp(state.cat,"i");var cat=m.category||"";' +
  'ok=ok&&(rx.test(cat)||rx.test(txt));}' +
  'if(fq&&loaded){var line=(m.line||"").toLowerCase();var sp=(m.species||"").toLowerCase();' +
  'ok=ok&&(line===fq);}' +
  'if(state.line==="featured"&&loaded){ok=ok&&/honey|bee|pollinator|monarch/i.test((m.species||""));}' +
  'if(qt){ok=ok&&((txt.indexOf(qt)>-1)||((m.species||"").toLowerCase().indexOf(qt)>-1));}' +
  'c.style.display=ok?"":"none";if(ok)shown++;});' +
  'var cnt=document.getElementById("eeCount");' +
  'if(cnt)cnt.textContent=shown+" / "+cards.length+" SPECIMENS";' +
  'var emp=document.getElementById("eeEmpty");if(emp)emp.style.display=shown?"none":"block";' +
  'syncUrl();}' +
  'function syncUrl(){' +
  'var p=new URLSearchParams(location.search);var map={tier:"tier",cat:"category",line:"line",q:"q"};' +
  'Object.keys(map).forEach(function(k){var v=state[k];if(v)p.set(map[k],v);else p.delete(map[k]);});' +
  'var inv={degradation:"roots",extinction:"trunk",reclamation:"canopy"};' +
  'if(state.tier&&inv[state.tier])p.set("tier",inv[state.tier]);' +
  'var qs=p.toString();' +
  'try{history.replaceState(null,"",location.pathname+(qs?"?"+qs:""));}catch(e){}}' +
  'var ui=buildBar();' +
  'var p=new URLSearchParams(location.search);' +
  'var t=(p.get("tier")||"").toLowerCase();state.tier=tierOf[t]||t;' +
  'state.cat=(p.get("category")||"").toLowerCase();state.line=(p.get("line")||"").toLowerCase();' +
  'state.q=(p.get("q")||"").trim();' +
  'var feat=(p.get("featured")||"").toLowerCase();' +
  'if(feat){state.q=feat.replace(/-/g," ");state.line="";}' +
  'if(ui.q&&state.q)ui.q.value=p.get("q")||p.get("featured")||"";' +
  'setPill("tier",state.tier);setPill("cat",state.cat);setPill("line",state.line);' +
  'apply();' +
  'fetch("/api/shop-meta").then(function(r){return r.json()}).then(function(d){' +
  'if(!d||!d.products)return;d.products.forEach(function(x){meta[x.id]=x;});loaded=true;apply();})' +
  '.catch(function(){});' +
  '})();</script>';
