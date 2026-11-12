/**
 * Cloudflare project configuration - ecoemo.store
 *
 * Typed config for the `cf` CLI (Cloudflare CLI, beta).
 * Verified against the live Worker on 2026-11-10 (deployment d2758671, version 30c1495b):
 *   Worker:          ecoemo-store
 *   Account:         a555bbda848e681e78adfd9d6f15f1d8
 *   Zone:            ecoemo.store (3bbfbd0038b2c692c4ec017019c8a2bc)
 *   Routes:          ecoemo.store/*  and  *.ecoemo.store/*
 *   Crons:           0 14 * * *  (daily 08:00 CT) - the weekly Monday trigger was
 *                    dropped 2026-11-10 with the obsolete productReminder function
 *   Compatibility:   2026-10-29
 *   Concurrency:     standard usage model, no bindings, no tail consumers
 *   workers.dev:     disabled (the script subdomain is off; only the zone routes serve)
 *
 * Use from this folder:
 *   cf deploy --dry-run    build + validate, no upload
 *   cf deploy              upload a new Worker version
 *   cf dev                 local dev server
 *
 * Note: `cf deploy` is strict about the Worker having been last updated through the
 * script API, so in a non-TTY shell run it as:
 *   printf 'y\n' | script -qec "cf deploy --message '...'" /dev/null
 */

export default {
  accountId: "a555bbda848e681e78adfd9d6f15f1d8",

  worker: {
    name: "ecoemo-store",

    // ES module Worker: default export with fetch() and scheduled() handlers.
    entrypoint: "./worker.js",

    // Live value, confirmed via GET /workers/scripts/ecoemo-store/settings.
    // Change deliberately: bumping this alters Workers runtime behaviour.
    compatibilityDate: "2026-10-29",

    triggers: [
      // Cron triggers - matched by event.cron inside the scheduled() handler.
      // Daily 08:00 CT: tidbit + payout summary + TikTok script + social posts.
      // This is the ONLY trigger on the live Worker. The Monday 14:00 UTC trigger
      // was removed 2026-11-10 with the obsolete Ko-fi-era productReminder function,
      // so the scheduled() handler must keep exporting for crons to fire.
      { type: "scheduled", schedule: "0 14 * * *" },

      // Zone routes - apex and every subdomain route to this Worker.
      { type: "fetch", pattern: "ecoemo.store/*", zone: "ecoemo.store" },
      { type: "fetch", pattern: "*.ecoemo.store/*", zone: "ecoemo.store" },
    ],

    // Worker logs in the dashboard (Workers Logs). Live state also has
    // invocation_logs + persisted logs on, head sampling 1.0.
    observability: { enabled: true },
  },
};
