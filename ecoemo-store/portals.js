// ─────────────────────────────────────────────────────────────────────────────
// Worker-rendered portals: /legal, /freelance, /conservation.
// These pages need no backend round-trip except /conservation (portalData JSON).
// All three inherit the metalcore layer injected by brandLayer().
// ─────────────────────────────────────────────────────────────────────────────

const HEAD = (title, desc) =>
  '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<title>' + esc(title) + '</title>' +
  '<meta name="description" content="' + esc(desc) + '">' +
  '<link rel="preconnect" href="https://fonts.googleapis.com">' +
  '<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cinzel+Decorative:wght@700;900&family=UnifrakturMaguntia&family=Space+Mono:wght@400;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">' +
  '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\'%3E%3Crect width=\'32\' height=\'32\' fill=\'%23070709\'/%3E%3Ctext x=\'16\' y=\'23\' font-size=\'17\' text-anchor=\'middle\' fill=\'%234ADE80\' font-family=\'serif\'%3E%C6%8EE%3C/text%3E%3C/svg%3E">' +
  PAGE_CSS + '</head><body>';

const PAGE_CSS = '<style id="ee-portal">' +
  '*{box-sizing:border-box;margin:0;padding:0}' +
  'body{background:#070709;color:#EFECE4;font-family:"Plus Jakarta Sans",system-ui,sans-serif;line-height:1.72;' +
  '-webkit-font-smoothing:antialiased;overflow-x:clip}' +
  '.pwrap{max-width:1080px;margin:0 auto;padding:34px 20px 70px}' +
  '.phead{padding:14px 0 26px;border-bottom:1px solid rgba(239,236,228,.14);margin-bottom:34px}' +
  '.peye{font-family:"Space Mono",monospace;font-size:9.5px;letter-spacing:.34em;text-transform:uppercase;color:#4ADE80}' +
  '.phead h1{font-family:"Cinzel Decorative",serif;font-weight:700;font-size:clamp(26px,5.4vw,50px);line-height:1.02;' +
  'letter-spacing:.02em;margin:12px 0 12px;text-transform:uppercase;' +
  'text-shadow:0 1px 0 #000,3px 3px 0 rgba(139,30,36,.45)}' +
  '.plede{color:#a8a49a;font-size:16px;max-width:70ch}' +
  '.pback{display:inline-block;margin-top:16px;font-family:"Space Mono",monospace;font-size:9.5px;letter-spacing:.24em;' +
  'text-transform:uppercase;color:#a8a49a;text-decoration:none;border-bottom:1px solid rgba(239,236,228,.2);padding-bottom:2px}' +
  '.pback:hover{color:#4ADE80}' +
  'h2.sec{font-family:"Cinzel Decorative",serif;font-size:clamp(17px,2.6vw,24px);letter-spacing:.05em;margin:44px 0 6px;' +
  'text-transform:uppercase;display:flex;align-items:center;gap:12px}' +
  'h2.sec:before{content:"//";font-family:"Space Mono",monospace;font-size:12px;color:#8B1E24;letter-spacing:0}' +
  '.psub{font-family:"Space Mono",monospace;font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:#a8a49a;margin-bottom:18px}' +
  '.pgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px}' +
  '.pcard{position:relative;border:1px solid rgba(239,236,228,.14);background:rgba(17,18,21,.72);padding:18px;' +
  'transition:transform .3s,border-color .3s,box-shadow .3s}' +
  '.pcard:hover{transform:translateY(-4px);border-color:rgba(74,222,128,.32);box-shadow:0 16px 40px rgba(0,0,0,.66),inset 0 0 34px rgba(30,77,54,.35)}' +
  '.pcard h3{font-family:"Cinzel Decorative",serif;font-size:15px;letter-spacing:.04em;line-height:1.3;margin:8px 0 6px;text-transform:uppercase}' +
  '.pcard p{font-size:13.5px;color:#a8a49a;line-height:1.6}' +
  '.ptag{font-family:"Space Mono",monospace;font-size:8.5px;letter-spacing:.22em;text-transform:uppercase;color:#a8a49a}' +
  '.pcrit{color:#8B1E24}.plichen{color:#4ADE80}' +
  '.pstat{display:inline-block;font-family:"Space Mono",monospace;font-size:8.5px;letter-spacing:.2em;text-transform:uppercase;' +
  'padding:3px 7px;border:1px solid rgba(139,30,36,.6);color:#d8847a;margin-top:10px}' +
  '.prow{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 18px}' +
  '.prow button{font-family:"Space Mono",monospace;font-size:9px;letter-spacing:.18em;text-transform:uppercase;' +
  'padding:7px 11px;background:#111215;color:#a8a49a;border:1px solid rgba(239,236,228,.14);cursor:pointer}' +
  '.prow button.on{color:#4ADE80;border-color:rgba(74,222,128,.45);background:rgba(30,77,54,.3)}' +
  'table.ledger{width:100%;border-collapse:collapse;font-size:13px;margin-top:10px}' +
  'table.ledger th{font-family:"Space Mono",monospace;font-size:8.5px;letter-spacing:.2em;text-transform:uppercase;' +
  'color:#a8a49a;text-align:left;padding:8px 10px;border-bottom:1px solid rgba(239,236,228,.18)}' +
  'table.ledger td{padding:9px 10px;border-bottom:1px solid rgba(239,236,228,.07);color:#d6d2c8}' +
  'table.ledger tr:hover td{background:rgba(30,77,54,.16)}' +
  '.totals{display:flex;flex-wrap:wrap;gap:26px;margin-top:18px;padding:16px;border:1px dashed rgba(74,222,128,.3)}' +
  '.totals div{font-family:"Space Mono",monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#a8a49a}' +
  '.totals b{display:block;font-size:20px;letter-spacing:.02em;color:#4ADE80;margin-top:4px}' +
  '.tabs{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 26px}' +
  '.tabs button{font-family:"Space Mono",monospace;font-size:9px;letter-spacing:.16em;text-transform:uppercase;' +
  'padding:9px 12px;background:#111215;color:#a8a49a;border:1px solid rgba(239,236,228,.14);cursor:pointer}' +
  '.tabs button.on{color:#EFECE4;border-color:rgba(74,222,128,.45);background:rgba(30,77,54,.34)}' +
  '.doc{display:none}.doc.on{display:block}' +
  '.doc h3{font-family:"Cinzel Decorative",serif;font-size:16px;letter-spacing:.05em;margin:24px 0 8px;text-transform:uppercase}' +
  '.doc h3:first-child{margin-top:0}' +
  '.doc p,.doc li{font-size:14.5px;color:#c2bdb2;margin-bottom:10px;line-height:1.75}' +
  '.doc ul{padding-left:20px;margin-bottom:14px}' +
  '.doc em{color:#a8a49a}' +
  '.doc strong{color:#EFECE4}' +
  'form.intake{display:grid;gap:12px;max-width:660px;margin-top:16px}' +
  'form.intake label{font-family:"Space Mono",monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#a8a49a;display:block;margin-bottom:6px}' +
  'form.intake input,form.intake select,form.intake textarea{width:100%;background:#111215;border:1px solid rgba(239,236,228,.16);' +
  'color:#EFECE4;font-family:"Plus Jakarta Sans",sans-serif;font-size:14px;padding:11px 12px;border-radius:0}' +
  'form.intake input:focus,form.intake select:focus,form.intake textarea:focus{outline:none;border-color:#4ADE80}' +
  'form.intake textarea{min-height:120px;resize:vertical}' +
  'button.submit{font-family:"Space Mono",monospace;font-size:10px;letter-spacing:.24em;text-transform:uppercase;' +
  'padding:14px 18px;background:#1E4D36;color:#EFECE4;border:1px solid rgba(74,222,128,.45);cursor:pointer;' +
  'transition:background .25s,color .25s}' +
  'button.submit:hover{background:#4ADE80;color:#070709}' +
  '.est{display:flex;flex-wrap:wrap;gap:14px;align-items:flex-end;padding:18px;border:1px solid rgba(239,236,228,.14);' +
  'background:rgba(17,18,21,.72);margin:14px 0 8px}' +
  '.est .f{flex:1 1 180px}' +
  '.est .num{font-family:"Space Mono",monospace;font-size:26px;color:#4ADE80;letter-spacing:.02em}' +
  '.pfoot{margin-top:56px;padding-top:20px;border-top:1px solid rgba(239,236,228,.14);' +
  'font-family:"Space Mono",monospace;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#6d6a62;' +
  'display:flex;flex-wrap:wrap;gap:14px;justify-content:space-between}' +
  '.pfoot a{color:#a8a49a;text-decoration:none}.pfoot a:hover{color:#4ADE80}' +
  '.note{border:1px dashed rgba(74,222,128,.3);padding:14px 16px;font-size:13.5px;color:#a8a49a;margin-top:16px}' +
  '@media(max-width:560px){.pwrap{padding:24px 14px 56px}table.ledger{font-size:11.5px}}' +
  '</style>';

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function FOOT() {
  return '<div class="pfoot"><span>&#477;E · ECO EMO · EST. MMXXVI · grieve the earth. save it anyway.</span>' +
    '<span><a href="/shop">Shop</a> · <a href="/vault">Vault</a> · <a href="/conservation">Conservation</a></span></div>';
}

