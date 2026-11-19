// ─────────────────────────────────────────────────────────────────────────────
// METALCORE LAYER — tour-poster typography, screenprint texture, claw-slash flare.
// Injected by brandLayer() into every proxied HTML page. Nothing here touches the
// backend functions: it is pure presentation + progressive enhancement, so a JS
// failure degrades to the plain page instead of an unreadable one.
// ─────────────────────────────────────────────────────────────────────────────

export const M_FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com">' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=UnifrakturMaguntia&family=Space+Mono:wght@400;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">';

// One tapered three-finger rake. Painted in the page background colour so it reads as
// a tear through the glyphs, with a single bone hairline as the screenprint highlight.
const CLAW = "data:image/svg+xml," + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 300' preserveAspectRatio='none'>" +
  "<g fill='none' stroke='%23070709' stroke-linecap='round'>" +
  "<path d='M292 -30 C322 52 278 108 332 188 C349 216 342 252 366 330' stroke-width='19'/>" +
  "<path d='M352 -30 C378 62 336 122 392 200 C409 228 400 262 424 330' stroke-width='12'/>" +
  "<path d='M406 -30 C430 74 392 132 444 208' stroke-width='7'/>" +
  "</g>" +
  "<g fill='none' stroke='%23EFECE4' stroke-linecap='round' opacity='.28'>" +
  "<path d='M283 -30 C313 52 269 108 323 188' stroke-width='1.6'/>" +
  "<path d='M343 -30 C369 62 327 122 383 200' stroke-width='1'/>" +
  "</g></svg>"
);

// Jagged claw-rip section divider (torn paper edge, not a clean rule).
const RIP = "data:image/svg+xml," + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 30' preserveAspectRatio='none'>" +
  "<path d='M0 16 L34 10 L58 19 L92 8 L128 18 L166 9 L204 20 L243 11 L282 21 L318 12 L356 22 L395 10 L432 19 L470 9 L508 20 L546 12 L584 21 L622 10 L660 19 L698 11 L736 21 L774 12 L812 20 L850 10 L888 19 L926 11 L964 21 L1002 12 L1040 20 L1078 10 L1116 19 L1154 11 L1200 18' " +
  "fill='none' stroke='%23EFECE4' stroke-opacity='.16' stroke-width='1.4'/>" +
  "<path d='M0 22 L44 17 L88 24 L132 15 L176 25 L220 16 L264 26 L308 18 L352 26 L396 17 L440 25 L484 16 L528 24 L572 15 L616 25 L660 17 L704 26 L748 16 L792 24 L836 15 L880 25 L924 17 L968 26 L1012 16 L1056 24 L1100 15 L1144 24 L1200 16' " +
  "fill='none' stroke='%231E4D36' stroke-opacity='.9' stroke-width='1'/>" +
  "<g stroke='%238B1E24' stroke-opacity='.55' stroke-width='2' fill='none' stroke-linecap='round'>" +
  "<path d='M214 2 C224 9 218 14 230 24'/><path d='M232 2 C242 9 236 14 248 24'/>" +
  "<path d='M856 2 C866 9 860 14 872 24'/><path d='M874 2 C884 9 878 14 890 24'/></g></svg>"
);

// Backwards ƎE crest. Used as the image-error fallback so a dead Printify mockup
// never renders as a broken-image icon.
const CREST = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>" +
  "<rect width='200' height='200' fill='#111215'/>" +
  "<circle cx='100' cy='100' r='74' fill='none' stroke='#EFECE4' stroke-opacity='.45'/>" +
  "<circle cx='100' cy='100' r='66' fill='none' stroke='#EFECE4' stroke-opacity='.28' stroke-dasharray='2 5'/>" +
  "<g fill='#EFECE4'>" +
  "<path d='M88 66h44v9H98v16h28v9H98v16h34v9H88z'/>" +
  "<path d='M76 66h9v59h-9z'/>" +
  "</g>" +
  "<text x='100' y='170' text-anchor='middle' font-family='monospace' font-size='10' letter-spacing='4' fill='#EFECE4' fill-opacity='.4'>ECO EMO</text></svg>";

const CREST_DATA = "data:image/svg+xml," + encodeURIComponent(CREST);

