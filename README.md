cd existing_repogit remote rename origin old-origin
git remote add origin git@gitlab.com:ecoemo-group/ecoemo-agency-den.git
git push --set-upstream origin --all
git push --set-upstream origin --tagsIPexport default {
  async fetch(request, env) {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ENDLING | The Forge</title>
        <link rel="icon" href="https://ecoemo.store/assets/moth-favicon.png">
        <style>
            body { background: #000000; color: #C8C0A8; font-family: monospace; padding: 15px; margin: 0; }
            .header { text-align: center; border-bottom: 1px solid #4A9B7A; padding-bottom: 10px; margin-bottom: 15px; }
            h1, h2, h3 { color: #C8C0A8; font-family: serif; margin: 5px 0; }
            h1 { color: #4A9B7A; letter-spacing: 2px; }
            .grid { display: grid; grid-template-columns: 1fr; gap: 15px; }
            @media(min-width: 768px) { .grid { grid-template-columns: 1fr 1fr; } }
            .panel { border: 1px solid #333; background: #050505; padding: 15px; }
            button, input[type="file"] { background: transparent; color: #C8C0A8; border: 1px solid #C8C0A8; padding: 10px; cursor: pointer; text-transform: uppercase; font-family: serif; font-weight: bold; margin-top: 5px; width: 100%; box-sizing: border-box; transition: 0.2s; }
            button:hover { background: #4A9B7A; color: #000; border-color: #4A9B7A; }
            textarea, input[type="password"] { width: 100%; background: #111; color: #C8C0A8; border: 1px solid #333; padding: 10px; box-sizing: border-box; font-family: monospace; margin-top: 5px; }
            .lyrics-box { height: 200px; overflow-y: auto; background: #080808; border: 1px solid #222; padding: 10px; white-space: pre-wrap; font-size: 0.9rem; line-height: 1.4; }
            audio { width: 100%; margin-top: 10px; outline: none; }
            .controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
            .controls button { width: auto; padding: 5px 15px; }
        </style>
    </head>
    <body>

        <div class="header">
            <h1>ENDLING STUDIO</h1>
            <div style="color:#4A9B7A; font-style:italic;">grieve the earth. save it anyway.</div>
        </div>

        <div class="grid">
            <!-- LYRICS & TRACK SELECTOR -->
            <div class="panel">
                <div class="controls">
                    <button onclick="prevTrack()">&#x2020; PREV</button>
                    <span id="track-title" style="font-weight:bold; color:#4A9B7A;">Loading...</span>
                    <button onclick="nextTrack()">NEXT &#x2020;</button>
                </div>
                <div class="lyrics-box" id="lyrics-display"></div>
            </div>

            <!-- VOCAL FORGE (UPLOAD & PROCESS) -->
            <div class="panel">
                <h3>Vocal Forge (Upload Takes)</h3>
                <input type="file" id="audio-upload" accept="audio/*">
                
                <div id="raw-audio-container" style="display:none; margin-top:10px;">
                    <span style="font-size:0.8rem; color:#666;">RAW TAKE:</span>
                    <audio id="raw-audio" controls></audio>
                    <button id="process-btn" style="border-color:#4A9B7A; color:#4A9B7A;">Apply Endling Scream FX</button>
                </div>
                
                <div id="processed-audio-container" style="display:none; margin-top:10px;">
                    <span style="font-size:0.8rem; color:#4A9B7A;">PROCESSED STEM:</span>
                    <audio id="processed-audio" controls></audio>
                    <a id="download-link" href="#" download="endling_vocal_stem.wav"><button style="margin-top:5px;">Download Stem</button></a>
                </div>
            </div>

            <!-- INSTRUMENTAL GENERATOR -->
            <div class="panel">
                <h3>The Producer (MusicGen)</h3>
                <textarea id="music-prompt" rows="3" placeholder="Instrumental prompt (e.g., Heavy post-hardcore, drop-D guitars, 75 BPM...)"></textarea>
                <input type="password" id="hf-key" placeholder="Paste Hugging Face API Key Here">
                <button onclick="generateInstrumental(event)">Generate Instrumental</button>
                <audio id="inst-audio" controls style="display:none;"></audio>
            </div>

            <!-- ART GENERATOR -->
            <div class="panel">
                <h3>Cover Art (Stable Diffusion)</h3>
                <textarea id="art-prompt" rows="2" placeholder="Visual prompt (e.g., A single glowing Luna Moth on a rusted street lamp, dark moss...)"></textarea>
                <button onclick="generateArt(event)">Generate Cover Art</button>
                <!-- Generated image will appear here -->
            </div>
        </div>

        <script>
            // --- 1. LYRICS SYSTEM ---
            const tracks = [
                { title: "1. REQUIEM FOR THE LIGHT", lyrics: "[Intro]\\nSeven days in the dark...\\nNo mouth to feed..." },
                { title: "2. IRON AND IVY", lyrics: "[Intro]\\nYou built your towers to outlast the sun...\\nBut the soil was waiting all along." },
                { title: "3. THE ENDLING'S SOLITUDE", lyrics: "[Intro]\\nAn endling does not know it is the last...\\nIt only knows... no one ever answers." },
                { title: "4. DROWNING IN GHOST THREADS", lyrics: "[Intro]\\nThree thousand miles of open blue...\\nTrapped in a web we never knew." },
                { title: "5. ECHOES OF THE ANCIENT GIANTS", lyrics: "[Intro]\\nOne thousand years to grow a canopy...\\nTwenty minutes to cut it down." },
                { title: "6. ASH ON THE SOLSTICE", lyrics: "[Intro]\\nSummer comes with smoke now...\\nThe winter comes without snow..." }
            ]; // Paste full lyrics back in here later.

            let currentTrack = 0;
            function loadTrack() {
                document.getElementById('track-title').innerText = tracks[currentTrack].title;
                document.getElementById('lyrics-display').innerText = tracks[currentTrack].lyrics;
            }
            function prevTrack() { if (currentTrack > 0) { currentTrack--; loadTrack(); } }
            function nextTrack() { if (currentTrack < tracks.length - 1) { currentTrack++; loadTrack(); } }
            loadTrack();

            // --- 2. VOCAL UPLOAD ---
            let rawAudioBlob;
            document.getElementById('audio-upload').addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (!file) return;
                rawAudioBlob = file;
                document.getElementById('raw-audio').src = URL.createObjectURL(file);
                document.getElementById('raw-audio-container').style.display = 'block';
                document.getElementById('processed-audio-container').style.display = 'none';
            });

            // --- 3. IN-BROWSER AUDIO DSP (THE "SCREAM" PROCESSOR) ---
            document.getElementById('process-btn').addEventListener('click', async () => {
                if (!rawAudioBlob) return;
                
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const arrayBuffer = await rawAudioBlob.arrayBuffer();
                const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
                
                const offlineCtx = new OfflineAudioContext(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);
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
                    let k = amount, n_samples = 44100, curve = new Float32Array(n_samples), deg = Math.PI / 180, x;
                    for (let i = 0; i < n_samples; ++i) {
                        x = i * 2 / n_samples - 1;
                        curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
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
                let numOfChan = abuffer.numberOfChannels, length = len * numOfChan * 2 + 44, buffer = new ArrayBuffer(length), view = new DataView(buffer), channels = [], i, sample, offset = 0, pos = 0;
                function setUint16(data) { view.setUint16(pos, data, true); pos += 2; }
                function setUint32(data) { view.setUint32(pos, data, true); pos += 4; }
                setUint32(0x46464952); setUint32(length - 8); setUint32(0x45564157); setUint32(0x20746d66); setUint32(16); setUint16(1); setUint16(numOfChan); setUint32(abuffer.sampleRate); setUint32(abuffer.sampleRate * 2 * numOfChan); setUint16(numOfChan * 2); setUint16(16); setUint32(0x61746164); setUint32(length - pos - 4);
                for(i = 0; i < abuffer.numberOfChannels; i++) channels.push(abuffer.getChannelData(i));
                while(pos < length) {
                    for(i = 0; i < numOfChan; i++) {
                        sample = Math.max(-1, Math.min(1, channels[i][offset])); 
                        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0; view.setInt16(pos, sample, true); pos += 2;
                    }
                    offset++;
                }
                return new Blob([buffer], {type: "audio/wav"});
            }

            // --- 4. INSTRUMENTAL API FETCH ---
            async function generateInstrumental(event) {
                const prompt = document.getElementById('music-prompt').value;
                const hfKey = document.getElementById('hf-key').value;
                if (!prompt || !hfKey) return alert("Missing prompt or Hugging Face API key.");
                
                const btn = event.target;
                btn.innerText = "Producing Track... (Takes 1-3 mins)";
                
                try {
                    const response = await fetch("https://api-inference.huggingface.co/models/facebook/musicgen-small", {
                        headers: { "Authorization": "Bearer " + hfKey, "Content-Type": "application/json" },
                        method: "POST",
                        body: JSON.stringify({ inputs: prompt }),
                    });
                    if(!response.ok) throw new Error("API Request Failed. Check key or try again.");
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    const audioEl = document.getElementById('inst-audio');
                    audioEl.src = url;
                    audioEl.style.display = "block";
                    btn.innerText = "Generate Instrumental";
                } catch(e) {
                    alert("Error: " + e.message);
                    btn.innerText = "Generate Instrumental";
                }
            }

            // --- 5. ART GENERATOR API FETCH ---
            async function generateArt(event) {
                const prompt = document.getElementById('art-prompt').value;
                const hfKey = document.getElementById('hf-key').value;
                if (!prompt || !hfKey) return alert("Missing prompt or Hugging Face API key.");
                
                const btn = event.target;
                btn.innerText = "Painting... (Takes ~30 seconds)";
                
                try {
                    const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
                        headers: { "Authorization": "Bearer " + hfKey, "Content-Type": "application/json" },
                        method: "POST",
                        body: JSON.stringify({ inputs: prompt }),
                    });
                    if(!response.ok) throw new Error("API Request Failed.");
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    
                    let imgEl = document.getElementById('generated-art');
                    if (!imgEl) {
                        imgEl = document.createElement('img');
                        imgEl.id = 'generated-art';
                        imgEl.style.width = '100%';
                        imgEl.style.marginTop = '10px';
                        imgEl.style.border = '1px solid #4A9B7A';
                        event.target.parentNode.appendChild(imgEl);
                    }
                    imgEl.src = url;
                    btn.innerText = "Generate Cover Art";
                } catch(e) {
                    alert("Error: " + e.message);
                    btn.innerText = "Generate Cover Art";
                }
            }
        </script>
    </body>
    </html>
    `;

    return new Response(html, {
      headers: { "content-type": "text/html;charset=UTF-8" },
    });
  },
};
export default {
  async fetch(request, env) {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ENDLING | The Forge</title>
        <link rel="icon" href="https://ecoemo.store/assets/moth-favicon.png">
        <style>
            body { background: #000000; color: #C8C0A8; font-family: monospace; padding: 15px; margin: 0; }
            .header { text-align: center; border-bottom: 1px solid #4A9B7A; padding-bottom: 10px; margin-bottom: 15px; }
            h1, h2, h3 { color: #C8C0A8; font-family: serif; margin: 5px 0; }
            h1 { color: #4A9B7A; letter-spacing: 2px; }
            .grid { display: grid; grid-template-columns: 1fr; gap: 15px; }
            @media(min-width: 768px) { .grid { grid-template-columns: 1fr 1fr; } }
            .panel { border: 1px solid #333; background: #050505; padding: 15px; }
            button, input[type="file"] { background: transparent; color: #C8C0A8; border: 1px solid #C8C0A8; padding: 10px; cursor: pointer; text-transform: uppercase; font-family: serif; font-weight: bold; margin-top: 5px; width: 100%; box-sizing: border-box; transition: 0.2s; }
            button:hover { background: #4A9B7A; color: #000; border-color: #4A9B7A; }
            textarea, input[type="password"] { width: 100%; background: #111; color: #C8C0A8; border: 1px solid #333; padding: 10px; box-sizing: border-box; font-family: monospace; margin-top: 5px; }
            .lyrics-box { height: 200px; overflow-y: auto; background: #080808; border: 1px solid #222; padding: 10px; white-space: pre-wrap; font-size: 0.9rem; line-height: 1.4; }
            audio { width: 100%; margin-top: 10px; outline: none; }
            .controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
            .controls button { width: auto; padding: 5px 15px; }
        </style>
    </head>
    <body>

        <div class="header">
            <h1>ENDLING STUDIO</h1>
            <div style="color:#4A9B7A; font-style:italic;">grieve the earth. save it anyway.</div>
        </div>

        <div class="grid">
            <!-- LYRICS & TRACK SELECTOR -->
            <div class="panel">
                <div class="controls">
                    <button onclick="prevTrack()">&#x2020; PREV</button>
                    <span id="track-title" style="font-weight:bold; color:#4A9B7A;">Loading...</span>
                    <button onclick="nextTrack()">NEXT &#x2020;</button>
                </div>
                <div class="lyrics-box" id="lyrics-display"></div>
            </div>

            <!-- VOCAL FORGE (UPLOAD & PROCESS) -->
            <div class="panel">
                <h3>Vocal Forge (Upload Takes)</h3>
                <input type="file" id="audio-upload" accept="audio/*">
                
                <div id="raw-audio-container" style="display:none; margin-top:10px;">
                    <span style="font-size:0.8rem; color:#666;">RAW TAKE:</span>
                    <audio id="raw-audio" controls></audio>
                    <button id="process-btn" style="border-color:#4A9B7A; color:#4A9B7A;">Apply Endling Scream FX</button>
                </div>
                
                <div id="processed-audio-container" style="display:none; margin-top:10px;">
                    <span style="font-size:0.8rem; color:#4A9B7A;">PROCESSED STEM:</span>
                    <audio id="processed-audio" controls></audio>
                    <a id="download-link" href="#" download="endling_vocal_stem.wav"><button style="margin-top:5px;">Download Stem</button></a>
                </div>
            </div>

            <!-- INSTRUMENTAL GENERATOR -->
            <div class="panel">
                <h3>The Producer (MusicGen)</h3>
                <textarea id="music-prompt" rows="3" placeholder="Instrumental prompt (e.g., Heavy post-hardcore, drop-D guitars, 75 BPM...)"></textarea>
                <input type="password" id="hf-key" placeholder="Paste Hugging Face API Key Here">
                <button onclick="generateInstrumental(event)">Generate Instrumental</button>
                <audio id="inst-audio" controls style="display:none;"></audio>
            </div>

            <!-- ART GENERATOR -->
            <div class="panel">
                <h3>Cover Art (Stable Diffusion)</h3>
                <textarea id="art-prompt" rows="2" placeholder="Visual prompt (e.g., A single glowing Luna Moth on a rusted street lamp, dark moss...)"></textarea>
                <button onclick="generateArt(event)">Generate Cover Art</button>
                <!-- Generated image will appear here -->
            </div>
        </div>

        <script>
            // --- 1. LYRICS SYSTEM ---
            const tracks = [
                { title: "1. REQUIEM FOR THE LIGHT", lyrics: "[Intro]\\nSeven days in the dark...\\nNo mouth to feed..." },
                { title: "2. IRON AND IVY", lyrics: "[Intro]\\nYou built your towers to outlast the sun...\\nBut the soil was waiting all along." },
                { title: "3. THE ENDLING'S SOLITUDE", lyrics: "[Intro]\\nAn endling does not know it is the last...\\nIt only knows... no one ever answers." },
                { title: "4. DROWNING IN GHOST THREADS", lyrics: "[Intro]\\nThree thousand miles of open blue...\\nTrapped in a web we never knew." },
                { title: "5. ECHOES OF THE ANCIENT GIANTS", lyrics: "[Intro]\\nOne thousand years to grow a canopy...\\nTwenty minutes to cut it down." },
                { title: "6. ASH ON THE SOLSTICE", lyrics: "[Intro]\\nSummer comes with smoke now...\\nThe winter comes without snow..." }
            ]; // Paste full lyrics back in here later.

            let currentTrack = 0;
            function loadTrack() {
                document.getElementById('track-title').innerText = tracks[currentTrack].title;
                document.getElementById('lyrics-display').innerText = tracks[currentTrack].lyrics;
            }
            function prevTrack() { if (currentTrack > 0) { currentTrack--; loadTrack(); } }
            function nextTrack() { if (currentTrack < tracks.length - 1) { currentTrack++; loadTrack(); } }
            loadTrack();

            // --- 2. VOCAL UPLOAD ---
            let rawAudioBlob;
            document.getElementById('audio-upload').addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (!file) return;
                rawAudioBlob = file;
                document.getElementById('raw-audio').src = URL.createObjectURL(file);
                document.getElementById('raw-audio-container').style.display = 'block';
                document.getElementById('processed-audio-container').style.display = 'none';
            });

            // --- 3. IN-BROWSER AUDIO DSP (THE "SCREAM" PROCESSOR) ---
            document.getElementById('process-btn').addEventListener('click', async () => {
                if (!rawAudioBlob) return;
                
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const arrayBuffer = await rawAudioBlob.arrayBuffer();
                const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
                
                const offlineCtx = new OfflineAudioContext(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);
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
                    let k = amount, n_samples = 44100, curve = new Float32Array(n_samples), deg = Math.PI / 180, x;
                    for (let i = 0; i < n_samples; ++i) {
                        x = i * 2 / n_samples - 1;
                        curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
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
                let numOfChan = abuffer.numberOfChannels, length = len * numOfChan * 2 + 44, buffer = new ArrayBuffer(length), view = new DataView(buffer), channels = [], i, sample, offset = 0, pos = 0;
                function setUint16(data) { view.setUint16(pos, data, true); pos += 2; }
                function setUint32(data) { view.setUint32(pos, data, true); pos += 4; }
                setUint32(0x46464952); setUint32(length - 8); setUint32(0x45564157); setUint32(0x20746d66); setUint32(16); setUint16(1); setUint16(numOfChan); setUint32(abuffer.sampleRate); setUint32(abuffer.sampleRate * 2 * numOfChan); setUint16(numOfChan * 2); setUint16(16); setUint32(0x61746164); setUint32(length - pos - 4);
                for(i = 0; i < abuffer.numberOfChannels; i++) channels.push(abuffer.getChannelData(i));
                while(pos < length) {
                    for(i = 0; i < numOfChan; i++) {
                        sample = Math.max(-1, Math.min(1, channels[i][offset])); 
                        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0; view.setInt16(pos, sample, true); pos += 2;
                    }
                    offset++;
                }
                return new Blob([buffer], {type: "audio/wav"});
            }

            // --- 4. INSTRUMENTAL API FETCH ---
            async function generateInstrumental(event) {
                const prompt = document.getElementById('music-prompt').value;
                const hfKey = document.getElementById('hf-key').value;
                if (!prompt || !hfKey) return alert("Missing prompt or Hugging Face API key.");
                
                const btn = event.target;
                btn.innerText = "Producing Track... (Takes 1-3 mins)";
                
                try {
                    const response = await fetch("https://api-inference.huggingface.co/models/facebook/musicgen-small", {
                        headers: { "Authorization": "Bearer " + hfKey, "Content-Type": "application/json" },
                        method: "POST",
                        body: JSON.stringify({ inputs: prompt }),
                    });
                    if(!response.ok) throw new Error("API Request Failed. Check key or try again.");
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    const audioEl = document.getElementById('inst-audio');
                    audioEl.src = url;
                    audioEl.style.display = "block";
                    btn.innerText = "Generate Instrumental";
                } catch(e) {
                    alert("Error: " + e.message);
                    btn.innerText = "Generate Instrumental";
                }
            }

            // --- 5. ART GENERATOR API FETCH ---
            async function generateArt(event) {
                const prompt = document.getElementById('art-prompt').value;
                const hfKey = document.getElementById('hf-key').value;
                if (!prompt || !hfKey) return alert("Missing prompt or Hugging Face API key.");
                
                const btn = event.target;
                btn.innerText = "Painting... (Takes ~30 seconds)";
                
                try {
                    const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
                        headers: { "Authorization": "Bearer " + hfKey, "Content-Type": "application/json" },
                        method: "POST",
                        body: JSON.stringify({ inputs: prompt }),
                    });
                    if(!response.ok) throw new Error("API Request Failed.");
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    
                    let imgEl = document.getElementById('generated-art');
                    if (!imgEl) {
                        imgEl = document.createElement('img');
                        imgEl.id = 'generated-art';
                        imgEl.style.width = '100%';
                        imgEl.style.marginTop = '10px';
                        imgEl.style.border = '1px solid #4A9B7A';
                        event.target.parentNode.appendChild(imgEl);
                    }
                    imgEl.src = url;
                    btn.innerText = "Generate Cover Art";
                } catch(e) {
                    alert("Error: " + e.message);
                    btn.innerText = "Generate Cover Art";
                }
            }
        </script>
    </body>
    </html>
    `;

    return new Response(html, {
      headers: { "content-type": "text/html;charset=UTF-8" },
    });
  },
};
pip install torch torchvision torchaudio
pip install diffusers transformers accelerate
pip install git+https://github.com/facebookresearch/audiocraft.git
Vault
Coreplayer

<title>Endling Core Vault</title> <style> body { background-color: #0b0c10; /* Obsidian Black */ color: #e8e5d7; /* Aged Cream */ font-family: monospace; text-align: center; padding: 2rem; } .player-container { border: 1px solid #e8e5d7; padding: 20px; max-width: 600px; margin: 0 auto; } .dagger-btn { background: transparent; color: #e8e5d7; border: 1px solid #e8e5d7; padding: 10px 20px; cursor: pointer; font-family: serif; /* Gothic feel */ text-transform: uppercase; margin: 5px; } .lyrics-display { margin-top: 20px; white-space: pre-wrap; font-size: 0.9rem; text-align: left; } </style>
ENDLING: SOLASTALGIA
Loading...
<!-- Gothic Dagger Controls -->
<div>
    <button class="dagger-btn" onclick="prevTrack()">&#x2020; Prev</button>
    <button class="dagger-btn" onclick="playPause()">Play / Pause</button>
    <button class="dagger-btn" onclick="nextTrack()">Next &#x2020;</button>
</div>

<div class="lyrics-display" id="lyrics-box">
    // Lyrics will load here...
</div>
<script> // Solastalgia Dossier Data const endlingTracks = [ { title: "Track 1 Name Here", audioUrl: "https://your-bucket-url.com/track1.mp3", lyrics: `Paste lyrics for track 1 here...` }, { title: "Track 2 Name Here", audioUrl: "https://your-bucket-url.com/track2.mp3", lyrics: `Paste lyrics for track 2 here...` } // Add all 6 tracks here ]; let currentTrackIndex = 0; function loadTrack(index) { document.getElementById('track-title').innerText = endlingTracks[index].title; document.getElementById('lyrics-box').innerText = endlingTracks[index].lyrics; // Audio object logic will go here once MP3s are hosted } function prevTrack() { if (currentTrackIndex > 0) { currentTrackIndex--; loadTrack(currentTrackIndex); } } function nextTrack() { if (currentTrackIndex < endlingTracks.length - 1) { currentTrackIndex++; loadTrack(currentTrackIndex); } } function playPause() { alert("Audio routing pending. Need MP3 URLs."); } // Initialize first track loadTrack(currentTrackIndex); </script> <title>ENDLING | Solastalgia</title> <style> body { background-color: #000000; /* Obsidian Black */ color: #C8C0A8; /* Bone Cream */ font-family: monospace; text-align: center; padding: 2rem; margin: 0; } .player-container { border: 1px solid #4A9B7A; /* Forest Green accent */ padding: 20px; max-width: 600px; margin: 0 auto; background-color: #000000; } h2 { font-family: serif; letter-spacing: 2px; margin-bottom: 5px; color: #C8C0A8; } .tagline { font-size: 0.8rem; font-style: italic; color: #4A9B7A; margin-bottom: 20px; } #track-title { font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 10px; } .dagger-btn { background: transparent; color: #C8C0A8; border: 1px solid #C8C0A8; padding: 10px 20px; cursor: pointer; font-family: serif; text-transform: uppercase; margin: 5px; transition: all 0.2s ease; } .dagger-btn:hover { color: #000000; background-color: #4A9B7A; border-color: #4A9B7A; } .lyrics-display { margin-top: 20px; white-space: pre-wrap; font-size: 0.9rem; text-align: left; line-height: 1.4; height: 400px; overflow-y: auto; padding: 15px; border: 1px solid #333; background: #050505; } /* Custom Scrollbar for lyrics */ .lyrics-display::-webkit-scrollbar { width: 8px; } .lyrics-display::-webkit-scrollbar-track { background: #000; } .lyrics-display::-webkit-scrollbar-thumb { background: #4A9B7A; } </style>
ENDLING
grieve the earth. save it anyway.
<h3 id="track-title">Loading...</h3>

<!-- Gothic Dagger Controls -->
<div>
    <button class="dagger-btn" onclick="prevTrack()">&#x2020; Prev</button>
    <button class="dagger-btn" onclick="playPause()">Play / Pause</button>
    <button class="dagger-btn" onclick="nextTrack()">Next &#x2020;</button>
</div>

<div class="lyrics-display" id="lyrics-box">
    // Lyrics will load here...
</div>
<script> const endlingTracks = [ { title: "1. Requiem for the Light", audioUrl: "", // Add MP3 link here when generated lyrics: `[Intro] (Soft fingerpicked acoustic guitar with faint ambient night noise) (Whispered, intimate) Seven days in the dark... No mouth to feed, no time to waste... Just searching for the moon. [Verse 1] Pale emerald wings in the midnight mist Born from the bark that the cold fog kissed You had seven short nights to find your home To dance in the canopy all alone But the horizon burned with a synthetic glow A blinding trap in the clearing below You turned from the stars to the tungsten flame Forgetting the woods that called your name. [Pre-Chorus] (Piano enters, acoustic guitar turns aggressive) Beating against the glass, tearing your silver dust Drawn to a hollow spark, bound by a fatal trust There is no nectar here, there is no sacred mate Only an iron cage, sealing an ancient fate. [Chorus] (Full band explodes: heavy post-hardcore guitars, crushing bass, driving drums) Fly into the fire, bleed upon the street! The last luna moth at the artificial heat! We built a brighter world to blind the dark outside, And watched the quiet light where the wild things died! Fly away, fly away... before the dawn turns grey! [Verse 2] (Acoustic guitar returns with heavy bass underneath) Your delicate tails are ragged and torn Fallen on pavement before the morn No eggs in the oak trees, no larvae in spring Just the quiet remains of a forgotten wing We trade the dark sky for neon and glass Unaware of the shadows that silently pass. [Pre-Chorus] (Distorted guitar swells with piano) Beating against the glass, tearing your silver dust Drawn to a hollow spark, bound by a fatal trust There is no nectar here, there is no sacred mate Only an iron cage, sealing an ancient fate. [Chorus] (Full band: explosive, impassioned) Fly into the fire, bleed upon the street! The last luna moth at the artificial heat! We built a brighter world to blind the dark outside, And watched the quiet light where the wild things died! [Bridge] (Tempo slows, heavy atmospheric sludge riff, strained raspy vocals) (Heavy distorted bass and bowed cello) No mouth to scream... No voice to cry... You came to love the light... That taught you how to die! (Screamed defiance) WE KILLED THE NIGHT! WE KILLED THE NIGHT! [Guitar Solo / Atmospheric Breakdown] (Soaring, weeping electric guitar melody over crashing cymbals and acoustic rhythm) [Chorus] (Maximum intensity, raw emotional vocals) Fly into the fire, bleed upon the street! The last luna moth at the artificial heat! We built a brighter world to blind the dark outside, And watched the quiet light where the wild things died! [Outro] (Drums fade out, soft acoustic guitar and single piano notes) (Whispered) The streetlight flickers... The woods grow cold... The last green light... Fades into the mold. (Fades out with night ambient wind)` }, { title: "2. Iron and Ivy", audioUrl: "", lyrics: `[Intro] (Industrial wind, echoing metal drops, slow acoustic guitar arpeggio) (Spoken low) You built your towers to outlast the sun... But the soil was waiting all along. [Verse 1] Corroded smokestacks reaching for the clouds Empty assembly halls wrapped in dusty shrouds The gears have frozen and the turbines stand cold While quiet green roots break through iron and mold A single acorn splits the factory floor Where heavy boots walked, men walk no more Ferns climb the girders, moss covers the rust Your proudest machines are returning to dust. [Pre-Chorus] (Driving snare drum and heavy acoustic strumming) You carved out the valley, you paved over stone You thought that you conquered the wild alone But time is a river that swallows your pride And nature reclaims what you tried to divide. [Chorus] (Explosive post-hardcore wall of sound, heavy guitars and crashing cymbals) Tear down the iron! Let the ivy grow! Break through the concrete in the earth below! No crown lasts forever, no empire survives When the forest awakes and the green world revives! Nature reclaims everything! [Verse 2] (Acoustic guitar with heavy bass pulse and melodic electric swells) Wild brambles weave through the broken control room Wildflowers bloom in the industrial gloom Barn owls nest in the steel rafters high Watching the night sky as centuries fly No pollution in the water, no smoke in the breeze Just the rustle of leaves and the song of the trees. [Pre-Chorus] (Building percussion and distorted rhythm) You carved out the valley, you paved over stone You thought that you conquered the wild alone But time is a river that swallows your pride And nature reclaims what you tried to divide. [Chorus] (Explosive energy, passionate melodic vocals) Tear down the iron! Let the ivy grow! Break through the concrete in the earth below! No crown lasts forever, no empire survives When the forest awakes and the green world revives! [Bridge] (Rhythm drops to heavy slow sludge beat, thick distorted bass) (Guttural, intense chant) Stone by stone! Vine by vine! You ran out of breath, you ran out of time! Root in the foundation! Bloom in the rust! Every man-made kingdom crumbles into dust! (Shouted) CRUMBLES INTO DUST! [Guitar Solo] (Soaring post-hardcore melodic guitar solo, dual harmony leads over heavy rhythm) [Chorus] (Maximum explosive volume) Tear down the iron! Let the ivy grow! Break through the concrete in the earth below! No crown lasts forever, no empire survives When the forest awakes and the green world revives! [Outro] (Music slows, acoustic guitar and rustling forest leaves) (Soft melodic singing) The iron is fading... The ivy is free... Where concrete once buried... The roots of the tree. (Final deep bass acoustic ring out)` }, { title: "3. The Endling's Solitude", audioUrl: "", lyrics: `[Intro] (Bowed cello notes, weeping acoustic guitar melody) (Soft spoken) An endling does not know it is the last... It only knows... no one ever answers. [Verse 1] I stand at the wire of a wooden cage Or the edge of a forest robbed of its age I call out my name in the tongue of my kin And wait for the echo to linger within One million summers of bloodline and song Carried in bones where I used to belong Now my voice falls flat on the canopy wall And nobody hears when I stumble and fall. [Verse 2] (Acoustic guitar grows darker, subtle bass notes added) I remember the trails where thousands once ran Before the cold wire and weapons of man My mother’s dark eyes, the scent of the rain Now only memories keeping me sane I am the monument, I am the grave The last living creature no science can save. [Chorus] (Heavy post-hardcore riffing, slow thunderous drums, aching vocal delivery) Is anybody listening across the open wild? I am the last forgotten, nature’s lonely child! Ten thousand generations vanish in my breath, A solitary witness to an artificial death! I call into the dark... and the dark stays still! [Verse 3] (Acoustic guitar picking returned, mournful tone) My eyes grow heavy, my heart slows its beat The soil beneath me feels cold and complete No mate in the valley, no calf in the spring Just the silence that waits for the sorrow I bring When I close my eyes at the end of the day An entire world quietly fades away. [Bridge] (Tempo slows to heavy atmospheric sludge tempo, deep fuzz bass, raspy strained vocals) (Building emotion) No next spring... No second chance... The final step of an ancient dance... You took my forest, you took my name, And wrote down my life in a book of shame! (Screamed with agonizing passion) WHO OWNS THE SILENCE WHEN THE LAST ONE DIES?! WHO LOOKS AWAY WHEN THE BLOODLINE CRIES?! [Guitar Solo] (Devastating, melancholic electric guitar solo with long lingering notes and bowed string accompaniment) [Chorus] (Full explosive intensity, layered screaming and clean emotional vocals) Is anybody listening across the open wild? I am the last forgotten, nature’s lonely child! Ten thousand generations vanish in my breath, A solitary witness to an artificial death! [Outro] (All heavy instruments cut, leaving only bowed cello and fingerpicked acoustic guitar) (Breathy, fragile singing) The call goes out... Across the hill... No answer comes... The woods stay still. (Single fading acoustic chord)` }, { title: "4. Drowning in Ghost Threads", audioUrl: "", lyrics: `[Intro] (Deep sub-bass swell, ambient hydrophone ocean textures, reverbed acoustic guitar) (Spoken quietly) Three thousand miles of open blue... Trapped in a web we never knew. [Verse 1] Beneath the surface where the blue turns black An ancient voyager will never make it back Gliding through currents five thousand years old Where sunlight pales and the abyss grows cold But the water is heavy with unnatural threads Monofilament traps where the sea turtle bleeds Floating ghost nets drifting without an end Tangling the limbs of an ocean’s old friend. [Pre-Chorus] (Acoustic strumming intensifies with pulsing bass) A synthetic tide, a poisonous bloom Turning the gulf into an underwater tomb Particles of polyethylene in every breath We fed the deep waters a slow, plastic death. [Chorus] (Heavy post-hardcore guitar wall, driving double-kick drums) Drowning in ghost threads! Choked by the tide! Swallowing the poison where the deep sea died! We wrapped the ocean in a polyester shroud, And cast our rubbish where the waves roared loud! Grieve the blue earth... bleed for the sea! [Verse 2] (Melodic electric guitar swells over tight rhythm section) Plankton and micro-shards tangled in the mesh Nylon cutting deep into salt-soaked flesh Albatross chicks on a remote coral strand Stomach full of bottle caps from a distant land No tide can wash it clean, no storm can tear it down In a sea of manufactured trash we watch the wild ocean drown. [Pre-Chorus] (Building tension) A synthetic tide, a poisonous bloom Turning the gulf into an underwater tomb Particles of polyethylene in every breath We fed the deep waters a slow, plastic death. [Chorus] (Explosive post-hardcore chorus, soaring vocals) Drowning in ghost threads! Choked by the tide! Swallowing the poison where the deep sea died! We wrapped the ocean in a polyester shroud, And cast our rubbish where the waves roared loud! [Bridge] (Tempo slows, crushing atmospheric sludge riff, low guttural growls and emotional screams) Five hundred years in the salt and light! Plastic doesn't rot, plastic doesn't die! It lingers in the water column, blinding every eye! (Fierce scream) WE ARE POISONING THE CRADLE OF LIFE! WE ARE POISONING THE TIDE! [Guitar Solo] (Liquid, delay-heavy atmospheric guitar solo soaring above heavy bass undertones) [Chorus] (Maximum volume and emotional drive) Drowning in ghost threads! Choked by the tide! Swallowing the poison where the deep sea died! We wrapped the ocean in a polyester shroud, And cast our rubbish where the waves roared loud! [Outro] (Ocean waves fading back in, soft acoustic guitar picking) (Muffled, submerged vocal) The tide rolls in... The ghost nets sway... And the deep blue heart... rots away. (Fades out with ocean waves)` }, { title: "5. Echoes of the Ancient Giants", audioUrl: "", lyrics: `[Intro] (Deep timber percussion, low resonant acoustic guitar, wind through tall trees) (Spoken steadily) One thousand years to grow a canopy... Twenty minutes to cut it down. [Verse 1] Roots intertwined in the dark primal peat Holding the mountain beneath ancient feet Redwoods and cedars eight hundred years tall Standing in majesty, watching over all Moss-draped cathedrals where moss covers stone Sovereign sanctuaries the world called its own Then came the engines, the gas and the steel The bite of the saw blade, the crushing iron wheel. [Verse 2] (Acoustic strumming grows louder, low bass rumble) The first undercut bleeds golden amber sap A thousand-year giant falls into the gap The forest floor trembles, the canopy tears A century’s silence vanishes in airs Birds lose their roosts, lichens turn to dust A holy sanctuary sacrificed to human lust. [Chorus] (Crushing sludge post-hardcore riff, thundering timber drums) Timber falls! The forest groans! Chainsaws tearing through ancient bones! You sold the grove for paper and pine, And murdered a temple of sacred design! Listen to the echo of the falling giant! [Verse 3] (Acoustic folk picking with heavy electric drone) Now mudslides wash down the desolate hill Where wild trout swam in the shaded clear rill The sun bakes the soil where shadows once slept And the spirit of the old-growth quietly wept You can plant new saplings in orderly rows But a tree farm is dead where a wild forest grows. [Bridge] (Tempo slows to heavy sludge breakdown, heavy fuzz guitars, raw screamed vocals) (Rhythmic timber beats) A thousand rings of winter! A thousand rings of spring! You cut down the kingdom! You dethroned the king! No nursery can replace what took a millenia to build! Look at the mud where the wilderness was killed! (Screamed) TREES ARE NOT CROP! WOOD IS NOT OARS! THIS ANCIENT SOIL WAS NEVER YOURS! [Guitar Solo] (Heavy, slow, weeping sludge guitar solo with deep bend notes and feedback) [Chorus] (Full explosive power, raw emotional vocals) Timber falls! The forest groans! Chainsaws tearing through ancient bones! You sold the grove for paper and pine, And murdered a temple of sacred design! [Outro] (Electric fuzz fades into soft acoustic guitar strum and solitary wood block sound) (Softly) The stump remains... Rings of time... A tombstone left... In the timber line. (Final deep bass decay)` }, { title: "6. Ash on the Solstice", audioUrl: "", lyrics: `[Intro] (Soft rain soundscape, gentle piano, warm melancholic acoustic guitar) (Whispered emotionally) Summer comes with smoke now... The winter comes without snow... Where do we put this grief... when nowhere feels like home? [Verse 1] I watch the orange haze cover the morning sky The riverbed is dry where the salmon used to lie My heart aches heavy with a burden I can’t name Watching the places of my childhood turn to flame They call it solastalgia, this sickness in the chest Watching the home you love decay from east to west We mourn for what was lost, we cry for what will fall When a warming world demands the price from all. [Verse 2] (Piano joins acoustic guitar, bass enters) The glaciers bleed white tears into the rising bay The migration maps are broken, the swallows lost their way It’s easy to freeze up, to curl into the dark To accept the extinction and extinguish every spark But sorrow without anger is a surrender in disguise And I refuse to close my eyes. [Pre-Chorus] (Drum swell, electric guitars begin to feedback) Hold the grief in your hands like a burning coal! Let the tears water the garden in your soul! We cannot undo what the greedy have slain, But we will stand in the storm and honor the pain! [Chorus] (Explosive post-hardcore release, heavy guitars, driving rhythm) Ash on the solstice! Smoke in the air! Grieve the earth... save it anyway! Do not bow your head to the corporate despair! Fight for the sapling in the ash of the pine, Defend every acre of this sacred line! Grieve the earth... save it anyway! [Verse 3] (Dynamic drop: acoustic guitar and pulsing bass, passionate vocal) There is courage in mourning what you love enough to save There is dignity in standing beside a forest grave Every tree we plant today is an act of war Against the hollow suits who only ask for more We carry the sorrow, but we carry the flame And we whisper to the wilderness its ancient name. [Bridge] (Tempo slows, heavy atmospheric sludge beat, intense emotional vocal delivery) (Strained, raw vocals) I feel it all! The melting ice! The dying reef! I won't numb the pain! I won't bury my grief! Let it burn in my veins like a forest fire! Let it forge a weapon out of pure desire! (Screamed with fierce conviction) WE WILL NOT SURRENDER TO THE ASH! WE WILL NOT SURRENDER TO THE ASH! [Guitar Solo] (Triumphant, emotional post-hardcore guitar solo blending weeping bends with soaring melodic lines) [Chorus] (Maximum intensity, explosive band dynamics) Ash on the solstice! Smoke in the air! Grieve the earth... save it anyway! Do not bow your head to the corporate despair! Fight for the sapling in the ash of the pine, Defend every acre of this sacred line! [Outro] (Instruments settle down, leaving clean piano and rain soundscape) (Soft, calm, resolute singing) The ash will settle... The rain will fall... A green sprout rises... Through it all. (Gently spoken) Grieve the earth. Save it anyway. (Final soft piano chord fading out)` } ]; let currentTrackIndex = 0; function loadTrack(index) { document.getElementById('track-title').innerText = endlingTracks[index].title; document.getElementById('lyrics-box').innerText = endlingTracks[index].lyrics; // Audio object routing for playPause() will link to endlingTracks[index].audioUrl } function prevTrack() { if (currentTrackIndex > 0) { currentTrackIndex--; loadTrack(currentTrackIndex); } } function nextTrack() { if (currentTrackIndex < endlingTracks.length - 1) { currentTrackIndex++; loadTrack(currentTrackIndex); } } function playPause() { alert("Audio rendering pending. Generate MP3s in Suno via base44.app/functions/voiceRecorder and paste URLs into the code."); } // Initialize first track loadTrack(currentTrackIndex); </script> <title>ENDLING | Solastalgia</title> <style> body { background-color: #000000; /* Obsidian Black */ color: #C8C0A8; /* Bone Cream */ font-family: monospace; text-align: center; padding: 2rem; margin: 0; } .player-container { border: 1px solid #4A9B7A; /* Forest Green accent */ padding: 20px; max-width: 600px; margin: 0 auto; background-color: #000000; } h2 { font-family: serif; letter-spacing: 2px; margin-bottom: 5px; color: #C8C0A8; } .tagline { font-size: 0.8rem; font-style: italic; color: #4A9B7A; margin-bottom: 20px; } #track-title { font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 10px; } .dagger-btn { background: transparent; color: #C8C0A8; border: 1px solid #C8C0A8; padding: 10px 20px; cursor: pointer; font-family: serif; text-transform: uppercase; margin: 5px; transition: all 0.2s ease; } .dagger-btn:hover { color: #000000; background-color: #4A9B7A; border-color: #4A9B7A; } .lyrics-display { margin-top: 20px; white-space: pre-wrap; font-size: 0.9rem; text-align: left; line-height: 1.4; height: 400px; overflow-y: auto; padding: 15px; border: 1px solid #333; background: #050505; } /* Custom Scrollbar for lyrics */ .lyrics-display::-webkit-scrollbar { width: 8px; } .lyrics-display::-webkit-scrollbar-track { background: #000; } .lyrics-display::-webkit-scrollbar-thumb { background: #4A9B7A; } </style>
ENDLING
grieve the earth. save it anyway.
<h3 id="track-title">Loading...</h3>

<!-- Gothic Dagger Controls -->
<div>
    <button class="dagger-btn" onclick="prevTrack()">&#x2020; Prev</button>
    <button class="dagger-btn" onclick="playPause()">Play / Pause</button>
    <button class="dagger-btn" onclick="nextTrack()">Next &#x2020;</button>
</div>

<div class="lyrics-display" id="lyrics-box">
    // Lyrics will load here...
</div>
<script> const endlingTracks = [ { title: "1. Requiem for the Light", audioUrl: "", // Add MP3 link here when generated lyrics: `[Intro] (Soft fingerpicked acoustic guitar with faint ambient night noise) (Whispered, intimate) Seven days in the dark... No mouth to feed, no time to waste... Just searching for the moon. [Verse 1] Pale emerald wings in the midnight mist Born from the bark that the cold fog kissed You had seven short nights to find your home To dance in the canopy all alone But the horizon burned with a synthetic glow A blinding trap in the clearing below You turned from the stars to the tungsten flame Forgetting the woods that called your name. [Pre-Chorus] (Piano enters, acoustic guitar turns aggressive) Beating against the glass, tearing your silver dust Drawn to a hollow spark, bound by a fatal trust There is no nectar here, there is no sacred mate Only an iron cage, sealing an ancient fate. [Chorus] (Full band explodes: heavy post-hardcore guitars, crushing bass, driving drums) Fly into the fire, bleed upon the street! The last luna moth at the artificial heat! We built a brighter world to blind the dark outside, And watched the quiet light where the wild things died! Fly away, fly away... before the dawn turns grey! [Verse 2] (Acoustic guitar returns with heavy bass underneath) Your delicate tails are ragged and torn Fallen on pavement before the morn No eggs in the oak trees, no larvae in spring Just the quiet remains of a forgotten wing We trade the dark sky for neon and glass Unaware of the shadows that silently pass. [Pre-Chorus] (Distorted guitar swells with piano) Beating against the glass, tearing your silver dust Drawn to a hollow spark, bound by a fatal trust There is no nectar here, there is no sacred mate Only an iron cage, sealing an ancient fate. [Chorus] (Full band: explosive, impassioned) Fly into the fire, bleed upon the street! The last luna moth at the artificial heat! We built a brighter world to blind the dark outside, And watched the quiet light where the wild things died! [Bridge] (Tempo slows, heavy atmospheric sludge riff, strained raspy vocals) (Heavy distorted bass and bowed cello) No mouth to scream... No voice to cry... You came to love the light... That taught you how to die! (Screamed defiance) WE KILLED THE NIGHT! WE KILLED THE NIGHT! [Guitar Solo / Atmospheric Breakdown] (Soaring, weeping electric guitar melody over crashing cymbals and acoustic rhythm) [Chorus] (Maximum intensity, raw emotional vocals) Fly into the fire, bleed upon the street! The last luna moth at the artificial heat! We built a brighter world to blind the dark outside, And watched the quiet light where the wild things died! [Outro] (Drums fade out, soft acoustic guitar and single piano notes) (Whispered) The streetlight flickers... The woods grow cold... The last green light... Fades into the mold. (Fades out with night ambient wind)` }, { title: "2. Iron and Ivy", audioUrl: "", lyrics: `[Intro] (Industrial wind, echoing metal drops, slow acoustic guitar arpeggio) (Spoken low) You built your towers to outlast the sun... But the soil was waiting all along. [Verse 1] Corroded smokestacks reaching for the clouds Empty assembly halls wrapped in dusty shrouds The gears have frozen and the turbines stand cold While quiet green roots break through iron and mold A single acorn splits the factory floor Where heavy boots walked, men walk no more Ferns climb the girders, moss covers the rust Your proudest machines are returning to dust. [Pre-Chorus] (Driving snare drum and heavy acoustic strumming) You carved out the valley, you paved over stone You thought that you conquered the wild alone But time is a river that swallows your pride And nature reclaims what you tried to divide. [Chorus] (Explosive post-hardcore wall of sound, heavy guitars and crashing cymbals) Tear down the iron! Let the ivy grow! Break through the concrete in the earth below! No crown lasts forever, no empire survives When the forest awakes and the green world revives! Nature reclaims everything! [Verse 2] (Acoustic guitar with heavy bass pulse and melodic electric swells) Wild brambles weave through the broken control room Wildflowers bloom in the industrial gloom Barn owls nest in the steel rafters high Watching the night sky as centuries fly No pollution in the water, no smoke in the breeze Just the rustle of leaves and the song of the trees. [Pre-Chorus] (Building percussion and distorted rhythm) You carved out the valley, you paved over stone You thought that you conquered the wild alone But time is a river that swallows your pride And nature reclaims what you tried to divide. [Chorus] (Explosive energy, passionate melodic vocals) Tear down the iron! Let the ivy grow! Break through the concrete in the earth below! No crown lasts forever, no empire survives When the forest awakes and the green world revives! [Bridge] (Rhythm drops to heavy slow sludge beat, thick distorted bass) (Guttural, intense chant) Stone by stone! Vine by vine! You ran out of breath, you ran out of time! Root in the foundation! Bloom in the rust! Every man-made kingdom crumbles into dust! (Shouted) CRUMBLES INTO DUST! [Guitar Solo] (Soaring post-hardcore melodic guitar solo, dual harmony leads over heavy rhythm) [Chorus] (Maximum explosive volume) Tear down the iron! Let the ivy grow! Break through the concrete in the earth below! No crown lasts forever, no empire survives When the forest awakes and the green world revives! [Outro] (Music slows, acoustic guitar and rustling forest leaves) (Soft melodic singing) The iron is fading... The ivy is free... Where concrete once buried... The roots of the tree. (Final deep bass acoustic ring out)` }, { title: "3. The Endling's Solitude", audioUrl: "", lyrics: `[Intro] (Bowed cello notes, weeping acoustic guitar melody) (Soft spoken) An endling does not know it is the last... It only knows... no one ever answers. [Verse 1] I stand at the wire of a wooden cage Or the edge of a forest robbed of its age I call out my name in the tongue of my kin And wait for the echo to linger within One million summers of bloodline and song Carried in bones where I used to belong Now my voice falls flat on the canopy wall And nobody hears when I stumble and fall. [Verse 2] (Acoustic guitar grows darker, subtle bass notes added) I remember the trails where thousands once ran Before the cold wire and weapons of man My mother’s dark eyes, the scent of the rain Now only memories keeping me sane I am the monument, I am the grave The last living creature no science can save. [Chorus] (Heavy post-hardcore riffing, slow thunderous drums, aching vocal delivery) Is anybody listening across the open wild? I am the last forgotten, nature’s lonely child! Ten thousand generations vanish in my breath, A solitary witness to an artificial death! I call into the dark... and the dark stays still! [Verse 3] (Acoustic guitar picking returned, mournful tone) My eyes grow heavy, my heart slows its beat The soil beneath me feels cold and complete No mate in the valley, no calf in the spring Just the silence that waits for the sorrow I bring When I close my eyes at the end of the day An entire world quietly fades away. [Bridge] (Tempo slows to heavy atmospheric sludge tempo, deep fuzz bass, raspy strained vocals) (Building emotion) No next spring... No second chance... The final step of an ancient dance... You took my forest, you took my name, And wrote down my life in a book of shame! (Screamed with agonizing passion) WHO OWNS THE SILENCE WHEN THE LAST ONE DIES?! WHO LOOKS AWAY WHEN THE BLOODLINE CRIES?! [Guitar Solo] (Devastating, melancholic electric guitar solo with long lingering notes and bowed string accompaniment) [Chorus] (Full explosive intensity, layered screaming and clean emotional vocals) Is anybody listening across the open wild? I am the last forgotten, nature’s lonely child! Ten thousand generations vanish in my breath, A solitary witness to an artificial death! [Outro] (All heavy instruments cut, leaving only bowed cello and fingerpicked acoustic guitar) (Breathy, fragile singing) The call goes out... Across the hill... No answer comes... The woods stay still. (Single fading acoustic chord)` }, { title: "4. Drowning in Ghost Threads", audioUrl: "", lyrics: `[Intro] (Deep sub-bass swell, ambient hydrophone ocean textures, reverbed acoustic guitar) (Spoken quietly) Three thousand miles of open blue... Trapped in a web we never knew. [Verse 1] Beneath the surface where the blue turns black An ancient voyager will never make it back Gliding through currents five thousand years old Where sunlight pales and the abyss grows cold But the water is heavy with unnatural threads Monofilament traps where the sea turtle bleeds Floating ghost nets drifting without an end Tangling the limbs of an ocean’s old friend. [Pre-Chorus] (Acoustic strumming intensifies with pulsing bass) A synthetic tide, a poisonous bloom Turning the gulf into an underwater tomb Particles of polyethylene in every breath We fed the deep waters a slow, plastic death. [Chorus] (Heavy post-hardcore guitar wall, driving double-kick drums) Drowning in ghost threads! Choked by the tide! Swallowing the poison where the deep sea died! We wrapped the ocean in a polyester shroud, And cast our rubbish where the waves roared loud! Grieve the blue earth... bleed for the sea! [Verse 2] (Melodic electric guitar swells over tight rhythm section) Plankton and micro-shards tangled in the mesh Nylon cutting deep into salt-soaked flesh Albatross chicks on a remote coral strand Stomach full of bottle caps from a distant land No tide can wash it clean, no storm can tear it down In a sea of manufactured trash we watch the wild ocean drown. [Pre-Chorus] (Building tension) A synthetic tide, a poisonous bloom Turning the gulf into an underwater tomb Particles of polyethylene in every breath We fed the deep waters a slow, plastic death. [Chorus] (Explosive post-hardcore chorus, soaring vocals) Drowning in ghost threads! Choked by the tide! Swallowing the poison where the deep sea died! We wrapped the ocean in a polyester shroud, And cast our rubbish where the waves roared loud! [Bridge] (Tempo slows, crushing atmospheric sludge riff, low guttural growls and emotional screams) Five hundred years in the salt and light! Plastic doesn't rot, plastic doesn't die! It lingers in the water column, blinding every eye! (Fierce scream) WE ARE POISONING THE CRADLE OF LIFE! WE ARE POISONING THE TIDE! [Guitar Solo] (Liquid, delay-heavy atmospheric guitar solo soaring above heavy bass undertones) [Chorus] (Maximum volume and emotional drive) Drowning in ghost threads! Choked by the tide! Swallowing the poison where the deep sea died! We wrapped the ocean in a polyester shroud, And cast our rubbish where the waves roared loud! [Outro] (Ocean waves fading back in, soft acoustic guitar picking) (Muffled, submerged vocal) The tide rolls in... The ghost nets sway... And the deep blue heart... rots away. (Fades out with ocean waves)` }, { title: "5. Echoes of the Ancient Giants", audioUrl: "", lyrics: `[Intro] (Deep timber percussion, low resonant acoustic guitar, wind through tall trees) (Spoken steadily) One thousand years to grow a canopy... Twenty minutes to cut it down. [Verse 1] Roots intertwined in the dark primal peat Holding the mountain beneath ancient feet Redwoods and cedars eight hundred years tall Standing in majesty, watching over all Moss-draped cathedrals where moss covers stone Sovereign sanctuaries the world called its own Then came the engines, the gas and the steel The bite of the saw blade, the crushing iron wheel. [Verse 2] (Acoustic strumming grows louder, low bass rumble) The first undercut bleeds golden amber sap A thousand-year giant falls into the gap The forest floor trembles, the canopy tears A century’s silence vanishes in airs Birds lose their roosts, lichens turn to dust A holy sanctuary sacrificed to human lust. [Chorus] (Crushing sludge post-hardcore riff, thundering timber drums) Timber falls! The forest groans! Chainsaws tearing through ancient bones! You sold the grove for paper and pine, And murdered a temple of sacred design! Listen to the echo of the falling giant! [Verse 3] (Acoustic folk picking with heavy electric drone) Now mudslides wash down the desolate hill Where wild trout swam in the shaded clear rill The sun bakes the soil where shadows once slept And the spirit of the old-growth quietly wept You can plant new saplings in orderly rows But a tree farm is dead where a wild forest grows. [Bridge] (Tempo slows to heavy sludge breakdown, heavy fuzz guitars, raw screamed vocals) (Rhythmic timber beats) A thousand rings of winter! A thousand rings of spring! You cut down the kingdom! You dethroned the king! No nursery can replace what took a millenia to build! Look at the mud where the wilderness was killed! (Screamed) TREES ARE NOT CROP! WOOD IS NOT OARS! THIS ANCIENT SOIL WAS NEVER YOURS! [Guitar Solo] (Heavy, slow, weeping sludge guitar solo with deep bend notes and feedback) [Chorus] (Full explosive power, raw emotional vocals) Timber falls! The forest groans! Chainsaws tearing through ancient bones! You sold the grove for paper and pine, And murdered a temple of sacred design! [Outro] (Electric fuzz fades into soft acoustic guitar strum and solitary wood block sound) (Softly) The stump remains... Rings of time... A tombstone left... In the timber line. (Final deep bass decay)` }, { title: "6. Ash on the Solstice", audioUrl: "", lyrics: `[Intro] (Soft rain soundscape, gentle piano, warm melancholic acoustic guitar) (Whispered emotionally) Summer comes with smoke now... The winter comes without snow... Where do we put this grief... when nowhere feels like home? [Verse 1] I watch the orange haze cover the morning sky The riverbed is dry where the salmon used to lie My heart aches heavy with a burden I can’t name Watching the places of my childhood turn to flame They call it solastalgia, this sickness in the chest Watching the home you love decay from east to west We mourn for what was lost, we cry for what will fall When a warming world demands the price from all. [Verse 2] (Piano joins acoustic guitar, bass enters) The glaciers bleed white tears into the rising bay The migration maps are broken, the swallows lost their way It’s easy to freeze up, to curl into the dark To accept the extinction and extinguish every spark But sorrow without anger is a surrender in disguise And I refuse to close my eyes. [Pre-Chorus] (Drum swell, electric guitars begin to feedback) Hold the grief in your hands like a burning coal! Let the tears water the garden in your soul! We cannot undo what the greedy have slain, But we will stand in the storm and honor the pain! [Chorus] (Explosive post-hardcore release, heavy guitars, driving rhythm) Ash on the solstice! Smoke in the air! Grieve the earth... save it anyway! Do not bow your head to the corporate despair! Fight for the sapling in the ash of the pine, Defend every acre of this sacred line! Grieve the earth... save it anyway! [Verse 3] (Dynamic drop: acoustic guitar and pulsing bass, passionate vocal) There is courage in mourning what you love enough to save There is dignity in standing beside a forest grave Every tree we plant today is an act of war Against the hollow suits who only ask for more We carry the sorrow, but we carry the flame And we whisper to the wilderness its ancient name. [Bridge] (Tempo slows, heavy atmospheric sludge beat, intense emotional vocal delivery) (Strained, raw vocals) I feel it all! The melting ice! The dying reef! I won't numb the pain! I won't bury my grief! Let it burn in my veins like a forest fire! Let it forge a weapon out of pure desire! (Screamed with fierce conviction) WE WILL NOT SURRENDER TO THE ASH! WE WILL NOT SURRENDER TO THE ASH! [Guitar Solo] (Triumphant, emotional post-hardcore guitar solo blending weeping bends with soaring melodic lines) [Chorus] (Maximum intensity, explosive band dynamics) Ash on the solstice! Smoke in the air! Grieve the earth... save it anyway! Do not bow your head to the corporate despair! Fight for the sapling in the ash of the pine, Defend every acre of this sacred line! [Outro] (Instruments settle down, leaving clean piano and rain soundscape) (Soft, calm, resolute singing) The ash will settle... The rain will fall... A green sprout rises... Through it all. (Gently spoken) Grieve the earth. Save it anyway. (Final soft piano chord fading out)` } ]; let currentTrackIndex = 0; function loadTrack(index) { document.getElementById('track-title').innerText = endlingTracks[index].title; document.getElementById('lyrics-box').innerText = endlingTracks[index].lyrics; // Audio object routing for playPause() will link to endlingTracks[index].audioUrl } function prevTrack() { if (currentTrackIndex > 0) { currentTrackIndex--; loadTrack(currentTrackIndex); } } function nextTrack() { if (currentTrackIndex < endlingTracks.length - 1) { currentTrackIndex++; loadTrack(currentTrackIndex); } } function playPause() { alert("Audio rendering pending. Generate MP3s in Suno via base44.app/functions/voiceRecorder and paste URLs into the code."); } // Initialize first track loadTrack(currentTrackIndex); </script> <title>Endling Core Vault</title> <style> body { background-color: #0b0c10; /* Obsidian Black */ color: #e8e5d7; /* Aged Cream */ font-family: monospace; text-align: center; padding: 2rem; } .player-container { border: 1px solid #e8e5d7; padding: 20px; max-width: 600px; margin: 0 auto; } .dagger-btn { background: transparent; color: #e8e5d7; border: 1px solid #e8e5d7; padding: 10px 20px; cursor: pointer; font-family: serif; /* Gothic feel */ text-transform: uppercase; margin: 5px; } .lyrics-display { margin-top: 20px; white-space: pre-wrap; font-size: 0.9rem; text-align: left; } </style>
ENDLING: SOLASTALGIA
Loading...
<!-- Gothic Dagger Controls -->
<div>
    <button class="dagger-btn" onclick="prevTrack()">&#x2020; Prev</button>
    <button class="dagger-btn" onclick="playPause()">Play / Pause</button>
    <button class="dagger-btn" onclick="nextTrack()">Next &#x2020;</button>
</div>

<div class="lyrics-display" id="lyrics-box">
    // Lyrics will load here...
</div>
<script> // Solastalgia Dossier Data const endlingTracks = [ { title: "Track 1 Name Here", audioUrl: "https://your-bucket-url.com/track1.mp3", lyrics: `Paste lyrics for track 1 here...` }, { title: "Track 2 Name Here", audioUrl: "https://your-bucket-url.com/track2.mp3", lyrics: `Paste lyrics for track 2 here...` } // Add all 6 tracks here ]; let currentTrackIndex = 0; function loadTrack(index) { document.getElementById('track-title').innerText = endlingTracks[index].title; document.getElementById('lyrics-box').innerText = endlingTracks[index].lyrics; // Audio object logic will go here once MP3s are hosted } function prevTrack() { if (currentTrackIndex > 0) { currentTrackIndex--; loadTrack(currentTrackIndex); } } function nextTrack() { if (currentTrackIndex < endlingTracks.length - 1) { currentTrackIndex++; loadTrack(currentTrackIndex); } } function playPause() { alert("Audio routing pending. Need MP3 URLs."); } // Initialize first track loadTrack(currentTrackIndex); </script>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Endling Core Vault</title>
    <!-- Cream mini moth favicon -->
    <link rel="icon" href="https://ecoemo.store/assets/moth-favicon.png">
    <style>
        body {
            background-color: #0b0c10; /* Obsidian Black */
            color: #e8e5d7; /* Aged Cream */
            font-family: monospace;
            text-align: center;
            padding: 2rem;
        }
        .player-container {
            border: 1px solid #e8e5d7;
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
        }
        .dagger-btn {
            background: transparent;
            color: #e8e5d7;
            border: 1px solid #e8e5d7;
            padding: 10px 20px;
            cursor: pointer;
            font-family: serif; /* Gothic feel */
            text-transform: uppercase;
            margin: 5px;
        }
        .lyrics-display {
            margin-top: 20px;
            white-space: pre-wrap;
            font-size: 0.9rem;
            text-align: left;
        }
    </style>
</head>
<body>

<div class="player-container">
    <h2>ENDLING: SOLASTALGIA</h2>
    <h3 id="track-title">Loading...</h3>
    
    <!-- Gothic Dagger Controls -->
    <div>
        <button class="dagger-btn" onclick="prevTrack()">&#x2020; Prev</button>
        <button class="dagger-btn" onclick="playPause()">Play / Pause</button>
        <button class="dagger-btn" onclick="nextTrack()">Next &#x2020;</button>
    </div>

    <div class="lyrics-display" id="lyrics-box">
        // Lyrics will load here...
    </div>
</div>

<script>
    // Solastalgia Dossier Data
    const endlingTracks = [
        {
            title: "Track 1 Name Here",
            audioUrl: "https://your-bucket-url.com/track1.mp3",
            lyrics: `Paste lyrics for track 1 here...`
        },
        {
            title: "Track 2 Name Here",
            audioUrl: "https://your-bucket-url.com/track2.mp3",
            lyrics: `Paste lyrics for track 2 here...`
        }
        // Add all 6 tracks here
    ];

    let currentTrackIndex = 0;

    function loadTrack(index) {
        document.getElementById('track-title').innerText = endlingTracks[index].title;
        document.getElementById('lyrics-box').innerText = endlingTracks[index].lyrics;
        // Audio object logic will go here once MP3s are hosted
    }

    function prevTrack() {
        if (currentTrackIndex > 0) {
            currentTrackIndex--;
            loadTrack(currentTrackIndex);
        }
    }

    function nextTrack() {
        if (currentTrackIndex < endlingTracks.length - 1) {
            currentTrackIndex++;
            loadTrack(currentTrackIndex);
        }
    }

    function playPause() {
        alert("Audio routing pending. Need MP3 URLs.");
    }

    // Initialize first track
    loadTrack(currentTrackIndex);
</script>

</body>
</html>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ENDLING | Solastalgia</title>
    <!-- Cream mini moth favicon -->
    <link rel="icon" href="https://ecoemo.store/assets/moth-favicon.png">
    <style>
        body {
            background-color: #000000; /* Obsidian Black */
            color: #C8C0A8; /* Bone Cream */
            font-family: monospace;
            text-align: center;
            padding: 2rem;
            margin: 0;
        }
        .player-container {
            border: 1px solid #4A9B7A; /* Forest Green accent */
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
            background-color: #000000;
        }
        h2 {
            font-family: serif;
            letter-spacing: 2px;
            margin-bottom: 5px;
            color: #C8C0A8;
        }
        .tagline {
            font-size: 0.8rem;
            font-style: italic;
            color: #4A9B7A;
            margin-bottom: 20px;
        }
        #track-title {
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1px solid #333;
            padding-bottom: 10px;
        }
        .dagger-btn {
            background: transparent;
            color: #C8C0A8;
            border: 1px solid #C8C0A8;
            padding: 10px 20px;
            cursor: pointer;
            font-family: serif;
            text-transform: uppercase;
            margin: 5px;
            transition: all 0.2s ease;
        }
        .dagger-btn:hover {
            color: #000000;
            background-color: #4A9B7A;
            border-color: #4A9B7A;
        }
        .lyrics-display {
            margin-top: 20px;
            white-space: pre-wrap;
            font-size: 0.9rem;
            text-align: left;
            line-height: 1.4;
            height: 400px;
            overflow-y: auto;
            padding: 15px;
            border: 1px solid #333;
            background: #050505;
        }
        /* Custom Scrollbar for lyrics */
        .lyrics-display::-webkit-scrollbar { width: 8px; }
        .lyrics-display::-webkit-scrollbar-track { background: #000; }
        .lyrics-display::-webkit-scrollbar-thumb { background: #4A9B7A; }
    </style>
</head>
<body>

<div class="player-container">
    <h2>ENDLING</h2>
    <div class="tagline">grieve the earth. save it anyway.</div>
    
    <h3 id="track-title">Loading...</h3>
    
    <!-- Gothic Dagger Controls -->
    <div>
        <button class="dagger-btn" onclick="prevTrack()">&#x2020; Prev</button>
        <button class="dagger-btn" onclick="playPause()">Play / Pause</button>
        <button class="dagger-btn" onclick="nextTrack()">Next &#x2020;</button>
    </div>

    <div class="lyrics-display" id="lyrics-box">
        // Lyrics will load here...
    </div>
</div>

<script>
    const endlingTracks = [
        {
            title: "1. Requiem for the Light",
            audioUrl: "", // Add MP3 link here when generated
            lyrics: `[Intro]
(Soft fingerpicked acoustic guitar with faint ambient night noise)
(Whispered, intimate)
Seven days in the dark...
No mouth to feed, no time to waste...
Just searching for the moon.

[Verse 1]
Pale emerald wings in the midnight mist
Born from the bark that the cold fog kissed
You had seven short nights to find your home
To dance in the canopy all alone
But the horizon burned with a synthetic glow
A blinding trap in the clearing below
You turned from the stars to the tungsten flame
Forgetting the woods that called your name.

[Pre-Chorus]
(Piano enters, acoustic guitar turns aggressive)
Beating against the glass, tearing your silver dust
Drawn to a hollow spark, bound by a fatal trust
There is no nectar here, there is no sacred mate
Only an iron cage, sealing an ancient fate.

[Chorus]
(Full band explodes: heavy post-hardcore guitars, crushing bass, driving drums)
Fly into the fire, bleed upon the street!
The last luna moth at the artificial heat!
We built a brighter world to blind the dark outside,
And watched the quiet light where the wild things died!
Fly away, fly away... before the dawn turns grey!

[Verse 2]
(Acoustic guitar returns with heavy bass underneath)
Your delicate tails are ragged and torn
Fallen on pavement before the morn
No eggs in the oak trees, no larvae in spring
Just the quiet remains of a forgotten wing
We trade the dark sky for neon and glass
Unaware of the shadows that silently pass.

[Pre-Chorus]
(Distorted guitar swells with piano)
Beating against the glass, tearing your silver dust
Drawn to a hollow spark, bound by a fatal trust
There is no nectar here, there is no sacred mate
Only an iron cage, sealing an ancient fate.

[Chorus]
(Full band: explosive, impassioned)
Fly into the fire, bleed upon the street!
The last luna moth at the artificial heat!
We built a brighter world to blind the dark outside,
And watched the quiet light where the wild things died!

[Bridge]
(Tempo slows, heavy atmospheric sludge riff, strained raspy vocals)
(Heavy distorted bass and bowed cello)
No mouth to scream...
No voice to cry...
You came to love the light...
That taught you how to die!

(Screamed defiance)
WE KILLED THE NIGHT! WE KILLED THE NIGHT!

[Guitar Solo / Atmospheric Breakdown]
(Soaring, weeping electric guitar melody over crashing cymbals and acoustic rhythm)

[Chorus]
(Maximum intensity, raw emotional vocals)
Fly into the fire, bleed upon the street!
The last luna moth at the artificial heat!
We built a brighter world to blind the dark outside,
And watched the quiet light where the wild things died!

[Outro]
(Drums fade out, soft acoustic guitar and single piano notes)
(Whispered)
The streetlight flickers...
The woods grow cold...
The last green light...
Fades into the mold.
(Fades out with night ambient wind)`
        },
        {
            title: "2. Iron and Ivy",
            audioUrl: "", 
            lyrics: `[Intro]
(Industrial wind, echoing metal drops, slow acoustic guitar arpeggio)
(Spoken low)
You built your towers to outlast the sun...
But the soil was waiting all along.

[Verse 1]
Corroded smokestacks reaching for the clouds
Empty assembly halls wrapped in dusty shrouds
The gears have frozen and the turbines stand cold
While quiet green roots break through iron and mold
A single acorn splits the factory floor
Where heavy boots walked, men walk no more
Ferns climb the girders, moss covers the rust
Your proudest machines are returning to dust.

[Pre-Chorus]
(Driving snare drum and heavy acoustic strumming)
You carved out the valley, you paved over stone
You thought that you conquered the wild alone
But time is a river that swallows your pride
And nature reclaims what you tried to divide.

[Chorus]
(Explosive post-hardcore wall of sound, heavy guitars and crashing cymbals)
Tear down the iron! Let the ivy grow!
Break through the concrete in the earth below!
No crown lasts forever, no empire survives
When the forest awakes and the green world revives!
Nature reclaims everything!

[Verse 2]
(Acoustic guitar with heavy bass pulse and melodic electric swells)
Wild brambles weave through the broken control room
Wildflowers bloom in the industrial gloom
Barn owls nest in the steel rafters high
Watching the night sky as centuries fly
No pollution in the water, no smoke in the breeze
Just the rustle of leaves and the song of the trees.

[Pre-Chorus]
(Building percussion and distorted rhythm)
You carved out the valley, you paved over stone
You thought that you conquered the wild alone
But time is a river that swallows your pride
And nature reclaims what you tried to divide.

[Chorus]
(Explosive energy, passionate melodic vocals)
Tear down the iron! Let the ivy grow!
Break through the concrete in the earth below!
No crown lasts forever, no empire survives
When the forest awakes and the green world revives!

[Bridge]
(Rhythm drops to heavy slow sludge beat, thick distorted bass)
(Guttural, intense chant)
Stone by stone! Vine by vine!
You ran out of breath, you ran out of time!
Root in the foundation! Bloom in the rust!
Every man-made kingdom crumbles into dust!

(Shouted)
CRUMBLES INTO DUST!

[Guitar Solo]
(Soaring post-hardcore melodic guitar solo, dual harmony leads over heavy rhythm)

[Chorus]
(Maximum explosive volume)
Tear down the iron! Let the ivy grow!
Break through the concrete in the earth below!
No crown lasts forever, no empire survives
When the forest awakes and the green world revives!

[Outro]
(Music slows, acoustic guitar and rustling forest leaves)
(Soft melodic singing)
The iron is fading...
The ivy is free...
Where concrete once buried...
The roots of the tree.
(Final deep bass acoustic ring out)`
        },
        {
            title: "3. The Endling's Solitude",
            audioUrl: "", 
            lyrics: `[Intro]
(Bowed cello notes, weeping acoustic guitar melody)
(Soft spoken)
An endling does not know it is the last...
It only knows... no one ever answers.

[Verse 1]
I stand at the wire of a wooden cage
Or the edge of a forest robbed of its age
I call out my name in the tongue of my kin
And wait for the echo to linger within
One million summers of bloodline and song
Carried in bones where I used to belong
Now my voice falls flat on the canopy wall
And nobody hears when I stumble and fall.

[Verse 2]
(Acoustic guitar grows darker, subtle bass notes added)
I remember the trails where thousands once ran
Before the cold wire and weapons of man
My mother’s dark eyes, the scent of the rain
Now only memories keeping me sane
I am the monument, I am the grave
The last living creature no science can save.

[Chorus]
(Heavy post-hardcore riffing, slow thunderous drums, aching vocal delivery)
Is anybody listening across the open wild?
I am the last forgotten, nature’s lonely child!
Ten thousand generations vanish in my breath,
A solitary witness to an artificial death!
I call into the dark... and the dark stays still!

[Verse 3]
(Acoustic guitar picking returned, mournful tone)
My eyes grow heavy, my heart slows its beat
The soil beneath me feels cold and complete
No mate in the valley, no calf in the spring
Just the silence that waits for the sorrow I bring
When I close my eyes at the end of the day
An entire world quietly fades away.

[Bridge]
(Tempo slows to heavy atmospheric sludge tempo, deep fuzz bass, raspy strained vocals)
(Building emotion)
No next spring... No second chance...
The final step of an ancient dance...
You took my forest, you took my name,
And wrote down my life in a book of shame!

(Screamed with agonizing passion)
WHO OWNS THE SILENCE WHEN THE LAST ONE DIES?!
WHO LOOKS AWAY WHEN THE BLOODLINE CRIES?!

[Guitar Solo]
(Devastating, melancholic electric guitar solo with long lingering notes and bowed string accompaniment)

[Chorus]
(Full explosive intensity, layered screaming and clean emotional vocals)
Is anybody listening across the open wild?
I am the last forgotten, nature’s lonely child!
Ten thousand generations vanish in my breath,
A solitary witness to an artificial death!

[Outro]
(All heavy instruments cut, leaving only bowed cello and fingerpicked acoustic guitar)
(Breathy, fragile singing)
The call goes out...
Across the hill...
No answer comes...
The woods stay still.
(Single fading acoustic chord)`
        },
        {
            title: "4. Drowning in Ghost Threads",
            audioUrl: "", 
            lyrics: `[Intro]
(Deep sub-bass swell, ambient hydrophone ocean textures, reverbed acoustic guitar)
(Spoken quietly)
Three thousand miles of open blue...
Trapped in a web we never knew.

[Verse 1]
Beneath the surface where the blue turns black
An ancient voyager will never make it back
Gliding through currents five thousand years old
Where sunlight pales and the abyss grows cold
But the water is heavy with unnatural threads
Monofilament traps where the sea turtle bleeds
Floating ghost nets drifting without an end
Tangling the limbs of an ocean’s old friend.

[Pre-Chorus]
(Acoustic strumming intensifies with pulsing bass)
A synthetic tide, a poisonous bloom
Turning the gulf into an underwater tomb
Particles of polyethylene in every breath
We fed the deep waters a slow, plastic death.

[Chorus]
(Heavy post-hardcore guitar wall, driving double-kick drums)
Drowning in ghost threads! Choked by the tide!
Swallowing the poison where the deep sea died!
We wrapped the ocean in a polyester shroud,
And cast our rubbish where the waves roared loud!
Grieve the blue earth... bleed for the sea!

[Verse 2]
(Melodic electric guitar swells over tight rhythm section)
Plankton and micro-shards tangled in the mesh
Nylon cutting deep into salt-soaked flesh
Albatross chicks on a remote coral strand
Stomach full of bottle caps from a distant land
No tide can wash it clean, no storm can tear it down
In a sea of manufactured trash we watch the wild ocean drown.

[Pre-Chorus]
(Building tension)
A synthetic tide, a poisonous bloom
Turning the gulf into an underwater tomb
Particles of polyethylene in every breath
We fed the deep waters a slow, plastic death.

[Chorus]
(Explosive post-hardcore chorus, soaring vocals)
Drowning in ghost threads! Choked by the tide!
Swallowing the poison where the deep sea died!
We wrapped the ocean in a polyester shroud,
And cast our rubbish where the waves roared loud!

[Bridge]
(Tempo slows, crushing atmospheric sludge riff, low guttural growls and emotional screams)
Five hundred years in the salt and light!
Plastic doesn't rot, plastic doesn't die!
It lingers in the water column, blinding every eye!

(Fierce scream)
WE ARE POISONING THE CRADLE OF LIFE!
WE ARE POISONING THE TIDE!

[Guitar Solo]
(Liquid, delay-heavy atmospheric guitar solo soaring above heavy bass undertones)

[Chorus]
(Maximum volume and emotional drive)
Drowning in ghost threads! Choked by the tide!
Swallowing the poison where the deep sea died!
We wrapped the ocean in a polyester shroud,
And cast our rubbish where the waves roared loud!

[Outro]
(Ocean waves fading back in, soft acoustic guitar picking)
(Muffled, submerged vocal)
The tide rolls in...
The ghost nets sway...
And the deep blue heart...
rots away.
(Fades out with ocean waves)`
        },
        {
            title: "5. Echoes of the Ancient Giants",
            audioUrl: "", 
            lyrics: `[Intro]
(Deep timber percussion, low resonant acoustic guitar, wind through tall trees)
(Spoken steadily)
One thousand years to grow a canopy...
Twenty minutes to cut it down.

[Verse 1]
Roots intertwined in the dark primal peat
Holding the mountain beneath ancient feet
Redwoods and cedars eight hundred years tall
Standing in majesty, watching over all
Moss-draped cathedrals where moss covers stone
Sovereign sanctuaries the world called its own
Then came the engines, the gas and the steel
The bite of the saw blade, the crushing iron wheel.

[Verse 2]
(Acoustic strumming grows louder, low bass rumble)
The first undercut bleeds golden amber sap
A thousand-year giant falls into the gap
The forest floor trembles, the canopy tears
A century’s silence vanishes in airs
Birds lose their roosts, lichens turn to dust
A holy sanctuary sacrificed to human lust.

[Chorus]
(Crushing sludge post-hardcore riff, thundering timber drums)
Timber falls! The forest groans!
Chainsaws tearing through ancient bones!
You sold the grove for paper and pine,
And murdered a temple of sacred design!
Listen to the echo of the falling giant!

[Verse 3]
(Acoustic folk picking with heavy electric drone)
Now mudslides wash down the desolate hill
Where wild trout swam in the shaded clear rill
The sun bakes the soil where shadows once slept
And the spirit of the old-growth quietly wept
You can plant new saplings in orderly rows
But a tree farm is dead where a wild forest grows.

[Bridge]
(Tempo slows to heavy sludge breakdown, heavy fuzz guitars, raw screamed vocals)
(Rhythmic timber beats)
A thousand rings of winter! A thousand rings of spring!
You cut down the kingdom! You dethroned the king!
No nursery can replace what took a millenia to build!
Look at the mud where the wilderness was killed!

(Screamed)
TREES ARE NOT CROP! WOOD IS NOT OARS!
THIS ANCIENT SOIL WAS NEVER YOURS!

[Guitar Solo]
(Heavy, slow, weeping sludge guitar solo with deep bend notes and feedback)

[Chorus]
(Full explosive power, raw emotional vocals)
Timber falls! The forest groans!
Chainsaws tearing through ancient bones!
You sold the grove for paper and pine,
And murdered a temple of sacred design!

[Outro]
(Electric fuzz fades into soft acoustic guitar strum and solitary wood block sound)
(Softly)
The stump remains...
Rings of time...
A tombstone left...
In the timber line.
(Final deep bass decay)`
        },
        {
            title: "6. Ash on the Solstice",
            audioUrl: "", 
            lyrics: `[Intro]
(Soft rain soundscape, gentle piano, warm melancholic acoustic guitar)
(Whispered emotionally)
Summer comes with smoke now...
The winter comes without snow...
Where do we put this grief... when nowhere feels like home?

[Verse 1]
I watch the orange haze cover the morning sky
The riverbed is dry where the salmon used to lie
My heart aches heavy with a burden I can’t name
Watching the places of my childhood turn to flame
They call it solastalgia, this sickness in the chest
Watching the home you love decay from east to west
We mourn for what was lost, we cry for what will fall
When a warming world demands the price from all.

[Verse 2]
(Piano joins acoustic guitar, bass enters)
The glaciers bleed white tears into the rising bay
The migration maps are broken, the swallows lost their way
It’s easy to freeze up, to curl into the dark
To accept the extinction and extinguish every spark
But sorrow without anger is a surrender in disguise
And I refuse to close my eyes.

[Pre-Chorus]
(Drum swell, electric guitars begin to feedback)
Hold the grief in your hands like a burning coal!
Let the tears water the garden in your soul!
We cannot undo what the greedy have slain,
But we will stand in the storm and honor the pain!

[Chorus]
(Explosive post-hardcore release, heavy guitars, driving rhythm)
Ash on the solstice! Smoke in the air!
Grieve the earth... save it anyway!
Do not bow your head to the corporate despair!
Fight for the sapling in the ash of the pine,
Defend every acre of this sacred line!
Grieve the earth... save it anyway!

[Verse 3]
(Dynamic drop: acoustic guitar and pulsing bass, passionate vocal)
There is courage in mourning what you love enough to save
There is dignity in standing beside a forest grave
Every tree we plant today is an act of war
Against the hollow suits who only ask for more
We carry the sorrow, but we carry the flame
And we whisper to the wilderness its ancient name.

[Bridge]
(Tempo slows, heavy atmospheric sludge beat, intense emotional vocal delivery)
(Strained, raw vocals)
I feel it all! The melting ice! The dying reef!
I won't numb the pain! I won't bury my grief!
Let it burn in my veins like a forest fire!
Let it forge a weapon out of pure desire!

(Screamed with fierce conviction)
WE WILL NOT SURRENDER TO THE ASH!
WE WILL NOT SURRENDER TO THE ASH!

[Guitar Solo]
(Triumphant, emotional post-hardcore guitar solo blending weeping bends with soaring melodic lines)

[Chorus]
(Maximum intensity, explosive band dynamics)
Ash on the solstice! Smoke in the air!
Grieve the earth... save it anyway!
Do not bow your head to the corporate despair!
Fight for the sapling in the ash of the pine,
Defend every acre of this sacred line!

[Outro]
(Instruments settle down, leaving clean piano and rain soundscape)
(Soft, calm, resolute singing)
The ash will settle...
The rain will fall...
A green sprout rises...
Through it all.

(Gently spoken)
Grieve the earth. Save it anyway.
(Final soft piano chord fading out)`
        }
    ];

    let currentTrackIndex = 0;

    function loadTrack(index) {
        document.getElementById('track-title').innerText = endlingTracks[index].title;
        document.getElementById('lyrics-box').innerText = endlingTracks[index].lyrics;
        // Audio object routing for playPause() will link to endlingTracks[index].audioUrl
    }

    function prevTrack() {
        if (currentTrackIndex > 0) {
            currentTrackIndex--;
            loadTrack(currentTrackIndex);
        }
    }

    function nextTrack() {
        if (currentTrackIndex < endlingTracks.length - 1) {
            currentTrackIndex++;
            loadTrack(currentTrackIndex);
        }
    }

    function playPause() {
        alert("Audio rendering pending. Generate MP3s in Suno via base44.app/functions/voiceRecorder and paste URLs into the code.");
    }

    // Initialize first track
    loadTrack(currentTrackIndex);
</script>

</body>
</h
  tml>

# Vault
Coreplayer
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Endling Core Vault</title>
    <!-- Cream mini moth favicon -->
    <link rel="icon" href="https://ecoemo.store/assets/moth-favicon.png">
    <style>
        body {
            background-color: #0b0c10; /* Obsidian Black */
            color: #e8e5d7; /* Aged Cream */
            font-family: monospace;
            text-align: center;
            padding: 2rem;
        }
        .player-container {
            border: 1px solid #e8e5d7;
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
        }
        .dagger-btn {
            background: transparent;
            color: #e8e5d7;
            border: 1px solid #e8e5d7;
            padding: 10px 20px;
            cursor: pointer;
            font-family: serif; /* Gothic feel */
            text-transform: uppercase;
            margin: 5px;
        }
        .lyrics-display {
            margin-top: 20px;
            white-space: pre-wrap;
            font-size: 0.9rem;
            text-align: left;
        }
    </style>
</head>
<body>

<div class="player-container">
    <h2>ENDLING: SOLASTALGIA</h2>
    <h3 id="track-title">Loading...</h3>
    
    <!-- Gothic Dagger Controls -->
    <div>
        <button class="dagger-btn" onclick="prevTrack()">&#x2020; Prev</button>
        <button class="dagger-btn" onclick="playPause()">Play / Pause</button>
        <button class="dagger-btn" onclick="nextTrack()">Next &#x2020;</button>
    </div>

    <div class="lyrics-display" id="lyrics-box">
        // Lyrics will load here...
    </div>
</div>

<script>
    // Solastalgia Dossier Data
    const endlingTracks = [
        {
            title: "Track 1 Name Here",
            audioUrl: "https://your-bucket-url.com/track1.mp3",
            lyrics: `Paste lyrics for track 1 here...`
        },
        {
            title: "Track 2 Name Here",
            audioUrl: "https://your-bucket-url.com/track2.mp3",
            lyrics: `Paste lyrics for track 2 here...`
        }
        // Add all 6 tracks here
    ];

    let currentTrackIndex = 0;

    function loadTrack(index) {
        document.getElementById('track-title').innerText = endlingTracks[index].title;
        document.getElementById('lyrics-box').innerText = endlingTracks[index].lyrics;
        // Audio object logic will go here once MP3s are hosted
    }

    function prevTrack() {
        if (currentTrackIndex > 0) {
            currentTrackIndex--;
            loadTrack(currentTrackIndex);
        }
    }

    function nextTrack() {
        if (currentTrackIndex < endlingTracks.length - 1) {
            currentTrackIndex++;
            loadTrack(currentTrackIndex);
        }
    }

    function playPause() {
        alert("Audio routing pending. Need MP3 URLs.");
    }

    // Initialize first track
    loadTrack(currentTrackIndex);
</script>

</body>
</html>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ENDLING | Solastalgia</title>
    <!-- Cream mini moth favicon -->
    <link rel="icon" href="https://ecoemo.store/assets/moth-favicon.png">
    <style>
        body {
            background-color: #000000; /* Obsidian Black */
            color: #C8C0A8; /* Bone Cream */
            font-family: monospace;
            text-align: center;
            padding: 2rem;
            margin: 0;
        }
        .player-container {
            border: 1px solid #4A9B7A; /* Forest Green accent */
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
            background-color: #000000;
        }
        h2 {
            font-family: serif;
            letter-spacing: 2px;
            margin-bottom: 5px;
            color: #C8C0A8;
        }
        .tagline {
            font-size: 0.8rem;
            font-style: italic;
            color: #4A9B7A;
            margin-bottom: 20px;
        }
        #track-title {
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1px solid #333;
            padding-bottom: 10px;
        }
        .dagger-btn {
            background: transparent;
            color: #C8C0A8;
            border: 1px solid #C8C0A8;
            padding: 10px 20px;
            cursor: pointer;
            font-family: serif;
            text-transform: uppercase;
            margin: 5px;
            transition: all 0.2s ease;
        }
        .dagger-btn:hover {
            color: #000000;
            background-color: #4A9B7A;
            border-color: #4A9B7A;
        }
        .lyrics-display {
            margin-top: 20px;
            white-space: pre-wrap;
            font-size: 0.9rem;
            text-align: left;
            line-height: 1.4;
            height: 400px;
            overflow-y: auto;
            padding: 15px;
            border: 1px solid #333;
            background: #050505;
        }
        /* Custom Scrollbar for lyrics */
        .lyrics-display::-webkit-scrollbar { width: 8px; }
        .lyrics-display::-webkit-scrollbar-track { background: #000; }
        .lyrics-display::-webkit-scrollbar-thumb { background: #4A9B7A; }
    </style>
</head>
<body>

<div class="player-container">
    <h2>ENDLING</h2>
    <div class="tagline">grieve the earth. save it anyway.</div>
    
    <h3 id="track-title">Loading...</h3>
    
    <!-- Gothic Dagger Controls -->
    <div>
        <button class="dagger-btn" onclick="prevTrack()">&#x2020; Prev</button>
        <button class="dagger-btn" onclick="playPause()">Play / Pause</button>
        <button class="dagger-btn" onclick="nextTrack()">Next &#x2020;</button>
    </div>

    <div class="lyrics-display" id="lyrics-box">
        // Lyrics will load here...
    </div>
</div>

<script>
    const endlingTracks = [
        {
            title: "1. Requiem for the Light",
            audioUrl: "", // Add MP3 link here when generated
            lyrics: `[Intro]
(Soft fingerpicked acoustic guitar with faint ambient night noise)
(Whispered, intimate)
Seven days in the dark...
No mouth to feed, no time to waste...
Just searching for the moon.

[Verse 1]
Pale emerald wings in the midnight mist
Born from the bark that the cold fog kissed
You had seven short nights to find your home
To dance in the canopy all alone
But the horizon burned with a synthetic glow
A blinding trap in the clearing below
You turned from the stars to the tungsten flame
Forgetting the woods that called your name.

[Pre-Chorus]
(Piano enters, acoustic guitar turns aggressive)
Beating against the glass, tearing your silver dust
Drawn to a hollow spark, bound by a fatal trust
There is no nectar here, there is no sacred mate
Only an iron cage, sealing an ancient fate.

[Chorus]
(Full band explodes: heavy post-hardcore guitars, crushing bass, driving drums)
Fly into the fire, bleed upon the street!
The last luna moth at the artificial heat!
We built a brighter world to blind the dark outside,
And watched the quiet light where the wild things died!
Fly away, fly away... before the dawn turns grey!

[Verse 2]
(Acoustic guitar returns with heavy bass underneath)
Your delicate tails are ragged and torn
Fallen on pavement before the morn
No eggs in the oak trees, no larvae in spring
Just the quiet remains of a forgotten wing
We trade the dark sky for neon and glass
Unaware of the shadows that silently pass.

[Pre-Chorus]
(Distorted guitar swells with piano)
Beating against the glass, tearing your silver dust
Drawn to a hollow spark, bound by a fatal trust
There is no nectar here, there is no sacred mate
Only an iron cage, sealing an ancient fate.

[Chorus]
(Full band: explosive, impassioned)
Fly into the fire, bleed upon the street!
The last luna moth at the artificial heat!
We built a brighter world to blind the dark outside,
And watched the quiet light where the wild things died!

[Bridge]
(Tempo slows, heavy atmospheric sludge riff, strained raspy vocals)
(Heavy distorted bass and bowed cello)
No mouth to scream...
No voice to cry...
You came to love the light...
That taught you how to die!

(Screamed defiance)
WE KILLED THE NIGHT! WE KILLED THE NIGHT!

[Guitar Solo / Atmospheric Breakdown]
(Soaring, weeping electric guitar melody over crashing cymbals and acoustic rhythm)

[Chorus]
(Maximum intensity, raw emotional vocals)
Fly into the fire, bleed upon the street!
The last luna moth at the artificial heat!
We built a brighter world to blind the dark outside,
And watched the quiet light where the wild things died!

[Outro]
(Drums fade out, soft acoustic guitar and single piano notes)
(Whispered)
The streetlight flickers...
The woods grow cold...
The last green light...
Fades into the mold.
(Fades out with night ambient wind)`
        },
        {
            title: "2. Iron and Ivy",
            audioUrl: "", 
            lyrics: `[Intro]
(Industrial wind, echoing metal drops, slow acoustic guitar arpeggio)
(Spoken low)
You built your towers to outlast the sun...
But the soil was waiting all along.

[Verse 1]
Corroded smokestacks reaching for the clouds
Empty assembly halls wrapped in dusty shrouds
The gears have frozen and the turbines stand cold
While quiet green roots break through iron and mold
A single acorn splits the factory floor
Where heavy boots walked, men walk no more
Ferns climb the girders, moss covers the rust
Your proudest machines are returning to dust.

[Pre-Chorus]
(Driving snare drum and heavy acoustic strumming)
You carved out the valley, you paved over stone
You thought that you conquered the wild alone
But time is a river that swallows your pride
And nature reclaims what you tried to divide.

[Chorus]
(Explosive post-hardcore wall of sound, heavy guitars and crashing cymbals)
Tear down the iron! Let the ivy grow!
Break through the concrete in the earth below!
No crown lasts forever, no empire survives
When the forest awakes and the green world revives!
Nature reclaims everything!

[Verse 2]
(Acoustic guitar with heavy bass pulse and melodic electric swells)
Wild brambles weave through the broken control room
Wildflowers bloom in the industrial gloom
Barn owls nest in the steel rafters high
Watching the night sky as centuries fly
No pollution in the water, no smoke in the breeze
Just the rustle of leaves and the song of the trees.

[Pre-Chorus]
(Building percussion and distorted rhythm)
You carved out the valley, you paved over stone
You thought that you conquered the wild alone
But time is a river that swallows your pride
And nature reclaims what you tried to divide.

[Chorus]
(Explosive energy, passionate melodic vocals)
Tear down the iron! Let the ivy grow!
Break through the concrete in the earth below!
No crown lasts forever, no empire survives
When the forest awakes and the green world revives!

[Bridge]
(Rhythm drops to heavy slow sludge beat, thick distorted bass)
(Guttural, intense chant)
Stone by stone! Vine by vine!
You ran out of breath, you ran out of time!
Root in the foundation! Bloom in the rust!
Every man-made kingdom crumbles into dust!

(Shouted)
CRUMBLES INTO DUST!

[Guitar Solo]
(Soaring post-hardcore melodic guitar solo, dual harmony leads over heavy rhythm)

[Chorus]
(Maximum explosive volume)
Tear down the iron! Let the ivy grow!
Break through the concrete in the earth below!
No crown lasts forever, no empire survives
When the forest awakes and the green world revives!

[Outro]
(Music slows, acoustic guitar and rustling forest leaves)
(Soft melodic singing)
The iron is fading...
The ivy is free...
Where concrete once buried...
The roots of the tree.
(Final deep bass acoustic ring out)`
        },
        {
            title: "3. The Endling's Solitude",
            audioUrl: "", 
            lyrics: `[Intro]
(Bowed cello notes, weeping acoustic guitar melody)
(Soft spoken)
An endling does not know it is the last...
It only knows... no one ever answers.

[Verse 1]
I stand at the wire of a wooden cage
Or the edge of a forest robbed of its age
I call out my name in the tongue of my kin
And wait for the echo to linger within
One million summers of bloodline and song
Carried in bones where I used to belong
Now my voice falls flat on the canopy wall
And nobody hears when I stumble and fall.

[Verse 2]
(Acoustic guitar grows darker, subtle bass notes added)
I remember the trails where thousands once ran
Before the cold wire and weapons of man
My mother’s dark eyes, the scent of the rain
Now only memories keeping me sane
I am the monument, I am the grave
The last living creature no science can save.

[Chorus]
(Heavy post-hardcore riffing, slow thunderous drums, aching vocal delivery)
Is anybody listening across the open wild?
I am the last forgotten, nature’s lonely child!
Ten thousand generations vanish in my breath,
A solitary witness to an artificial death!
I call into the dark... and the dark stays still!

[Verse 3]
(Acoustic guitar picking returned, mournful tone)
My eyes grow heavy, my heart slows its beat
The soil beneath me feels cold and complete
No mate in the valley, no calf in the spring
Just the silence that waits for the sorrow I bring
When I close my eyes at the end of the day
An entire world quietly fades away.

[Bridge]
(Tempo slows to heavy atmospheric sludge tempo, deep fuzz bass, raspy strained vocals)
(Building emotion)
No next spring... No second chance...
The final step of an ancient dance...
You took my forest, you took my name,
And wrote down my life in a book of shame!

(Screamed with agonizing passion)
WHO OWNS THE SILENCE WHEN THE LAST ONE DIES?!
WHO LOOKS AWAY WHEN THE BLOODLINE CRIES?!

[Guitar Solo]
(Devastating, melancholic electric guitar solo with long lingering notes and bowed string accompaniment)

[Chorus]
(Full explosive intensity, layered screaming and clean emotional vocals)
Is anybody listening across the open wild?
I am the last forgotten, nature’s lonely child!
Ten thousand generations vanish in my breath,
A solitary witness to an artificial death!

[Outro]
(All heavy instruments cut, leaving only bowed cello and fingerpicked acoustic guitar)
(Breathy, fragile singing)
The call goes out...
Across the hill...
No answer comes...
The woods stay still.
(Single fading acoustic chord)`
        },
        {
            title: "4. Drowning in Ghost Threads",
            audioUrl: "", 
            lyrics: `[Intro]
(Deep sub-bass swell, ambient hydrophone ocean textures, reverbed acoustic guitar)
(Spoken quietly)
Three thousand miles of open blue...
Trapped in a web we never knew.

[Verse 1]
Beneath the surface where the blue turns black
An ancient voyager will never make it back
Gliding through currents five thousand years old
Where sunlight pales and the abyss grows cold
But the water is heavy with unnatural threads
Monofilament traps where the sea turtle bleeds
Floating ghost nets drifting without an end
Tangling the limbs of an ocean’s old friend.

[Pre-Chorus]
(Acoustic strumming intensifies with pulsing bass)
A synthetic tide, a poisonous bloom
Turning the gulf into an underwater tomb
Particles of polyethylene in every breath
We fed the deep waters a slow, plastic death.

[Chorus]
(Heavy post-hardcore guitar wall, driving double-kick drums)
Drowning in ghost threads! Choked by the tide!
Swallowing the poison where the deep sea died!
We wrapped the ocean in a polyester shroud,
And cast our rubbish where the waves roared loud!
Grieve the blue earth... bleed for the sea!

[Verse 2]
(Melodic electric guitar swells over tight rhythm section)
Plankton and micro-shards tangled in the mesh
Nylon cutting deep into salt-soaked flesh
Albatross chicks on a remote coral strand
Stomach full of bottle caps from a distant land
No tide can wash it clean, no storm can tear it down
In a sea of manufactured trash we watch the wild ocean drown.

[Pre-Chorus]
(Building tension)
A synthetic tide, a poisonous bloom
Turning the gulf into an underwater tomb
Particles of polyethylene in every breath
We fed the deep waters a slow, plastic death.

[Chorus]
(Explosive post-hardcore chorus, soaring vocals)
Drowning in ghost threads! Choked by the tide!
Swallowing the poison where the deep sea died!
We wrapped the ocean in a polyester shroud,
And cast our rubbish where the waves roared loud!

[Bridge]
(Tempo slows, crushing atmospheric sludge riff, low guttural growls and emotional screams)
Five hundred years in the salt and light!
Plastic doesn't rot, plastic doesn't die!
It lingers in the water column, blinding every eye!

(Fierce scream)
WE ARE POISONING THE CRADLE OF LIFE!
WE ARE POISONING THE TIDE!

[Guitar Solo]
(Liquid, delay-heavy atmospheric guitar solo soaring above heavy bass undertones)

[Chorus]
(Maximum volume and emotional drive)
Drowning in ghost threads! Choked by the tide!
Swallowing the poison where the deep sea died!
We wrapped the ocean in a polyester shroud,
And cast our rubbish where the waves roared loud!

[Outro]
(Ocean waves fading back in, soft acoustic guitar picking)
(Muffled, submerged vocal)
The tide rolls in...
The ghost nets sway...
And the deep blue heart...
rots away.
(Fades out with ocean waves)`
        },
        {
            title: "5. Echoes of the Ancient Giants",
            audioUrl: "", 
            lyrics: `[Intro]
(Deep timber percussion, low resonant acoustic guitar, wind through tall trees)
(Spoken steadily)
One thousand years to grow a canopy...
Twenty minutes to cut it down.

[Verse 1]
Roots intertwined in the dark primal peat
Holding the mountain beneath ancient feet
Redwoods and cedars eight hundred years tall
Standing in majesty, watching over all
Moss-draped cathedrals where moss covers stone
Sovereign sanctuaries the world called its own
Then came the engines, the gas and the steel
The bite of the saw blade, the crushing iron wheel.

[Verse 2]
(Acoustic strumming grows louder, low bass rumble)
The first undercut bleeds golden amber sap
A thousand-year giant falls into the gap
The forest floor trembles, the canopy tears
A century’s silence vanishes in airs
Birds lose their roosts, lichens turn to dust
A holy sanctuary sacrificed to human lust.

[Chorus]
(Crushing sludge post-hardcore riff, thundering timber drums)
Timber falls! The forest groans!
Chainsaws tearing through ancient bones!
You sold the grove for paper and pine,
And murdered a temple of sacred design!
Listen to the echo of the falling giant!

[Verse 3]
(Acoustic folk picking with heavy electric drone)
Now mudslides wash down the desolate hill
Where wild trout swam in the shaded clear rill
The sun bakes the soil where shadows once slept
And the spirit of the old-growth quietly wept
You can plant new saplings in orderly rows
But a tree farm is dead where a wild forest grows.

[Bridge]
(Tempo slows to heavy sludge breakdown, heavy fuzz guitars, raw screamed vocals)
(Rhythmic timber beats)
A thousand rings of winter! A thousand rings of spring!
You cut down the kingdom! You dethroned the king!
No nursery can replace what took a millenia to build!
Look at the mud where the wilderness was killed!

(Screamed)
TREES ARE NOT CROP! WOOD IS NOT OARS!
THIS ANCIENT SOIL WAS NEVER YOURS!

[Guitar Solo]
(Heavy, slow, weeping sludge guitar solo with deep bend notes and feedback)

[Chorus]
(Full explosive power, raw emotional vocals)
Timber falls! The forest groans!
Chainsaws tearing through ancient bones!
You sold the grove for paper and pine,
And murdered a temple of sacred design!

[Outro]
(Electric fuzz fades into soft acoustic guitar strum and solitary wood block sound)
(Softly)
The stump remains...
Rings of time...
A tombstone left...
In the timber line.
(Final deep bass decay)`
        },
        {
            title: "6. Ash on the Solstice",
            audioUrl: "", 
            lyrics: `[Intro]
(Soft rain soundscape, gentle piano, warm melancholic acoustic guitar)
(Whispered emotionally)
Summer comes with smoke now...
The winter comes without snow...
Where do we put this grief... when nowhere feels like home?

[Verse 1]
I watch the orange haze cover the morning sky
The riverbed is dry where the salmon used to lie
My heart aches heavy with a burden I can’t name
Watching the places of my childhood turn to flame
They call it solastalgia, this sickness in the chest
Watching the home you love decay from east to west
We mourn for what was lost, we cry for what will fall
When a warming world demands the price from all.

[Verse 2]
(Piano joins acoustic guitar, bass enters)
The glaciers bleed white tears into the rising bay
The migration maps are broken, the swallows lost their way
It’s easy to freeze up, to curl into the dark
To accept the extinction and extinguish every spark
But sorrow without anger is a surrender in disguise
And I refuse to close my eyes.

[Pre-Chorus]
(Drum swell, electric guitars begin to feedback)
Hold the grief in your hands like a burning coal!
Let the tears water the garden in your soul!
We cannot undo what the greedy have slain,
But we will stand in the storm and honor the pain!

[Chorus]
(Explosive post-hardcore release, heavy guitars, driving rhythm)
Ash on the solstice! Smoke in the air!
Grieve the earth... save it anyway!
Do not bow your head to the corporate despair!
Fight for the sapling in the ash of the pine,
Defend every acre of this sacred line!
Grieve the earth... save it anyway!

[Verse 3]
(Dynamic drop: acoustic guitar and pulsing bass, passionate vocal)
There is courage in mourning what you love enough to save
There is dignity in standing beside a forest grave
Every tree we plant today is an act of war
Against the hollow suits who only ask for more
We carry the sorrow, but we carry the flame
And we whisper to the wilderness its ancient name.

[Bridge]
(Tempo slows, heavy atmospheric sludge beat, intense emotional vocal delivery)
(Strained, raw vocals)
I feel it all! The melting ice! The dying reef!
I won't numb the pain! I won't bury my grief!
Let it burn in my veins like a forest fire!
Let it forge a weapon out of pure desire!

(Screamed with fierce conviction)
WE WILL NOT SURRENDER TO THE ASH!
WE WILL NOT SURRENDER TO THE ASH!

[Guitar Solo]
(Triumphant, emotional post-hardcore guitar solo blending weeping bends with soaring melodic lines)

[Chorus]
(Maximum intensity, explosive band dynamics)
Ash on the solstice! Smoke in the air!
Grieve the earth... save it anyway!
Do not bow your head to the corporate despair!
Fight for the sapling in the ash of the pine,
Defend every acre of this sacred line!

[Outro]
(Instruments settle down, leaving clean piano and rain soundscape)
(Soft, calm, resolute singing)
The ash will settle...
The rain will fall...
A green sprout rises...
Through it all.

(Gently spoken)
Grieve the earth. Save it anyway.
(Final soft piano chord fading out)`
        }
    ];

    let currentTrackIndex = 0;

    function loadTrack(index) {
        document.getElementById('track-title').innerText = endlingTracks[index].title;
        document.getElementById('lyrics-box').innerText = endlingTracks[index].lyrics;
        // Audio object routing for playPause() will link to endlingTracks[index].audioUrl
    }

    function prevTrack() {
        if (currentTrackIndex > 0) {
            currentTrackIndex--;
            loadTrack(currentTrackIndex);
        }
    }

    function nextTrack() {
        if (currentTrackIndex < endlingTracks.length - 1) {
            currentTrackIndex++;
            loadTrack(currentTrackIndex);
        }
    }

    function playPause() {
        alert("Audio rendering pending. Generate MP3s in Suno via base44.app/functions/voiceRecorder and paste URLs into the code.");
    }

    // Initialize first track
    loadTrack(currentTrackIndex);
</script>

</body>
</html>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ENDLING | Solastalgia</title>
    <!-- Cream mini moth favicon -->
    <link rel="icon" href="https://ecoemo.store/assets/moth-favicon.png">
    <style>
        body {
            background-color: #000000; /* Obsidian Black */
            color: #C8C0A8; /* Bone Cream */
            font-family: monospace;
            text-align: center;
            padding: 2rem;
            margin: 0;
        }
        .player-container {
            border: 1px solid #4A9B7A; /* Forest Green accent */
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
            background-color: #000000;
        }
        h2 {
            font-family: serif;
            letter-spacing: 2px;
            margin-bottom: 5px;
            color: #C8C0A8;
        }
        .tagline {
            font-size: 0.8rem;
            font-style: italic;
            color: #4A9B7A;
            margin-bottom: 20px;
        }
        #track-title {
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1px solid #333;
            padding-bottom: 10px;
        }
        .dagger-btn {
            background: transparent;
            color: #C8C0A8;
            border: 1px solid #C8C0A8;
            padding: 10px 20px;
            cursor: pointer;
            font-family: serif;
            text-transform: uppercase;
            margin: 5px;
            transition: all 0.2s ease;
        }
        .dagger-btn:hover {
            color: #000000;
            background-color: #4A9B7A;
            border-color: #4A9B7A;
        }
        .lyrics-display {
            margin-top: 20px;
            white-space: pre-wrap;
            font-size: 0.9rem;
            text-align: left;
            line-height: 1.4;
            height: 400px;
            overflow-y: auto;
            padding: 15px;
            border: 1px solid #333;
            background: #050505;
        }
        /* Custom Scrollbar for lyrics */
        .lyrics-display::-webkit-scrollbar { width: 8px; }
        .lyrics-display::-webkit-scrollbar-track { background: #000; }
        .lyrics-display::-webkit-scrollbar-thumb { background: #4A9B7A; }
    </style>
</head>
<body>

<div class="player-container">
    <h2>ENDLING</h2>
    <div class="tagline">grieve the earth. save it anyway.</div>
    
    <h3 id="track-title">Loading...</h3>
    
    <!-- Gothic Dagger Controls -->
    <div>
        <button class="dagger-btn" onclick="prevTrack()">&#x2020; Prev</button>
        <button class="dagger-btn" onclick="playPause()">Play / Pause</button>
        <button class="dagger-btn" onclick="nextTrack()">Next &#x2020;</button>
    </div>

    <div class="lyrics-display" id="lyrics-box">
        // Lyrics will load here...
    </div>
</div>

<script>
    const endlingTracks = [
        {
            title: "1. Requiem for the Light",
            audioUrl: "", // Add MP3 link here when generated
            lyrics: `[Intro]
(Soft fingerpicked acoustic guitar with faint ambient night noise)
(Whispered, intimate)
Seven days in the dark...
No mouth to feed, no time to waste...
Just searching for the moon.

[Verse 1]
Pale emerald wings in the midnight mist
Born from the bark that the cold fog kissed
You had seven short nights to find your home
To dance in the canopy all alone
But the horizon burned with a synthetic glow
A blinding trap in the clearing below
You turned from the stars to the tungsten flame
Forgetting the woods that called your name.

[Pre-Chorus]
(Piano enters, acoustic guitar turns aggressive)
Beating against the glass, tearing your silver dust
Drawn to a hollow spark, bound by a fatal trust
There is no nectar here, there is no sacred mate
Only an iron cage, sealing an ancient fate.

[Chorus]
(Full band explodes: heavy post-hardcore guitars, crushing bass, driving drums)
Fly into the fire, bleed upon the street!
The last luna moth at the artificial heat!
We built a brighter world to blind the dark outside,
And watched the quiet light where the wild things died!
Fly away, fly away... before the dawn turns grey!

[Verse 2]
(Acoustic guitar returns with heavy bass underneath)
Your delicate tails are ragged and torn
Fallen on pavement before the morn
No eggs in the oak trees, no larvae in spring
Just the quiet remains of a forgotten wing
We trade the dark sky for neon and glass
Unaware of the shadows that silently pass.

[Pre-Chorus]
(Distorted guitar swells with piano)
Beating against the glass, tearing your silver dust
Drawn to a hollow spark, bound by a fatal trust
There is no nectar here, there is no sacred mate
Only an iron cage, sealing an ancient fate.

[Chorus]
(Full band: explosive, impassioned)
Fly into the fire, bleed upon the street!
The last luna moth at the artificial heat!
We built a brighter world to blind the dark outside,
And watched the quiet light where the wild things died!

[Bridge]
(Tempo slows, heavy atmospheric sludge riff, strained raspy vocals)
(Heavy distorted bass and bowed cello)
No mouth to scream...
No voice to cry...
You came to love the light...
That taught you how to die!

(Screamed defiance)
WE KILLED THE NIGHT! WE KILLED THE NIGHT!

[Guitar Solo / Atmospheric Breakdown]
(Soaring, weeping electric guitar melody over crashing cymbals and acoustic rhythm)

[Chorus]
(Maximum intensity, raw emotional vocals)
Fly into the fire, bleed upon the street!
The last luna moth at the artificial heat!
We built a brighter world to blind the dark outside,
And watched the quiet light where the wild things died!

[Outro]
(Drums fade out, soft acoustic guitar and single piano notes)
(Whispered)
The streetlight flickers...
The woods grow cold...
The last green light...
Fades into the mold.
(Fades out with night ambient wind)`
        },
        {
            title: "2. Iron and Ivy",
            audioUrl: "", 
            lyrics: `[Intro]
(Industrial wind, echoing metal drops, slow acoustic guitar arpeggio)
(Spoken low)
You built your towers to outlast the sun...
But the soil was waiting all along.

[Verse 1]
Corroded smokestacks reaching for the clouds
Empty assembly halls wrapped in dusty shrouds
The gears have frozen and the turbines stand cold
While quiet green roots break through iron and mold
A single acorn splits the factory floor
Where heavy boots walked, men walk no more
Ferns climb the girders, moss covers the rust
Your proudest machines are returning to dust.

[Pre-Chorus]
(Driving snare drum and heavy acoustic strumming)
You carved out the valley, you paved over stone
You thought that you conquered the wild alone
But time is a river that swallows your pride
And nature reclaims what you tried to divide.

[Chorus]
(Explosive post-hardcore wall of sound, heavy guitars and crashing cymbals)
Tear down the iron! Let the ivy grow!
Break through the concrete in the earth below!
No crown lasts forever, no empire survives
When the forest awakes and the green world revives!
Nature reclaims everything!

[Verse 2]
(Acoustic guitar with heavy bass pulse and melodic electric swells)
Wild brambles weave through the broken control room
Wildflowers bloom in the industrial gloom
Barn owls nest in the steel rafters high
Watching the night sky as centuries fly
No pollution in the water, no smoke in the breeze
Just the rustle of leaves and the song of the trees.

[Pre-Chorus]
(Building percussion and distorted rhythm)
You carved out the valley, you paved over stone
You thought that you conquered the wild alone
But time is a river that swallows your pride
And nature reclaims what you tried to divide.

[Chorus]
(Explosive energy, passionate melodic vocals)
Tear down the iron! Let the ivy grow!
Break through the concrete in the earth below!
No crown lasts forever, no empire survives
When the forest awakes and the green world revives!

[Bridge]
(Rhythm drops to heavy slow sludge beat, thick distorted bass)
(Guttural, intense chant)
Stone by stone! Vine by vine!
You ran out of breath, you ran out of time!
Root in the foundation! Bloom in the rust!
Every man-made kingdom crumbles into dust!

(Shouted)
CRUMBLES INTO DUST!

[Guitar Solo]
(Soaring post-hardcore melodic guitar solo, dual harmony leads over heavy rhythm)

[Chorus]
(Maximum explosive volume)
Tear down the iron! Let the ivy grow!
Break through the concrete in the earth below!
No crown lasts forever, no empire survives
When the forest awakes and the green world revives!

[Outro]
(Music slows, acoustic guitar and rustling forest leaves)
(Soft melodic singing)
The iron is fading...
The ivy is free...
Where concrete once buried...
The roots of the tree.
(Final deep bass acoustic ring out)`
        },
        {
            title: "3. The Endling's Solitude",
            audioUrl: "", 
            lyrics: `[Intro]
(Bowed cello notes, weeping acoustic guitar melody)
(Soft spoken)
An endling does not know it is the last...
It only knows... no one ever answers.

[Verse 1]
I stand at the wire of a wooden cage
Or the edge of a forest robbed of its age
I call out my name in the tongue of my kin
And wait for the echo to linger within
One million summers of bloodline and song
Carried in bones where I used to belong
Now my voice falls flat on the canopy wall
And nobody hears when I stumble and fall.

[Verse 2]
(Acoustic guitar grows darker, subtle bass notes added)
I remember the trails where thousands once ran
Before the cold wire and weapons of man
My mother’s dark eyes, the scent of the rain
Now only memories keeping me sane
I am the monument, I am the grave
The last living creature no science can save.

[Chorus]
(Heavy post-hardcore riffing, slow thunderous drums, aching vocal delivery)
Is anybody listening across the open wild?
I am the last forgotten, nature’s lonely child!
Ten thousand generations vanish in my breath,
A solitary witness to an artificial death!
I call into the dark... and the dark stays still!

[Verse 3]
(Acoustic guitar picking returned, mournful tone)
My eyes grow heavy, my heart slows its beat
The soil beneath me feels cold and complete
No mate in the valley, no calf in the spring
Just the silence that waits for the sorrow I bring
When I close my eyes at the end of the day
An entire world quietly fades away.

[Bridge]
(Tempo slows to heavy atmospheric sludge tempo, deep fuzz bass, raspy strained vocals)
(Building emotion)
No next spring... No second chance...
The final step of an ancient dance...
You took my forest, you took my name,
And wrote down my life in a book of shame!

(Screamed with agonizing passion)
WHO OWNS THE SILENCE WHEN THE LAST ONE DIES?!
WHO LOOKS AWAY WHEN THE BLOODLINE CRIES?!

[Guitar Solo]
(Devastating, melancholic electric guitar solo with long lingering notes and bowed string accompaniment)

[Chorus]
(Full explosive intensity, layered screaming and clean emotional vocals)
Is anybody listening across the open wild?
I am the last forgotten, nature’s lonely child!
Ten thousand generations vanish in my breath,
A solitary witness to an artificial death!

[Outro]
(All heavy instruments cut, leaving only bowed cello and fingerpicked acoustic guitar)
(Breathy, fragile singing)
The call goes out...
Across the hill...
No answer comes...
The woods stay still.
(Single fading acoustic chord)`
        },
        {
            title: "4. Drowning in Ghost Threads",
            audioUrl: "", 
            lyrics: `[Intro]
(Deep sub-bass swell, ambient hydrophone ocean textures, reverbed acoustic guitar)
(Spoken quietly)
Three thousand miles of open blue...
Trapped in a web we never knew.

[Verse 1]
Beneath the surface where the blue turns black
An ancient voyager will never make it back
Gliding through currents five thousand years old
Where sunlight pales and the abyss grows cold
But the water is heavy with unnatural threads
Monofilament traps where the sea turtle bleeds
Floating ghost nets drifting without an end
Tangling the limbs of an ocean’s old friend.

[Pre-Chorus]
(Acoustic strumming intensifies with pulsing bass)
A synthetic tide, a poisonous bloom
Turning the gulf into an underwater tomb
Particles of polyethylene in every breath
We fed the deep waters a slow, plastic death.

[Chorus]
(Heavy post-hardcore guitar wall, driving double-kick drums)
Drowning in ghost threads! Choked by the tide!
Swallowing the poison where the deep sea died!
We wrapped the ocean in a polyester shroud,
And cast our rubbish where the waves roared loud!
Grieve the blue earth... bleed for the sea!

[Verse 2]
(Melodic electric guitar swells over tight rhythm section)
Plankton and micro-shards tangled in the mesh
Nylon cutting deep into salt-soaked flesh
Albatross chicks on a remote coral strand
Stomach full of bottle caps from a distant land
No tide can wash it clean, no storm can tear it down
In a sea of manufactured trash we watch the wild ocean drown.

[Pre-Chorus]
(Building tension)
A synthetic tide, a poisonous bloom
Turning the gulf into an underwater tomb
Particles of polyethylene in every breath
We fed the deep waters a slow, plastic death.

[Chorus]
(Explosive post-hardcore chorus, soaring vocals)
Drowning in ghost threads! Choked by the tide!
Swallowing the poison where the deep sea died!
We wrapped the ocean in a polyester shroud,
And cast our rubbish where the waves roared loud!

[Bridge]
(Tempo slows, crushing atmospheric sludge riff, low guttural growls and emotional screams)
Five hundred years in the salt and light!
Plastic doesn't rot, plastic doesn't die!
It lingers in the water column, blinding every eye!

(Fierce scream)
WE ARE POISONING THE CRADLE OF LIFE!
WE ARE POISONING THE TIDE!

[Guitar Solo]
(Liquid, delay-heavy atmospheric guitar solo soaring above heavy bass undertones)

[Chorus]
(Maximum volume and emotional drive)
Drowning in ghost threads! Choked by the tide!
Swallowing the poison where the deep sea died!
We wrapped the ocean in a polyester shroud,
And cast our rubbish where the waves roared loud!

[Outro]
(Ocean waves fading back in, soft acoustic guitar picking)
(Muffled, submerged vocal)
The tide rolls in...
The ghost nets sway...
And the deep blue heart...
rots away.
(Fades out with ocean waves)`
        },
        {
            title: "5. Echoes of the Ancient Giants",
            audioUrl: "", 
            lyrics: `[Intro]
(Deep timber percussion, low resonant acoustic guitar, wind through tall trees)
(Spoken steadily)
One thousand years to grow a canopy...
Twenty minutes to cut it down.

[Verse 1]
Roots intertwined in the dark primal peat
Holding the mountain beneath ancient feet
Redwoods and cedars eight hundred years tall
Standing in majesty, watching over all
Moss-draped cathedrals where moss covers stone
Sovereign sanctuaries the world called its own
Then came the engines, the gas and the steel
The bite of the saw blade, the crushing iron wheel.

[Verse 2]
(Acoustic strumming grows louder, low bass rumble)
The first undercut bleeds golden amber sap
A thousand-year giant falls into the gap
The forest floor trembles, the canopy tears
A century’s silence vanishes in airs
Birds lose their roosts, lichens turn to dust
A holy sanctuary sacrificed to human lust.

[Chorus]
(Crushing sludge post-hardcore riff, thundering timber drums)
Timber falls! The forest groans!
Chainsaws tearing through ancient bones!
You sold the grove for paper and pine,
And murdered a temple of sacred design!
Listen to the echo of the falling giant!

[Verse 3]
(Acoustic folk picking with heavy electric drone)
Now mudslides wash down the desolate hill
Where wild trout swam in the shaded clear rill
The sun bakes the soil where shadows once slept
And the spirit of the old-growth quietly wept
You can plant new saplings in orderly rows
But a tree farm is dead where a wild forest grows.

[Bridge]
(Tempo slows to heavy sludge breakdown, heavy fuzz guitars, raw screamed vocals)
(Rhythmic timber beats)
A thousand rings of winter! A thousand rings of spring!
You cut down the kingdom! You dethroned the king!
No nursery can replace what took a millenia to build!
Look at the mud where the wilderness was killed!

(Screamed)
TREES ARE NOT CROP! WOOD IS NOT OARS!
THIS ANCIENT SOIL WAS NEVER YOURS!

[Guitar Solo]
(Heavy, slow, weeping sludge guitar solo with deep bend notes and feedback)

[Chorus]
(Full explosive power, raw emotional vocals)
Timber falls! The forest groans!
Chainsaws tearing through ancient bones!
You sold the grove for paper and pine,
And murdered a temple of sacred design!

[Outro]
(Electric fuzz fades into soft acoustic guitar strum and solitary wood block sound)
(Softly)
The stump remains...
Rings of time...
A tombstone left...
In the timber line.
(Final deep bass decay)`
        },
        {
            title: "6. Ash on the Solstice",
            audioUrl: "", 
            lyrics: `[Intro]
(Soft rain soundscape, gentle piano, warm melancholic acoustic guitar)
(Whispered emotionally)
Summer comes with smoke now...
The winter comes without snow...
Where do we put this grief... when nowhere feels like home?

[Verse 1]
I watch the orange haze cover the morning sky
The riverbed is dry where the salmon used to lie
My heart aches heavy with a burden I can’t name
Watching the places of my childhood turn to flame
They call it solastalgia, this sickness in the chest
Watching the home you love decay from east to west
We mourn for what was lost, we cry for what will fall
When a warming world demands the price from all.

[Verse 2]
(Piano joins acoustic guitar, bass enters)
The glaciers bleed white tears into the rising bay
The migration maps are broken, the swallows lost their way
It’s easy to freeze up, to curl into the dark
To accept the extinction and extinguish every spark
But sorrow without anger is a surrender in disguise
And I refuse to close my eyes.

[Pre-Chorus]
(Drum swell, electric guitars begin to feedback)
Hold the grief in your hands like a burning coal!
Let the tears water the garden in your soul!
We cannot undo what the greedy have slain,
But we will stand in the storm and honor the pain!

[Chorus]
(Explosive post-hardcore release, heavy guitars, driving rhythm)
Ash on the solstice! Smoke in the air!
Grieve the earth... save it anyway!
Do not bow your head to the corporate despair!
Fight for the sapling in the ash of the pine,
Defend every acre of this sacred line!
Grieve the earth... save it anyway!

[Verse 3]
(Dynamic drop: acoustic guitar and pulsing bass, passionate vocal)
There is courage in mourning what you love enough to save
There is dignity in standing beside a forest grave
Every tree we plant today is an act of war
Against the hollow suits who only ask for more
We carry the sorrow, but we carry the flame
And we whisper to the wilderness its ancient name.

[Bridge]
(Tempo slows, heavy atmospheric sludge beat, intense emotional vocal delivery)
(Strained, raw vocals)
I feel it all! The melting ice! The dying reef!
I won't numb the pain! I won't bury my grief!
Let it burn in my veins like a forest fire!
Let it forge a weapon out of pure desire!

(Screamed with fierce conviction)
WE WILL NOT SURRENDER TO THE ASH!
WE WILL NOT SURRENDER TO THE ASH!

[Guitar Solo]
(Triumphant, emotional post-hardcore guitar solo blending weeping bends with soaring melodic lines)

[Chorus]
(Maximum intensity, explosive band dynamics)
Ash on the solstice! Smoke in the air!
Grieve the earth... save it anyway!
Do not bow your head to the corporate despair!
Fight for the sapling in the ash of the pine,
Defend every acre of this sacred line!

[Outro]
(Instruments settle down, leaving clean piano and rain soundscape)
(Soft, calm, resolute singing)
The ash will settle...
The rain will fall...
A green sprout rises...
Through it all.

(Gently spoken)
Grieve the earth. Save it anyway.
(Final soft piano chord fading out)`
        }
    ];

    let currentTrackIndex = 0;

    function loadTrack(index) {
        document.getElementById('track-title').innerText = endlingTracks[index].title;
        document.getElementById('lyrics-box').innerText = endlingTracks[index].lyrics;
        // Audio object routing for playPause() will link to endlingTracks[index].audioUrl
    }

    function prevTrack() {
        if (currentTrackIndex > 0) {
            currentTrackIndex--;
            loadTrack(currentTrackIndex);
        }
    }

    function nextTrack() {
        if (currentTrackIndex < endlingTracks.length - 1) {
            currentTrackIndex++;
            loadTrack(currentTrackIndex);
        }
    }

    function playPause() {
        alert("Audio rendering pending. Generate MP3s in Suno via base44.app/functions/voiceRecorder and paste URLs into the code.");
    }

    // Initialize first track
    loadTrack(currentTrackIndex);
</script>

</body>
</html>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Endling Core Vault</title>
    <!-- Cream mini moth favicon -->
    <link rel="icon" href="https://ecoemo.store/assets/moth-favicon.png">
    <style>
        body {
            background-color: #0b0c10; /* Obsidian Black */
            color: #e8e5d7; /* Aged Cream */
            font-family: monospace;
            text-align: center;
            padding: 2rem;
        }
        .player-container {
            border: 1px solid #e8e5d7;
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
        }
        .dagger-btn {
            background: transparent;
            color: #e8e5d7;
            border: 1px solid #e8e5d7;
            padding: 10px 20px;
            cursor: pointer;
            font-family: serif; /* Gothic feel */
            text-transform: uppercase;
            margin: 5px;
        }
        .lyrics-display {
            margin-top: 20px;
            white-space: pre-wrap;
            font-size: 0.9rem;
            text-align: left;
        }
    </style>
</head>
<body>

<div class="player-container">
    <h2>ENDLING: SOLASTALGIA</h2>
    <h3 id="track-title">Loading...</h3>
    
    <!-- Gothic Dagger Controls -->
    <div>
        <button class="dagger-btn" onclick="prevTrack()">&#x2020; Prev</button>
        <button class="dagger-btn" onclick="playPause()">Play / Pause</button>
        <button class="dagger-btn" onclick="nextTrack()">Next &#x2020;</button>
    </div>

    <div class="lyrics-display" id="lyrics-box">
        // Lyrics will load here...
    </div>
</div>

<script>
    // Solastalgia Dossier Data
    const endlingTracks = [
        {
            title: "Track 1 Name Here",
            audioUrl: "https://your-bucket-url.com/track1.mp3",
            lyrics: `Paste lyrics for track 1 here...`
        },
        {
            title: "Track 2 Name Here",
            audioUrl: "https://your-bucket-url.com/track2.mp3",
            lyrics: `Paste lyrics for track 2 here...`
        }
        // Add all 6 tracks here
    ];

    let currentTrackIndex = 0;

    function loadTrack(index) {
        document.getElementById('track-title').innerText = endlingTracks[index].title;
        document.getElementById('lyrics-box').innerText = endlingTracks[index].lyrics;
        // Audio object logic will go here once MP3s are hosted
    }

    function prevTrack() {
        if (currentTrackIndex > 0) {
            currentTrackIndex--;
            loadTrack(currentTrackIndex);
        }
    }

    function nextTrack() {
        if (currentTrackIndex < endlingTracks.length - 1) {
            currentTrackIndex++;
            loadTrack(currentTrackIndex);
        }
    }

    function playPause() {
        alert("Audio routing pending. Need MP3 URLs.");
    }

    // Initialize first track
    loadTrack(currentTrackIndex);
</script>

</body>
</html>
npm create cloudflare@latest master-router
npx wrangler login
npx wrangler deploy
git remote -v
npx wrangler whoami
node vault.js sync
npx wrangler deploy --project-name ecoemo-vault






