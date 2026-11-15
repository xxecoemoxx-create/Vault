# Agency Den AR tree — standalone asset build

- **Build:** 2026-11-14c
- **Live asset:** https://ecoemo.store/media/agency-den-tree.png?v=2026-11-14c
- **Source:** media.base44.com 466718479_generated_image.png (1024x1024 PNG)
- **Repo copy:** assets/agency-den-tree/agency-den-tree.png
- **Served by:** ecoemo-store worker, `/media/agency-den-tree.png`, immutable 1-year cache
- **Rendered by:** `TREE_STANDALONE_IMG` in worker.js — one `<img>`, no SVG, no CSS background layer, no drip pseudo-element

## Swapping the tree

1. Replace `agency-den-tree.png` in this folder.
2. Bump `TREE_BUILD` in `worker.js` (it feeds the `?v=` query).
3. `cf deploy`.

The versioned URL is what forces the cache refresh: a new `?v=` is a cache miss, the worker
refetches upstream through the edge, and the old layered graphic cannot be served from cache.
The API token in use has no Cache Purge permission, so the `?v= bump` is the refresh mechanism.
