// Eco Emo — Cloudflare Worker with Cron Triggers v2
// Bypasses Base44 workflow credit block by calling backend functions directly

import { GRAVE_BEACON_B64 } from "./media-grave-beacon.js";
import { PAGES } from "./pages-bundle.js";
import { M_FONTS, M_CSS, M_JS, portalRail, ticker, LEGAL_FOOT } from "./metalcore.js";
import { SHOP_UI } from "./shopui.js";
import { PLATED } from "./plated.js";
import { HOME_CSS, HOME_HTML, HOME_JS } from "./homesections.js";
import { ARCADE_PAGE } from "./arcade.js";
import { vaultPage } from "./vault.js";
import { legalPage, freelancePage, conservationPage } from "./portals.js";

const FUNCTIONS_BASE = "https://base44.app/api/apps/6a27be55829cc8409d2adfc6/functions/";
// Repo-backed pages: the Vault repository is the deploy source for /worx and /games.
const REPO_RAW = "https://raw.githubusercontent.com/xxecoemoxx-create/Vault/main/";

// ── social publishing ───────────────────────────────────────────────────────
const IG_GRAPH = "https://graph.instagram.com/v23.0";
const LI_REST = "https://api.linkedin.com/rest";
const LI_VERSION = "202610";

function jr(payload, status) {
  return new Response(JSON.stringify(payload), {
    status: status || 200,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}

async function socialStatus(env) {
  const out = { instagram: null, linkedin: null };
  if (env.INSTAGRAM_ACCESS_TOKEN) {
    try {
      const r = await fetch(IG_GRAPH + "/me?fields=id,username,account_type&access_token=" + encodeURIComponent(env.INSTAGRAM_ACCESS_TOKEN));
      const d = await r.json();
      out.instagram = r.ok ? { ok: true, id: d.id, username: d.username, type: d.account_type } : { ok: false, status: r.status, error: d };
    } catch (e) { out.instagram = { ok: false, error: String(e) }; }
  } else out.instagram = { ok: false, error: "INSTAGRAM_ACCESS_TOKEN not set" };

  if (env.LINKEDIN_ACCESS_TOKEN) {
    try {
      const r = await fetch("https://api.linkedin.com/v2/userinfo", { headers: { Authorization: "Bearer " + env.LINKEDIN_ACCESS_TOKEN } });
      const d = await r.json();
      out.linkedin = r.ok ? { ok: true, sub: d.sub, name: d.name, email: d.email } : { ok: false, status: r.status, error: d };
    } catch (e) { out.linkedin = { ok: false, error: String(e) }; }
  } else out.linkedin = { ok: false, error: "LINKEDIN_ACCESS_TOKEN not set" };

  return jr(out);
}

async function socialPost(req, env) {
  let body = {};
  try { body = await req.json(); } catch (_) {}
  const network = String(body.network || "").toLowerCase();

  if (network === "instagram") {
    if (!env.INSTAGRAM_ACCESS_TOKEN) return jr({ ok: false, error: "INSTAGRAM_ACCESS_TOKEN not set" }, 500);
    if (!body.imageUrl) return jr({ ok: false, error: "imageUrl required" }, 400);
    const me = await fetch(IG_GRAPH + "/me?fields=id&access_token=" + encodeURIComponent(env.INSTAGRAM_ACCESS_TOKEN)).then((r) => r.json());
    if (!me.id) return jr({ ok: false, step: "auth", error: me }, 502);
    const form = new URLSearchParams({ image_url: String(body.imageUrl), caption: String(body.caption || ""), access_token: env.INSTAGRAM_ACCESS_TOKEN });
    const created = await fetch(IG_GRAPH + "/" + me.id + "/media", { method: "POST", body: form }).then((r) => r.json());
    if (!created.id) return jr({ ok: false, step: "container", error: created }, 502);
    let code = "IN_PROGRESS";
    for (let i = 0; i < 12; i++) {
      await new Promise((r) => setTimeout(r, 2500));
      const st = await fetch(IG_GRAPH + "/" + created.id + "?fields=status_code&access_token=" + encodeURIComponent(env.INSTAGRAM_ACCESS_TOKEN)).then((r) => r.json());
      code = st.status_code || code;
      if (code !== "IN_PROGRESS") break;
    }
    if (code !== "FINISHED") return jr({ ok: false, step: "processing", statusCode: code, containerId: created.id }, 502);
    const pubForm = new URLSearchParams({ creation_id: created.id, access_token: env.INSTAGRAM_ACCESS_TOKEN });
    const pub = await fetch(IG_GRAPH + "/" + me.id + "/media_publish", { method: "POST", body: pubForm }).then((r) => r.json());
    if (!pub.id) return jr({ ok: false, step: "publish", error: pub }, 502);
    return jr({ ok: true, network: "instagram", mediaId: pub.id });
  }

  if (network === "linkedin") {
    if (!env.LINKEDIN_ACCESS_TOKEN) return jr({ ok: false, error: "LINKEDIN_ACCESS_TOKEN not set" }, 500);
    const text = String(body.text || body.caption || "").trim();
    if (!text) return jr({ ok: false, error: "text required" }, 400);
    const who = await fetch("https://api.linkedin.com/v2/userinfo", { headers: { Authorization: "Bearer " + env.LINKEDIN_ACCESS_TOKEN } }).then((r) => r.json());
    if (!who.sub) return jr({ ok: false, step: "auth", error: who }, 502);
    const payload = {
      author: "urn:li:person:" + who.sub,
      commentary: text,
      visibility: "PUBLIC",
      distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false
    };
    const r = await fetch(LI_REST + "/posts", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + env.LINKEDIN_ACCESS_TOKEN,
        "LinkedIn-Version": LI_VERSION,
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const raw = await r.text();
    if (!r.ok) return jr({ ok: false, step: "publish", status: r.status, error: raw.slice(0, 500) }, 502);
    return jr({ ok: true, network: "linkedin", postId: r.headers.get("x-restli-id") });
  }

  if (network === "discord") {
    if (!env.DISCORD_BOT_TOKEN) return jr({ ok: false, error: "DISCORD_BOT_TOKEN not set" }, 500);
    if (!env.DISCORD_CHANNEL_ID) return jr({ ok: false, error: "DISCORD_CHANNEL_ID not set" }, 500);
    const content = String(body.text || body.caption || "").trim();
    if (!content) return jr({ ok: false, error: "text required" }, 400);
    const r = await fetch("https://discord.com/api/v10/channels/" + env.DISCORD_CHANNEL_ID + "/messages", {
      method: "POST",
      headers: { Authorization: "Bot " + env.DISCORD_BOT_TOKEN, "Content-Type": "application/json", "User-Agent": "DiscordBot (https://ecoemo.store, 1.0)" },
      body: JSON.stringify({ content: content.slice(0, 1900) })
    });
    const data = await r.json();
    if (!r.ok) return jr({ ok: false, step: "publish", status: r.status, error: data }, 502);
    return jr({ ok: true, network: "discord", messageId: data.id });
  }

  if (network === "facebook") {
    if (!env.FACEBOOK_PAGE_TOKEN || !env.FACEBOOK_PAGE_ID) return jr({ ok: false, error: "Facebook page token/id not set" }, 500);
    const form = new URLSearchParams({ message: String(body.text || body.caption || ""), access_token: env.FACEBOOK_PAGE_TOKEN });
    if (body.imageUrl) form.set("link", String(body.imageUrl));
    const r = await fetch("https://graph.facebook.com/v23.0/" + env.FACEBOOK_PAGE_ID + "/feed", { method: "POST", body: form });
    const data = await r.json();
    if (!r.ok || !data.id) return jr({ ok: false, step: "publish", status: r.status, error: data }, 502);
    return jr({ ok: true, network: "facebook", postId: data.id });
  }

  // Reddit needs a script app (client id/secret + refresh token). Untested until those
  // exist; the shape is the documented OAuth2 refresh flow.
  if (network === "reddit") {
    const need = ["REDDIT_CLIENT_ID", "REDDIT_CLIENT_SECRET", "REDDIT_REFRESH_TOKEN", "REDDIT_SUBREDDIT"].filter((k) => !env[k]);
    if (need.length) return jr({ ok: false, error: "missing " + need.join(", ") }, 500);
    const tokenRes = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(env.REDDIT_CLIENT_ID + ":" + env.REDDIT_CLIENT_SECRET),
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "EcoEmoBot/1.0 (https://ecoemo.store)"
      },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: env.REDDIT_REFRESH_TOKEN })
    });
    const tok = await tokenRes.json();
    if (!tokenRes.ok || !tok.access_token) return jr({ ok: false, step: "token", status: tokenRes.status, error: tok }, 502);

    const form = new URLSearchParams({
      sr: env.REDDIT_SUBREDDIT,
      title: String(body.title || body.caption || "").slice(0, 290),
      kind: "self",
      text: String(body.text || body.caption || ""),
      api_type: "json"
    });
    const r = await fetch("https://oauth.reddit.com/api/submit", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + tok.access_token,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "EcoEmoBot/1.0 (https://ecoemo.store)"
      },
      body: form
    });
    const data = await r.json();
    const errors = data && data.json && data.json.errors;
    if (!r.ok || (errors && errors.length)) return jr({ ok: false, step: "publish", status: r.status, error: data }, 502);
    const postUrl = data?.json?.data?.url || "";
    return jr({ ok: true, network: "reddit", postId: postUrl, permalink: postUrl });
  }

  return jr({ ok: false, error: "network must be instagram or linkedin" }, 400);
}

