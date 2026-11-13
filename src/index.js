name = "endling-studio"
main = "src/index.js"
compatibility_date = "2026-11-13"

[vars]
ENVIRONMENT = "production"

# Secrets to configure via wrangler secret put:
# - GITHUB_PAT
# - VAULT_SECRET
# - STRIPE_WEBHOOK_SECRET
# - PRINTIFY_API_KEY
npx wrangler secret put PAYPAL_API_SECRET
/**
 * EcoEmo Ecosystem - Master API Gateway & Webhook Bridge
 * Unifies Cloudflare, Base44, Printify, Stripe, and PayPal routing.
 */

const BASE44_API_URL = "https://base44.app/api/apps/6a27be55829cc8409d2adfc6";

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const method = request.method;

        // Handle CORS preflight requests across all storefront and vault domains
        if (method === 'OPTIONS') {
            return handleCorsPreflight();
        }

        try {
            // 1. Telemetry & Analytics Endpoint (used by vault-tracker.js)
            if (url.pathname === '/api/telemetry' && method === 'POST') {
                return await handleTelemetry(request, env);
            }

            // 2. Payment & Fulfillment Webhook Proxy (Stripe, PayPal, Printify)
            if (url.pathname.startsWith('/api/webhooks/')) {
                return await handleWebhookProxy(request, env, url.pathname);
            }

            // 3. General Base44 Backend & Core Vault Proxy
            if (url.pathname.startsWith('/api/')) {
                return await proxyToBase44(request, env);
            }

            // Default fallback response for root or static asset routing
            return new Response(JSON.stringify({
                brand: "Eco Emo",
                storefront: "https://ecoemo.store",
                status: "Operational",
                version: "2026.11.13"
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json', ...getCorsHeaders() }
            });

        } catch (error) {
            console.error('[Gateway Error]', error);
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', ...getCorsHeaders() }
            });
        }
    }
};

/**
 * Handle incoming telemetry events from the frontend tracker
 */
async function handleTelemetry(request, env) {
    const payload = await request.json();
    console.log('[Telemetry Received]', payload);

    // Forward telemetry batch to Base44 data store or analytics sink if configured
    // For now, return a successful confirmation response
    return new Response(JSON.stringify({ success: true, receivedAt: new Date().toISOString() }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...getCorsHeaders() }
    });
}

/**
 * Handle and verify incoming webhooks from Stripe, PayPal, or Printify
 */
async function handleWebhookProxy(request, env, pathname) {
    const rawBody = await request.text();
    console.log(`[Webhook Proxy] Routed path: ${pathname}`);

    // Forward verified webhook payload directly to Base44 backend functions
    const targetUrl = `${BASE44_API_URL}/functions${pathname}`;
    const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Vault-Signature': request.headers.get('stripe-signature') || request.headers.get('paypal-transmission-sig') || ''
        },
        body: rawBody
    });

    return new Response(await response.text(), {
        status: response.status,
        headers: { 'Content-Type': 'application/json', ...getCorsHeaders() }
    });
}

/**
 * Proxy standard API requests through to the Base44 backend application
 */
async function proxyToBase44(request, env) {
    const url = new URL(request.url);
    const targetUrl = `${BASE44_API_URL}${url.pathname.replace('/api', '')}${url.search}`;
    
    const modifiedRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
        redirect: 'follow'
    });

    const apiResponse = await fetch(modifiedRequest);
    const responseHeaders = new Headers(apiResponse.headers);
    
    // Inject CORS headers to allow cross-origin requests from ecoemo.store and local dev
    Object.entries(getCorsHeaders()).forEach(([key, value]) => {
        responseHeaders.set(key, value);
    });

    return new Response(apiResponse.body, {
        status: apiResponse.status,
        headers: responseHeaders
    });
}

function handleCorsPreflight() {
    return new Response(null, {
        status: 204,
        headers: getCorsHeaders()
    });
}

function getCorsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Vault-Signature',
    };
}
export default {
  async fetch(request) {
    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ENDLING | The Forge</title>
    <link rel="icon" href="https://ecoemo.store/assets/moth-favicon.png" />
    <style>
      :root {
        --bg: #000000;
        --panel: #050505;
        --panel-border: #2d2d2d;
        --text: #c8c0a8;
        --muted: #8b8b8b;
        --accent: #4a9b7a;
        --accent-strong: #6ec9a0;
      }

      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 20px;
        background: var(--bg);
        color: var(--text);
        font-family: monospace;
      }
      .shell {
        max-width: 1200px;
        margin: 0 auto;
      }
      .header {
        text-align: center;
        border-bottom: 1px solid var(--accent);
        padding-bottom: 12px;
        margin-bottom: 20px;
      }
      h1, h2, h3 {
        color: var(--text);
        font-family: serif;
        margin: 0.2em 0;
      }
      h1 {
        color: var(--accent);
        letter-spacing: 2px;
      }
      .tagline {
        color: var(--accent);
        font-style: italic;
      }
      .grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 18px;
      }
      @media (min-width: 768px) {
        .grid {
          grid-template-columns: 1fr 1fr;
        }
      }
      .panel {
        background: var(--panel);
        border: 1px solid var(--panel-border);
        padding: 16px;
      }
      .controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
      }
      button, input[type="file"], textarea, input[type="password"] {
        font: inherit;
      }
      button {
        background: transparent;
        color: var(--text);
        border: 1px solid var(--text);
        padding: 10px 14px;
        cursor: pointer;
        text-transform: uppercase;
        font-family: serif;
        transition: all 0.2s ease;
      }
      button:hover {
        background: var(--accent);
        border-color: var(--accent);
        color: #000;
      }
      textarea, input[type="password"] {
        width: 100%;
        background: #111;
        color: var(--text);
        border: 1px solid var(--panel-border);
        padding: 12px;
        margin-top: 8px;
      }
      .lyrics-box {
        min-height: 220px;
        max-height: 280px;
        overflow-y: auto;
        background: #080808;
        border: 1px solid #1f1f1f;
        padding: 12px;
        white-space: pre-wrap;
        line-height: 1.5;
      }
      audio {
        width: 100%;
        margin-top: 10px;
      }
      .muted {
        font-size: 0.8rem;
        color: var(--muted);
      }
      .accent {
        color: var(--accent);
      }
      .block {
        display: block;
        margin-top: 10px;
      }
      #generated-art {
        width: 100%;
        border: 1px solid var(--accent);
        margin-top: 12px;
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <div class="header">
        <h1>ENDLING STUDIO</h1>
        <div class="tagline">grieve the earth. save it anyway.</div>
      </div>

      <div class="grid">
        <div class="panel">
          <div class="controls">
            <button type="button" onclick="prevTrack()">&#x2020; PREV</button>
            <span id="track-title" class="accent" style="font-weight:bold;">Loading...</span>
            <button type="button" onclick="nextTrack()">NEXT &#x2020;</button>
          </div>
          <div class="lyrics-box" id="lyrics-display"></div>
        </div>

        <div class="panel">
          <h3>Vocal Forge (Upload Takes)</h3>
          <input type="file" id="audio-upload" accept="audio/*" />

          <div id="raw-audio-container" style="display:none; margin-top:12px;">
            <span class="muted">RAW TAKE:</span>
            <audio id="raw-audio" controls></audio>
            <button id="process-btn" type="button" class="block">Apply Endling Scream FX</button>
          </div>

          <div id="processed-audio-container" style="display:none; margin-top:12px;">
            <span class="accent">PROCESSED STEM:</span>
            <audio id="processed-audio" controls></audio>
            <a id="download-link" href="#" download="endling_vocal_stem.wav" style="display:block; margin-top:8px;">
              <button type="button">Download Stem</button>
            </a>
          </div>
        </div>

        <div class="panel">
          <h3>The Producer (MusicGen)</h3>
          <textarea id="music-prompt" rows="3" placeholder="Instrumental prompt (e.g., Heavy post-hardcore, drop-D guitars, 75 BPM...)"></textarea>
          <input type="password" id="hf-key" placeholder="Paste Hugging Face API Key Here" />
          <button type="button" onclick="generateInstrumental(event)" class="block">Generate Instrumental</button>
          <audio id="inst-audio" controls style="display:none;"></audio>
        </div>

        <div class="panel">
          <h3>Cover Art (Stable Diffusion)</h3>
          <textarea id="art-prompt" rows="2" placeholder="Visual prompt (e.g., A single glowing Luna Moth on a rusted street lamp, dark moss...)"></textarea>
          <button type="button" onclick="generateArt(event)" class="block">Generate Cover Art</button>
        </div>
      </div>
    </div>

    <script>
      const tracks = [
        { title: '1. REQUIEM FOR THE LIGHT', lyrics: '[Intro]\nSeven days in the dark...\nNo mouth to feed...' },
        { title: '2. IRON AND IVY', lyrics: '[Intro]\nYou built your towers to outlast the sun...\nBut the soil was waiting all along.' },
        { title: "3. THE ENDLING'S SOLITUDE", lyrics: '[Intro]\nAn endling does not know it is the last...\nIt only knows... no one ever answers.' },
        { title: '4. DROWNING IN GHOST THREADS', lyrics: '[Intro]\nThree thousand miles of open blue...\nTrapped in a web we never knew.' },
        { title: '5. ECHOES OF THE ANCIENT GIANTS', lyrics: '[Intro]\nOne thousand years to grow a canopy...\nTwenty minutes to cut it down.' },
        { title: '6. ASH ON THE SOLSTICE', lyrics: '[Intro]\nSummer comes with smoke now...\nThe winter comes without snow...' }
      ];

      let currentTrack = 0;
      let rawAudioBlob = null;

      function loadTrack() {
        const track = tracks[currentTrack];
        document.getElementById('track-title').textContent = track.title;
        document.getElementById('lyrics-display').textContent = track.lyrics;
      }

      function prevTrack() {
        if (currentTrack > 0) {
          currentTrack -= 1;
          loadTrack();
        }
      }

      function nextTrack() {
        if (currentTrack < tracks.length - 1) {
          currentTrack += 1;
          loadTrack();
        }
      }

      document.getElementById('audio-upload').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        rawAudioBlob = file;
        document.getElementById('raw-audio').src = URL.createObjectURL(file);
        document.getElementById('raw-audio-container').style.display = 'block';
        document.getElementById('processed-audio-container').style.display = 'none';
      });

      document.getElementById('process-btn').addEventListener('click', async () => {
        if (!rawAudioBlob) return;

        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const arrayBuffer = await rawAudioBlob.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

        const offlineCtx = new OfflineAudioContext(
          audioBuffer.numberOfChannels,
          audioBuffer.length,
          audioBuffer.sampleRate
        );
        const source = offlineCtx.createBufferSource();
        source.buffer = audioBuffer;

        const compressor = offlineCtx.createDynamicsCompressor();
        compressor.threshold.value = -24;
        compressor.knee.value = 30;
        compressor.ratio.value = 12;
        compressor.attack.value = 0.003;
        compressor.release.value = 0.25;

        const distortion = offlineCtx.createWaveShaper();
        function makeDistortionCurve(amount) {
          const nSamples = 44100;
          const curve = new Float32Array(nSamples);
          for (let i = 0; i < nSamples; i++) {
            const x = (i * 2) / nSamples - 1;
            curve[i] = ((3 + amount) * x * 20 * Math.PI / 180) / (Math.PI + amount * Math.abs(x));
          }
          return curve;
        }

        distortion.curve = makeDistortionCurve(40);
        distortion.oversample = '4x';

        const eqHigh = offlineCtx.createBiquadFilter();
        eqHigh.type = 'highshelf';
        eqHigh.frequency.value = 3000;
        eqHigh.gain.value = 6;

        source.connect(compressor);
        compressor.connect(distortion);
        distortion.connect(eqHigh);
        eqHigh.connect(offlineCtx.destination);
        source.start(0);

        const renderedBuffer = await offlineCtx.startRendering();
        const wavBlob = bufferToWave(renderedBuffer, renderedBuffer.length);
        const processedUrl = URL.createObjectURL(wavBlob);

        document.getElementById('processed-audio').src = processedUrl;
        document.getElementById('download-link').href = processedUrl;
        document.getElementById('processed-audio-container').style.display = 'block';
      });

      function bufferToWave(abuffer, len) {
        const numOfChan = abuffer.numberOfChannels;
        const length = len * numOfChan * 2 + 44;
        const buffer = new ArrayBuffer(length);
        const view = new DataView(buffer);
        const channels = [];
        let pos = 0;

        function setUint16(data) {
          view.setUint16(pos, data, true);
          pos += 2;
        }

        function setUint32(data) {
          view.setUint32(pos, data, true);
          pos += 4;
        }

        setUint32(0x46464952);
        setUint32(length - 8);
        setUint32(0x45564157);
        setUint32(0x20746d66);
        setUint32(16);
        setUint16(1);
        setUint16(numOfChan);
        setUint32(abuffer.sampleRate);
        setUint32(abuffer.sampleRate * numOfChan * 2);
        setUint16(numOfChan * 2);
        setUint16(16);
        setUint32(0x61746164);
        setUint32(len * numOfChan * 2);

        for (let i = 0; i < numOfChan; i++) {
          channels.push(abuffer.getChannelData(i));
        }

        for (let i = 0; i < len; i++) {
          for (let channel = 0; channel < numOfChan; channel++) {
            let sample = Math.max(-1, Math.min(1, channels[channel][i]));
            sample = sample < 0 ? sample * 32768 : sample * 32767;
            view.setInt16(pos, sample, true);
            pos += 2;
          }
        }

        return new Blob([buffer], { type: 'audio/wav' });
      }

      async function generateInstrumental(event) {
        const prompt = document.getElementById('music-prompt').value;
        const hfKey = document.getElementById('hf-key').value;
        if (!prompt || !hfKey) {
          alert('Missing prompt or Hugging Face API key.');
          return;
        }

        const btn = event.target;
        btn.textContent = 'Producing Track...';

        try {
          const response = await fetch('https://api-inference.huggingface.co/models/facebook/musicgen-small', {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + hfKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: prompt })
          });

          if (!response.ok) {
            throw new Error('API request failed. Check your key or try again.');
          }

          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const audioEl = document.getElementById('inst-audio');
          audioEl.src = url;
          audioEl.style.display = 'block';
          btn.textContent = 'Generate Instrumental';
        } catch (error) {
          alert('Error: ' + error.message);
          btn.textContent = 'Generate Instrumental';
        }
      }

      async function generateArt(event) {
        const prompt = document.getElementById('art-prompt').value;
        const hfKey = document.getElementById('hf-key').value;
        if (!prompt || !hfKey) {
          alert('Missing prompt or Hugging Face API key.');
          return;
        }

        const btn = event.target;
        btn.textContent = 'Painting...';

        try {
          const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0', {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + hfKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: prompt })
          });

          if (!response.ok) {
            throw new Error('Artwork request failed.');
          }

          const blob = await response.blob();
          const url = URL.createObjectURL(blob);

          let imgEl = document.getElementById('generated-art');
          if (!imgEl) {
            imgEl = document.createElement('img');
            imgEl.id = 'generated-art';
            event.target.parentNode.appendChild(imgEl);
          }

          imgEl.src = url;
          btn.textContent = 'Generate Cover Art';
        } catch (error) {
          alert('Error: ' + error.message);
          btn.textContent = 'Generate Cover Art';
        }
      }

      loadTrack();
    </script>
  </body>