// ── /legal ───────────────────────────────────────────────────────────────────
export function legalPage(doc) {
  const docs = [
    ["terms", "Terms of Service", `<h3>1. Who We Are</h3>
      <p>EcoEmo (also trading as <strong>Endling</strong> for music and the Agency Den) is a sole proprietorship
      registered and operated in the State of Oklahoma, United States. References to "we", "us" and "our" mean EcoEmo.
      Contact: <strong>xxecoemoxx@gmail.com</strong>.</p>
      <h3>2. Using This Site</h3>
      <p>By browsing ecoemo.store, buying merchandise, streaming Endling recordings, or submitting a commission request,
      you agree to these terms. If you do not agree, stop using the site.</p>
      <ul>
        <li>You must be 18 or older, or have a guardian's permission, to place an order.</li>
        <li>Do not scrape, resell, or mirror our artwork, writing, or audio without written permission.</li>
        <li>Product colours and print placement vary slightly between garments; that is the nature of screen printing
        and print-on-demand, not a defect.</li>
      </ul>
      <h3>3. Orders and Pricing</h3>
      <p>Prices are listed in USD and may change without notice. An order is accepted when payment clears through our
      processor (Stripe or PayPal). We may cancel an order and refund it in full if a design, size, or supplier becomes
      unavailable.</p>
      <h3>4. Accounts and Conduct</h3>
      <p>Keep your login details private. You are responsible for activity under your account. We may suspend access for
      abuse, harassment, or attempts to interfere with the site.</p>
      <h3>5. Liability</h3>
      <p>The site and its content are provided "as is". To the extent the law allows, our total liability for any claim
      is limited to the amount you paid for the order giving rise to it. Nothing here limits rights you have under
      Oklahoma or federal consumer law.</p>
      <h3>6. Changes</h3>
      <p>We may update these terms. The version published here at the time of your order governs that order.</p>`],

    ["privacy", "Privacy Policy", `<h3>What We Collect</h3>
      <ul>
        <li><strong>Order data:</strong> name, email, shipping address, and the items you bought. Payment card numbers
        never touch our servers; they go directly to Stripe or PayPal.</li>
        <li><strong>Account data:</strong> email, region, saved articles, adopted species, and membership tier.</li>
        <li><strong>Usage data:</strong> pages viewed, referring source, and approximate location, collected through
        Google Analytics 4 (property G-G572GHGMY6). IP addresses are anonymised at collection.</li>
      </ul>
      <h3>Why We Collect It</h3>
      <p>To fulfil orders, send the field dispatches you asked for, keep the conservation ledger accurate, and understand
      which stories people actually read. We do not sell personal data. Ever.</p>
      <h3>Who We Share It With</h3>
      <ul>
        <li><strong>Printify</strong> and its print providers, to manufacture and ship your order.</li>
        <li><strong>Stripe</strong> and <strong>PayPal</strong>, for payment processing.</li>
        <li><strong>Google Analytics</strong>, for aggregate traffic measurement.</li>
      </ul>
      <h3>Your Rights</h3>
      <p>You can request a copy or deletion of your data at <strong>xxecoemoxx@gmail.com</strong>. Deletion requests are
      honoured within 30 days, except records we must keep for tax and accounting purposes.</p>
      <h3>Storage</h3>
      <p>Data is stored on our application backend and at our print and payment partners in the United States. Newsletter
      subscribers can unsubscribe from any email footer link.</p>`],

    ["shipping", "Shipping", `<h3>Where We Ship</h3>
      <p>Worldwide, through Printify's provider network. Production happens in the facility closest to your address where
      a given design allows it.</p>
      <h3>Timing</h3>
      <ul>
        <li><strong>Production:</strong> 2 to 5 business days for apparel, up to 7 for home goods and specialty items.</li>
        <li><strong>US delivery:</strong> typically 3 to 8 business days after production.</li>
        <li><strong>International:</strong> typically 7 to 20 business days. Customs clearance can add time.</li>
      </ul>
      <p>Tracking is emailed as soon as the provider hands the parcel to the carrier. Print-on-demand means nothing sits
      in a warehouse, so an order cannot be rushed by upgrading shipping alone.</p>
      <h3>Duties and Taxes</h3>
      <p>International orders may attract import duties or VAT charged by your country. Those charges are the buyer's
      responsibility and are not collected by us.</p>
      <h3>Wrong Address</h3>
      <p>Tell us within 12 hours of ordering if the address is wrong. After production starts, the address is locked at
      the print provider.</p>`],

    ["returns", "Returns &amp; Fulfillment", `<h3>Print-on-Demand Reality</h3>
      <p>Every item is made to order, one at a time. That is how we avoid deadstock and landfill, and it is also why
      "buy, try, return" retail logic does not apply.</p>
      <h3>What We Replace Free</h3>
      <ul>
        <li>Misprinted, crooked, faded, or peeling artwork.</li>
        <li>Wrong item, wrong size, or wrong colour shipped.</li>
        <li>Garments damaged in transit.</li>
      </ul>
      <p>Report it within <strong>30 days of delivery</strong> with your order number and photographs of the item and the
      shipping label. We reprint or refund once the provider confirms the fault. In most cases you do not need to return
      the faulty item.</p>
      <h3>What We Cannot Take Back</h3>
      <p>Change of mind, wrong size chosen at checkout, or buyer's remorse on a correctly produced order. Size charts are
      published on each product page: measure a garment you already own and compare.</p>
      <h3>Cancellations</h3>
      <p>Orders can be cancelled for a full refund before they enter production, usually within the first few hours.
      Email us immediately and we will try, but once the presses start it is too late.</p>`],

    ["conservation", "Conservation Donation Disclosure", `<h3>The Commitment</h3>
      <p>EcoEmo directs a portion of every merchandise sale to endangered species conservation. The exact percentage is
      printed on the product card and on your order confirmation. Nothing about that split is marketing-only: each sale
      creates a ledger entry.</p>
      <h3>How It Works</h3>
      <ul>
        <li>When an order is paid, a <strong>DonationLedger</strong> entry is created with the amount allocated to
        conservation and the species or programme it is attached to.</li>
        <li>Entries start as <em>accrued</em>. When the funds are actually sent to a partner organisation, the entry is
        marked <em>disbursed</em>.</li>
        <li>The live ledger is public at <a href="/conservation" style="color:#4ADE80">/conservation</a>.</li>
      </ul>
      <h3>Where Funds Go</h3>
      <p>Routing is hardcoded toward the species this project was built around: red wolves, vaquitas, fishing cats, and
      monarch butterflies, plus the habitat programmes listed on the conservation page. Partner organisations are named
      as each disbursement is made.</p>
      <h3>What We Do Not Claim</h3>
      <p>We are a business, not a registered charity. Donations made through the store are not tax-deductible for the
      buyer. We do not claim a certification or rating we have not earned.</p>`],

    ["trademark", "Trademark &amp; Copyright", `<h3>Owned Marks</h3>
      <p><strong>ECO EMO</strong>, <strong>ENDLING</strong>, <strong>AGENCY DEN</strong>, <strong>WORX</strong>, and the
      backwards <strong>&#477;E</strong> monogram are trademarks of EcoEmo. Common-law rights are asserted through
      continuous use in commerce; a federal application for the word mark and monogram is on file.</p>
      <h3>Copyright</h3>
      <p>&copy; 2026 EcoEmo. All artwork, illustrations, garment designs, photography, written field dispatches, page
      code, and Endling recordings are protected works. All rights reserved.</p>
      <h3>You May Not</h3>
      <ul>
        <li>Reproduce, resell, or drop-ship our designs, or upload them to another print service.</li>
        <li>Use our marks, monogram, or mascots in your own branding or advertising.</li>
        <li>Sample, re-upload, or monetise Endling audio without written permission.</li>
      </ul>
      <h3>Fan Use</h3>
      <p>Posting a photo of your own purchase, or sharing a track link, is always fine. Credit is appreciated, not
      required.</p>
      <h3>Reporting Infringement</h3>
      <p>Send a description of the infringing use, its URL, and your contact details to
      <strong>xxecoemoxx@gmail.com</strong>. We act on valid reports and will remove infringing listings.</p>
      <p><em>Registered place of business: Oklahoma, United States. Effective 1 November 2026.</em></p>`]
  ];

  const active = docs.some((d) => d[0] === doc) ? doc : "terms";
  const tabs = docs.map((d) =>
    '<button type="button" data-doc="' + d[0] + '" class="' + (d[0] === active ? "on" : "") + '">' + d[1] + '</button>'
  ).join("");
  const panes = docs.map((d) =>
    '<section class="doc ' + (d[0] === active ? "on" : "") + '" id="doc-' + d[0] + '"><h3>' + d[1] + '</h3>' + d[2] + '</section>'
  ).join("");

  return HEAD("Legal Registry | Eco Emo",
    "Terms of Service, Privacy Policy, Shipping, Returns, Conservation Donation Disclosure, and Trademark & Copyright for EcoEmo, a sole proprietorship in Oklahoma, USA.") +
    '<div class="pwrap"><header class="phead"><div class="peye">Official Registry &middot; &#477;E</div>' +
    '<h1 class="ee-slash">Legal &amp; Brand Protection</h1>' +
    '<p class="plede">EcoEmo is a sole proprietorship in Oklahoma, United States. Everything below is the actual operating position: '
    + 'what we promise, what we do not, and what we will defend.</p>' +
    '<a class="pback" href="/">&larr; Back to the surface</a></header>' +
    '<div class="tabs">' + tabs + '</div>' + panes +
    '<div class="note"><strong>Trademark &amp; copyright notice.</strong> ECO EMO, ENDLING, AGENCY DEN, WORX and the '
    + 'backwards &#477;E monogram are trademarks of EcoEmo. All artwork, designs, photography, copy, code and Endling '
    + 'recordings are &copy; 2026 EcoEmo. All rights reserved.</div>' +
    FOOT() + '</div>' +
    '<script>(function(){var b=document.querySelectorAll(".tabs button"),' +
    'd=document.querySelectorAll(".doc");' +
    'b.forEach(function(x){x.addEventListener("click",function(){' +
    'b.forEach(function(y){y.classList.remove("on")});d.forEach(function(y){y.classList.remove("on")});' +
    'x.classList.add("on");var t=document.getElementById("doc-"+x.dataset.doc);if(t)t.classList.add("on");' +
    'try{history.replaceState(null,"","/legal?doc="+x.dataset.doc)}catch(e){}' +
    'window.scrollTo({top:0,behavior:"smooth"});});});})();</script>' +
    '</body></html>';
}

