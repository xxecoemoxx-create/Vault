// ─────────────────────────────────────────────────────────────────────────────
// ECO EMO — CX AGENT (Cloudflare Worker)
//
// Keeps the customer experience on par without a human in the loop:
//   GET  /                      human dashboard: the current CX scorecard
//   GET  /api/cx/scorecard      machine-readable audit of the storefront
//   POST /api/cx/feedback       visitor pulse: {segment, rating 1-5, note}
//   GET  /api/cx/feedback/summary  aggregate pulse by audience segment
//   GET  /api/cx/health         liveness
//   cron (weekly)               audit, store the report, alert when below floor
//
// The audit reads the live HTML plus the stylesheets that page actually ships,
// so it scores the cascade visitors get, not a copy of the source.
// ─────────────────────────────────────────────────────────────────────────────

import { auditPage, summarizeFeedback } from "./cx-rubric.js";

const USER_AGENT = "ecoemo-cx-agent/1.0 (+https://ecoemo.store)";
const FEEDBACK_TTL = 60 * 60 * 24 * 30;
const REPORT_CACHE_MS = 60 * 1000;

// In-isolate fallback so the agent is useful before a KV namespace is bound.
const memory = { feedback: [], report: null, cachedAt: 0 };

function json(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders
    }
  });
}

function cors(extra = {}) {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    ...extra
  };
}

const target = (env) => (env && env.CX_TARGET_URL) || "https://ecoemo.store/";