// ── daily multi-platform publishing ─────────────────────────────────────────
function pickCaption(posts, network) {
  if (!posts) return "";
  const ig = posts.instagram || "";
  const tw = posts.twitter || "";
  if (network === "instagram") return ig || tw;
  if (network === "linkedin") return ig || tw;
  if (network === "discord") return ig || tw;
  if (network === "facebook") return ig || tw;
  if (network === "reddit") return [posts.reddit_title, posts.reddit_body].filter(Boolean).join("\n\n");
  return tw || ig;
}

// Every network's credential requirement in one place, so a missing token is a labelled
// skip instead of a silent failure or a half-configured post.
function networkCreds(env, network) {
  if (network === "instagram") return env.INSTAGRAM_ACCESS_TOKEN ? [] : ["INSTAGRAM_ACCESS_TOKEN"];
  if (network === "linkedin") return env.LINKEDIN_ACCESS_TOKEN ? [] : ["LINKEDIN_ACCESS_TOKEN"];
  if (network === "discord") {
    const need = [];
    if (!env.DISCORD_BOT_TOKEN) need.push("DISCORD_BOT_TOKEN");
    if (!env.DISCORD_CHANNEL_ID) need.push("DISCORD_CHANNEL_ID");
    return need;
  }
  if (network === "facebook") {
    const need = [];
    if (!env.FACEBOOK_PAGE_TOKEN) need.push("FACEBOOK_PAGE_TOKEN");
    if (!env.FACEBOOK_PAGE_ID) need.push("FACEBOOK_PAGE_ID");
    return need;
  }
  if (network === "reddit") {
    const need = [];
    for (const k of ["REDDIT_CLIENT_ID", "REDDIT_CLIENT_SECRET", "REDDIT_REFRESH_TOKEN", "REDDIT_SUBREDDIT"]) if (!env[k]) need.push(k);
    return need;
  }
  if (network === "youtube") return env.YOUTUBE_ACCESS_TOKEN ? [] : ["YOUTUBE_ACCESS_TOKEN"];
  return ["unknown network"];
}

async function markPublish(date, network, status, detail, extra) {
  try {
    await fetch(FUNCTIONS_BASE + "dailyPost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.assign({ action: "mark", date, network, status, detail: String(detail || "").slice(0, 800) }, extra || {}))
    });
  } catch (e) {
    console.error("PUBLISH_MARK_FAIL " + network + " " + String(e));
  }
}

async function publishDaily(env, posts, dry) {
  let plan;
  try {
    const r = await fetch(FUNCTIONS_BASE + "dailyPost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "plan" })
    });
    plan = await r.json();
  } catch (e) {
    console.error("PUBLISH_PLAN_FAIL " + String(e));
    return { ok: false, error: "plan failed: " + String(e) };
  }
  if (!plan || !plan.ok) return { ok: false, error: "plan rejected", detail: plan };

  if (!posts) {
    try {
      const g = await fetch(FUNCTIONS_BASE + "generateSocialPosts", { method: "POST" });
      const gj = await g.json();
      posts = (gj && gj.posts) || null;
    } catch (e) {
      console.error("PUBLISH_CAPTION_FAIL " + String(e));
    }
  }

  const date = plan.date;
  const imageUrl = "https://ecoemo.store/media/daily/" + date + ".jpg";
  const enabled = String(env.PUBLISH_ENABLED || "true") !== "false";
  const report = { date, dry: !!dry, enabled, image: imageUrl, results: {} };

  for (const network of plan.pending || []) {
    const missing = networkCreds(env, network);
    if (missing.length) {
      report.results[network] = { status: "skipped", reason: "missing " + missing.join(", ") };
      if (!dry) await markPublish(date, network, "skipped", "missing credentials: " + missing.join(", "));
      continue;
    }
    if (!enabled) {
      report.results[network] = { status: "skipped", reason: "PUBLISH_ENABLED=false" };
      if (!dry) await markPublish(date, network, "skipped", "PUBLISH_ENABLED=false");
      continue;
    }

    const caption = pickCaption(posts, network);
    if (!caption) {
      report.results[network] = { status: "skipped", reason: "no caption available" };
      if (!dry) await markPublish(date, network, "skipped", "no caption available");
      continue;
    }

    if (dry) {
      report.results[network] = { status: "ready", chars: caption.length, needsImage: network === "instagram" };
      continue;
    }

    const payload = { network, imageUrl: network === "instagram" ? imageUrl : "", caption, text: caption, title: posts && posts.reddit_title ? posts.reddit_title : caption.split("\n")[0] };
    try {
      const res = await socialPost(new Request("https://internal/api/social/post", { method: "POST", body: JSON.stringify(payload) }), env);
      const data = await res.json();
      if (data && data.ok) {
        report.results[network] = { status: "published", id: data.mediaId || data.postId || data.messageId };
        await markPublish(date, network, "published", "", { media_id: String(data.mediaId || data.postId || data.messageId || ""), post_url: data.permalink || "" });
      } else {
        report.results[network] = { status: "failed", detail: data };
        await markPublish(date, network, "failed", JSON.stringify(data).slice(0, 500));
      }
    } catch (e) {
      report.results[network] = { status: "failed", detail: String(e) };
      await markPublish(date, network, "failed", String(e));
    }
  }

  const summary = Object.entries(report.results).map(([k, v]) => k + "=" + v.status).join(" ");
  console.log("PUBLISH_DAILY " + date + " " + summary);
  return Object.assign({ ok: true }, report);
}

