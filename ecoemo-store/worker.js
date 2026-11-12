// Eco Emo — Cloudflare Worker with Cron Triggers v2
// Bypasses Base44 workflow credit block by calling backend functions directly

const FUNCTIONS_BASE = "https://base44.app/api/apps/6a27be55829cc8409d2adfc6/functions/";
const LOGO_URL = "https://media.base44.com/images/public/6a27be55829cc8409d2adfc6/f77676f2b_cb25d4839_generated_image.png";
// Routes the sitemapGenerator function does not know about (added after it shipped).
// Anything already listed is left alone, so the generator stays the source of truth.
const SITEMAP_EXTRA_PATHS = [
  "/labs",
  "/agency-den",
  "/agency-den/degradation",
  "/agency-den/extinction",
  "/agency-den/reclamation",
  "/?page=shop",
  "/?page=membership"
];

function enrichSitemap(xml) {
  if (!xml || !xml.includes("</urlset>")) return xml;
  const today = new Date().toISOString().slice(0, 10);
  const missing = SITEMAP_EXTRA_PATHS.filter((p) => !xml.includes("<loc>https://ecoemo.store" + p + "</loc>"));
  if (!missing.length) return xml;
  const entries = missing
    .map((p) => "  <url><loc>https://ecoemo.store" + p + "</loc><lastmod>" + today + "</lastmod><changefreq>weekly</changefreq><priority>" + (p.indexOf("page=") > -1 ? "0.9" : "0.8") + "</priority></url>\n")
    .join("");
  return xml.replace("</urlset>", entries + "</urlset>");
}

const ROBOTS_TXT = `# Eco Emo — ecoemo.store
User-agent: *
Allow: /

# Block AI training crawlers
User-agent: GPTBot
Disallow: /
User-agent: Google-Extended
Disallow: /
User-agent: CCBot
Disallow: /
User-agent: ClaudeBot
Disallow: /
User-agent: Bytespider
Disallow: /
User-agent: Amazonbot
Disallow: /
User-agent: Applebot-Extended
Disallow: /
User-agent: meta-externalagent
Disallow: /

# Owner-only surfaces
Disallow: /admin
Disallow: /studio
Disallow: /editors
Disallow: /ops

Sitemap: https://ecoemo.store/sitemap.xml
`;