// ── /freelance ───────────────────────────────────────────────────────────────
export function freelancePage() {
  const work = [
    ["Storefront on the edge", "A Cloudflare Worker in front of a headless backend: Stripe checkout, Printify fulfilment, cron pipelines, "
      + "zero per-order platform fees. This store runs on it, at roughly 1.9 seconds per scheduled run.", "cloudflare / stripe / printify"],
    ["Catalogue repair at scale", "Audited a 132-SKU print-on-demand catalogue against its provider, found the dead fulfilment links, the blank "
      + "print areas and the duplicate artwork, then split cosmetic drift from genuine breakage.", "node / api / qa"],
    ["AI content pipelines", "Species research to publish-ready copy with human review gates and a fact-check pass. Daily cadence, no babysitting, "
      + "no hallucinated IUCN statuses.", "gemini / automation"],
    ["Internal tooling", "Key-gated approval boards, audit dashboards and issue trackers built on the same edge stack as the storefront.", "typescript / edge"],
    ["Dark band-tee illustration", "Gothic, botanical and doom-metal artwork built for real print: separation-safe ink, black shirts that stay black, "
      + "no thin hairlines that clog.", "procreate / vector / print prep"]
  ];
  const cards = work.map((w) =>
    '<div class="pcard"><div class="ptag">' + esc(w[2]) + '</div><h3>' + esc(w[0]) + '</h3><p>' + esc(w[1]) + '</p></div>'
  ).join("");

  return HEAD("Freelance · Custom Art + Code Commissions | Eco Emo",
    "Commission dark band-tee illustration, full-stack web apps, or Cloudflare and AI workflow engineering from Eco Emo.") +
    '<div class="pwrap"><header class="phead"><div class="peye">Commission Desk &middot; &#477;E</div>' +
    '<h1 class="ee-slash">Freelance</h1>' +
    '<p class="plede">Custom art and code for people who want the thing to actually work. Band merch that survives a wash, '
    + 'sites that survive a traffic spike, pipelines that survive a bad API day.</p>' +
    '<a class="pback" href="/">&larr; Back to the surface</a></header>' +

    '<h2 class="sec">Selected Work</h2><div class="psub">Shipped, not hypothetical</div>' +
    '<div class="pgrid">' + cards + '</div>' +

    '<h2 class="sec">Estimator</h2><div class="psub">Rough range before we talk &middot; not a quote</div>' +
    '<div class="est">' +
    '<div class="f"><label style="font-family:\'Space Mono\',monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#a8a49a">Service</label>' +
    '<select id="estSvc" style="width:100%;background:#111215;border:1px solid rgba(239,236,228,.16);color:#EFECE4;padding:11px;font-size:14px">' +
    '<option value="350">Artwork &middot; band tee / poster design</option>' +
    '<option value="1200">Web &middot; single-page storefront or landing</option>' +
    '<option value="2600">Web &middot; full storefront + checkout + fulfilment</option>' +
    '<option value="900">Automation &middot; AI content pipeline</option>' +
    '<option value="700">Automation &middot; worker / cron engineering</option></select></div>' +
    '<div class="f"><label style="font-family:\'Space Mono\',monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#a8a49a">Rush</label>' +
    '<select id="estRush" style="width:100%;background:#111215;border:1px solid rgba(239,236,228,.16);color:#EFECE4;padding:11px;font-size:14px">' +
    '<option value="1">Standard timeline</option><option value="1.35">Inside two weeks (+35%)</option>' +
    '<option value="1.7">Inside one week (+70%)</option></select></div>' +
    '<div class="f"><div class="ptag">Estimated range</div><div class="num" id="estOut">$350 &ndash; $500</div></div>' +
    '</div>' +
    '<p class="psub" style="margin-top:2px">Final scope and price come back the same day, in writing.</p>' +

    '<h2 class="sec">Intake</h2><div class="psub">Straight to the desk &middot; answered same day where possible</div>' +
    '<form class="intake" id="intake" method="post" action="/api/inquiry">' +
    '<div><label for="f-name">Name</label><input id="f-name" name="name" required autocomplete="name"></div>' +
    '<div><label for="f-email">Email</label><input id="f-email" name="email" type="email" required autocomplete="email"></div>' +
    '<div><label for="f-svc">Service</label><select id="f-svc" name="service_type">' +
    '<option value="web-ai-dev">Web / AI development</option>' +
    '<option value="gothic-merch-design">Gothic merch design</option>' +
    '<option value="agency-den-membership">Agency Den membership</option>' +
    '<option value="other">Something else</option></select></div>' +
    '<div><label for="f-budget">Budget</label><input id="f-budget" name="budget" placeholder="e.g. $800 &ndash; $1,500"></div>' +
    '<div><label for="f-msg">What has to be built</label><textarea id="f-msg" name="message" required placeholder="What breaks, what you want built, and when it has to be done."></textarea></div>' +
    '<button class="submit" type="submit">Send the brief</button>' +
    '<p class="psub" id="intakeStatus" style="margin:0"></p></form>' +

    '<div class="note">Prefer email? <strong>xxecoemoxx@gmail.com</strong>. Send the same three things: what breaks, what you '
    + 'want, and the deadline. A portion of every commission goes to the conservation ledger too.</div>' +
    FOOT() + '</div>' +
    '<script>(function(){' +
    'var s=document.getElementById("estSvc"),r=document.getElementById("estRush"),o=document.getElementById("estOut");' +
    'function calc(){var b=parseFloat(s.value)*parseFloat(r.value);' +
    'o.textContent="$"+Math.round(b/50)*50+" \\u2013 $"+Math.round(b*1.45/50)*50;}' +
    's.addEventListener("change",calc);r.addEventListener("change",calc);calc();' +
    'var f=document.getElementById("intake"),st=document.getElementById("intakeStatus");' +
    'f.addEventListener("submit",function(e){e.preventDefault();' +
    'var btn=f.querySelector("button.submit");btn.disabled=true;st.textContent="SENDING\\u2026";' +
    'var body={name:f.name.value,email:f.email.value,service_type:f.service_type.value,budget:f.budget.value,message:f.message.value};' +
    'fetch("/api/inquiry",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)})' +
    '.then(function(r){return r.json()})' +
    '.then(function(d){if(d&&d.ok){st.textContent="RECEIVED. THE BRIEF IS ON THE DESK \\u2014 REPLY GOES TO "+body.email.toUpperCase();' +
    'f.reset();btn.textContent="SENT";}else{throw new Error((d&&d.error)||"failed")}})' +
    '.catch(function(){st.textContent="COULD NOT SEND. EMAIL xxecoemoxx@gmail.com INSTEAD.";btn.disabled=false;btn.textContent="TRY AGAIN"});' +
    '});})();</script>' +
    '</body></html>';
}