// ── portal rail sigils ───────────────────────────────────────────────────────
const SIG = {
  shop: "<svg viewBox='0 0 16 16' aria-hidden='true'><path d='M2 5h12l-1.2 8.2H3.2z' fill='none' stroke='currentColor' stroke-width='1.1'/><path d='M5.4 5a2.6 2.6 0 0 1 5.2 0' fill='none' stroke='currentColor' stroke-width='1.1'/></svg>",
  vault: "<svg viewBox='0 0 16 16' aria-hidden='true'><rect x='2' y='4' width='12' height='8' rx='1' fill='none' stroke='currentColor' stroke-width='1.1'/><circle cx='5.2' cy='8' r='1.3' fill='currentColor'/><circle cx='10.8' cy='8' r='1.3' fill='currentColor'/><path d='M6.5 8h3' stroke='currentColor' stroke-width='1'/></svg>",
  arcade: "<svg viewBox='0 0 16 16' aria-hidden='true'><rect x='2.6' y='2.6' width='10.8' height='10.8' rx='1.4' fill='none' stroke='currentColor' stroke-width='1.1'/><path d='M8 5v3.4M6.3 6.7h3.4' stroke='currentColor' stroke-width='1.1'/><circle cx='11' cy='11' r='.9' fill='currentColor'/></svg>",
  conservation: "<svg viewBox='0 0 16 16' aria-hidden='true'><path d='M8 14V6.5' stroke='currentColor' stroke-width='1.1'/><path d='M8 7C8 7 3.6 6.4 3.2 3 6.6 2.8 8 5.4 8 7z' fill='none' stroke='currentColor' stroke-width='1.1'/><path d='M8 9.4c0 0 4.4-.6 4.8-4-3.4-.2-4.8 2.4-4.8 4z' fill='none' stroke='currentColor' stroke-width='1.1'/></svg>",
  worx: "<svg viewBox='0 0 16 16' aria-hidden='true'><path d='M8 2.2l1.7 3.6 3.9.5-2.8 2.8.7 4L8 11.2 4.5 13l.7-4L2.4 6.3l3.9-.5z' fill='none' stroke='currentColor' stroke-width='1.1' stroke-linejoin='round'/></svg>",
  freelance: "<svg viewBox='0 0 16 16' aria-hidden='true'><path d='M2.4 13.6L3 10.4 10.4 3l2.6 2.6L5.6 13z' fill='none' stroke='currentColor' stroke-width='1.1' stroke-linejoin='round'/><path d='M9.4 4l2.6 2.6' stroke='currentColor' stroke-width='1.1'/></svg>",
  legal: "<svg viewBox='0 0 16 16' aria-hidden='true'><path d='M8 1.8l5 2v4.1c0 3-2.2 5.2-5 6.3-2.8-1.1-5-3.3-5-6.3V3.8z' fill='none' stroke='currentColor' stroke-width='1.1'/><path d='M5.8 8.1l1.6 1.6 3-3.2' fill='none' stroke='currentColor' stroke-width='1.2'/></svg>"
};

const PORTALS = [
  ["/shop", "Shop", "shop"],
  ["/vault", "Vault", "vault"],
  ["/arcade", "Arcade", "arcade"],
  ["/conservation", "Conservation", "conservation"],
  ["/worx", "WORX", "worx"],
  ["/freelance", "Freelance", "freelance"]
];

// ── footer legal registry (header rail intentionally has no Legal entry) ─────
const LEGAL_DOCS = [
  ["terms", "Terms", "Terms of Service"],
  ["privacy", "Privacy", "Privacy Policy"],
  ["shipping", "Shipping", "Shipping"],
  ["returns", "Returns", "Returns &amp; Fulfillment"],
  ["conservation", "Donation Disclosure", "Conservation Donation Disclosure"],
  ["trademark", "Trademark", "Trademark &amp; Copyright"]
];

export const LEGAL_FOOT = '<div class="ee-legalfoot"><span class="ee-lf-k">Legal registry</span>' +
  LEGAL_DOCS.map(function (d) {
    return '<a href="/legal?doc=' + d[0] + '" title="' + d[2] + '">' + d[1] + '</a>';
  }).join('<span class="ee-lf-sep">&middot;</span>') + '</div>';

