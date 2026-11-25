// ─────────────────────────────────────────────────────────────────────────────
// CX RUBRIC — what "the experience is on par" actually means, in code.
//
// The CX agent fetches the customer-facing page, reads the markup + the CSS the
// page actually ships, and scores it against six dimensions and six audience
// segments. Nothing here is decorative: every check maps to something a visitor
// can feel (can I read it, can I tell what to do, can I trust it, does it load).
// ─────────────────────────────────────────────────────────────────────────────

export const DIMENSIONS = [
  { key: "clarity", label: "Clarity", weight: 0.18 },
  { key: "accessibility", label: "Accessibility", weight: 0.24 },
  { key: "trust", label: "Trust & proof", weight: 0.16 },
  { key: "conversion", label: "Path to action", weight: 0.16 },
  { key: "performance", label: "Weight & speed", weight: 0.12 },
  { key: "craft", label: "Craft & voice", weight: 0.14 }
];

const p = (detail) => ({ status: "pass", detail });
const w = (detail) => ({ status: "warn", detail });
const f = (detail) => ({ status: "fail", detail });

// ── signal extraction ───────────────────────────────────────────────────────

const ENTITY = /&(?:[a-z]+|#\d+);/gi;

export function readPage(html, css) {
  const styleBlocks = html.match(/<style\b[^>]*>([\s\S]*?)<\/style>/gi) || [];
  const inlineCss = styleBlocks
    .map((block) => block.replace(/^<style\b[^>]*>/i, "").replace(/<\/style>$/i, ""))
    .join("\n");

  const stripped = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  const text = stripped.replace(ENTITY, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").filter(Boolean).length : 0;
  const sentences = Math.max(1, (text.match(/[.!?]+(?:\s|$)/g) || []).length);

  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  const links = html.match(/<a\b[^>]*>/gi) || [];
  const buttons = html.match(/<button\b[^>]*>/gi) || [];
  const inputs = html.match(/<(?:input|select|textarea)\b[^>]*>/gi) || [];
  const labels = html.match(/<label\b[^>]*>/gi) || [];
  const stylesheets = html.match(/<link\b[^>]*rel=["']?stylesheet["']?[^>]*>/gi) || [];
  const scripts = html.match(/<script\b[^>]*src=[^>]*>/gi) || [];

  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "";
  const desc = (
    html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i) || []
  )[1] || "";
  const viewport = /<meta[^>]+name=["']viewport["'][^>]*content=["'][^"']*width=device-width/i.test(html);

  const allCss = `${inlineCss}\n${css || ""}`;
  const cssHas = (re) => re.test(allCss);
  const cssVars = (allCss.match(/--[a-z0-9-]+\s*:/gi) || []).length;

  const ctaLinks = links.filter((tag) => /\b(class|data-act)=["'][^"']*(btn|button|cta|shop)/i.test(tag));
  const deadLinks = links.filter((tag) => /\bhref=["'](?:#|)["']/i.test(tag));

  const fontLinks = /fonts\.googleapis\.com|fonts\.gstatic\.com|@font-face/i.test(html + allCss);
  const fontFaces = (allCss.match(/font-family\s*:\s*["']?([^;"'}]+)/gi) || [])
    .map((m) => m.replace(/font-family\s*:\s*/i, "").replace(/["']/g, "").trim())
    .filter((family) => !/^(inherit|initial|unset)$/i.test(family));

  return {
    html,
    css: allCss,
    bytes: new TextEncoder().encode(html).length,
    inlineCssBytes: new TextEncoder().encode(inlineCss).length,
    title: title.replace(ENTITY, " ").trim(),
    desc: desc.trim(),
    lang: (/<html\b[^>]*\blang=["']([a-z-]+)["']/i.exec(html) || [])[1] || "",
    viewport,
    h1: (html.match(/<h1\b/gi) || []).length,
    h2: (html.match(/<h2\b/gi) || []).length,
    h3: (html.match(/<h3\b/gi) || []).length,
    words,
    sentences,
    imgs: imgs.length,
    imgsAlt: imgs.filter((tag) => /\balt\s*=/i.test(tag)).length,
    inputs: inputs.length,
    labels: labels.length,
    labelledInputs: inputs.filter(
      (tag) => /\b(aria-label|aria-labelledby|id)=/i.test(tag) || /\btype=["']hidden/i.test(tag)
    ).length,
    links: links.length,
    navLinks: (html.match(/<nav\b[\s\S]*?<\/nav>/i) || [""])[0].match(/<a\b/gi) || [],
    buttons: buttons.length,
    cta: ctaLinks.length + buttons.length,
    deadLinks: deadLinks.length,
    externalCss: stylesheets.filter((tag) => /^<link[^>]+href=["']https?:/i.test(tag)).length,
    scripts: scripts.length,
    main: /<main\b/i.test(html),
    nav: /<nav\b/i.test(html),
    footer: /<footer\b/i.test(html),
    skip: /href=["']#(?:main|content)["'][^>]*>\s*(?:skip|jump)/i.test(html),
    ariaLive: /\baria-live\b|\brole=["'](?:status|alert)["']/i.test(html),
    mailto: /href=["']mailto:/i.test(html),
    tel: /href=["']tel:/i.test(html),
    price: /\$\s?\d|\bprices?\b|\bUSD\b|\bcost\b/i.test(text),
    policy: /\b(shipping|returns?|refunds?|delivery)\b/i.test(text),
    privacy: /\bprivacy\b/i.test(text),
    impact: /\b(conservation|pledge|donat|proceeds|nonprofit|endangered)\b/i.test(text),
    socialProof: /\b(review|reviews|rating|trusted by|customers)\b/i.test(text),
    heroCta: /<section[^>]*hero[\s\S]{0,4000}?<(?:a|button)\b[^>]*(?:btn|cta|button|shop)/i.test(html),
    focusVisible: cssHas(/:focus-visible/),
    reducedMotion: cssHas(/prefers-reduced-motion/),
    targets: cssHas(/min-height\s*:\s*(4[4-9]|[5-9]\d)\s*px/) || cssHas(/padding\s*:\s*\d+\s+2[0-9]px/),
    bigType: cssHas(/font-size\s*:\s*(1[6-9]|2[0-4])px/),
    cssVars,
    fontLinks,
    fontFaces: fontFaces.length,
    svg: (html.match(/<svg\b/gi) || []).length,
    eyebrow: /\b(eyebrow|tagline|kicker|lede)\b/i.test(html),
    wordsPerSentence: Math.round(words / sentences)
  };
}

// ── checks ──────────────────────────────────────────────────────────────────

export const CHECKS = [
  // clarity
  {
    id: "title", dim: "clarity", weight: 3,
    label: "Page title is present and scannable",
    fix: "Write a 15–65 character <title> that names the offer, not just the brand.",
    test: (s) => {
      if (!s.title) return f("No <title> found.");
      const n = s.title.length;
      if (n >= 15 && n <= 65) return p(`${n} characters.`);
      return w(`${n} characters — aim for 15–65 so it isn't truncated in search or tabs.`);
    }
  },
  {
    id: "meta", dim: "clarity", weight: 2,
    label: "Search description sells the page",
    fix: "Add a 50–170 character meta description with the offer and the proof.",
    test: (s) => {
      if (!s.desc) return f("No meta description.");
      const n = s.desc.length;
      return n >= 50 && n <= 170 ? p(`${n} characters.`) : w(`${n} characters — aim for 50–170.`);
    }
  },
  {
    id: "h1", dim: "clarity", weight: 2,
    label: "Exactly one headline",
    fix: "Keep one <h1> per page; demote the rest to h2.",
    test: (s) => {
      if (s.h1 === 1) return p("One h1.");
      if (s.h1 === 0) return f("No h1 — nothing tells the visitor what this page is.");
      return w(`${s.h1} h1s competing for the headline.`);
    }
  },
  {
    id: "structure", dim: "clarity", weight: 1,
    label: "Content is broken into scannable sections",
    fix: "Split long stretches into h2 sections a thumb can skip through.",
    test: (s) => (s.h2 >= 2 ? p(`${s.h2} sections.`) : w(`${s.h2} section headings — the page reads as one wall.`))
  },
  {
    id: "copy", dim: "clarity", weight: 2,
    label: "Enough copy to answer questions, not so much it buries them",
    fix: "Aim for 120–1600 words of visible copy on the landing surface.",
    test: (s) => {
      if (s.words < 120) return f(`${s.words} words — too thin to answer objections.`);
      if (s.words > 1600) return w(`${s.words} words — long for a first visit.`);
      return p(`${s.words} words.`);
    }
  },
  {
    id: "reading", dim: "clarity", weight: 2,
    label: "Sentences are readable at a glance",
    fix: "Keep sentences under ~22 words so the page can be skimmed on a phone.",
    test: (s) => (s.wordsPerSentence <= 22 ? p(`${s.wordsPerSentence} words per sentence.`) : w(`${s.wordsPerSentence} words per sentence — tighten it.`))
  },

  // accessibility
  {
    id: "lang", dim: "accessibility", weight: 2,
    label: "Page declares its language",
    fix: 'Add lang="en" to <html> so screen readers use the right voice.',
    test: (s) => (s.lang ? p(`lang="${s.lang}".`) : f("No lang attribute."))
  },
  {
    id: "viewport", dim: "accessibility", weight: 3,
    label: "Renders properly on a phone",
    fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.',
    test: (s) => (s.viewport ? p("width=device-width present.") : f("No mobile viewport — the page zooms out on phones."))
  },
  {
    id: "alt", dim: "accessibility", weight: 3,
    label: "Images are described",
    fix: "Give every meaningful <img> an alt; use alt=\"\" only for decoration.",
    test: (s) => {
      if (s.imgs === 0) return p("No raster images to describe.");
      return s.imgsAlt === s.imgs ? p(`${s.imgsAlt}/${s.imgs} images have alt text.`) : f(`${s.imgs - s.imgsAlt} of ${s.imgs} images have no alt.`);
    }
  },
  {
    id: "labels", dim: "accessibility", weight: 2,
    label: "Form fields are labelled",
    fix: "Pair every input with a <label for> or an aria-label.",
    test: (s) => {
      if (s.inputs === 0) return p("No form fields on this page.");
      return s.labelledInputs >= s.inputs ? p(`${s.inputs}/${s.inputs} fields labelled.`) : f(`${s.inputs - s.labelledInputs} unlabelled field(s).`);
    }
  },
  {
    id: "landmarks", dim: "accessibility", weight: 2,
    label: "Landmarks let assistive tech jump around",
    fix: "Wrap the page in <main>, with <nav> and <footer> around the rest.",
    test: (s) => (s.main && s.nav ? p("main + nav present.") : w("Missing a <main> or <nav> landmark."))
  },
  {
    id: "skip", dim: "accessibility", weight: 1,
    label: "Keyboard users can skip the nav",
    fix: 'Add a "Skip to content" link as the first focusable element.',
    test: (s) => (s.skip ? p("Skip link present.") : w("No skip link."))
  },
  {
    id: "focus", dim: "accessibility", weight: 2,
    label: "Focus is visible on every control",
    fix: "Style :focus-visible so keyboard users can see where they are.",
    test: (s) => (s.focusVisible ? p(":focus-visible styled.") : f("No visible focus style."))
  },
  {
    id: "motion", dim: "accessibility", weight: 2,
    label: "Motion can be turned off",
    fix: "Respect prefers-reduced-motion (and ideally offer a calm toggle).",
    test: (s) => (s.reducedMotion ? p("prefers-reduced-motion handled.") : f("Animation ignores reduced-motion."))
  },
  {
    id: "live", dim: "accessibility", weight: 1,
    label: "Changing content is announced",
    fix: 'Use role="status" or aria-live="polite" for content that swaps in place.',
    test: (s) => (s.ariaLive ? p("Live region present.") : w("No live region for dynamic content."))
  },
  {
    id: "targets", dim: "accessibility", weight: 2,
    label: "Tap targets are big enough",
    fix: "Give buttons and links at least a 44px hit area.",
    test: (s) => (s.targets ? p("44px+ targets declared.") : w("No 44px target sizing found in CSS."))
  },
  {
    id: "type", dim: "accessibility", weight: 1,
    label: "Body type is large enough to read",
    fix: "Set body copy at 16px or larger.",
    test: (s) => (s.bigType ? p("Body type ≥16px.") : w("No ≥16px body size found."))
  },

  // trust
  {
    id: "contact", dim: "trust", weight: 2,
    label: "A human can be reached",
    fix: "Put a mailto: or tel: link in the footer.",
    test: (s) => (s.mailto || s.tel ? p("Direct contact link present.") : f("No mailto/tel link — the store looks unmanned."))
  },
  {
    id: "policy", dim: "trust", weight: 2,
    label: "Shipping or returns are stated",
    fix: "Link shipping, delivery or returns from the landing surface.",
    test: (s) => (s.policy ? p("Shipping/returns mentioned.") : w("No shipping or returns language."))
  },
  {
    id: "privacy", dim: "trust", weight: 1,
    label: "Privacy is addressed",
    fix: "Link a privacy notice wherever you collect an email.",
    test: (s) => (s.privacy ? p("Privacy mentioned.") : w("No privacy reference."))
  },
  {
    id: "impact", dim: "trust", weight: 2,
    label: "The impact claim is visible",
    fix: "State the conservation pledge on the page, not only on a sub-page.",
    test: (s) => (s.impact ? p("Impact claim present.") : w("The mission is invisible on this page."))
  },
  {
    id: "price", dim: "trust", weight: 2,
    label: "Money is spoken about plainly",
    fix: "Show a price or a link to priced products above the fold.",
    test: (s) => (s.price ? p("Price language present.") : w("No price signal — visitors can't judge the commitment."))
  },
  {
    id: "proof", dim: "trust", weight: 1,
    label: "Other customers exist",
    fix: "Add a review count, a press quote or a customer line.",
    test: (s) => (s.socialProof ? p("Social proof present.") : w("No social proof."))
  },

  // conversion
  {
    id: "cta", dim: "conversion", weight: 3,
    label: "There is an obvious next step",
    fix: "Keep 2–8 primary actions; more than that is noise.",
    test: (s) => {
      if (s.cta === 0) return f("No call to action.");
      if (s.cta < 2) return w("Only one action on the page.");
      if (s.cta > 8) return w(`${s.cta} actions — competing for the same click.`);
      return p(`${s.cta} actions.`);
    }
  },
  {
    id: "herocta", dim: "conversion", weight: 2,
    label: "The first screen has a way forward",
    fix: "Put a primary action inside the hero, not below the fold.",
    test: (s) => (s.heroCta ? p("Hero carries an action.") : w("No action in the first screen."))
  },
  {
    id: "dead", dim: "conversion", weight: 2,
    label: "No dead links",
    fix: 'Point href="#" links at a real destination or make them buttons.',
    test: (s) => (s.deadLinks === 0 ? p("No empty links.") : f(`${s.deadLinks} link(s) go nowhere.`))
  },
  {
    id: "nav", dim: "conversion", weight: 1,
    label: "Navigation is short and honest",
    fix: "Keep the primary nav to 4–7 destinations.",
    test: (s) => {
      const n = s.navLinks.length;
      if (n === 0) return w("No links in the primary nav.");
      if (n > 7) return w(`${n} nav links — trim to the ones that matter.`);
      return p(`${n} nav links.`);
    }
  },

  // performance
  {
    id: "bytes", dim: "performance", weight: 3,
    label: "HTML stays light",
    fix: "Keep the document under ~180KB so it paints fast on a phone.",
    test: (s) => {
      const kb = Math.round(s.bytes / 1024);
      if (kb <= 180) return p(`${kb}KB of HTML.`);
      if (kb <= 320) return w(`${kb}KB of HTML — heavy for a first paint.`);
      return f(`${kb}KB of HTML.`);
    }
  },
  {
    id: "requests", dim: "performance", weight: 2,
    label: "Few blocking requests",
    fix: "Keep external stylesheets and scripts under a dozen.",
    test: (s) => {
      const n = s.externalCss + s.scripts;
      return n <= 12 ? p(`${n} external css/script requests.`) : w(`${n} external requests.`);
    }
  },
  {
    id: "lazy", dim: "performance", weight: 1,
    label: "Images don't block the fold",
    fix: 'Add loading="lazy" (or width/height) to below-fold images.',
    test: (s) => {
      if (s.imgs === 0) return p("No raster images to defer.");
      return /loading=["']lazy["']/i.test(s.html) ? p("Lazy loading present.") : w("No lazy-loading on images.");
    }
  },
  {
    id: "inlinecss", dim: "performance", weight: 1,
    label: "Styles aren't bloating the document",
    fix: "Move large <style> blocks into a cached stylesheet.",
    test: (s) => {
      const kb = Math.round(s.inlineCssBytes / 1024);
      return kb <= 80 ? p(`${kb}KB inline CSS.`) : w(`${kb}KB inline CSS.`);
    }
  },

  // craft
  {
    id: "voice", dim: "craft", weight: 2,
    label: "The page has a voice, not just a layout",
    fix: "Give the hero an eyebrow and a line that only this brand would write.",
    test: (s) => (s.eyebrow ? p("Brand voice markers present.") : w("The hero reads generic."))
  },
  {
    id: "palette", dim: "craft", weight: 2,
    label: "The theme is a system, not one-off colours",
    fix: "Define colour and type as CSS custom properties.",
    test: (s) => (s.cssVars >= 5 ? p(`${s.cssVars} design tokens.`) : w(`${s.cssVars} CSS variables — the theme is ad hoc.`))
  },
  {
    id: "typefaces", dim: "craft", weight: 2,
    label: "Typography is chosen, not defaulted",
    fix: "Load a display face for headings and a readable face for body copy.",
    test: (s) => {
      if (s.fontLinks || s.fontFaces >= 2) return p(`${s.fontFaces} font families declared.`);
      return w("No custom typography — the page looks like a template.");
    }
  },
  {
    id: "imagery", dim: "craft", weight: 1,
    label: "There is something to look at",
    fix: "Add at least a few illustrations or photographs, not only text.",
    test: (s) => {
      const n = s.imgs + s.svg;
      return n >= 3 ? p(`${n} visual elements.`) : w(`${n} visual elements — the page is all type.`);
    }
  }
];

// ── audience segments ───────────────────────────────────────────────────────

export const SEGMENTS = [
  {
    key: "mobile_first",
    label: "First-time visitor on a phone",
    audience: "18–29",
    checks: { viewport: 3, targets: 3, cta: 2, herocta: 2, motion: 1, bytes: 2, voice: 1 },
    note: "Arrives from a link, decides in seconds, leaves if the first screen is a wall of text."
  },
  {
    key: "values",
    label: "Values-led shopper",
    audience: "25–40",
    checks: { impact: 3, price: 2, policy: 2, privacy: 1, proof: 2, contact: 1 },
    note: "Will pay more, but only after the claim is specific and the receipts are reachable."
  },
  {
    key: "clarity",
    label: "Clarity-first browser",
    audience: "40–60",
    checks: { title: 2, structure: 2, reading: 2, type: 2, contact: 2, policy: 2, dead: 2 },
    note: "Wants to know what this is, what it costs and who to email — without hunting."
  },
  {
    key: "access",
    label: "Low vision & motion sensitivity",
    audience: "all ages",
    checks: { type: 2, motion: 3, focus: 3, contrast: 2, targets: 2, alt: 2, labels: 1 },
    note: "Needs readable type, visible focus, and a way to stop the page moving."
  },
  {
    key: "low_bandwidth",
    label: "Older device or slow connection",
    audience: "global",
    checks: { bytes: 3, requests: 2, lazy: 2, inlinecss: 1, imagery: 1 },
    note: "A heavy document is a blank screen for a few seconds — and a bounce."
  },
  {
    key: "keyboard",
    label: "Screen reader & keyboard",
    audience: "all ages",
    checks: { lang: 2, landmarks: 2, skip: 2, alt: 2, labels: 2, focus: 3, live: 1, structure: 1 },
    note: "Navigates by landmarks and headings; silent content does not exist for them."
  }
];

// ── scoring ─────────────────────────────────────────────────────────────────

function ratio(results, ids) {
  const picked = results.filter((r) => !ids || ids.includes(r.id));
  const total = picked.reduce((sum, r) => sum + r.weight, 0);
  if (!total) return 0;
  const earned = picked.reduce(
    (sum, r) => sum + r.weight * (r.status === "pass" ? 1 : r.status === "warn" ? 0.5 : 0),
    0
  );
  return Math.round((earned / total) * 100);
}

function grade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export function auditPage({ url, status, html, css, ms, fetchedAt }) {
  const signals = readPage(html, css);
  const results = CHECKS.map((check) => {
    const outcome = check.test(signals);
    return {
      id: check.id,
      dimension: check.dim,
      weight: check.weight,
      label: check.label,
      fix: check.fix,
      status: outcome.status,
      detail: outcome.detail
    };
  });

  const dimensions = DIMENSIONS.map((dim) => {
    const own = results.filter((r) => r.dimension === dim.key);
    return {
      key: dim.key,
      label: dim.label,
      weight: dim.weight,
      score: ratio(results, own.map((r) => r.id)),
      findings: own.map((r) => ({ id: r.id, label: r.label, status: r.status, detail: r.detail }))
    };
  });

  const overall = Math.round(
    dimensions.reduce((sum, d) => sum + d.score * d.weight, 0)
  );

  const byId = new Map(results.map((r) => [r.id, r]));

  const demographics = SEGMENTS.map((segment) => {
    const ids = Object.keys(segment.checks);
    // "contrast" is a placeholder for palette contrast; treat as covered when the
    // page ships design tokens (the audit cannot compute rendered contrast).
    const resolved = ids.map((id) => byId.get(id) || {
      id,
      label: "Palette contrast",
      status: signals.cssVars >= 5 ? "pass" : "warn",
      detail: signals.cssVars >= 5 ? "Tokenised palette in use." : "No palette tokens to verify.",
      weight: 2
    });
    const total = ids.reduce((sum, id) => sum + segment.checks[id], 0);
    const earned = resolved.reduce(
      (sum, r) => sum + segment.checks[r.id] * (r.status === "pass" ? 1 : r.status === "warn" ? 0.5 : 0),
      0
    );
    return {
      key: segment.key,
      label: segment.label,
      audience: segment.audience,
      note: segment.note,
      score: total ? Math.round((earned / total) * 100) : 0,
      gaps: resolved.filter((r) => r.status !== "pass").map((r) => r.label)
    };
  });

  const dimensionWeight = new Map(DIMENSIONS.map((d) => [d.key, d.weight]));
  const recommendations = results
    .filter((r) => r.status !== "pass")
    .sort(
      (a, b) =>
        (dimensionWeight.get(b.dimension) * b.weight * (b.status === "fail" ? 2 : 1)) -
        (dimensionWeight.get(a.dimension) * a.weight * (a.status === "fail" ? 2 : 1))
    )
    .slice(0, 6)
    .map((r) => ({
      priority: r.status === "fail" ? "high" : "medium",
      dimension: r.dimension,
      check: r.label,
      action: r.fix
    }));

  return {
    ok: true,
    url,
    httpStatus: status,
    fetchedAt,
    ms,
    overall,
    grade: grade(overall),
    dimensions,
    demographics,
    recommendations,
    signals: {
      bytes: signals.bytes,
      words: signals.words,
      wordsPerSentence: signals.wordsPerSentence,
      images: signals.imgs,
      svg: signals.svg,
      tokens: signals.cssVars,
      externalRequests: signals.externalCss + signals.scripts
    }
  };
}

export function summarizeFeedback(entries) {
  const list = entries.filter((e) => e && Number.isFinite(e.rating));
  const bySegment = {};
  for (const entry of list) {
    const key = entry.segment || "unspecified";
    bySegment[key] = bySegment[key] || { count: 0, sum: 0 };
    bySegment[key].count += 1;
    bySegment[key].sum += entry.rating;
  }
  const segments = Object.keys(bySegment)
    .map((key) => ({
      segment: key,
      count: bySegment[key].count,
      average: Number((bySegment[key].sum / bySegment[key].count).toFixed(2))
    }))
    .sort((a, b) => b.count - a.count);

  const total = list.length;
  return {
    total,
    average: total ? Number((list.reduce((s, e) => s + e.rating, 0) / total).toFixed(2)) : null,
    segments,
    latest: list.slice(-5).reverse()
  };
}
