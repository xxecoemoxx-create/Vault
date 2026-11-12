// agencyDenPublish — flips Agency Den tier products to live in the shop.
// Called after Printify products exist, so nothing goes on sale that cannot be fulfilled.
// Auth: ?key=ecoemo_vault_2026
//
// Body: { items: [{ id, printify_product_id?, image_url?, name? }] }
// Behaviour per item: drop the "awaiting_approval" tag, add "published",
// set is_active = true, and write printify_product_id / image_url when supplied.

import { createClientFromRequest } from "npm:@base44/sdk";

const VAULT_KEY = "ecoemo_vault_2026";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  if (url.searchParams.get("key") !== VAULT_KEY) {
    return Response.json({ error: "forbidden" }, { status: 401 });
  }

  const base44 = createClientFromRequest(req);

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const items: any[] = Array.isArray(body.items) ? body.items : [];
  if (!items.length) {
    return Response.json({ error: "no items" }, { status: 400 });
  }
  if (items.length > 35) {
    return Response.json({ error: "max 35 items per call (entity update rate limit)" }, { status: 400 });
  }

  const results: any[] = [];

  for (const it of items) {
    if (!it?.id) {
      results.push({ ok: false, error: "missing id" });
      continue;
    }
    try {
      const rec: any = await base44.asServiceRole.entities.MerchProduct.get(it.id);
      if (!rec) {
        results.push({ id: it.id, ok: false, error: "not found" });
        continue;
      }

      const tags: string[] = (rec.tags || []).filter((t: string) => t !== "awaiting_approval");
      if (!tags.includes("published")) tags.push("published");

      const patch: any = { tags, is_active: true };
      if (it.printify_product_id) patch.printify_product_id = it.printify_product_id;
      if (it.image_url) patch.image_url = it.image_url;
      if (it.name) patch.name = it.name;

      await base44.asServiceRole.entities.MerchProduct.update(it.id, patch);
      results.push({
        id: it.id,
        ok: true,
        name: rec.name,
        printify_product_id: patch.printify_product_id || rec.printify_product_id || null,
      });
    } catch (e) {
      results.push({ id: it.id, ok: false, error: String(e) });
    }
  }

  return Response.json({
    updated: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results,
  });
});