function stylesheetHrefs(html, base) {
  const out = [];
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  for (const tag of tags) {
    if (!/rel=["']?stylesheet/i.test(tag)) continue;
    const href = (tag.match(/href=["']([^"']+)["']/i) || [])[1];
    if (!href) continue;
    try {
      const resolved = new URL(href, base);
      if (resolved.origin === new URL(base).origin) out.push(resolved.toString());
    } catch (error) {
      /* ignore malformed hrefs */
    }
  }
  return out.slice(0, 4);
}

async function runAudit(env, { fresh = false } = {}) {
  const now = Date.now();
  if (!fresh && memory.report && now - memory.cachedAt < REPORT_CACHE_MS) {
    return memory.report;
  }

  const url = target(env);
  const started = Date.now();

  let response;
  try {
    response = await fetch(url, {
      headers: { "user-agent": USER_AGENT, accept: "text/html,application/xhtml+xml" },
      redirect: "follow",
      signal: AbortSignal.timeout(9000)
    });
  } catch (error) {
    return {
      ok: false,
      url,
      error: `Could not reach the storefront: ${error.message}`,
      fetchedAt: new Date(now).toISOString()
    };
  }

  const html = await response.text();

  const css = (
    await Promise.all(
      stylesheetHrefs(html, url).map(async (href) => {
        try {
          const sheet = await fetch(href, {
            headers: { "user-agent": USER_AGENT },
            signal: AbortSignal.timeout(6000)
          });
          return sheet.ok ? await sheet.text() : "";
        } catch (error) {
          return "";
        }
      })
    )
  ).join("\n");

  const report = auditPage({
    url,
    status: response.status,
    html,
    css,
    ms: Date.now() - started,
    fetchedAt: new Date(now).toISOString()
  });

  memory.report = report;
  memory.cachedAt = now;

  if (env && env.CX_KV) {
    try {
      await env.CX_KV.put("report:latest", JSON.stringify(report), {
        expirationTtl: FEEDBACK_TTL
      });
    } catch (error) {
      /* a KV hiccup must not break the audit */
    }
  }

  return report;
}

async function saveFeedback(env, entry) {
  const key = `feedback:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  if (env && env.CX_KV) {
    await env.CX_KV.put(key, JSON.stringify(entry), { expirationTtl: FEEDBACK_TTL });
    return true;
  }
  memory.feedback.push(entry);
  if (memory.feedback.length > 200) memory.feedback.shift();
  return false;
}

async function loadFeedback(env) {
  if (env && env.CX_KV) {
    const listed = await env.CX_KV.list({ prefix: "feedback:", limit: 200 });
    const entries = await Promise.all(
      listed.keys.map(async (item) => {
        const raw = await env.CX_KV.get(item.name);
        try {
          return raw ? JSON.parse(raw) : null;
        } catch (error) {
          return null;
        }
      })
    );
    return entries.filter(Boolean);
  }
  return memory.feedback.slice();
}

async function collectFeedback(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return json({ ok: false, error: "Body must be JSON." }, 400, cors());
  }

  const rating = Number(body.rating);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return json({ ok: false, error: "rating must be 1–5." }, 400, cors());
  }

  const segment = String(body.segment || "unspecified")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .slice(0, 40) || "unspecified";

  const entry = {
    segment,
    rating: Math.round(rating),
    note: String(body.note || "").slice(0, 280),
    at: new Date().toISOString()
  };

  const durable = await saveFeedback(env, entry);
  return json({ ok: true, stored: durable ? "kv" : "memory", entry }, 202, cors());
}

function bar(score) {
  const hue = score >= 85 ? "#4ADE80" : score >= 70 ? "#E4C46F" : "#E4696F";
  return `<span class="bar"><span style="width:${Math.max(2, score)}%;background:${hue}"></span></span>`;
}

function dashboard(report, feedback) {
  if (!report.ok) {
    return `<!DOCTYPE html><html lang="en"><meta charset="utf-8"><title>CX agent — storefront unreachable</title>
<body style="background:#070709;color:#efece4;font-family:ui-monospace,monospace;padding:48px">
<h1 style="font-size:20px;letter-spacing:.2em">CX AGENT // STOREFRONT UNREACHABLE</h1>
<p style="color:#E4696F">${report.error}</p>
<p style="color:#a8a49a">Target: ${report.url}</p></body></html>`;
  }

  const dims = report.dimensions
    .map(
      (d) => `<tr><td class="dl">${d.label}</td><td class="db">${bar(d.score)}</td>
      <td class="dv">${d.score}</td></tr>`
    )
    .join("");

  const segments = report.demographics
    .map(
      (s) => `<article class="card">
        <p class="aud">${s.audience}</p>
        <h3>${s.label}</h3>
        <p class="score ${s.score >= 80 ? "good" : s.score >= 65 ? "ok" : "bad"}">${s.score}</p>
        <p class="note">${s.note}</p>
        ${s.gaps.length ? `<p class="gaps">Watch: ${s.gaps.slice(0, 3).join(" · ")}</p>` : `<p class="gaps good">No gaps detected</p>`}
      </article>`
    )
    .join("");

  const recs = report.recommendations
    .map(
      (r, i) => `<li><span class="pri ${r.priority}">${r.priority}</span>
      <span><b>${r.check}</b> <em>(${r.dimension})</em><br><span class="fix">${r.action}</span></span></li>`
    )
    .join("") || `<li><span class="fix">Nothing flagged. Keep it that way.</span></li>`;

  const pulse = feedback.total
    ? `<p class="pulse">${feedback.total} visitor ratings · average ${feedback.average}/5 ·
       ${feedback.segments.map((s) => `${s.segment} ${s.average}`).join(" · ")}</p>`
    : `<p class="pulse">No visitor ratings yet. POST {segment, rating, note} to /api/cx/feedback.</p>`;

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>CX agent — ${report.overall}/100</title>
<style>
  :root{--tar:#070709;--bark:#111215;--bone:#efece4;--dim:#a8a49a;--moss:#1E4D36;--lichen:#4ADE80;--ember:#E4696F}
  *{box-sizing:border-box}
  body{margin:0;background:var(--tar);color:var(--bone);font-family:"Plus Jakarta Sans",system-ui,sans-serif;line-height:1.6}
  .wrap{max-width:1080px;margin:0 auto;padding:36px 22px 64px}
  .top{display:flex;flex-wrap:wrap;align-items:flex-end;gap:18px;border-bottom:1px solid rgba(239,236,228,.14);padding-bottom:18px}
  .k{font-family:ui-monospace,monospace;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:var(--ember)}
  h1{margin:6px 0 0;font-size:clamp(22px,4vw,32px);letter-spacing:.06em;text-transform:uppercase}
  .meta{margin-left:auto;font-family:ui-monospace,monospace;font-size:11px;letter-spacing:.1em;color:var(--dim);text-align:right}
  .hero-score{display:flex;align-items:baseline;gap:14px;margin:26px 0 6px}
  .hero-score b{font-size:clamp(56px,11vw,92px);line-height:.9;color:var(--lichen)}
  .hero-score span{font-family:ui-monospace,monospace;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--dim)}
  table{width:100%;border-collapse:collapse;margin-top:18px}
  td{padding:10px 6px;border-bottom:1px solid rgba(239,236,228,.08);vertical-align:middle}
  .dl{width:34%;font-size:15px}
  .dv{width:52px;text-align:right;font-family:ui-monospace,monospace;font-size:13px;color:var(--dim)}
  .bar{display:block;height:7px;background:rgba(239,236,228,.08);position:relative}
  .bar span{position:absolute;inset:0 auto 0 0;display:block}
  h2{font-size:13px;font-family:ui-monospace,monospace;letter-spacing:.24em;text-transform:uppercase;color:var(--lichen);margin:44px 0 6px}
  .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin-top:14px}
  .card{border:1px solid rgba(239,236,228,.14);background:rgba(17,18,21,.7);padding:16px}
  .aud{margin:0;font-family:ui-monospace,monospace;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--dim)}
  .card h3{margin:6px 0 2px;font-size:15px;letter-spacing:.02em}
  .score{margin:4px 0;font-family:ui-monospace,monospace;font-size:30px;line-height:1}
  .good{color:var(--lichen)}.ok{color:#E4C46F}.bad{color:var(--ember)}
  .note{margin:6px 0;color:var(--dim);font-size:13.5px}
  .gaps{margin:8px 0 0;font-family:ui-monospace,monospace;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--ember)}
  ul.recs{list-style:none;margin:14px 0 0;padding:0;display:grid;gap:10px}
  ul.recs li{display:flex;gap:12px;border-left:2px solid rgba(74,222,128,.4);padding:6px 0 6px 14px}
  .pri{flex:none;font-family:ui-monospace,monospace;font-size:9px;letter-spacing:.14em;text-transform:uppercase;padding:3px 6px;height:fit-content;border:1px solid currentColor}
  .pri.high{color:var(--ember)}.pri.medium{color:#E4C46F}
  .fix{color:var(--dim);font-size:14px}
  em{font-style:normal;color:var(--dim);font-size:12px;font-family:ui-monospace,monospace}
  .pulse{font-family:ui-monospace,monospace;font-size:11.5px;letter-spacing:.06em;color:var(--dim)}
  footer{margin-top:48px;padding-top:18px;border-top:1px solid rgba(239,236,228,.14);font-family:ui-monospace,monospace;font-size:11px;letter-spacing:.1em;color:var(--dim);display:flex;flex-wrap:wrap;gap:8px 20px}
</style></head><body><div class="wrap">
  <div class="top">
    <div><p class="k">Eco Emo · CX agent</p><h1>Experience scorecard</h1></div>
    <p class="meta">${report.url}<br>${report.fetchedAt} · ${report.ms}ms · HTTP ${report.httpStatus}</p>
  </div>
  <div class="hero-score"><b>${report.overall}</b><span>/ 100 · grade ${report.grade} · ${report.signals.words} words · ${Math.round(report.signals.bytes / 1024)}KB</span></div>
  <table>${dims}</table>

  <h2>Audience fit</h2>
  <div class="cards">${segments}</div>

  <h2>What to fix next</h2>
  <ul class="recs">${recs}</ul>

  <h2>Visitor pulse</h2>
  ${pulse}

  <footer><span>GET /api/cx/scorecard</span><span>POST /api/cx/feedback</span><span>cron: weekly</span></footer>
</div></body></html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors() });
    }

    if (path === "/api/cx/health") {
      return json({ ok: true, service: "ecoemo-cx-agent", target: target(env) });
    }

    if (path === "/api/cx/scorecard") {
      const report = await runAudit(env, { fresh: url.searchParams.get("fresh") === "1" });
      return json(report, report.ok ? 200 : 502);
    }

    if (path === "/api/cx/feedback" && request.method === "POST") {
      return collectFeedback(request, env);
    }

    if (path === "/api/cx/feedback/summary") {
      const entries = await loadFeedback(env);
      return json(summarizeFeedback(entries), 200, cors());
    }

    if (path === "/" || path === "/dashboard") {
      const [report, entries] = await Promise.all([runAudit(env), loadFeedback(env)]);
      return new Response(dashboard(report, summarizeFeedback(entries)), {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }
      });
    }

    return json(
      {
        ok: false,
        error: "Not found",
        routes: [
          "GET /",
          "GET /api/cx/scorecard",
          "POST /api/cx/feedback",
          "GET /api/cx/feedback/summary",
          "GET /api/cx/health"
        ]
      },
      404
    );
  },

  async scheduled(event, env, ctx) {
    const work = (async () => {
      const report = await runAudit(env, { fresh: true });
      const floor = Number(env && env.CX_MIN_SCORE) || 85;
      if (!report.ok) {
        console.error(`CX ALERT — storefront unreachable: ${report.error}`);
        return;
      }
      const below = report.demographics.filter((s) => s.score < floor);
      console.log(
        `CX WEEKLY — ${report.overall}/100 (${report.grade}) on ${report.url}` +
          (below.length ? ` · below floor: ${below.map((s) => `${s.key}:${s.score}`).join(", ")}` : " · all segments on par")
      );
      if (report.overall < floor) {
        console.warn(
          `CX ALERT — overall ${report.overall} under floor ${floor}. Next: ` +
            report.recommendations.map((r) => r.check).join("; ")
        );
      }
    })();
    if (ctx && ctx.waitUntil) ctx.waitUntil(work);
    else await work;
  }
};