export function portalRail() {
  const links = PORTALS.map(function (p) {
    return '<a href="' + p[0] + '">' + SIG[p[2]] + '<span>' + p[1] + '</span></a>';
  }).join("");
  return '<div class="ee-rail" role="navigation" aria-label="Primary portals">' +
    '<a class="ee-rail-brand" href="/"><b>&#477;E</b><span>ECO&nbsp;EMO</span></a>' +
    '<nav class="ee-rail-links">' + links + '</nav></div>';
}

const TICKER_LINES = [
  "HONEY BEE // POLLINATOR DEFENSE ACTIVE",
  "RED WOLF // FEWER THAN 20 WILD",
  "VAQUITA // 10 REMAIN",
  "FISHING CAT // WETLAND LOSS",
  "ENDLING VAULT // CHANNELS OPEN",
  "A PORTION OF EVERY ORDER GOES TO CONSERVATION"
];

export function ticker() {
  const line = TICKER_LINES.map(function (t) {
    return '<span class="ee-tick-item">' + t + '</span><span class="ee-tick-sep">&#10022;</span>';
  }).join("");
  return '<div class="ee-ticker" aria-hidden="true"><div class="ee-ticker-track">' + line + line + '</div></div>';
}

export const M_CSS = '<style id="ee-metalcore">' +
  ':root{--ee-tar:#070709;--ee-bark:#111215;--ee-bone:#EFECE4;--ee-bone-dim:#a8a49a;--ee-moss:#1E4D36;' +
  '--ee-moss-lit:#2f7a55;--ee-lichen:#4ADE80;--ee-crimson:#8B1E24;--ee-ink:rgba(239,236,228,.14);' +
  '--ee-display:"UnifrakturMaguntia","Cinzel Decorative",serif;--ee-serif:"Cinzel Decorative","Cinzel",serif;' +
  '--ee-mono:"Space Mono",ui-monospace,SFMono-Regular,monospace;--ee-sans:"Plus Jakarta Sans",system-ui,-apple-system,sans-serif;' +
  '--ee-rail:42px}' +

  // ── base surface + type ────────────────────────────────────────────────────
  'body{background:var(--ee-tar)!important;color:var(--ee-bone);font-family:var(--ee-sans)!important;font-size:16.5px;line-height:1.72;letter-spacing:.004em}' +
  'body,p,li,td,th,dd,dt,figcaption,label,legend,input,textarea,select,button{font-family:var(--ee-sans)}' +
  'h1,h2,h3,h4,h5,h6,.brand-text,.section-header h2{font-family:var(--ee-serif)!important;letter-spacing:.045em;font-weight:700}' +
  '.hero-title{font-family:var(--ee-display)!important;letter-spacing:.01em;line-height:.95;text-transform:uppercase;' +
  'color:var(--ee-bone);text-shadow:0 1px 0 #000,0 0 26px rgba(74,222,128,.14),3px 3px 0 rgba(139,30,36,.5),-1px -1px 0 rgba(239,236,228,.1)}' +
  '.eyebrow,.kicker,.meta,.byline,.label,.pill,.tag,.product-cat,.section-tag,.shop-intro,.product-price,' +
  '.ee-legalfoot{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;margin:22px auto 0;' +
  'padding-top:16px;border-top:1px solid rgba(239,236,228,.12);max-width:900px;' +
  'font-family:var(--ee-mono);font-size:8.5px;letter-spacing:.2em;text-transform:uppercase}' +
  '.ee-legalfoot .ee-lf-k{color:var(--ee-crimson);letter-spacing:.28em}' +
  '.ee-legalfoot a{color:var(--ee-bone-dim);text-decoration:none}' +
  '.ee-legalfoot a:hover{color:var(--ee-lichen)}' +
  '.ee-legalfoot .ee-lf-sep{color:rgba(239,236,228,.28)}' +
  '.status-badge,.rmeta,.nav-links a,footer,footer a,.btn,.button,.buy-btn,.shop-link,button' +
  '{font-family:var(--ee-mono)!important;letter-spacing:.16em;text-transform:uppercase}' +
  '.product-price{color:var(--ee-bone)!important;letter-spacing:.06em}' +
  'a{color:var(--ee-bone)}a:hover{color:var(--ee-lichen)}' +
  '.article-body{font-size:17px;line-height:1.82;hyphens:auto}' +
  '.article-body h2,.article-body h3{font-family:var(--ee-serif)}' +

  // ── screenprint atmosphere: grain + ember vignette ────────────────────────
  'body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.55;' +
  'background-image:radial-gradient(circle at 18% 8%,rgba(30,77,54,.16),transparent 46%),' +
  'radial-gradient(circle at 84% 2%,rgba(139,30,36,.12),transparent 44%),' +
  'radial-gradient(circle at 50% 100%,rgba(30,77,54,.1),transparent 52%)}' +
  'body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.055;mix-blend-mode:screen;' +
  'background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'160\' height=\'160\' filter=\'url(%23n)\'/%3E%3C/svg%3E")}' +

  // ── metalcore display treatment: ink bleed + claw rake ────────────────────
  '.hero-title,.ee-slash{position:relative;isolation:isolate}' +
  '.hero-title::after,.ee-slash::after{content:"";position:absolute;top:-8%;left:12%;width:86%;height:132%;' +
  'pointer-events:none;z-index:2;opacity:.94;background-repeat:no-repeat;background-position:right top;' +
  'background-size:100% 100%;background-image:url("' + CLAW + '")}' +
  '.section-header h2{position:relative;display:inline-block}' +
  '.section-header h2::after{content:"";position:absolute;left:-2%;top:-14%;width:106%;height:120%;pointer-events:none;' +
  'opacity:.72;background-repeat:no-repeat;background-size:100% 100%;background-image:url("' + CLAW + '")}' +

  // ── torn-rip dividers replace the smooth rule ─────────────────────────────
  '.ee-divider{height:26px;margin:30px auto;max-width:900px;opacity:.85;background-repeat:no-repeat;' +
  'background-position:center;background-size:100% 26px;background-image:url("' + RIP + '")}' +
  '.tagline-strip,.donation-strip{position:relative}' +
  '.tagline-strip::before,.donation-strip::before{content:"";position:absolute;left:0;right:0;top:-1px;height:22px;' +
  'pointer-events:none;opacity:.5;background-repeat:no-repeat;background-size:100% 22px;background-image:url("' + RIP + '")}' +

  // ── cards: registration crop marks, hairline ink, moss inner glow ─────────
  '.card,.product-card,.species-card,.article-card,.org-card{position:relative;' +
  'border:1px solid var(--ee-ink)!important;background-color:rgba(17,18,21,.72)!important;' +
  'backdrop-filter:blur(2px);transition:transform .32s cubic-bezier(.2,.7,.2,1),box-shadow .32s,border-color .32s}' +
  '.card::before,.product-card::before,.species-card::before{content:"";position:absolute;top:-5px;left:-5px;width:11px;height:11px;' +
  'pointer-events:none;opacity:.5;background-repeat:no-repeat;' +
  'background-image:linear-gradient(var(--ee-bone),var(--ee-bone)),linear-gradient(var(--ee-bone),var(--ee-bone));' +
  'background-size:100% 1px,1px 100%;background-position:0 50%,50% 0}' +
  '.card::after,.product-card::after,.species-card::after{content:"";position:absolute;bottom:-5px;right:-5px;width:11px;height:11px;' +
  'pointer-events:none;opacity:.5;background-repeat:no-repeat;' +
  'background-image:linear-gradient(var(--ee-bone),var(--ee-bone)),linear-gradient(var(--ee-bone),var(--ee-bone));' +
  'background-size:100% 1px,1px 100%;background-position:0 50%,50% 100%}' +
  '.card:hover,.product-card:hover,.species-card:hover,.article-card:hover,.org-card:hover{transform:translateY(-5px);' +
  'border-color:rgba(74,222,128,.34)!important;' +
  'box-shadow:0 18px 44px rgba(0,0,0,.72),inset 0 0 40px rgba(30,77,54,.42),0 0 0 1px rgba(74,222,128,.18)}' +
  '.ee-wm{position:absolute;right:8px;bottom:6px;z-index:3;pointer-events:none;font-family:var(--ee-serif);' +
  'font-size:22px;line-height:1;letter-spacing:0;color:var(--ee-bone);opacity:0;transform:rotate(-9deg) scale(.9);' +
  'transition:opacity .3s,transform .3s}' +
  '.card:hover .ee-wm,.product-card:hover .ee-wm,.species-card:hover .ee-wm{opacity:.16;transform:rotate(-9deg) scale(1)}' +
  '.ee-specimen,.ee-pledge{position:absolute;z-index:3;pointer-events:none;font-family:var(--ee-mono);' +
  'font-size:8.5px;letter-spacing:.22em;text-transform:uppercase;padding:3px 6px;background:rgba(7,7,9,.86);' +
  'border:1px solid var(--ee-ink);color:var(--ee-bone-dim)}' +
  '.ee-specimen{top:8px;left:8px;max-width:70%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
  '.ee-pledge{top:8px;right:8px;color:var(--ee-lichen);border-color:rgba(74,222,128,.4)}' +
  '.ee-flip{position:absolute;top:8px;left:8px;z-index:5;font-family:var(--ee-mono);font-size:8.5px;letter-spacing:.16em;' +
  'text-transform:uppercase;padding:4px 7px;background:rgba(7,7,9,.9);color:var(--ee-bone-dim);' +
  'border:1px solid var(--ee-ink);cursor:pointer}' +
  '.ee-flip:hover{color:var(--ee-lichen);border-color:rgba(74,222,128,.45)}' +
  '.product-card.ee-flipped .ee-face-back{opacity:1}' +

  // ── portal rail ──────────────────────────────────────────────────────────
  '.ee-rail{position:sticky;top:0;z-index:220;display:flex;align-items:center;gap:14px;' +
  'padding:0 14px;height:var(--ee-rail);background:rgba(7,7,9,.96);' +
  'border-bottom:1px solid var(--ee-ink);backdrop-filter:blur(10px);max-width:100%}' +
  '.ee-rail-brand{display:flex;align-items:center;gap:8px;text-decoration:none;flex-shrink:0;' +
  'font-family:var(--ee-mono);font-size:10px;letter-spacing:.3em;color:var(--ee-bone)}' +
  '.ee-rail-brand b{font-family:var(--ee-serif);font-size:15px;letter-spacing:0;color:var(--ee-lichen);font-weight:700}' +
  '.ee-rail-links{display:flex;align-items:center;gap:2px;overflow-x:auto;scrollbar-width:none;flex:1 1 auto;' +
  'min-width:0;-webkit-overflow-scrolling:touch}' +
  '.ee-rail-links::-webkit-scrollbar{display:none}' +
  '.ee-rail-links a{display:inline-flex;align-items:center;gap:5px;padding:6px 9px;text-decoration:none;' +
  'font-family:var(--ee-mono);font-size:9.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--ee-bone-dim);' +
  'white-space:nowrap;border:1px solid transparent;transition:color .2s,border-color .2s,background .2s}' +
  '.ee-rail-links a svg{width:13px;height:13px;flex-shrink:0;opacity:.72;transition:opacity .2s}' +
  '.ee-rail-links a:hover{color:var(--ee-bone);border-color:var(--ee-ink);background:rgba(30,77,54,.22)}' +
  '.ee-rail-links a:hover svg{opacity:1;color:var(--ee-lichen)}' +
  '.site-header{top:var(--ee-rail)!important}' +
  '@media(max-width:720px){.ee-rail-brand span{display:none}.ee-rail{gap:6px;padding:0 8px}}' +
  '@media(max-width:420px){.ee-rail-links a span{display:none}.ee-rail-links a{padding:7px 9px}}' +

  // ── kinetic dispatch ticker ──────────────────────────────────────────────
  '.ee-ticker{position:relative;overflow:hidden;border-bottom:1px solid var(--ee-ink);' +
  'background:linear-gradient(90deg,rgba(139,30,36,.16),rgba(7,7,9,.9) 42%,rgba(30,77,54,.2))}' +
  '.ee-ticker-track{display:flex;align-items:center;width:max-content;padding:6px 0;' +
  'animation:ee-scroll 52s linear infinite;will-change:transform}' +
  '.ee-ticker:hover .ee-ticker-track{animation-play-state:paused}' +
  '.ee-tick-item{font-family:var(--ee-mono);font-size:9.5px;letter-spacing:.26em;text-transform:uppercase;' +
  'color:var(--ee-bone-dim);padding:0 12px;white-space:nowrap}' +
  '.ee-tick-sep{color:var(--ee-crimson);font-size:9px}' +
  '@keyframes ee-scroll{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}' +

  // ── motion: staggered reveals, magnetic lift ─────────────────────────────
  '.ee-primed{opacity:0;transform:translateY(16px)}' +
  '.ee-in{opacity:1;transform:none;transition:opacity .55s ease,transform .55s cubic-bezier(.2,.7,.2,1)}' +
  '@media(prefers-reduced-motion:reduce){' +
  '.ee-ticker-track{animation:none}.ee-primed{opacity:1;transform:none}' +
  '.card:hover,.product-card:hover,.species-card:hover,.article-card:hover,.org-card:hover{transform:none}' +
  '.hero-title::after,.section-header h2::after{opacity:.4}}' +
  '</style>';

