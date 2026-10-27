5px import torch
import scipy.io.wavfile as wavfile
from audiocraft.models import MusicGen
from diffusers import StableDiffusionPipeline

print("Loading Endling Audio Engine (MusicGen)...")
audio_model = MusicGen.get_pretrained('facebook/musicgen-small')
audio_model.set_generation_params(duration=180) # 3-minute instrumentals

print("Loading Endling Visual Engine (Stable Diffusion)...")
pipe = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5", torch_dtype=torch.float16)
pipe = pipe.to("cuda" if torch.cuda.is_available() else "cpu")

tracks = {
    "01_Requiem": {
        "music": "Dark acoustic emo blending into atmospheric post-hardcore, 75 BPM in 6/8 time. Gentle melancholic fingerpicked acoustic guitar and ghostly piano opening, building into soaring wall-of-sound distorted guitars, heavy resonant bass, thunderous slow drums, and ambient night insect textures.",
        "art": "A single radiant forest-green Luna Moth with frayed, delicate wings resting on an old rusted iron streetlight bulb enveloped in dark moss under a pitch-black night sky."
    },
    "02_IronAndIvy": {
        "music": "Atmospheric post-hardcore with dark acoustic verse dynamics, 88 BPM in heavy dropped-D tuning. Industrial metal scraping ambient textures fading into resonant acoustic guitar chords, rhythmic driving percussion, wall-of-sound electric guitar crescendos.",
        "art": "Fractured concrete beams of a crumbling factory overrun by thick forest ivy and glowing emerald moss under a pale cream twilight sky."
    },
    "03_EndlingsSolitude": {
        "music": "Sombre acoustic emo evolving into heavy sludge post-hardcore, 65 BPM. Mournful bowed cello and delicate fingerpicked acoustic guitar transitioning into slow, crushing sludge riffs, reverberant snare.",
        "art": "The silhouetted shadow of a solitary creature standing atop a rain-soaked ridge, casting a long shadow across a barren landscape under a misty forest-green aura."
    },
    "04_GhostThreads": {
        "music": "Dark atmospheric emo post-hardcore with aquatic, reverbed soundscapes, 80 BPM. Hydrophone-like bass rumble, swirling ambient electric guitar delays, sharp emotive acoustic rhythms, surging heavy guitar breakdowns.",
        "art": "A translucent sea turtle swimming through a dark forest-green abyss filled with suspended microplastic particles reflecting faint cream-colored sunlight."
    },
    "05_AncientGiants": {
        "music": "Crushing atmospheric sludge post-hardcore with dark acoustic folk foundations, 70 BPM. Deep resonant acoustic guitars, thundering ritual timber drums, low bowed bass, heavy sludge fuzz riffs.",
        "art": "A colossal ancient tree stump with centuries of growth rings exposed, surrounded by chainsaws resting on a bed of fresh forest pine needles and dark soil."
    },
    "06_AshOnSolstice": {
        "music": "Melancholic acoustic emo with intense post-hardcore climax, 76 BPM. Subtle piano chords, rain soundscapes, acoustic guitar strumming building into explosive wall-of-sound distorted guitars, rapid driving drums.",
        "art": "A handful of dark charred ash slipping through fingers onto a fresh forest-green pine sprout breaking through scorched soil."
    }
}

for track_name, prompts in tracks.items():
    print(f"\nProducing Instrumental for {track_name}...")
    audio_output = audio_model.generate([prompts["music"]])
    wavfile.write(f"{track_name}_instrumental.wav", 32000, audio_output[0, 0].cpu().numpy())
    
    print(f"Painting Cover Art for {track_name}...")
    image = pipe(prompts["art"]).images[0]
    image.save(f"{track_name}_cover.png")

print("\nSolastalgia production complete. Files saved to current directory.")
import subprocess
import sys
import json

def render_music_video(track_name, raw_vocal_path, instrumental_path, output_path):
    # Step 1: Mix vocals with instrumental and apply the Web Audio DSP scream effect equivalent
    mixed_audio = "temp_mixed.wav"
    subprocess.run([
        "ffmpeg", "-i", raw_vocal_path, "-i", instrumental_path, 
        "-filter_complex", "[0:a]volume=1.2,compand[v];[1:a]volume=0.8[i];[v][i]amix=inputs=2:duration=longest",
        mixed_audio, "-y"
    ], check=True)

    # Step 2: Generate the visualizer video using the brand palette and album art
    subprocess.run([
        "ffmpeg", "-loop", "1", "-i", "assets/solastalgia_cover.png", 
        "-i", mixed_audio, 
        "-vf", "drawbox=x=0:y=0:w=iw:h=ih:color=#4A9B7A:t=fill,format=yuv420p", 
        "-c:v", "libx264", "-tune", "stillimage", "-c:a", "aac", "-b:a", "192k", 
        "-pix_fmt", "yuv420p", "-shortest", output_path, "-y"
    ], check=True)
    print(f"[{track_name}] Rendered and sealed in the vault: {output_path}")

if __name__ == "__main__":
    payload = json.loads(sys.argv[1])
    render_music_video(payload['track'], payload['vocal'], payload['instrumental'], payload['output'])
Execution Pipeline
To link this all together without repeating manual steps, update your custom vault.js CLI in the Codespace terminal. Add a new command vault orchestrate that automatically pushes your local changes to the Cloudflare Worker and starts the Python rendering queue for any pending audio files.
​Run npx wrangler deploy in your master-router directory to push the central API live. Send the deployment URL here, and we can immediately route your Base44 links (superagent-9d2adfc6.base44.app) to start pointing their outputs into this single entity.