async function dailyImage(date) {
  let src = null;
  try {
    const r = await fetch(FUNCTIONS_BASE + "dailyPost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "plan", date })
    });
    const plan = await r.json();
    src = plan && plan.image_url;
  } catch (e) {
    console.error("DAILY_IMAGE_PLAN_FAIL " + String(e));
  }
  if (!src) return new Response("no image for " + date, { status: 404, headers: { "Content-Type": "text/plain" } });

  const headers = {
    "User-Agent": "EcoEmoBot/1.0 (https://ecoemo.store; xxecoemoxx@gmail.com) AppleWebKit/537.36",
    "Referer": "https://ecoemo.store/",
    "Accept": "image/avif,image/webp,image/jpeg,image/*;q=0.8"
  };

  // Wikimedia 403s Cloudflare's egress from the thumb host, so try the original file and a
  // resizing CDN before giving up. First 200 image wins and is what Instagram receives.
  const original = src.replace("/thumb/", "/").replace(/\/\d+px-[^/]+$/, "");
  const candidates = [src, original, "https://wsrv.nl/?url=" + encodeURIComponent(src) + "&w=1200&output=jpg"];

  for (const candidate of candidates) {
    try {
      const img = await fetch(candidate, { headers, cf: { cacheEverything: true, cacheTtl: 604800 } });
      const type = img.headers.get("content-type") || "";
      if (img.ok && type.startsWith("image/")) {
        return new Response(img.body, {
          headers: {
            "Content-Type": "image/jpeg",
            "Cache-Control": "public, max-age=604800",
            "X-Image-Source": candidate === src ? "primary" : (candidate === original ? "original" : "cdn")
          }
        });
      }
      console.error("DAILY_IMAGE_TRY " + img.status + " " + candidate.slice(0, 120));
    } catch (e) {
      console.error("DAILY_IMAGE_ERR " + String(e) + " " + candidate.slice(0, 80));
    }
  }

  return new Response("no fetchable image for " + date, { status: 502, headers: { "Content-Type": "text/plain" } });
}