// JS runs after paint, so nothing is hidden before the observer is attached.
export const M_JS = '<script id="ee-metalcore-js">(function(){' +
  'var d=document;' +
  'function crest(img){try{img.onerror=null;img.src="' + CREST_DATA + '";img.style.objectFit="cover";}catch(e){}}' +
  'Array.prototype.forEach.call(d.images,function(img){' +
  'if(!img.complete||img.naturalWidth===0){img.addEventListener("error",function(){crest(img);});}' +
  'img.addEventListener("load",function(){if(img.naturalWidth===0)crest(img);});});' +
  'Array.prototype.forEach.call(d.querySelectorAll(".product-card,.species-card,.article-card,.card"),function(card){' +
  'if(card.getAttribute("data-ee"))return;card.setAttribute("data-ee","1");' +
  'var wm=d.createElement("span");wm.className="ee-wm";wm.setAttribute("aria-hidden","true");wm.textContent="\u018eE";card.appendChild(wm);' +
  'var h=card.querySelector("h3"),img=card.querySelector("img");' +
  'if(card.classList.contains("species-card")&&h){' +
  'var sp=d.createElement("span");sp.className="ee-specimen";sp.textContent="SPECIMEN // "+h.textContent.trim().toUpperCase().slice(0,22);card.appendChild(sp);}' +
  'if(card.classList.contains("product-card")){' +
  'var pl=d.createElement("span");pl.className="ee-pledge";pl.textContent="15% PLEDGE";card.appendChild(pl);' +
  'if(img&&!card.querySelector(".ee-flip")){' +
  'var front=d.createElement("img");front.className="ee-face-back";front.alt="";' +
  'front.src="' + CREST_DATA + '";front.loading="lazy";' +
  'front.style.cssText="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#070709;opacity:0;transition:opacity .45s;z-index:2;pointer-events:none";' +
  'card.style.position="relative";card.insertBefore(front,card.firstChild);' +
  'var b=d.createElement("button");b.type="button";b.className="ee-flip";b.textContent="FLIP // FRONT";' +
  'b.addEventListener("click",function(ev){ev.preventDefault();ev.stopPropagation();' +
  'var on=card.classList.toggle("ee-flipped");b.textContent=on?"FLIP // BACK":"FLIP // FRONT";});' +
  'card.appendChild(b);}}});' +
  'if("IntersectionObserver" in window){' +
  'var io=new IntersectionObserver(function(es){es.forEach(function(e){' +
  'if(e.isIntersecting){var t=e.target;var i=parseInt(t.getAttribute("data-ee-i")||"0",10);' +
  't.style.transitionDelay=Math.min(i*55,330)+"ms";t.classList.add("ee-in");' +
  'io.unobserve(t);}});},{rootMargin:"0px 0px -8% 0px",threshold:.06});' +
  'var n=0;Array.prototype.forEach.call(d.querySelectorAll(".card,.product-card,.species-card,.article-card,.org-card,.hero-title,.section-header"),function(el){' +
  'if(el.getAttribute("data-ee-in"))return;el.setAttribute("data-ee-in","1");el.setAttribute("data-ee-i",String(n++%7));' +
  'el.classList.add("ee-primed");io.observe(el);});}' +
  '})();</script>';
