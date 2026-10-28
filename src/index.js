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