async function repoPage(repoPath, fallbackKey) {
  let html = null;
  try {
    const r = await fetch(REPO_RAW + repoPath, { cf: { cacheTtl: 300, cacheEverything: true } });
    if (r.ok) {
      const t = await r.text();
      if (t && t.length > 800 && t.indexOf("</html>") > -1) html = t;
    }
  } catch (_) {}
  const body = html || PAGES[fallbackKey] || "<h1>Not published yet</h1>";
  return new Response(body, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "X-Page-Source": html ? "repo" : "bundle"
    }
  });
}
const LOGO_URL = "https://media.base44.com/images/public/6a27be55829cc8409d2adfc6/f77676f2b_cb25d4839_generated_image.png";
// Routes the sitemapGenerator function does not know about (added after it shipped).
// Anything already listed is left alone, so the generator stays the source of truth.
const SITEMAP_EXTRA_PATHS = [
  "/shop",
  "/vault",
  "/conservation",
  "/freelance",
  "/legal",
  "/labs",
  "/agency-den",
  "/agency-den/degradation",
  "/agency-den/extinction",
  "/agency-den/reclamation",
  "/worx",
  "/games",
  "/games/reclamation",
  "/games/degradation",
  "/games/extinction",
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
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // API surface (music sync, audio proxy, printify sync + webhook, checkout,
    // stripe webhook, inquiry). Page rendering below is unchanged.
    const GRAFTED_API = [
      "/api/sync-music",
      "/api/stream-audio",
      "/api/sync-printify",
      "/api/webhooks/printify",
      "/api/checkout",
      "/api/webhooks/stripe"
    ];
    if (GRAFTED_API.indexOf(url.pathname) > -1) {
      const apiCtx = ctx || { waitUntil: (p) => { if (p && p.catch) p.catch(() => {}); } };
      const apiResp = await handleApi(request, env, apiCtx, url, url.pathname);
      if (apiResp) return apiResp;
    }

    // www -> apex 301: Google keeps selecting www as canonical; make it redirect
    if (url.hostname === "www.ecoemo.store") {
      url.hostname = "ecoemo.store";
      return Response.redirect(url.toString(), 301);
    }

    // Self-hosted product photo: Printify mockup generation fails for blueprint 5454,
    // so the Grave Beacon night light image is baked into the bundle and served here.
    if (url.pathname === "/media/grave-beacon.jpg") {
      const bin = Uint8Array.from(atob(GRAVE_BEACON_B64), (c) => c.charCodeAt(0));
      return new Response(bin, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=31536000, immutable"
        }
      });
    }

    // Agency Den AR tree — standalone build served through the edge so the page
    // references ONE versioned asset instead of a layered SVG + CSS background stack.
    if (url.pathname === "/media/agency-den-tree.png") {
      const up = await fetch(DEN_TREE_ART, { cf: { cacheEverything: true, cacheTtl: 2592000 } });
      if (!up.ok) {
        return new Response("tree asset unavailable", { status: 502, headers: { "Content-Type": "text/plain" } });
      }
      return new Response(up.body, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-Asset-Build": TREE_BUILD
        }
      });
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

    // ── Root-slug portals (flat single level, never nested paths) ────────────
    const cleanPath = (url.pathname.replace(/\/+$/, "").toLowerCase() || "/");

    // Homepage-only sections: ecosystem anatomy, drop strip, live telemetry
    if (cleanPath === "/") {
      const upstream = await fetch(FUNCTIONS_BASE + "publicSite" + url.search, {
        headers: { "X-Forwarded-Host": url.hostname }
      });
      let body = await upstream.text();
      if (!body.includes("ee-anatomy")) {
        body = body.includes("<footer")
          ? body.replace(/<footer/i, HOME_HTML + "<footer")
          : body.replace("</body>", HOME_HTML + "</body>");
        body = body.replace("</head>", HOME_CSS + "</head>");
        body = body.includes("</body>") ? body.replace("</body>", HOME_JS + "</body>") : body + HOME_JS;
      }
      return new Response(brandLayer(body), {
        status: upstream.status,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=120, stale-while-revalidate=60"
        }
      });
    }

    // Impact numbers for the homepage telemetry strip
    if (cleanPath === "/api/impact") {
      let out = { species: 0, articles: 0, disbursed: 0, accrued: 0, pledge: 15 };
      try {
        const r = await fetch(FUNCTIONS_BASE + "portalData?what=conservation", {
          headers: { "X-Forwarded-Host": url.hostname }
        });
        if (r.ok) {
          const d = await r.json();
          const money = (list, status) => (list || [])
            .filter((x) => (x.status || "accrued").toLowerCase() === status)
            .reduce((a, x) => a + Number(x.amount_to_org || x.amount_total || 0), 0);
          out = {
            species: (d.species || []).length,
            articles: (d.articles || []).length,
            disbursed: Math.round(money(d.donations, "disbursed")),
            accrued: Math.round(money(d.donations, "accrued")),
            pledge: 15
          };
        }
      } catch (e) {}
      return new Response(JSON.stringify(out), {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=300" }
      });
    }

    if (cleanPath === "/shop") {
      const q = new URLSearchParams(url.search);
      q.set("page", "shop");
      const upstream = await fetch(FUNCTIONS_BASE + "shopStorefront?" + q.toString(), {
        headers: { "X-Forwarded-Host": url.hostname }
      });
      const body = await upstream.text();
      const themed = brandLayer(body);
      const withUi = themed.includes("</body>")
        ? themed.replace("</body>", SHOP_UI + "</body>")
        : themed + SHOP_UI;
      return new Response(withUi, {
        status: upstream.status,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    // Product metadata for the shop filter bar (tags the storefront never prints)
    if (cleanPath === "/api/shop-meta") {
      const r = await fetch(FUNCTIONS_BASE + "portalData?what=products", {
        headers: { "X-Forwarded-Host": url.hostname }
      });
      return new Response(await r.text(), {
        status: r.status,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=300, stale-while-revalidate=120"
        }
      });
    }

    // /vault — Endling Vault audio deck (public): Web Audio visualizer + channels.
    // ?download=1 still hands off to the legacy standalone player build.
    if (cleanPath === "/vault" || cleanPath === "/endling") {
      if (url.searchParams.get("download") === "1") {
        const upstream = await fetch(FUNCTIONS_BASE + "coreVaultPlayer" + url.search, {
          headers: { "X-Forwarded-Host": url.hostname }
        });
        const body = await upstream.text();
        const ct = upstream.headers.get("Content-Type") || "text/html; charset=utf-8";
        return new Response(ct.includes("text/html") ? brandLayer(body) : body, {
          status: upstream.status,
          headers: { "Content-Type": ct }
        });
      }
      let tracks = [];
      let err = "";
      try {
        const r = await fetch(FUNCTIONS_BASE + "portalData?what=tracks", {
          headers: { "X-Forwarded-Host": url.hostname }
        });
        if (r.ok) {
          const d = await r.json();
          // base44.app file URLs 302 to the CDN without CORS headers, which kills
          // both playback and the Web Audio analyser. The CDN URL sends ACAO:* and
          // supports range requests, so hand the browser that one directly.
          tracks = (d.tracks || []).map(function (t) {
            if (!t || !t.url) return t;
            const m = String(t.url).match(/^https:\/\/base44\.app\/api\/apps\/[^/]+\/files\/mp\/public\/(.+)$/);
            if (m) t.url = "https://media.base44.com/files/public/" + m[1];
            return t;
          });
        } else err = "HTTP " + r.status;
      } catch (e) {
        err = "unreachable";
      }
      return new Response(brandLayer(vaultPage(tracks, err)), {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=60, stale-while-revalidate=30"
        }
      });
    }

    if (cleanPath === "/membership") {
      const upstream = await fetch(FUNCTIONS_BASE + "membershipPage" + url.search, {
        headers: { "X-Forwarded-Host": url.hostname }
      });
      const body = await upstream.text();
      return new Response(brandLayer(body), {
        status: upstream.status,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    if (cleanPath === "/legal") {
      return new Response(brandLayer(legalPage(url.searchParams.get("doc") || "")), {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=600" }
      });
    }

    if (cleanPath === "/freelance") {
      return new Response(brandLayer(freelancePage()), {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=600" }
      });
    }

    if (cleanPath === "/conservation") {
      let data = null;
      let err = "";
      try {
        const r = await fetch(FUNCTIONS_BASE + "portalData?what=conservation", {
          headers: { "X-Forwarded-Host": url.hostname }
        });
        if (r.ok) data = await r.json();
        else err = "HTTP " + r.status;
      } catch (e) {
        err = "unreachable";
      }
      return new Response(brandLayer(conservationPage(data, err)), {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=120, stale-while-revalidate=60"
        }
      });
    }

    // Freelance intake → Inquiry record via portalData
    if (cleanPath === "/api/inquiry" && request.method === "POST") {
      const payload = await request.text();
      const r = await fetch(FUNCTIONS_BASE + "portalData?action=intake", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Forwarded-Host": url.hostname },
        body: payload
      });
      return new Response(await r.text(), {
        status: r.status,
        headers: { "Content-Type": "application/json; charset=utf-8" }
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
    if (pageParam === "music") {
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
    const ownerPaths = /^\/(admin|studio|editors?|ops)(\/|$)/i;
    if (ownerPaths.test(url.pathname) && url.searchParams.get("key") !== OWNER_KEY) {
      return new Response(OWNER_HIDDEN_HTML, { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } });
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
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=60, stale-while-revalidate=30" }
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

    // ── Social publishing endpoints ───────────────────────────────────────────
    // The Base44 app has no Instagram/LinkedIn secrets, so the tokens live as Worker
    // secrets and the worker performs the API calls. Key-gated: SOCIAL_POST_KEY.
    // Rehost today's species image on our own origin: Instagram will not fetch a
    // Wikimedia thumb URL, and the cron needs a stable public image for every platform.
    const dailyMedia = url.pathname.match(/^\/media\/daily\/(\d{4}-\d{2}-\d{2})\.jpg$/);
    if (dailyMedia) {
      return await dailyImage(dailyMedia[1]);
    }

    if (url.pathname === "/api/social/status" && request.method === "GET") {
      if (url.searchParams.get("key") !== env.SOCIAL_POST_KEY) {
        return new Response(JSON.stringify({ error: "forbidden" }), { status: 401, headers: { "Content-Type": "application/json" } });
      }
      return await socialStatus(env);
    }
    // Same code path the 08:00 CT cron uses, exposed for verification. Idempotent:
    // publishDaily skips any network already recorded for today.
    if (url.pathname === "/api/cron/run" && (request.method === "POST" || request.method === "GET")) {
      if (url.searchParams.get("key") !== env.SOCIAL_POST_KEY) {
        return new Response(JSON.stringify({ error: "forbidden" }), { status: 401, headers: { "Content-Type": "application/json" } });
      }
      const out = await runDailyTasks(env);
      return jr({ ok: true, cron: "manual invocation of runDailyTasks", results: out });
    }

    if (url.pathname === "/api/social/run" && (request.method === "POST" || request.method === "GET")) {
      if (url.searchParams.get("key") !== env.SOCIAL_POST_KEY) {
        return new Response(JSON.stringify({ error: "forbidden" }), { status: 401, headers: { "Content-Type": "application/json" } });
      }
      const dry = url.searchParams.get("dry") === "1";
      return jr(await publishDaily(env, null, dry));
    }

    if (url.pathname === "/api/social/post" && request.method === "POST") {
      if (url.searchParams.get("key") !== env.SOCIAL_POST_KEY) {
        return new Response(JSON.stringify({ error: "forbidden" }), { status: 401, headers: { "Content-Type": "application/json" } });
      }
      return await socialPost(request, env);
    }

    // /arcade — the hand-built CRT cabinet (both canvas games)
    if (cleanPath === "/arcade") {
      return new Response(brandLayer(ARCADE_PAGE), {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=60"
        }
      });
    }

    // ── WORX portal and the 2D arcade ─────────────────────────────────────────
    // These serve from the GitHub repo (xxecoemoxx-create/Vault) so committing a file
    // to a mapped directory publishes it; the bundled copy is the fallback if GitHub
    // is unreachable. Repo layout: worx/index.html, games/index.html, games/<tier>/index.html
    if (url.pathname === "/worx" || url.pathname === "/worx/") {
      return await repoPage("worx/index.html", "worx");
    }
    if (url.pathname === "/games" || url.pathname === "/games/") {
      return await repoPage("games/index.html", "arcade");
    }
    const gameTier = url.pathname.match(/^\/games\/(reclamation|degradation|extinction)\/?$/);
    if (gameTier) {
      return await repoPage("games/" + gameTier[1] + "/index.html", gameTier[1]);
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
      ctx.waitUntil(runDailyTasks(env));
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
    '<a href="/agency-den">Agency Den</a><a href="/worx">WORX</a><a href="/games">Arcade</a><a href="/labs">Labs</a><a href="?page=membership">Membership</a><a href="?page=terms">Terms</a>'
  );
  return out;
}

const SCORCHED_LOGO = "https://media.base44.com/images/public/6a27be55829cc8409d2adfc6/97d8f9b23_generated_image.png";
const DEN_TREE_ART = "https://media.base44.com/images/public/6a27be55829cc8409d2adfc6/466718479_generated_image.png";
// Bump TREE_BUILD to force every browser and edge copy to refetch the tree asset.
const TREE_BUILD = "2026-11-14c";
const TREE_STANDALONE_IMG = '<div class="tree ee-tree"><img src="/media/agency-den-tree.png?v=' + TREE_BUILD + '" alt="The Agency Den bleeding tree: root tier degradation, trunk tier extinction, canopy tier reclamation" width="1024" height="1024" loading="eager" decoding="async"></div>';

const OWNER_HIDDEN_HTML = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>404 | Eco Emo</title>
<style>body{background:#000;color:#c8c0a8;font-family:Georgia,serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center}h1{font-size:15px;letter-spacing:6px;color:#5a5448}</style>
</head><body><h1>THIS PAGE HAS GONE EXTINCT</h1></body></html>`;

// On phones the fixed radio bar ate 81px of every screen, so it starts collapsed there.
// The brand layer: real type, real motifs, the scorched logo instead of a typed "EE".
const LAYOUT_CSS = `<style id="ee-layout-fix">
/* Layout repairs, 2026-11-14: card CTA alignment, mobile nav overflow, spotify bar width */
.product-body{flex:1 1 auto;min-height:0}
.product-desc{min-height:0}
.tier .actions{margin-top:auto}
.header-inner{flex-wrap:wrap;row-gap:4px}
.nav-links{flex-wrap:wrap;justify-content:center}
.spotify-bar{max-width:100%}
.spotify-frame{max-width:100%}
.section-header{flex-wrap:wrap}
/* homepage brand-art strip: plates rendered at natural 1024px and stacked, adding ~5100px of cropped scroll */
img[alt="Eco Emo brand art"]{width:20%;height:auto;display:block}
div:has(> img[alt="Eco Emo brand art"]){display:flex;flex-wrap:nowrap;align-items:flex-start}
@media(max-width:640px){
  img[alt="Eco Emo brand art"]{width:33.3333%}
  div:has(> img[alt="Eco Emo brand art"]){flex-wrap:wrap}
}
/* hard stop on stray horizontal panning: clip never creates a scroll container,
   so sticky headers and fixed bars keep working; hidden is the old-Safari fallback */
html,body{max-width:100%;overflow-x:clip}
@supports not (overflow-x:clip){body{overflow-x:hidden}}
.nav{flex-wrap:wrap;justify-content:center;row-gap:6px}
@media(max-width:600px){
  .section-header h2{white-space:normal;font-size:19px}
}
@media(max-width:520px){
  .nav{gap:10px;font-size:10px;letter-spacing:.12em}
  .nav-links a{padding:6px 9px;font-size:10px;letter-spacing:.12em}
  .nav-links a.shop-link{padding:6px 12px}
}
@media(max-width:400px){
  .nav{gap:8px;font-size:9.5px;letter-spacing:.05em}
  .nav-links{gap:0}
  .nav-links a{padding:5px 6px;font-size:9.5px;letter-spacing:.05em}
  .nav-links a.shop-link{padding:5px 8px}
}
</style>`;

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
header.site nav{display:flex;gap:18px;align-items:center}header.site a{color:var(--dim);text-decoration:none}header.site a:hover{color:var(--green)}
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
<header class="site"><a class="brand" href="/">ECO EMO</a><nav><a href="/agency-den">AGENCY DEN</a><a href="/?page=shop">SHOP</a></nav></header>
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
.tree.ee-tree{position:relative;display:block;width:100%;max-width:520px;margin:0 auto;min-height:0;background:none}
.tree.ee-tree img{display:block;width:100%;height:auto;max-height:520px;object-fit:contain;animation:ee-breathe 11s ease-in-out infinite;filter:drop-shadow(0 10px 34px rgba(74,155,122,.18))}
.tree.ee-tree::after{display:none}
@keyframes ee-breathe{0%,100%{opacity:.92;transform:scale(1)}50%{opacity:1;transform:scale(1.012)}}
@media(prefers-reduced-motion:reduce){.tree.ee-tree img{animation:none;opacity:1}}
</style>`;

function brandLayer(html, opts) {
  let out = injectMembershipLink(html);

  // typed EE monogram in the header -> the scorched mini logo
  out = out.replace(
    /(class="brand"[\s\S]{0,600}?)EE(<\/span>)/,
    '$1<img class="ee-logo" src="' + SCORCHED_LOGO + '" alt="Eco Emo">$2'
  );

  // The legacy AR tree was an inline SVG repainted by a CSS background plus a drip
  // pseudo-element. Swap the whole layered stack for one standalone asset.
  if (opts && opts.den) {
    out = out.replace(/<svg[^>]*class="tree"[\s\S]*?<\/svg>/, TREE_STANDALONE_IMG);
  }

  const inject = M_FONTS + BRAND_CSS + LAYOUT_CSS + M_CSS + ((opts && opts.den) ? DEN_CSS : "");
  out = out.includes("</head>") ? out.replace("</head>", inject + "</head>") : inject + out;

  // Legal registry belongs in the footer only (Chris, Nov 15). PublicSite keeps the
  // old flat row of ?page= links; swap it for the real registry cluster.
  out = out.replace('<div class="footer-links" style="margin-top:8px;"><a href="?page=terms">Terms</a><a href="?page=privacy">Privacy</a><a href="?page=refund">Refunds</a><a href="?page=shipping">Shipping</a><a href="?page=faq">FAQ</a></div>', LEGAL_FOOT);
  out = out.replace(/href="\?page=terms"/g, 'href="/legal?doc=terms"');
  out = out.replace(/href="\?page=privacy"/g, 'href="/legal?doc=privacy"');
  out = out.replace(/href="\?page=refund"/g, 'href="/legal?doc=returns"');
  out = out.replace(/href="\?page=shipping"/g, 'href="/legal?doc=shipping"');
  out = out.replace(/href="\?page=faq"/g, 'href="/legal?doc=terms"');
  // pages that carry their own footer markup get the cluster once, before </body>
  if (!out.includes('class="ee-legalfoot"')) {
    if (out.includes("</footer>")) out = out.replace("</footer>", LEGAL_FOOT + "</footer>");
    else if (out.includes("</body>")) out = out.replace("</body>", LEGAL_FOOT + "</body>");
  }

  // Labs link on every page, including the ones with their own nav (den tier pages, shop)
  if (!out.includes('href="/labs"')) {
    if (out.includes("</nav>")) {
      out = out.replace("</nav>", '<a href="/labs">Labs</a></nav>');
    } else if (out.includes("</footer>")) {
      out = out.replace("</footer>", '<div style="text-align:center;padding:18px 0;font-family:Oswald,sans-serif;font-size:10px;letter-spacing:2.5px"><a href="/labs" style="color:#5a5448;text-decoration:none">LABS</a></div></footer>');
    }
  }

  // the fixed Spotify radio bar is gone (Chris, Nov 14: non functional clutter)
  out = out.replace(/<div class="spotify-bar"[\s\S]*?<\/iframe><\/div>/, "");

  // a torn-rip divider after the header, only on full pages that have one
  if (out.includes("</header>") && !out.includes("ee-divider")) {
    out = out.replace("</header>", "</header><div class=" + '"ee-divider"' + "></div>");
  }

  // absolute links that leaked the backend host out of the shop function
  out = out.replace(/https:\/\/base44\.app\//g, "/");

  // primary portals live on root slugs now
  out = out.replace(/href="\?page=shop"/g, 'href="/shop"');
  out = out.replace(/href="\?page=music"/g, 'href="/vault"');
  out = out.replace(/href="\?page=membership"/g, 'href="/membership"');

  // Persistent portal rail + kinetic dispatch ticker, once per document
  if (!out.includes('class="ee-rail"')) {
    const chrome = portalRail() + ticker();
    out = /<body[^>]*>/i.test(out)
      ? out.replace(/<body[^>]*>/i, function (m) { return m + chrome; })
      : chrome + out;
  }

  if (!out.includes("ee-metalcore-js")) {
    out = out.includes("</body>") ? out.replace("</body>", M_JS + "</body>") : out + M_JS;
  }

  // product photography re-plated onto obsidian (white studio bg flood-filled out)
  if (!out.includes("__eePlated")) {
    out = out.includes("</body>") ? out.replace("</body>", PLATED + "</body>") : out + PLATED;
  }
  return out;
}

function escapeHtml(s) {
  return (s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

async function runDailyTasks(env) {
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

  // Publish the generated captions to every configured network. Isolated like the rest:
  // a dead token logs PUBLISH_DAILY <network>=skipped and never blocks the pipeline.
  const socialPosts = results.social && results.social.posts ? results.social.posts : null;
  try {
    results.publish = await publishDaily(env || {}, socialPosts, false);
  } catch (e) {
    results.publish = { error: String(e) };
    console.error("PUBLISH_FAIL " + String(e));
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

// ─── API LAYER (grafted from the API-only worker deployed 2026-11-15 08:13Z) ───
async function handleApi(request, env, ctx, url, path) {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders() });
  }
  try {
  // 1. Sync Real Endling "Solastalgia" Tracklist to Base44 (Wipes/Replaces Fake Tracks)
  if (path === "/api/sync-music" && (request.method === "POST" || request.method === "GET")) {
    const result = await syncEndlingSolastalgia(env);
    return jsonResponse({ ok: true, synced_tracks: result.count, skipped: result.skipped, album: "Solastalgia" });
  }

  // 2. Direct Audio Stream Proxy for Google Drive Audio Files (/api/stream-audio?id=FILE_ID)
  if (path === "/api/stream-audio" && request.method === "GET") {
    const fileId = url.searchParams.get("id");
    if (!fileId) return jsonResponse({ error: "Missing Google Drive file id" }, 400);
    if (fileId.startsWith("REPLACE_WITH_")) return jsonResponse({ error: "Drive file ID not configured yet" }, 503);
    return await streamGoogleDriveAudio(fileId);
  }

  // 3. Full Paginated Printify Catalog Sync
  if (path === "/api/sync-printify" && (request.method === "POST" || request.method === "GET")) {
    const result = await syncAllPrintifyProducts(env);
    return jsonResponse({ ok: true, synced_products: result.count });
  }

  // 4. Printify Webhook Receiver
  if (path === "/api/webhooks/printify" && request.method === "POST") {
    const payload = await request.json();
    ctx.waitUntil(syncAllPrintifyProducts(env));
    return jsonResponse({ received: true, event: payload?.type || "printify_event" });
  }

  // 5. Unified Stripe & PayPal Checkout
  if (path === "/api/checkout" && request.method === "POST") {
    const body = await request.json();
    if (body.provider === "paypal" && !env.PAYPAL_CLIENT_ID) {
      return jsonResponse({ ok: false, error: "PayPal is not configured on this worker." }, 503);
    }
    if (body.provider !== "paypal" && !env.STRIPE_SECRET_KEY) {
      return jsonResponse({ ok: false, error: "Stripe is not configured on this worker. The live shop checks out through the Base44 shopCheckout function." }, 503);
    }
    if (body.provider === "paypal") {
      const order = await createPayPalOrder(env, body);
      return jsonResponse(order);
    }
    const session = await createStripeCheckout(env, body);
    return jsonResponse(session);
  }

  // 6. Stripe Webhook -> Conservation Donation Ledger (with signature verification)
  if (path === "/api/webhooks/stripe" && request.method === "POST") {
    const sig = request.headers.get("Stripe-Signature");
    if (!sig || !env.STRIPE_WEBHOOK_SECRET) {
      return jsonResponse({ error: "Webhook signature verification not configured" }, 400);
    }
    const rawBody = await request.text();
    const verified = await verifyStripeSignature(rawBody, sig, env.STRIPE_WEBHOOK_SECRET);
    if (!verified) {
      return jsonResponse({ error: "Invalid webhook signature" }, 400);
    }
    const event = JSON.parse(rawBody);
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const amountTotal = (session.amount_total || 0) / 100;
      const donationUsd = Number((amountTotal * 0.15).toFixed(2));
      ctx.waitUntil(
        postToBase44Entity(env, "DonationLedger", [
          {
            order_id: session.id,
            species: session.metadata?.species || "Honey Bee & Pollinator Habitats",
            partner_org: session.metadata?.conservation_org || "EcoEmo Conservation Fund",
            amount_usd: donationUsd,
            status: "accrued",
          },
        ])
      );
    }
    return jsonResponse({ received: true });
  }

  // 7. Freelance & Agency Den Inquiry Endpoint
  if (path === "/api/inquiry" && request.method === "POST") {
    const inquiry = await request.json();
    await postToBase44Entity(env, "Inquiry", [inquiry]);
    return jsonResponse({ ok: true, message: "Inquiry logged." });
  }


    return null;
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message }, 500);
  }
}

async function verifyStripeSignature(rawBody, sigHeader, secret) {
  const parts = sigHeader.split(",").reduce((acc, part) => {
    const [k, v] = part.split("=");
    acc[k] = v;
    return acc;
  }, {});
  const timestamp = parts["t"];
  const signature = parts["v1"];
  if (!timestamp || !signature) return false;
  const age = Math.floor(Date.now() / 1000) - parseInt(timestamp, 10);
  if (age > 300 || age < -300) return false;
  const signedPayload = timestamp + "." + rawBody;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const expected = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload));
  const expectedHex = [...new Uint8Array(expected)].map((b) => b.toString(16).padStart(2, "0")).join("");
  if (expectedHex.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expectedHex.length; i++) {
    diff |= expectedHex.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

async function streamGoogleDriveAudio(fileId) {
  const driveUrl = "https://drive.google.com/uc?export=download&confirm=yes&id=" + encodeURIComponent(fileId);
  const audioRes = await fetch(driveUrl, { redirect: "follow" });
  const contentType = audioRes.headers.get("Content-Type") || "";
  if (contentType.includes("text/html") && audioRes.status === 200) {
    const html = await audioRes.text();
    const confirmMatch = html.match(/confirm=([a-zA-Z0-9_-]+)/);
    if (confirmMatch) {
      const retryUrl = "https://drive.google.com/uc?export=download&confirm=" + confirmMatch[1] + "&id=" + encodeURIComponent(fileId);
      const retryRes = await fetch(retryUrl, { redirect: "follow" });
      const retryCt = retryRes.headers.get("Content-Type") || "";
      if (!retryCt.includes("text/html")) {
        return buildAudioResponse(retryRes);
      }
    }
    return jsonResponse({ error: "Unable to retrieve audio file" }, 502);
  }
  return buildAudioResponse(audioRes);
}

function buildAudioResponse(audioRes) {
  const headers = new Headers(audioRes.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Cache-Control", "public, max-age=86400");
  return new Response(audioRes.body, { status: audioRes.status, headers });
}

async function syncEndlingSolastalgia(env) {
  const trackDefs = [
    { title: "Requiem for the Light", tier: "roots", duration: "4:18", envKey: "TRACK_1_URL", species_focus: "Nocturnal Pollinators & Dark-Sky Habitats", lyrics: "Shadows lengthen across the cleared ridge / Beneath the ash, the roots still hold..." },
    { title: "Iron and Ivy", tier: "roots", duration: "3:54", envKey: "TRACK_2_URL", species_focus: "Old-Growth Forest Reclamation", lyrics: "Rusted steel gives way to creeping green / Every fracture splits the concrete seam..." },
    { title: "The Endling's Solitude", tier: "trunk", duration: "4:42", envKey: "TRACK_3_URL", species_focus: "Last-of-Kind Endangered Species", lyrics: "Calling out across an empty frequency / The final echo of a vanished lineage..." },
    { title: "Drowning in Ghost Threads", tier: "trunk", duration: "3:49", envKey: "TRACK_4_URL", species_focus: "Vaquita Porpoise & Ghost-Net Marine Defense", lyrics: "Tangled in the drifting nylon veil / Beneath the tide where silent silhouettes pale..." },
    { title: "Echoes of the Ancient Giants", tier: "canopy", duration: "5:11", envKey: "TRACK_5_URL", species_focus: "Redwood & Canopy Megafauna", lyrics: "Towers of timber breathing in the mist / Centuries etched into every ring..." },
    { title: "Ash on the Solstice", tier: "canopy", duration: "4:35", envKey: "TRACK_6_URL", species_focus: "Wildfire Recovery & Honey Bee Corridors", lyrics: "From blackened soil the first wild blossoms rise / Embers fade into the solstice skies..." },
  ];
  const coverArt = "https://ecoemo.store/assets/moth-favicon.png";
  const tracks = [];
  let skipped = 0;
  for (const def of trackDefs) {
    let audioUrl = env[def.envKey];
    if (!audioUrl) {
      const driveId = env[def.envKey + "_DRIVE_ID"];
      if (driveId && !driveId.startsWith("REPLACE_WITH_")) {
        audioUrl = "https://ecoemo.store/api/stream-audio?id=" + encodeURIComponent(driveId);
      }
    }
    if (!audioUrl) { skipped++; continue; }
    tracks.push({ title: def.title, tier: def.tier, duration: def.duration, audio_url: audioUrl, cover_art: coverArt, species_focus: def.species_focus, lyrics: def.lyrics });
  }
  if (env.BASE44_API_URL && env.BASE44_API_KEY && tracks.length > 0) {
    await upsertBase44Entities(env, "Track", tracks, "title");
  }
  return { count: tracks.length, skipped };
}

async function syncAllPrintifyProducts(env) {
  const shopId = env.PRINTIFY_SHOP_ID || "28608254";
  const token = env.PRINTIFY_API_TOKEN;
  if (!token) throw new Error("Missing PRINTIFY_API_TOKEN");
  let page = 1;
  let allProducts = [];
  while (true) {
    const res = await fetch("https://api.printify.com/v1/shops/" + shopId + "/products.json?limit=50&page=" + page, {
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Printify API error: " + res.status);
    const data = await res.json();
    const items = data.data || [];
    if (items.length === 0) break;
    allProducts = allProducts.concat(items);
    if (!data.next_page_url) break;
    page++;
  }
  const normalized = allProducts.map((p) => {
    const images = Array.isArray(p.images) ? p.images : [];
    const backImg = images.find((img) => img.position === "back" && img.is_default) || images.find((img) => img.position === "back");
    const frontImg = images.find((img) => img.position === "front" && img.is_default) || images.find((img) => img.position === "front");
    const fallbackImg = images.find((img) => img.is_default) || images[0];
    const primaryImage = (backImg?.src || fallbackImg?.src || "").trim();
    const secondaryImage = (frontImg?.src || fallbackImg?.src || primaryImage).trim();
    const enabledVariants = (p.variants || []).filter((v) => v.is_enabled);
    const minPriceCents = enabledVariants.length > 0 ? Math.min(...enabledVariants.map((v) => v.price)) : 2999;
    const textBlob = (p.title + " " + (p.tags || []).join(" ") + " " + (p.description || "")).toLowerCase();
    let tier = "trunk";
    if (textBlob.includes("root") || textBlob.includes("degradation")) tier = "roots";
    else if (textBlob.includes("canopy") || textBlob.includes("reclamation")) tier = "canopy";
    let merch_line = "ecoemo";
    let is_featured_species = false;
    let species = "EcoEmo Core";
    if (textBlob.includes("bee") || textBlob.includes("honey") || textBlob.includes("pollinator")) { merch_line = "species"; is_featured_species = true; species = "Honey Bee"; }
    else if (textBlob.includes("vaquita")) { merch_line = "species"; species = "Vaquita Porpoise"; }
    else if (textBlob.includes("fishing cat")) { merch_line = "species"; species = "Fishing Cat"; }
    else if (textBlob.includes("species") || textBlob.includes("wolf") || textBlob.includes("owl") || textBlob.includes("panther")) { merch_line = "species"; species = "Endangered Species"; }
    else if (textBlob.includes("endling") || textBlob.includes("solastalgia") || textBlob.includes("band")) { merch_line = "endling"; species = "Endling Project"; }
    else if ((textBlob.includes("eco") && !textBlob.includes("ecoemo")) || textBlob.includes("recycled") || textBlob.includes("net")) { merch_line = "eco"; species = "Sustainable Eco Gear"; }
    let category = "apparel";
    if (textBlob.includes("slide") || textBlob.includes("sandal")) category = "slides";
    else if (textBlob.includes("pin") || textBlob.includes("sunglass") || textBlob.includes("hat") || textBlob.includes("bag")) category = "accessories";
    else if (textBlob.includes("cushion") || textBlob.includes("pillow") || textBlob.includes("print") || textBlob.includes("poster")) category = "home-art";
    return {
      printify_id: String(p.id), title: p.title, description: (p.description || "").replace(/<[^>]*>?/gm, ""),
      price: Number((minPriceCents / 100).toFixed(2)), tier, merch_line, is_featured_species, category, species,
      conservation_org: is_featured_species ? "Pollinator & Honey Bee Defense Partners" : "Verified Habitat & Species Partners",
      donation_percent: 15, primary_image: primaryImage, secondary_image: secondaryImage,
      variants: enabledVariants.map((v) => ({ id: v.id, title: v.title, price: Number((v.price / 100).toFixed(2)) })),
      in_stock: enabledVariants.length > 0,
    };
  });
  if (env.BASE44_API_URL && env.BASE44_API_KEY && normalized.length > 0) {
    await upsertBase44Entities(env, "Product", normalized, "printify_id");
  }
  return { count: normalized.length };
}

async function createStripeCheckout(env, body) {
  const params = new URLSearchParams();
  params.append("mode", "payment");
  params.append("success_url", "https://ecoemo.store/shop?checkout=success");
  params.append("cancel_url", "https://ecoemo.store/shop?checkout=cancelled");
  params.append("shipping_address_collection[allowed_countries][0]", "US");
  params.append("shipping_address_collection[allowed_countries][1]", "CA");
  params.append("shipping_address_collection[allowed_countries][2]", "GB");
  params.append("shipping_address_collection[allowed_countries][3]", "AU");
  (body.items || []).forEach((item, idx) => {
    params.append("line_items[" + idx + "][price_data][currency]", "usd");
    params.append("line_items[" + idx + "][price_data][product_data][name]", item.title);
    if (item.image) params.append("line_items[" + idx + "][price_data][product_data][images][0]", item.image);
    params.append("line_items[" + idx + "][price_data][unit_amount]", String(Math.round(item.price * 100)));
    params.append("line_items[" + idx + "][quantity]", String(item.quantity || 1));
  });
  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: "Bearer " + env.STRIPE_SECRET_KEY, "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  return await res.json();
}

async function createPayPalOrder(env, body) {
  const auth = btoa(env.PAYPAL_CLIENT_ID + ":" + env.PAYPAL_SECRET);
  const tokenRes = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: { Authorization: "Basic " + auth, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  const { access_token } = await tokenRes.json();
  const total = (body.items || []).reduce((sum, i) => sum + i.price * (i.quantity || 1), 0).toFixed(2);
  const orderRes = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
    method: "POST",
    headers: { Authorization: "Bearer " + access_token, "Content-Type": "application/json" },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{ amount: { currency_code: "USD", value: total }, description: "EcoEmo Conservation Merch" }],
      application_context: { return_url: "https://ecoemo.store/shop?checkout=success", cancel_url: "https://ecoemo.store/shop?checkout=cancelled" },
    }),
  });
  return await orderRes.json();
}

async function publishDailySpeciesTidbit(env) {
  if (!env.BASE44_API_URL || !env.BASE44_API_KEY) return;
  const today = new Date().toISOString().split("T")[0];
  const pick = {
    title: "Featured Species Spotlight: Protecting Native & Honey Bee Pollinators",
    slug: "honey-bee-tidbit-" + today,
    category: "species-tidbit", species: "Honey Bee",
    summary: "Pollinators sustain over 75% of flowering plants and global food crops, yet face severe pressure from pesticides and habitat loss.",
    body: "Every item in our Featured Honey Bee drop channels proceeds directly toward pesticide-free pollinator corridors and wildflower habitat restoration.",
    published_at: new Date().toISOString(),
  };
  await postToBase44Entity(env, "Article", [pick]);
}

async function upsertBase44Entities(env, entityName, records, keyField) {
  const baseUrl = env.BASE44_API_URL.replace(/\/$/, "");
  const res = await fetch(baseUrl + "/entities/" + entityName + "/upsert", {
    method: "POST",
    headers: { Authorization: "Bearer " + env.BASE44_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ key: keyField, records }),
  });
  if (!res.ok) throw new Error("Base44 Upsert Error (" + res.status + "): " + await res.text());
  return await res.json();
}

async function postToBase44Entity(env, entityName, records) {
  const baseUrl = env.BASE44_API_URL.replace(/\/$/, "");
  await fetch(baseUrl + "/entities/" + entityName, {
    method: "POST",
    headers: { Authorization: "Bearer " + env.BASE44_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(records.length === 1 ? records[0] : records),
  });
}

function corsHeaders() {
  return { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization" };
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), { status: status || 200, headers: Object.assign({}, corsHeaders(), { "Content-Type": "application/json" }) });
}