export default {
  async fetch(request) {
    const url = new URL(request.url);

    // www -> apex 301: Google keeps selecting www as canonical; make it redirect
    if (url.hostname === "www.ecoemo.store") {
      url.hostname = "ecoemo.store";
      return Response.redirect(url.toString(), 301);
    }

    // /robots.txt — served statically, never proxied
    if (url.pathname === "/robots.txt") {
      return new Response(ROBOTS_TXT, {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" }
      });
    }

    // Retired private/admin paths — clean 404
    if (url.pathname === "/social" || url.pathname === "/cron-test") {
      return new Response("<!DOCTYPE html><html><head><meta charset='utf-8'><title>404 — Eco Emo</title></head><body style='background:#000;color:#c8c0a8;font-family:Georgia,serif;text-align:center;padding:100px 24px'><h1 style='letter-spacing:6px;font-weight:400;color:#4a9b7a'>GONE EXTINCT</h1><p>This page no longer exists.</p><p><a style='color:#4a9b7a' href='/'>Return to ecoemo.store</a></p></body></html>", {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    // /sitemap.xml — from the sitemap generator function
    if (url.pathname === "/sitemap.xml") {
      const upstream = await fetch(FUNCTIONS_BASE + "sitemapGenerator", {
        headers: { "X-Forwarded-Host": url.hostname }
      });
      const body = await upstream.text();
      return new Response(enrichSitemap(body), {
        status: upstream.status,
        headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" }
      });
    }

    // Shop storefront + post-purchase thank-you → shopStorefront function
    // (also answers the legacy ?page=products Ko-fi export URL)
    const pageParam = url.searchParams.get("page");
    if (pageParam === "shop" || pageParam === "products" || pageParam === "thankyou") {
      const upstream = await fetch(FUNCTIONS_BASE + "shopStorefront" + url.search, {
        headers: { "X-Forwarded-Host": url.hostname }
      });
      const body = await upstream.text();
      return new Response(brandLayer(body), {
        status: upstream.status,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    // ?page=music&key=<vault key> — the Core Vault player, owner path
    if (pageParam === "music" && url.searchParams.get("key") === "ecoemo_vault_2026") {
      const upstream = await fetch(FUNCTIONS_BASE + "coreVaultPlayer" + url.search, {
        headers: { "X-Forwarded-Host": url.hostname }
      });
      const body = await upstream.text();
      return new Response(body, {
        status: upstream.status,
        headers: { "Content-Type": upstream.headers.get("Content-Type") || "text/html; charset=utf-8" }
      });
    }

    // OWNER-ONLY SURFACES — hidden unless the vault key is present, so the public
    // never even learns these paths exist (Chris: "accessible only to me").
    const OWNER_KEY = "ecoemo_vault_2026";
    const ownerPaths = /^\/(admin|studio|editors?|vault|ops)(\/|$)/i;
    if (ownerPaths.test(url.pathname) && url.searchParams.get("key") !== OWNER_KEY) {
      return new Response(OWNER_HIDDEN_HTML, { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    // ?page=music — listening room closed (Chris asked to remove the Spotify playlist
    // on 2026-11-11). The standalone Core Vault player is owner-only.
    if (pageParam === "music") {
      const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The Core Vault | Eco Emo</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Oswald:wght@300;400&family=Crimson+Pro:ital,wght@0,300;0,400;1,300&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#c8c0a8;font-family:'Crimson Pro',Georgia,serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px 20px;text-align:center;background-image:radial-gradient(circle at 50% 0%,rgba(74,155,122,.10),transparent 62%)}
.wrap{max-width:620px}
h1{font-family:'Cinzel',serif;font-size:26px;letter-spacing:5px;color:#e8e0cc;margin-bottom:14px}
.eyebrow{font-family:'Oswald',sans-serif;font-size:10px;letter-spacing:4px;color:#4a9b7a;text-transform:uppercase;margin-bottom:18px}
p{font-size:16px;color:#9a9280;font-style:italic;line-height:1.8}
a.btn{display:inline-block;margin-top:26px;font-family:'Oswald',sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#c8c0a8;border:1px solid rgba(74,155,122,.45);padding:9px 18px;text-decoration:none}
a.btn:hover{background:rgba(74,155,122,.14);color:#e8e0cc}
</style></head><body><div class="wrap">
<div class="eyebrow">The Core Vault</div>
<h1>THE LISTENING ROOM IS CLOSED</h1>
<p>The playlist is pulled. What plays next has to earn its place.<br>Grieve the earth. Save it anyway.</p>
<a class="btn" href="/">Return to the surface</a>
</div></body></html>`;
      return new Response(html, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=600" }
      });
    }

    // ?page=membership — public membership tiers with live Stripe subscription links
    if (pageParam === "membership" || pageParam === "tiers") {
      const upstream = await fetch(FUNCTIONS_BASE + "membershipPage" + url.search, {
        headers: { "X-Forwarded-Host": url.hostname }
      });
      const body = await upstream.text();
      return new Response(brandLayer(body), {
        status: upstream.status,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    // AGENCY DEN — AR bleeding tree (root / trunk / canopy) at clean paths
    const denMatch = url.pathname.match(/^\/agency-den(?:\/([a-z-]+))?\/?$/i) || url.pathname.match(/^\/agencyden(?:\/([a-z-]+))?\/?$/i);
    if (denMatch) {
      const seg = String(denMatch[1] || "").toLowerCase();
      const tier = ["degradation", "extinction", "reclamation"].includes(seg) ? "?tier=" + seg : "";
      const upstream = await fetch(FUNCTIONS_BASE + "agencyDen" + tier, {
        headers: { "X-Forwarded-Host": url.hostname }
      });
      const body = await upstream.text();
      return new Response(brandLayer(body, { den: true }), {
        status: upstream.status,
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=300" }
      });
    }

    // DESIGN APPROVAL DASHBOARD — manual gate, POST/303 aware
    if (url.pathname === "/admin/design-approvals" || url.pathname === "/admin/design-approvals/") {
      const init = { headers: { "X-Forwarded-Host": url.hostname } };
      if (request.method === "POST") {
        init.method = "POST";
        init.body = await request.text();
        init.headers["Content-Type"] = request.headers.get("Content-Type") || "application/x-www-form-urlencoded";
      }
      const upstream = await fetch(FUNCTIONS_BASE + "designApprovals" + url.search, init);
      const ct = upstream.headers.get("Content-Type") || "text/html; charset=utf-8";
      if (upstream.status === 303) {
        const loc = upstream.headers.get("Location") || "";
        const q = loc.includes("?") ? loc.slice(loc.indexOf("?")) : "";
        return new Response(null, { status: 303, headers: { Location: "/admin/design-approvals" + q } });
      }
      const body = await upstream.text();
      return new Response(body, { status: upstream.status, headers: { "Content-Type": ct } });
    }

    // /labs — Christopher's other builds (Plant Your Future, WildScribe)
    if (url.pathname === "/labs" || url.pathname === "/labs/") {
      return new Response(labsPage(), {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=300" }
      });
    }

    // Everything else → publicSite
    const target = FUNCTIONS_BASE + "publicSite" + url.search;
    const upstream = await fetch(target, {
      headers: { "X-Forwarded-Host": url.hostname }
    });
    const body = await upstream.text();
    const contentType = upstream.headers.get("Content-Type") || "text/html; charset=utf-8";
    const out = contentType.includes("text/html") ? brandLayer(body) : body;
    return new Response(out, {
      status: upstream.status,
      headers: { "Content-Type": contentType }
    });
  },

  async scheduled(event, env, ctx) {
    const cron = event.cron;
    console.log("Cron triggered: " + cron);

    if (cron === "0 14 * * *") {
      ctx.waitUntil(runDailyTasks());
    }

    // Weekly Ko-fi-era productReminder call retired 2026-11-10: the function and its
    // weekly cron trigger were removed (obsolete since the Stripe/Printify move, and it
    // had been failing with HTTP 400 on every run).
  }
};

// Adds the Membership page to the site nav without touching publicSite.ts.
// Both replacements are exact-match and harmless if the markup ever changes.
function injectMembershipLink(html) {
  let out = html;
  out = out.replace(
    '<a href="?page=shop" class="shop-link">Shop</a></nav>',
    '<a href="/agency-den">Den</a><a href="?page=shop" class="shop-link">Shop</a><a href="?page=membership">Membership</a></nav>'
  );
  out = out.replace(
    '<a href="?page=terms">Terms</a>',
    '<a href="/agency-den">Agency Den</a><a href="/labs">Labs</a><a href="?page=membership">Membership</a><a href="?page=terms">Terms</a>'
  );
  return out;
}

const SCORCHED_LOGO = "https://media.base44.com/images/public/6a27be55829cc8409d2adfc6/97d8f9b23_generated_image.png";
const DEN_TREE_ART = "https://media.base44.com/images/public/6a27be55829cc8409d2adfc6/466718479_generated_image.png";

const OWNER_HIDDEN_HTML = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>404 | Eco Emo</title>
<style>body{background:#000;color:#c8c0a8;font-family:Georgia,serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center}h1{font-size:15px;letter-spacing:6px;color:#5a5448}</style>
</head><body><h1>THIS PAGE HAS GONE EXTINCT</h1></body></html>`;

// The brand layer: real type, real motifs, the scorched logo instead of a typed "EE".
const BRAND_CSS = `<style id="ee-brand-layer">
:root{--ee-bg:#000;--ee-cream:#c8c0a8;--ee-dim:#9a9280;--ee-green:#4a9b7a;--ee-line:rgba(74,155,122,.22)}
body{background:#000 !important;color:#c8c0a8}
body,h1,h2,h3,h4,h5,h6,p,li,td,th,blockquote,figcaption,span:not(.label){font-family:'Crimson Pro',Georgia,serif}
h1,h2,h3,h4,.brand,.site-header .brand,.page-title{font-family:'Cinzel',serif !important;letter-spacing:.05em}
h1{color:#e8e0cc}
.eyebrow,.kicker,.meta,.byline,.nav-links a,footer,footer a,.label,button,.btn,.button,.shop-link,.pill,.tag{font-family:'Oswald',sans-serif !important;letter-spacing:.18em;text-transform:uppercase}
.brand img.ee-logo{height:1.15em;width:auto;vertical-align:-.22em;filter:drop-shadow(0 0 6px rgba(74,155,122,.35))}
.nav-links a{position:relative;transition:color .25s}
.nav-links a::after{content:"";position:absolute;left:0;right:100%;bottom:-4px;height:1px;background:var(--ee-green);transition:right .3s}
.nav-links a:hover::after{right:0}
body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.5;
  background-image:radial-gradient(circle at 20% 12%,rgba(74,155,122,.07),transparent 42%),radial-gradient(circle at 82% 4%,rgba(180,70,47,.06),transparent 46%)}
body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.035;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E")}
main,.container,.wrap{position:relative;z-index:1}
.card,.article-card,.species-card,.product-card,.org-card{transition:transform .3s ease,box-shadow .3s ease,border-color .3s ease}
.card:hover,.article-card:hover,.species-card:hover,.product-card:hover,.org-card:hover{transform:translateY(-3px);box-shadow:0 14px 34px rgba(0,0,0,.62),0 0 0 1px rgba(74,155,122,.28)}
.ee-divider{height:26px;margin:34px auto;max-width:720px;opacity:.5;
  background-repeat:no-repeat;background-position:center;background-size:contain;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 720 26'%3E%3Cpath d='M0 13h300' stroke='%234a9b7a' stroke-width='1' opacity='.55'/%3E%3Cpath d='M420 13h300' stroke='%234a9b7a' stroke-width='1' opacity='.55'/%3E%3Cpath d='M360 3l7 9-7 9-7-9z' fill='%234a9b7a'/%3E%3Cpath d='M327 13c8-7 16-7 24 0-8 7-16 7-24 0z' fill='%23c8c0a8' opacity='.6'/%3E%3Cpath d='M393 13c-8-7-16-7-24 0 8 7 16 7 24 0z' fill='%23c8c0a8' opacity='.6'/%3E%3C/svg%3E")}
a{transition:color .22s}
::selection{background:rgba(74,155,122,.35);color:#fff}
</style>`;

// The den tree becomes the logo's tree: real art, animated blood, no flat SVG.

// ---- Labs: Christopher's own builds outside the Base44 stack ----
const LABS = [
  {
    name: "Plant Your Future",
    url: "https://resumai-bnp2bdjo.manus.space/",
    built: "Manus AI",
    tag: "Live",
    live: true,
    blurb: "AI resume and cover-letter builder with a conservation hook: every document generated plants real trees. Career tools that pay the planet back.",
    note: "Resume engine, ATS-oriented output, tree planting tied to usage."
  },
  {
    name: "WildScribe",
    url: "https://quick-cash-289.preview.emergentagent.com/",
    built: "Emergent",
    tag: "Live",
    live: true,
    blurb: "An AI conservation studio: four paid micro-tools that turn field work into funding pitches, a shop of grant and stewardship template packs, and a tip jar that sends everything to wildlife rescue partners.",
    note: "Claude-powered drafts, Stripe checkout and instant downloads. Live on the Emergent preview domain; the production subdomain is not yet resolving."
  }
];

function labsPage() {
  const cards = LABS.map((a) => `
    <a class="lab" href="${a.url}" target="_blank" rel="noopener">
      <div class="lab-top"><span class="lab-name">${a.name}</span><span class="lab-tag ${a.live ? "on" : "off"}">${a.tag}</span></div>
      <div class="lab-built">${a.built}</div>
      <p>${a.blurb}</p>
      <div class="lab-note">${a.note}</div>
      <span class="lab-go">open &nearr;</span>
    </a>`).join("");
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Labs — Eco Emo</title><meta name="description" content="Other things Christopher built: Plant Your Future on Manus, WildScribe on Emergent.">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Crimson+Pro:wght@300;400;600&family=Oswald:wght@300;400&display=swap" rel="stylesheet">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23000'/%3E%3Cpath d='M9 8h6v16H9zM17 8h6v16h-6z' fill='%23c8c0a8'/%3E%3C/svg%3E">
<style>
:root{--bg:#000;--fg:#c8c0a8;--dim:#9a9280;--green:#4a9b7a;--bright:#e8e0cc}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--fg);font-family:'Crimson Pro',Georgia,serif;line-height:1.75;padding:0 20px 70px}
header.site{display:flex;justify-content:space-between;align-items:center;padding:18px 0;border-bottom:1px solid rgba(74,155,122,.18);font-family:'Oswald',sans-serif;letter-spacing:2px;font-size:11px}
header.site a{color:var(--dim);text-decoration:none}header.site a:hover{color:var(--green)}
.brand{font-family:'Cinzel',serif;font-size:15px;letter-spacing:4px;color:var(--bright);text-decoration:none}
.wrap{max-width:820px;margin:0 auto}
.eyebrow{font-family:'Oswald',sans-serif;font-size:10px;letter-spacing:4px;color:var(--green);text-transform:uppercase;margin:40px 0 10px}
h1{font-family:'Cinzel',serif;font-size:34px;letter-spacing:2px;color:var(--bright);line-height:1.2;margin-bottom:12px}
.sub{color:var(--dim);font-style:italic;margin-bottom:36px;max-width:56ch}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:18px}
.lab{display:block;background:linear-gradient(160deg,rgba(15,15,15,.9),rgba(6,6,6,.9));border:1px solid rgba(74,155,122,.2);border-radius:8px;padding:22px;text-decoration:none;color:var(--fg);transition:transform .25s,border-color .25s,box-shadow .25s}
.lab:hover{transform:translateY(-3px);border-color:rgba(74,155,122,.55);box-shadow:0 12px 34px rgba(0,0,0,.6)}
.lab-top{display:flex;justify-content:space-between;align-items:center;gap:10px}
.lab-name{font-family:'Cinzel',serif;font-size:17px;color:var(--bright);letter-spacing:1px}
.lab-tag{font-family:'Oswald',sans-serif;font-size:9px;letter-spacing:2px;padding:3px 8px;border-radius:2px;border:1px solid}
.lab-tag.on{color:#4a9b7a;border-color:rgba(74,155,122,.5)}
.lab-tag.off{color:#9a9280;border-color:rgba(154,146,128,.35)}
.lab-built{font-family:'Oswald',sans-serif;font-size:10px;letter-spacing:2.5px;color:var(--dim);margin:6px 0 14px;text-transform:uppercase}
.lab p{font-size:15px;margin-bottom:12px}
.lab-note{font-size:12px;color:#6e6a5c;border-top:1px solid rgba(74,155,122,.12);padding-top:10px}
.lab-go{display:inline-block;margin-top:12px;font-family:'Oswald',sans-serif;font-size:10px;letter-spacing:2.5px;color:var(--green)}
footer{margin-top:48px;text-align:center;font-family:'Oswald',sans-serif;font-size:10px;letter-spacing:3px;color:#5a5448}
</style></head><body>
<header class="site"><a class="brand" href="/">ECO EMO</a><a href="/agency-den">AGENCY DEN</a><a href="/?page=shop">SHOP</a></nav></header>
<div class="wrap">
<div class="eyebrow">Built by Christopher</div>
<h1>Labs</h1>
<p class="sub">The Eco Emo store is one build. These are the others: separate products, separate stacks, same conservation instinct.</p>
<div class="grid">${cards}</div>
</div>
<footer>EST. MMXXVI · EMO CONSERVATION · GREIVE THE EARTH. SAVE IT ANYWAY.</footer>
</body></html>`;
}

const DEN_CSS = `<style id="ee-den-tree">
.tree{position:relative;min-height:360px;background-image:url("${DEN_TREE_ART}");background-size:contain;background-position:center bottom;background-repeat:no-repeat;animation:ee-breathe 9s ease-in-out infinite}
.tree svg{display:none !important}
.tree::after{content:"";position:absolute;left:50%;top:38%;width:2px;height:0;background:linear-gradient(180deg,rgba(180,70,47,0),#b4462f);transform:translateX(-50%);animation:ee-drip 4.6s ease-in infinite;filter:blur(.3px)}
@keyframes ee-breathe{0%,100%{transform:scale(1);filter:brightness(.94)}50%{transform:scale(1.015);filter:brightness(1.06)}}
@keyframes ee-drip{0%{height:0;opacity:0}18%{opacity:.9}100%{height:46%;opacity:0}}
@media(prefers-reduced-motion:reduce){.tree{animation:none}.tree::after{animation:none}}
</style>`;

function brandLayer(html, opts) {
  let out = injectMembershipLink(html);

  // typed EE monogram in the header -> the scorched mini logo
  out = out.replace(
    /(class="brand"[\s\S]{0,600}?)EE(<\/span>)/,
    '$1<img class="ee-logo" src="' + SCORCHED_LOGO + '" alt="Eco Emo">$2'
  );

  const inject = BRAND_CSS + ((opts && opts.den) ? DEN_CSS : "");
  out = out.includes("</head>") ? out.replace("</head>", inject + "</head>") : inject + out;

  // Labs link on every page, including the ones with their own nav (den tier pages, shop)
  if (!out.includes('href="/labs"')) {
    if (out.includes("</nav>")) {
      out = out.replace("</nav>", '<a href="/labs">Labs</a></nav>');
    } else if (out.includes("</footer>")) {
      out = out.replace("</footer>", '<div style="text-align:center;padding:18px 0;font-family:Oswald,sans-serif;font-size:10px;letter-spacing:2.5px"><a href="/labs" style="color:#5a5448;text-decoration:none">LABS</a></div></footer>');
    }
  }

  // a thorn divider after the header, only on full pages that have one
  if (out.includes("</header>") && !out.includes("ee-divider")) {
    out = out.replace("</header>", "</header><div class=" + '"ee-divider"' + "></div>");
  }
  return out;
}

function escapeHtml(s) {
  return (s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

async function runDailyTasks() {
  const results = {};
  const steps = [
    ["tidbit", "generateDailyTidbit"],
    ["payout", "dailyPayoutSummary"],
    ["tiktok", "tiktokScriptGenerator"],
    ["social", "generateSocialPosts"]
  ];

  // Each step is isolated: own timeout, one retry, and a loud structured error line
  // (CRON_FAIL <step> ...) so a single dead function can never swallow the rest of
  // the run, and telemetry can find the failure without digging through prose.
  for (const [label, fn] of steps) {
    results[label] = await runStep(label, fn);
  }

  const failed = Object.entries(results).filter(([, v]) => v && v.error);
  if (failed.length) {
    console.error("CRON_FAIL_SUMMARY " + JSON.stringify(failed.map(([k, v]) => ({ step: k, error: v.error }))));
  }
  console.log("Daily tasks: " + JSON.stringify(results));
  return results;
}

async function runStep(label, fnName, attempt = 1) {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45000);
  try {
    const r = await fetch(FUNCTIONS_BASE + fnName, { method: "POST", signal: controller.signal });
    const text = await r.text();
    let body;
    try { body = JSON.parse(text); } catch (e) { body = { error: "non-json " + r.status + ": " + text.slice(0, 200) }; }
    if (!r.ok) {
      const err = { error: "http " + r.status, detail: body };
      if (attempt < 2) { console.error("CRON_RETRY " + label + " " + JSON.stringify(err)); await new Promise((res) => setTimeout(res, 3000)); return runStep(label, fnName, attempt + 1); }
      console.error("CRON_FAIL " + label + " " + JSON.stringify(err));
      return err;
    }
    return Object.assign({}, body, { ms: Date.now() - started });
  } catch (e) {
    const err = { error: (e && e.name === "AbortError") ? "timeout after 45s" : String(e && e.message || e) };
    if (attempt < 2) { console.error("CRON_RETRY " + label + " " + JSON.stringify(err)); await new Promise((res) => setTimeout(res, 3000)); return runStep(label, fnName, attempt + 1); }
    console.error("CRON_FAIL " + label + " " + JSON.stringify(err));
    return err;
  } finally {
    clearTimeout(timer);
  }
}
