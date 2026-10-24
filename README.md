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
