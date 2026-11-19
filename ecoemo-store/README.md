# ecoemo-store Worker source (ecoemo.store)

This directory is the **source of the live Cloudflare Worker** behind ecoemo.store.
`worker.js` is the entrypoint and imports its page modules from the same folder, so all
files here are required to build:

```
worker.js                entrypoint: fetch() router + scheduled() cron handler
pages-bundle.js          PAGES: legacy ?page= renderers (home, shop, articles, species)
homesections.js          HOME_CSS / HOME_HTML / HOME_JS (apex page)
metalcore.js             M_FONTS, M_CSS, M_JS, portalRail, ticker, LEGAL_FOOT (shared shell)
shopui.js                SHOP_UI (shop grid, filters, size selectors)
plated.js                PLATED (product card decoration)
arcade.js                ARCADE_PAGE (both canvas cabinets)
vault.js                 vaultPage() (Endling Vault audio deck)
portals.js               legalPage() / freelancePage() / conservationPage()
media-grave-beacon.js    GRAVE_BEACON_B64 (self-hosted 1400px product photo, base64)
cloudflare.config.ts     cf CLI config: name, account, routes, cron, compatibility date
```

## Live state this source produces

- Worker: `ecoemo-store`, account `a555bbda848e681e78adfd9d6f15f1d8`
- Version `50f20771-635d-499e-b674-80d2e6723d43` (100%), deployed 2026-11-16T21:00Z,
  message *"api: honest 503 when stripe/paypal secrets absent on the edge worker"*
- Cron: single trigger `0 14 * * *` (08:00 CT) -> generateDailyTidbit,
  dailyPayoutSummary, tiktokScriptGenerator, generateSocialPosts
- Routes: `ecoemo.store/*` and `*.ecoemo.store/*`

## The Nov 16 fix

A version deployed straight through the API (`e5f5fc4d`) had replaced the whole storefront
with an API-only Worker that proxied every page to BASE44_ORIGIN_URL, so all nine routes
served the Base44 app shell. The repair kept the API work by grafting its six routes into
`worker.js` as `handleApi()` behind a `GRAFTED_API` allowlist:

`/api/sync-music`, `/api/stream-audio`, `/api/sync-printify`, `/api/webhooks/printify`,
`/api/checkout`, `/api/webhooks/stripe`

Our own endpoints (`/api/impact`, `/api/shop-meta`, `/api/inquiry`, `/api/social/*`,
`/api/cron/run`) stay untouched, and every page still renders from the modules above.
The grafted checkout / stripe-webhook routes return an honest 503 until
`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` and `PAYPAL_CLIENT_ID` exist as Worker
secrets; the live shop checks out through Base44 `shopCheckout` in the meantime.

## Deploying from here

```
cd ecoemo-store
printf 'y\n' | script -qec "cf deploy --message '<what changed>'" /dev/null
```

`cf deploy` is strict about a Worker last updated through the script API, which is why the
pty wrapper is needed in a non-TTY shell. `cf deploy --dry-run` builds without uploading.
Never commit `.social-key.txt` or any token: those live in Worker secrets only.
