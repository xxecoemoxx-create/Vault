# CX agent

A Cloudflare Worker that keeps the storefront's customer experience on par
without a human in the loop. It audits the live page, scores it against six
dimensions and six audience segments, and collects a visitor pulse.

## What it does

| Route | Method | Purpose |
| --- | --- | --- |
| `/` | GET | Human dashboard — the current scorecard |
| `/api/cx/scorecard` | GET | The same audit as JSON (`?fresh=1` skips the 60s cache) |
| `/api/cx/feedback` | POST | `{segment, rating: 1-5, note}` → stored in KV |
| `/api/cx/feedback/summary` | GET | Average rating per audience segment |
| `/api/cx/health` | GET | Liveness |
| cron (Mondays 13:00 UTC) | — | Fresh audit, stored report, console alert under the floor |

The audit fetches `CX_TARGET_URL` plus the same-origin stylesheets that page
links, so it scores the cascade a visitor actually receives — focus styles,
reduced-motion handling, tap-target sizing and design tokens all come from the
real CSS, not from a copy in this folder.

## Dimensions and weights

`accessibility 0.24 · clarity 0.18 · trust 0.16 · path to action 0.16 ·
craft 0.14 · weight & speed 0.12`

Each check is defined in `cx-rubric.js` with the visitor-facing reason and the
fix, so the dashboard output is directly actionable.

## Audience segments

Phone-first 18–29 · values-led 25–40 · clarity-first 40–60 · low vision &
motion sensitivity · older device / slow connection · screen reader & keyboard.
Each one scores only the checks that matter to it, so a page can be strong
overall and still fail an audience.

## Run it locally

```sh
cd workers
npx wrangler dev -c wrangler.cx.toml --local --var CX_TARGET_URL:http://localhost:3000/
```

Then open `http://localhost:8787/`. Point `CX_TARGET_URL` at whichever surface
you are reviewing.

## Deploy

```sh
npx wrangler deploy -c workers/wrangler.cx.toml
```

Without a `CX_KV` binding the agent still runs; the last report and the
feedback pulse live in the isolate's memory and reset on restart. Create a KV
namespace and uncomment the binding block in `wrangler.cx.toml` for durable
storage.

## Embedding the pulse

Any page can post to the feedback endpoint:

```js
await fetch("https://<cx-worker-host>/api/cx/feedback", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ segment: "mobile_first", rating: 4, note: "found the shop fast" })
});
```

CORS is open for these endpoints on purpose: it is an anonymous, credential-free
pulse.