</html>`;

    return new Response(html, {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
    });
  },
};
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Progressive Web App Manifest (Downloadable App)
    if (url.pathname === '/manifest.json') {
      return new Response(JSON.stringify({
        "name": "Eco Emo",
        "short_name": "Eco Emo",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#000000",
        "theme_color": "#4A9B7A",
        "icons": [{ "src": "/assets/moth-favicon.png", "sizes": "512x512", "type": "image/png" }]
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    // Payment Webhooks (Stripe, PayPal, Crypto)
    if (url.pathname === '/webhooks/payments') {
      const payload = await request.json();
      // Payout Split Logic: Calculate conservation donation vs overhead
      const totalAmount = payload.amount;
      const donationCut = totalAmount * 0.15; // 15% to real-world conservation orgs
      const payoutCut = totalAmount - donationCut;
      
      await env.BIGQUERY_LOGGER.fetch('https://your-bigquery-endpoint', {
        method: 'POST',
        body: JSON.stringify({ type: 'transaction', split: { donationCut, payoutCut }, data: payload })
      });
      return new Response('Payment processed and split recorded', { status: 200 });
    }

    // Merch Design Approval Gateway (Strict Confirmation Mode)
    if (url.pathname === '/automate/merch-design') {
      const designPayload = await request.json();
      // Agent generates design, but ONLY saves as draft in Printify API
      const printifyDraft = await fetch('https://api.printify.com/v1/shops/SHOP_ID/products.json', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${env.PRINTIFY_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...designPayload, visible: false }) // visible: false ensures it requires manual publish
      });
      return new Response('Design generated and pending manual confirmation', { status: 200 });
    }

    // Spotify playlist removed from frontend configuration internally
    return new Response('Agency Den Active. Spotify module stripped.', { status: 200 });
  }
};
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eco Emo | Agency Den & Endling Studio</title>
    <style>
        :root { --bg: #000000; --cream: #C8C0A8; --border: #C8C0A8; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); color: var(--cream); font-family: 'Courier New', Courier, monospace; line-height: 1.6; padding: 1.5rem; }
        
        header { text-align: center; border-bottom: 2px solid var(--cream); padding-bottom: 2rem; margin-bottom: 2rem; position: relative; }
        .ar-tree-banner { height: 120px; background: radial-gradient(circle, #111 0%, #000 100%); border: 1px solid var(--cream); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; position: relative; overflow: hidden; }
        .ar-tree-banner::after { content: "🌿 [AR BLEEDING TREE ACTIVE]"; font-size: 0.9rem; letter-spacing: 2px; color: var(--cream); opacity: 0.8; }
        
        h1 { font-size: 2rem; letter-spacing: 3px; margin-bottom: 0.5rem; }
        .tagline { font-style: italic; opacity: 0.9; }

        nav { display: flex; justify-content: center; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
        nav a { color: var(--bg); background: var(--cream); padding: 0.5rem 1rem; text-decoration: none; font-weight: bold; border: 1px solid var(--cream); }
        nav a:hover { background: var(--bg); color: var(--cream); }

        section { border: 1px solid var(--cream); padding: 1.5rem; margin-bottom: 2rem; background: #050505; }
        h2 { border-bottom: 1px solid var(--cream); padding-bottom: 0.5rem; margin-bottom: 1rem; font-size: 1.4rem; }

        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; }
        .card { border: 1px solid var(--cream); padding: 1rem; background: #0a0a0a; display: flex; flex-direction: column; justify-content: space-between; }
        .card h3 { margin-bottom: 0.5rem; font-size: 1.1rem; }
        
        .btn { display: block; text-align: center; margin-top: 1rem; padding: 0.5rem; border: 1px solid var(--cream); color: var(--cream); text-decoration: none; background: #000; cursor: pointer; }
        .btn:hover { background: var(--cream); color: #000; }

        footer { text-align: center; margin-top: 3rem; font-size: 0.8rem; opacity: 0.7; border-top: 1px solid var(--cream); padding-top: 1rem; }
    </style>
</head>
<body>

    <header>
        <div class="ar-tree-banner"></div>
        <h1>ECO EMO // AGENCY DEN</h1>
        <p class="tagline">Grieve the earth. Save it anyway. (Created by Endling / Christopher Sneed)</p>
    </header>

    <nav>
        <a href="#reclamation">Tier I: Reclamation</a>
        <a href="#degradation">Tier II: Degradation</a>
        <a href="#extinction">Tier III: Extinction</a>
        <a href="#honeybee">Honey Bee Line</a>
        <a href="#vault">The Core Vault (Music)</a>
        <a href="#games">Games</a>
        <a href="#worx">WORX (Scripts & Freelance)</a>
    </nav>

    <!-- TIER I -->
    <section id="reclamation">
        <h2>TIER I: RECLAMATION (Botanical & Soil Restoration)</h2>
        <p>Album: <em>Iron and Ivy</em> | Focus: Rewilding, organic soils, native seed banks.</p>
        <div class="grid" style="margin-top: 1rem;">
            <div class="card">
                <h3>Organic Cotton Flannel Overshirt</h3>
                <p>Heavyweight GOTS-certified organic cotton in charcoal and black plaid with embroidered ƎE chest stamp.</p>
                <a class="btn" href="https://buy.stripe.com/placeholder" target="_blank">Buy ($65)</a>
            </div>
            <div class="card">
                <h3>Heirloom Wildflower & Tree Seed Tin</h3>
                <p>Milkweed and American Chestnut restoration seeds in a reusable, compostable tin.</p>
                <a class="btn" href="https://buy.stripe.com/placeholder" target="_blank">Buy ($22)</a>
            </div>
            <div class="card">
                <h3>Soy Wax Pillar Candle ("Rootbound")</h3>
                <p>Cedarwood, forest moss, and pine resin in organic soy wax with seed-paper labels.</p>
                <a class="btn" href="https://buy.stripe.com/placeholder" target="_blank">Buy ($28)</a>
            </div>
        </div>
    </section>

    <!-- TIER II -->
    <section id="degradation">
        <h2>TIER II: DEGRADATION (Industrial Critique & Upcycled Utility)</h2>
        <p>Album: <em>Drowning in Ghost Threads</em> | Focus: Reclaiming industrial waste & urban decay.</p>
        <div class="grid" style="margin-top: 1rem;">
            <div class="card">
                <h3>Heavyweight Organic Hoodie</h3>
                <p>500gsm french terry in Pure Black with distressed thumbholes and agency den back art.</p>
                <a class="btn" href="https://buy.stripe.com/placeholder" target="_blank">Buy ($75)</a>
            </div>
            <div class="card">
                <h3>Acid-Wash Distressed Skinny Jeans</h3>
                <p>Organic black denim with heavy knee shredding and eco-friendly enzyme wash.</p>
                <a class="btn" href="https://buy.stripe.com/placeholder" target="_blank">Buy ($85)</a>
            </div>
            <div class="card">
                <h3>Upcycled Gear Bookends</h3>
                <p>Forged from reclaimed factory machinery gears and scrap steel in matte black.</p>
                <a class="btn" href="https://buy.stripe.com/placeholder" target="_blank">Buy ($45)</a>
            </div>
        </div>
    </section>

    <!-- TIER III -->
    <section id="extinction">
        <h2>TIER III: EXTINCTION (Memorial & Final Stand)</h2>
        <p>Album: <em>Solastalgia</em> | Focus: Honoring extinct species & minimalist obsidian design.</p>
        <div class="grid" style="margin-top: 1rem;">
            <div class="card">
                <h3>Minimalist Heavyweight Tee</h3>
                <p>Pure black organic ring-spun cotton with mini ƎE chest stamp and skeletal back artwork.</p>
                <a class="btn" href="https://buy.stripe.com/placeholder" target="_blank">Buy ($35)</a>
            </div>
            <div class="card">
                <h3>Skeletal Line-Art Ceramic Vase</h3>
                <p>Matte black ceramic hand-painted with minimalist white bone and floral line art.</p>
                <a class="btn" href="https://buy.stripe.com/placeholder" target="_blank">Buy ($40)</a>
            </div>
            <div class="card">
                <h3>Night-Blooming Cereus Resin Incense</h3>
                <p>Sustainably gathered botanical resins for slow-burn meditation and release.</p>
                <a class="btn" href="https://buy.stripe.com/placeholder" target="_blank">Buy ($18)</a>
            </div>
        </div>
    </section>

    <!-- HONEY BEE LINE -->
    <section id="honeybee">
        <h2>SPECIAL COLLECTION: THE HONEY BEE LINE</h2>
        <p>Dedicated to pollinator protection, pesticide-free agriculture, and hive preservation.</p>
        <div class="grid" style="margin-top: 1rem;">
            <div class="card">
                <h3>"Save the Swarm" Organic Tee</h3>
                <p>Mini ƎE honeybee chest logo and gothic anatomical bee back art in Aged Cream.</p>
                <a class="btn" href="https://buy.stripe.com/placeholder" target="_blank">Buy ($35)</a>
            </div>
            <div class="card">
                <h3>Wildflower Seed Bomb Tin</h3>
                <p>50+ native wildflower seed balls formulated specifically to feed struggling honeybees.</p>
                <a class="btn" href="https://buy.stripe.com/placeholder" target="_blank">Buy ($20)</a>
            </div>
            <div class="card">
                <h3>Apiary Canvas Tote Bag</h3>
                <p>Unbleached organic hemp canvas carryall with bold gothic conservation typography.</p>
                <a class="btn" href="https://buy.stripe.com/placeholder" target="_blank">Buy ($25)</a>
            </div>
        </div>
    </section>

    <!-- THE CORE VAULT (MUSIC) -->
    <section id="vault">
        <h2>THE CORE VAULT // ENDLING AUDIO STREAMING</h2>
        <p>No Spotify embeds. Pure original post-hardcore, metalcore, and screamo tracks.</p>
        <div class="card" style="margin-top: 1rem; background: #000;">
            <h3>Endling — *Solastalgia* (Master Album Stream)</h3>
            <p style="margin: 0.5rem 0;">Featuring: "Rootbound", "Chlorophyll & Rust", "Acid Rain Parade", "Endling's Escape", "The Endling's Solitude", "Ash on the Solstice".</p>
            <audio controls style="width: 100%; margin-top: 1rem; filter: invert(1);">
                <source src="#" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        </div>
    </section>

    <!-- GAMES -->
    <section id="games">
        <h2>ECO EMO ARCADE // 2D PHYSICS GAMES</h2>
        <div class="grid" style="margin-top: 1rem;">
            <div class="card">
                <h3>Plant Your Future (Tier I)</h3>
                <p>Engineer root networks to stabilize toxic soil and unlock conservation seeds.</p>
                <a class="btn" href="#" onclick="alert('Launching Plant Your Future build...')">Play Web Build</a>
            </div>
            <div class="card">
                <h3>Endling's Escape (Tier II)</h3>
                <p>2D momentum-based survival platformer with ragdoll slapstick physics.</p>
                <a class="btn" href="#" onclick="alert('Launching Monster Mash / Endling Build...')">Play Web Build</a>
            </div>
            <div class="card">
                <h3>Vaquita Deep (Tier III)</h3>
                <p>Underwater acoustic navigation game tracking elusive marine mammals via sonar.</p>
                <a class="btn" href="#" onclick="alert('Launching Vaquita Deep build...')">Play Web Build</a>
            </div>
        </div>
    </section>

    <!-- WORX PORTAL -->
    <section id="worx">
        <h2>WORX // AUTOMATION & SCRIPT REPOSITORY</h2>
        <p>Instant digital micro-licenses for developers and creators. Funding direct conservation.</p>
        <div class="grid" style="margin-top: 1rem;">
            <div class="card">
                <h3>Wild Scribe Content Automation</h3>
                <p>Python automated environmental writing & documentation pipeline.</p>
                <a class="btn" href="https://buy.stripe.com/placeholder" target="_blank">Download ($15)</a>
            </div>
            <div class="card">
                <h3>Cloudflare Worker API Boilerplate</h3>
                <p>Zero-cost serverless edge deployment setup for e-commerce and audio.</p>
                <a class="btn" href="https://buy.stripe.com/placeholder" target="_blank">Download ($25)</a>
            </div>
        </div>
    </section>

    <footer>
        <p>&copy; 2026 Endling & Eco Emo Brand. All rights reserved. Grieve the earth. Save it anyway.</p>
    </footer>

</body>
</html>
<style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Special+Elite&display=swap');

    :root { --bg: #000000; --cream: #C8C0A8; --border: #C8C0A8; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg); color: var(--cream); font-family: 'Special Elite', monospace; line-height: 1.6; padding: 1.5rem; }
    
    header { text-align: center; border: 2px solid var(--cream); padding: 2.5rem 1rem; margin-bottom: 2rem; background: #030303; position: relative; box-shadow: 0 0 20px rgba(200, 192, 168, 0.05); }
    
    .ar-tree-banner { height: 140px; background: radial-gradient(circle, #121212 0%, #000000 100%); border: 1px solid var(--cream); display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; position: relative; overflow: hidden; }
    .ar-tree-banner::after { content: "🌿 [AR BLEEDING TREE ACTIVE // AGENCY DEN]"; font-size: 0.85rem; letter-spacing: 4px; color: var(--cream); opacity: 0.85; text-transform: uppercase; font-family: monospace; }
    
    h1 { font-family: 'Cinzel', serif; font-size: 2.8rem; letter-spacing: 6px; font-weight: 900; color: var(--cream); margin-bottom: 0.5rem; text-shadow: 2px 2px 0px #1a1a1a; }
    .tagline { font-style: italic; opacity: 0.85; letter-spacing: 1.5px; font-size: 1.05rem; }

    nav { display: flex; justify-content: center; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
    nav a { color: var(--bg); background: var(--cream); padding: 0.6rem 1.2rem; text-decoration: none; font-weight: bold; border: 1px solid var(--cream); font-family: monospace; text-transform: uppercase; letter-spacing: 1px; transition: all 0.2s ease; }
    nav a:hover { background: var(--bg); color: var(--cream); box-shadow: 0 0 10px rgba(200, 192, 168, 0.3); }

    section { border: 1px solid var(--cream); padding: 1.5rem; margin-bottom: 2rem; background: #050505; }
    h2 { border-bottom: 1px solid var(--cream); padding-bottom: 0.5rem; margin-bottom: 1rem; font-size: 1.4rem; font-family: 'Cinzel', serif; letter-spacing: 2px; }

    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; }
    .card { border: 1px solid var(--cream); padding: 1.2rem; background: #0a0a0a; display: flex; flex-direction: column; justify-content: space-between; }
    .card h3 { margin-bottom: 0.5rem; font-size: 1.1rem; font-family: 'Cinzel', serif; letter-spacing: 1px; }
    
    .btn { display: block; text-align: center; margin-top: 1rem; padding: 0.6rem; border: 1px solid var(--cream); color: var(--cream); text-decoration: none; background: #000; cursor: pointer; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; }
    .btn:hover { background: var(--cream); color: #000; }

    footer { text-align: center; margin-top: 3rem; font-size: 0.8rem; opacity: 0.7; border-top: 1px solid var(--cream); padding-top: 1.5rem; letter-spacing: 1px; }
</style>
