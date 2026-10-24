import torch
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