// ── /conservation ────────────────────────────────────────────────────────────
export function conservationPage(data, err) {
  const species = (data && data.species) || [];
  const articles = (data && data.articles) || [];
  const ledger = (data && data.donations) || [];

  const featured = species.find((s) => /honey\s*bee/i.test(s.common_name || "")) ||
    species.find((s) => s.is_featured) || species[0] || null;

  const redListNames = [/vaquita/i, /fishing\s*cat/i, /red\s*wolf/i, /monarch/i, /panther/i, /tortoise/i];
  const red = [];
  redListNames.forEach((rx) => {
    const hit = species.find((s) => rx.test(s.common_name || ""));
    if (hit && red.indexOf(hit) === -1) red.push(hit);
  });
  species.forEach((s) => {
    if (red.length < 6 && red.indexOf(s) === -1 && /critic|endanger/i.test(s.status || "")) red.push(s);
  });

  const hero = featured
    ? '<section style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.9fr);gap:26px;align-items:center;' +
      'border:1px solid rgba(239,236,228,.14);background:rgba(17,18,21,.66);padding:22px">' +
      (featured.image_url
        ? '<img src="' + esc(featured.image_url) + '" alt="' + esc(featured.common_name) + '" style="width:100%;aspect-ratio:1;object-fit:cover;filter:grayscale(8%) contrast(1.06);order:2">'
        : "") +
      '<div style="order:1"><div class="ptag plichen">Featured species</div>' +
      '<h2 style="font-family:\'Cinzel Decorative\',serif;font-size:clamp(22px,3.4vw,34px);text-transform:uppercase;margin:8px 0 4px">' +
      esc(featured.common_name) + '</h2>' +
      '<p style="font-style:italic;color:#a8a49a;font-size:14px;margin-bottom:12px">' + esc(featured.scientific_name) + '</p>' +
      '<p style="font-size:15px;color:#d6d2c8">' + esc((featured.description || "").slice(0, 420)) + '</p>' +
      (featured.fun_fact ? '<p style="margin-top:12px;font-size:14px;color:#a8a49a"><strong style="color:#4ADE80">FIELD NOTE:</strong> ' +
        esc(featured.fun_fact) + '</p>' : "") +
      '<div class="pstat" style="border-color:rgba(139,30,36,.7)">' + esc(featured.status || "status unlisted") + '</div>' +
      '<p style="margin-top:16px"><a class="pback" href="/shop?featured=honey-bee">Shop the ' + esc(featured.common_name) + ' line &rarr;</a></p>' +
      '</div></section>'
    : '<div class="note">Species records are being rebuilt. The ledger below is live.</div>';

  const redCards = red.map((s) =>
    '<div class="pcard"><div class="ptag pcrit">' + esc(s.status || "at risk") + '</div>' +
    '<h3>' + esc(s.common_name) + '</h3>' +
    '<p style="font-style:italic;font-size:12.5px;color:#8b877e;margin-bottom:8px">' + esc(s.scientific_name) + '</p>' +
    '<p>' + esc((s.description || s.habitat || "").slice(0, 200)) + '</p>' +
    (s.population_estimate ? '<div class="pstat">' + esc(s.population_estimate) + '</div>' : "") + '</div>'
  ).join("");

  const rows = ledger.slice(0, 40).map((d) => {
    const amt = Number(d.amount_to_org || d.amount_total || 0);
    const date = (d.created_date || d.payout_date || "").slice(0, 10);
    const st = (d.status || "accrued").toLowerCase();
    return '<tr><td>' + esc(date) + '</td><td>' + esc(d.chosen_org_name || "Unassigned") + '</td>' +
      '<td>' + esc(d.type || "order") + '</td>' +
      '<td>$' + amt.toFixed(2) + '</td>' +
      '<td class="' + (st === "disbursed" ? "plichen" : "pcrit") + '">' + esc(st) + '</td></tr>';
  }).join("");

  const accr = ledger.filter((d) => (d.status || "accrued").toLowerCase() !== "disbursed")
    .reduce((a, d) => a + Number(d.amount_to_org || d.amount_total || 0), 0);
  const disb = ledger.filter((d) => (d.status || "").toLowerCase() === "disbursed")
    .reduce((a, d) => a + Number(d.amount_to_org || d.amount_total || 0), 0);

  const cats = ["All"];
  articles.forEach((a) => { if (a.category && cats.indexOf(a.category) === -1) cats.push(a.category); });
  const catBtns = cats.map((c, i) =>
    '<button type="button" data-cat="' + esc(c) + '" class="' + (i === 0 ? "on" : "") + '">' + esc(c) + '</button>'
  ).join("");

  const dispatches = articles.slice(0, 24).map((a) =>
    '<a class="pcard dpatch" data-cat="' + esc(a.category || "") + '" href="/?page=article&id=' + esc(a.id) + '" ' +
    'style="display:block;text-decoration:none;color:inherit">' +
    '<div class="ptag">' + esc(a.category || "field note") + (a.species_name ? " &middot; " + esc(a.species_name) : "") + '</div>' +
    '<h3>' + esc(a.title) + '</h3>' +
    '<p>' + esc((a.summary || "").slice(0, 150)) + '</p></a>'
  ).join("");

  return HEAD("Conservation Dossier · Field Ledger | Eco Emo",
    "Live conservation ledger, red-list species dossiers, and field dispatches from Eco Emo.") +
    '<div class="pwrap"><header class="phead"><div class="peye">Naturalist Dossier &middot; &#477;E</div>' +
    '<h1 class="ee-slash">Conservation</h1>' +
    '<p class="plede">What the money did, which species it went to, and what is still going extinct while we argue about it. '
    + 'No greenwashing: the ledger below is every entry we hold.</p>' +
    '<a class="pback" href="/">&larr; Back to the surface</a></header>' +
    (err ? '<div class="note">Live records served from cache: ' + esc(err) + '</div>' : "") +
    hero +
    '<h2 class="sec">The Red List</h2><div class="psub">Species this project routes funds toward</div>' +
    '<div class="pgrid">' + (redCards || '<div class="note">Species records loading.</div>') + '</div>' +
    '<h2 class="sec">Donation Ledger</h2><div class="psub">Every entry &middot; accrued &rarr; disbursed</div>' +
    '<table class="ledger"><thead><tr><th>Date</th><th>Partner / species</th><th>Type</th><th>Allocated</th><th>Status</th></tr></thead>' +
    '<tbody>' + (rows || '<tr><td colspan="5" style="color:#a8a49a">No entries yet. First disbursement posts here.</td></tr>') + '</tbody></table>' +
    '<div class="totals"><div>Accrued<b>$' + accr.toFixed(2) + '</b></div>' +
    '<div>Disbursed<b>$' + disb.toFixed(2) + '</b></div>' +
    '<div>Entries<b>' + ledger.length + '</b></div></div>' +
    '<h2 class="sec">Field Dispatches</h2><div class="psub">Reported, not repackaged</div>' +
    '<div class="prow" id="catRow">' + catBtns + '</div>' +
    '<div class="pgrid" id="dispatchGrid">' + (dispatches || '<div class="note">No dispatches published yet.</div>') + '</div>' +
    FOOT() + '</div>' +
    '<script>(function(){var row=document.getElementById("catRow");if(!row)return;' +
    'row.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;' +
    'Array.prototype.forEach.call(row.querySelectorAll("button"),function(x){x.classList.remove("on")});' +
    'b.classList.add("on");var c=b.dataset.cat;' +
    'Array.prototype.forEach.call(document.querySelectorAll(".dpatch"),function(card){' +
    'card.style.display=(c==="All"||card.dataset.cat===c)?"block":"none";});});})();</script>' +
    '</body></html>';
}
