# Vault
Coreplayer
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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


<!-- ============================================================
     AGENCY DEN — workers, agents, skills and files.
     Self-contained page: opens over the vault from the launcher.
     State lives in this browser's localStorage.
     ============================================================ -->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Agency Den</title>
<style>
    :root {
        --ad-ink: #0b0c10;
        --ad-panel: #0f1114;
        --ad-panel-2: #0d0f12;
        --ad-cream: #e8e5d7;
        --ad-bone: #c8c0a8;
        --ad-moss: #4a9b7a;
        --ad-moss-bright: #6fd0a8;
        --ad-line: #23262b;
        --ad-line-2: #2f3338;
        --ad-muted: #7f8b85;
        --ad-danger: #e09393;
    }

    #ad-launcher {
        position: fixed;
        right: 18px;
        bottom: 18px;
        z-index: 2147483000;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 18px;
        border: 1px solid var(--ad-moss);
        background: rgba(11, 12, 16, 0.96);
        color: var(--ad-cream);
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 12px;
        letter-spacing: 2px;
        text-transform: uppercase;
        cursor: pointer;
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.65);
        transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
    }
    #ad-launcher:hover { border-color: var(--ad-moss-bright); color: #ffffff; background: #11161a; }
    #ad-launcher:focus-visible { outline: 2px solid var(--ad-moss-bright); outline-offset: 3px; }

    #agency-den {
        position: fixed;
        inset: 0;
        z-index: 2147483001;
        display: none;
        overflow-y: auto;
        text-align: left;
        color: var(--ad-cream);
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;
        color-scheme: dark;
        background:
            radial-gradient(1100px 560px at 12% -8%, rgba(74, 155, 122, 0.13), transparent 62%),
            radial-gradient(900px 520px at 92% 108%, rgba(74, 155, 122, 0.08), transparent 60%),
            var(--ad-ink);
        -webkit-font-smoothing: antialiased;
    }
    #agency-den.ad-open { display: block; }
    #agency-den *, #ad-launcher * { box-sizing: border-box; }

    .ad-shell {
        max-width: 1180px;
        margin: 0 auto;
        padding: 26px clamp(14px, 4vw, 40px) 80px;
    }
    .ad-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
        padding-bottom: 18px;
        border-bottom: 1px solid var(--ad-line);
    }
    .ad-brand { display: flex; align-items: center; gap: 14px; }
    .ad-sigil {
        width: 46px;
        height: 46px;
        flex: none;
        display: grid;
        place-items: center;
        border: 1px solid var(--ad-moss);
        background: rgba(74, 155, 122, 0.07);
        color: var(--ad-moss-bright);
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 24px;
        line-height: 1;
    }
    .ad-title {
        margin: 0;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: clamp(22px, 3.2vw, 32px);
        font-weight: normal;
        letter-spacing: 4px;
        text-transform: uppercase;
        color: var(--ad-cream);
    }
    .ad-sub {
        margin: 5px 0 0;
        font-size: 10px;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: var(--ad-muted);
    }

    .ad-stats {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
        margin: 20px 0;
    }
    .ad-stat { border: 1px solid var(--ad-line); background: var(--ad-panel); padding: 12px 14px; }
    .ad-stat b {
        display: block;
        font-family: Georgia, 'Times New Roman', serif;
        font-weight: normal;
        font-size: 22px;
        line-height: 1.1;
        color: var(--ad-moss-bright);
    }
    .ad-stat span {
        display: block;
        margin-top: 4px;
        font-size: 9px;
        letter-spacing: 1.6px;
        text-transform: uppercase;
        color: var(--ad-muted);
    }

    .ad-tabs {
        display: flex;
        gap: 0;
        border-bottom: 1px solid var(--ad-line);
        margin-bottom: 22px;
        overflow-x: auto;
    }
    .ad-tab {
        appearance: none;
        border: 0;
        border-bottom: 2px solid transparent;
        background: transparent;
        color: var(--ad-muted);
        font-family: inherit;
        font-size: 11px;
        letter-spacing: 2px;
        text-transform: uppercase;
        padding: 12px 18px;
        cursor: pointer;
        white-space: nowrap;
    }
    .ad-tab:hover { color: var(--ad-cream); }
    .ad-tab[aria-selected="true"] { color: var(--ad-moss-bright); border-bottom-color: var(--ad-moss); }
    .ad-tab:focus-visible { outline: 1px solid var(--ad-moss); outline-offset: -3px; }

    .ad-panel {
        border: 1px solid var(--ad-line);
        background: var(--ad-panel);
        padding: 16px;
    }
    .ad-panel h3 {
        margin: 0 0 12px;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 14px;
        font-weight: normal;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: var(--ad-bone);
    }
    .ad-register { margin-bottom: 18px; }

    .ad-field { margin-bottom: 10px; }
    .ad-field label {
        display: block;
        margin-bottom: 5px;
        font-size: 9px;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: var(--ad-muted);
    }
    .ad-two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
    @media (max-width: 640px) { .ad-two { grid-template-columns: 1fr; } }

    .ad-input, .ad-select, .ad-textarea {
        width: 100%;
        border: 1px solid var(--ad-line-2);
        border-radius: 0;
        background: #0a0c0e;
        color: var(--ad-cream);
        font-family: inherit;
        font-size: 12px;
        line-height: 1.5;
        padding: 8px 10px;
    }
    .ad-textarea { resize: vertical; min-height: 74px; }
    .ad-input:focus, .ad-select:focus, .ad-textarea:focus {
        outline: none;
        border-color: var(--ad-moss);
        box-shadow: 0 0 0 1px rgba(74, 155, 122, 0.35);
    }
    .ad-input::placeholder, .ad-textarea::placeholder { color: #5c636a; }
    .ad-rule { border: 0; border-top: 1px solid var(--ad-line); margin: 16px 0; }

    .ad-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        appearance: none;
        border: 1px solid var(--ad-moss);
        background: transparent;
        color: var(--ad-moss-bright);
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 11px;
        letter-spacing: 1.6px;
        text-transform: uppercase;
        text-decoration: none;
        padding: 8px 12px;
        cursor: pointer;
        white-space: nowrap;
        transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
    }
    .ad-btn:hover { background: rgba(74, 155, 122, 0.15); color: #d9f5e8; }
    .ad-btn:focus-visible { outline: 2px solid var(--ad-moss-bright); outline-offset: 2px; }
    .ad-btn:disabled { opacity: 0.38; cursor: not-allowed; }
    .ad-btn.ad-ghost { border-color: var(--ad-line-2); color: var(--ad-bone); }
    .ad-btn.ad-ghost:hover { border-color: var(--ad-bone); background: rgba(232, 229, 215, 0.06); }
    .ad-btn.ad-danger { border-color: #4a2b2b; color: var(--ad-danger); }
    .ad-btn.ad-danger:hover { background: rgba(224, 147, 147, 0.12); border-color: #7a4040; }

    .ad-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
    .ad-grid .ad-empty { grid-column: 1 / -1; }
    .ad-card {
        display: flex;
        flex-direction: column;
        gap: 12px;
        border: 1px solid var(--ad-line);
        background: linear-gradient(180deg, #101216, var(--ad-panel-2));
        padding: 16px;
    }
    .ad-card.ad-off { opacity: 0.62; }
    .ad-card-head { display: flex; align-items: center; gap: 10px; }
    .ad-avatar {
        width: 38px;
        height: 38px;
        flex: none;
        display: grid;
        place-items: center;
        border: 1px solid var(--ad-line-2);
        background: #0a0c0e;
        color: var(--ad-moss);
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 17px;
        text-transform: uppercase;
    }
    .ad-name-wrap { min-width: 0; }
    .ad-name {
        margin: 0;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 16px;
        font-weight: normal;
        letter-spacing: 1px;
        color: var(--ad-cream);
        overflow-wrap: anywhere;
    }
    .ad-role {
        margin-top: 2px;
        font-size: 9px;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: var(--ad-muted);
    }
    .ad-switch {
        position: relative;
        flex: none;
        margin-left: auto;
        width: 46px;
        height: 24px;
        padding: 0;
        border: 1px solid #3a3f45;
        border-radius: 999px;
        background: #15181c;
        cursor: pointer;
    }
    .ad-switch::after {
        content: "";
        position: absolute;
        top: 3px;
        left: 3px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #5c636a;
        transition: left 0.18s ease, background 0.18s ease;
    }
    .ad-switch[aria-checked="true"] { border-color: var(--ad-moss); background: rgba(74, 155, 122, 0.16); }
    .ad-switch[aria-checked="true"]::after { left: 25px; background: var(--ad-moss-bright); }
    .ad-switch:focus-visible { outline: 2px solid var(--ad-moss-bright); outline-offset: 2px; }

    .ad-status { display: flex; align-items: center; gap: 7px; font-size: 9px; letter-spacing: 1.4px; text-transform: uppercase; color: var(--ad-muted); }
    .ad-dot { width: 6px; height: 6px; border-radius: 50%; background: #5c636a; flex: none; }
    .ad-status.ad-on .ad-dot { background: var(--ad-moss-bright); box-shadow: 0 0 8px rgba(111, 208, 168, 0.7); }

    .ad-desc { margin: 0; font-size: 12px; line-height: 1.55; color: #a8a294; }
    .ad-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .ad-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border: 1px solid var(--ad-line-2);
        background: #0a0c0e;
        color: var(--ad-bone);
        font-size: 9px;
        letter-spacing: 0.8px;
        text-transform: uppercase;
        padding: 4px 7px;
    }
    .ad-chip button {
        padding: 0;
        border: 0;
        background: none;
        color: var(--ad-muted);
        font-family: inherit;
        font-size: 12px;
        line-height: 1;
        cursor: pointer;
    }
    .ad-chip button:hover { color: var(--ad-danger); }
    .ad-chip button:focus-visible { outline: 1px solid var(--ad-danger); }

    .ad-apply { display: flex; gap: 8px; margin-top: auto; }
    .ad-apply .ad-select { flex: 1; min-width: 0; }
    .ad-card-foot { display: flex; justify-content: flex-end; }
    .ad-card-foot .ad-btn { padding: 6px 10px; font-size: 9px; }

    .ad-hint { margin: 10px 0 16px; font-size: 11px; line-height: 1.6; color: var(--ad-muted); }

    .ad-skills { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 16px; align-items: start; }
    @media (max-width: 860px) { .ad-skills { grid-template-columns: 1fr; } }
    .ad-list { display: flex; flex-direction: column; gap: 10px; }
    .ad-skill {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        border: 1px solid var(--ad-line);
        background: var(--ad-panel-2);
        padding: 12px 14px;
    }
    .ad-skill-main { flex: 1; min-width: 0; }
    .ad-skill h4 {
        margin: 0 0 4px;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 14px;
        font-weight: normal;
        letter-spacing: 0.6px;
        color: var(--ad-cream);
        overflow-wrap: anywhere;
    }
    .ad-skill .ad-btn { padding: 6px 10px; font-size: 9px; }
    .ad-meta { font-size: 9px; letter-spacing: 1.2px; text-transform: uppercase; color: var(--ad-muted); }
    .ad-skill .ad-desc { margin-top: 6px; }

    .ad-files { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 16px; align-items: start; }
    @media (max-width: 860px) { .ad-files { grid-template-columns: 1fr; } }
    .ad-table-wrap { overflow-x: auto; }
    .ad-table { width: 100%; border-collapse: collapse; font-size: 12px; }
    .ad-table th {
        padding: 0 10px 8px 0;
        border-bottom: 1px solid var(--ad-line);
        text-align: left;
        font-weight: normal;
        font-size: 9px;
        letter-spacing: 1.4px;
        text-transform: uppercase;
        color: var(--ad-muted);
        white-space: nowrap;
    }
    .ad-table td {
        padding: 10px 10px 10px 0;
        border-bottom: 1px solid #1a1d21;
        vertical-align: middle;
        color: var(--ad-bone);
    }
    .ad-table th:last-child, .ad-table td:last-child { text-align: right; padding-right: 0; white-space: nowrap; }
    .ad-file-name { color: var(--ad-cream); overflow-wrap: anywhere; }
    .ad-table .ad-btn { padding: 5px 9px; font-size: 9px; }

    .ad-empty {
        border: 1px dashed var(--ad-line-2);
        padding: 26px;
        text-align: center;
        font-size: 12px;
        line-height: 1.6;
        color: var(--ad-muted);
    }

    #ad-toast {
        position: fixed;
        left: 50%;
        bottom: 28px;
        transform: translateX(-50%) translateY(16px);
        z-index: 2147483002;
        padding: 10px 16px;
        border: 1px solid var(--ad-moss);
        background: var(--ad-panel);
        color: var(--ad-cream);
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 12px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease, transform 0.2s ease;
    }
    #ad-toast.ad-show { opacity: 1; transform: translateX(-50%) translateY(0); }

    @media (max-width: 640px) {
        .ad-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .ad-top { align-items: center; }
        .ad-shell { padding-bottom: 60px; }
    }
</style>
</head>
<body>

<div id="agency-den" role="dialog" aria-modal="true" aria-labelledby="ad-title" aria-hidden="true">
    <div class="ad-shell">
        <div class="ad-top">
            <div class="ad-brand">
                <div class="ad-sigil" aria-hidden="true">&#x2020;</div>
                <div>
                    <h2 class="ad-title" id="ad-title">Agency Den</h2>
                    <p class="ad-sub">Workers &middot; Agents &middot; Skills &middot; Files</p>
                </div>
            </div>
            <button class="ad-btn ad-ghost" type="button" data-action="close">Return to Vault</button>
        </div>

        <div class="ad-stats" id="ad-stats"></div>

        <div class="ad-tabs" role="tablist" aria-label="Agency Den sections">
            <button class="ad-tab" type="button" role="tab" data-tab="agents" aria-selected="true">Agents</button>
            <button class="ad-tab" type="button" role="tab" data-tab="skills" aria-selected="false">Skills</button>
            <button class="ad-tab" type="button" role="tab" data-tab="files" aria-selected="false">Files</button>
        </div>

        <div id="ad-view"></div>
    </div>
    <div id="ad-toast" role="status" aria-live="polite"></div>
</div>

<button id="ad-launcher" type="button" aria-haspopup="dialog" aria-controls="agency-den">&#x2020; Agency Den</button>

<script>
(function () {
    'use strict';

    var STORE_KEY = 'agencyDen.v1';
    var MAX_FILE_BYTES = 750 * 1024;

    function uid(prefix) {
        return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    }

    function seedState() {
        var skills = [
            { id: 'sk_lyric', name: 'Lyric Extraction', category: 'Text', description: 'Pull clean lyrics from a dossier and strip stage directions.' },
            { id: 'sk_master', name: 'Stem Mastering', category: 'Audio', description: 'Balance levels and export release-ready masters.' },
            { id: 'sk_sigil', name: 'Moth Sigil Design', category: 'Visual', description: 'Generate cream-on-obsidian moth marks in the vault palette.' },
            { id: 'sk_copy', name: 'Release Copywriting', category: 'Text', description: 'Write announcement copy in the Endling voice.' },
            { id: 'sk_index', name: 'File Indexing', category: 'Ops', description: 'Tag, dedupe and catalogue uploaded vault files.' }
        ];
        var agents = [
            { id: 'ag_warden', name: 'Warden', role: 'Orchestrator', model: 'den-core', description: 'Routes every request, keeps the ledger and dispatches work to the right worker.', enabled: true, skills: ['sk_index'] },
            { id: 'ag_lyricist', name: 'Lyricist', role: 'Text Worker', model: 'text-forge', description: 'Drafts and archives lyrics, keeping the Solastalgia dossier in canon.', enabled: true, skills: ['sk_lyric', 'sk_copy'] },
            { id: 'ag_soundwright', name: 'Soundwright', role: 'Audio Worker', model: 'audio-forge', description: 'Masters tracks, trims stems and prepares release-ready mixes.', enabled: true, skills: ['sk_master'] },
            { id: 'ag_mothlight', name: 'Mothlight', role: 'Visual Worker', model: 'vision-forge', description: 'Cover art, moth sigils and vault styling.', enabled: false, skills: ['sk_sigil'] },
            { id: 'ag_courier', name: 'Courier', role: 'Release Worker', model: 'dispatch', description: 'Packages the vault for distribution and posts announcements.', enabled: true, skills: ['sk_copy'] },
            { id: 'ag_archivist', name: 'Archivist', role: 'File Worker', model: 'archive', description: 'Catalogues files, checks duplicates and keeps the index clean.', enabled: false, skills: ['sk_index'] }
        ];
        return { agents: agents, skills: skills, files: [] };
    }

    var state = loadState();
    var activeTab = 'agents';
    var previousOverflow = '';

    var den = document.getElementById('agency-den');
    var launcher = document.getElementById('ad-launcher');
    var view = document.getElementById('ad-view');
    var statsEl = document.getElementById('ad-stats');

    function loadState() {
        try {
            var raw = window.localStorage.getItem(STORE_KEY);
            if (raw) {
                var parsed = JSON.parse(raw);
                if (parsed && Array.isArray(parsed.agents) && Array.isArray(parsed.skills) && Array.isArray(parsed.files)) {
                    return parsed;
                }
            }
        } catch (err) { /* storage unavailable or corrupt: fall back to the seed */ }
        var fresh = seedState();
        try { window.localStorage.setItem(STORE_KEY, JSON.stringify(fresh)); } catch (err2) { /* ignore */ }
        return fresh;
    }

    function persist() {
        try {
            window.localStorage.setItem(STORE_KEY, JSON.stringify(state));
            return true;
        } catch (err) {
            toast('Browser storage is full — that item is too large to keep.');
            return false;
        }
    }

    function esc(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
        });
    }

    function fmtBytes(bytes) {
        var n = Number(bytes) || 0;
        if (n < 1024) { return n + ' B'; }
        if (n < 1024 * 1024) { return (n / 1024).toFixed(1) + ' KB'; }
        return (n / (1024 * 1024)).toFixed(2) + ' MB';
    }

    function fmtDate(iso) {
        try {
            return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        } catch (err) { return '—'; }
    }

    function findAgent(id) {
        return state.agents.filter(function (a) { return a.id === id; })[0];
    }

    function findSkill(id) {
        return state.skills.filter(function (s) { return s.id === id; })[0];
    }

    function storageBytes() {
        var total = 0;
        state.files.forEach(function (f) { total += Number(f.size) || 0; });
        return total;
    }

    function toast(message) {
        var el = document.getElementById('ad-toast');
        if (!el) { return; }
        el.textContent = message;
        el.classList.add('ad-show');
        window.clearTimeout(toast.timer);
        toast.timer = window.setTimeout(function () { el.classList.remove('ad-show'); }, 2600);
    }

    function fieldValue(name) {
        var el = view.querySelector('[data-field="' + name + '"]');
        return el ? el.value : '';
    }

    function setField(name, value) {
        var el = view.querySelector('[data-field="' + name + '"]');
        if (el) { el.value = value; }
    }

    function snapshotFields() {
        var snapshot = {};
        view.querySelectorAll('[data-field]').forEach(function (el) {
            if (el.type === 'file') { return; }
            snapshot[el.getAttribute('data-field')] = el.value;
        });
        return snapshot;
    }

    function restoreFields(snapshot) {
        view.querySelectorAll('[data-field]').forEach(function (el) {
            if (el.type === 'file') { return; }
            var key = el.getAttribute('data-field');
            if (Object.prototype.hasOwnProperty.call(snapshot, key)) { el.value = snapshot[key]; }
        });
    }

    function stat(value, label) {
        return '<div class="ad-stat"><b>' + esc(value) + '</b><span>' + esc(label) + '</span></div>';
    }

    function renderStats() {
        var enabled = state.agents.filter(function (a) { return a.enabled; }).length;
        statsEl.innerHTML =
            stat(enabled + ' / ' + state.agents.length, 'Workers enabled') +
            stat(String(state.skills.length), 'Skills in library') +
            stat(String(state.files.length), 'Files hosted') +
            stat(fmtBytes(storageBytes()), 'Den storage');
    }

    function agentCard(agent) {
        var chips = agent.skills.map(function (skillId) {
            var skill = findSkill(skillId);
            if (!skill) { return ''; }
            return '<span class="ad-chip">' + esc(skill.name) +
                '<button type="button" data-action="unapply" data-agent="' + agent.id + '" data-skill="' + skill.id + '" aria-label="Remove ' + esc(skill.name) + ' from ' + esc(agent.name) + '">&times;</button>' +
                '</span>';
        }).join('');

        var options = state.skills.filter(function (skill) {
            return agent.skills.indexOf(skill.id) === -1;
        }).map(function (skill) {
            return '<option value="' + skill.id + '">' + esc(skill.name) + '</option>';
        }).join('');

        return '<article class="ad-card' + (agent.enabled ? '' : ' ad-off') + '">' +
            '<div class="ad-card-head">' +
                '<div class="ad-avatar" aria-hidden="true">' + esc(agent.name.charAt(0)) + '</div>' +
                '<div class="ad-name-wrap">' +
                    '<h3 class="ad-name">' + esc(agent.name) + '</h3>' +
                    '<div class="ad-role">' + esc(agent.role) + '</div>' +
                '</div>' +
                '<button class="ad-switch" type="button" role="switch" aria-checked="' + (agent.enabled ? 'true' : 'false') + '" aria-label="' + (agent.enabled ? 'Disable ' : 'Enable ') + esc(agent.name) + '" data-action="toggle" data-agent="' + agent.id + '"></button>' +
            '</div>' +
            '<div class="ad-status' + (agent.enabled ? ' ad-on' : '') + '"><span class="ad-dot"></span>' + (agent.enabled ? 'Enabled' : 'Disabled') + ' &middot; ' + esc(agent.model) + '</div>' +
            '<p class="ad-desc">' + esc(agent.description) + '</p>' +
            '<div class="ad-chips">' + (chips || '<span class="ad-meta">No skills applied</span>') + '</div>' +
            '<div class="ad-apply">' +
                '<select class="ad-select" data-skill-select="' + agent.id + '" aria-label="Skill to apply to ' + esc(agent.name) + '"' + (options ? '' : ' disabled') + '>' +
                    (options || '<option value="">No skills left to apply</option>') +
                '</select>' +
                '<button class="ad-btn" type="button" data-action="apply" data-agent="' + agent.id + '"' + (options ? '' : ' disabled') + '>Apply</button>' +
            '</div>' +
            '<div class="ad-card-foot"><button class="ad-btn ad-danger" type="button" data-action="remove-agent" data-agent="' + agent.id + '">Remove worker</button></div>' +
        '</article>';
    }

    function renderAgents() {
        var enabled = state.agents.filter(function (a) { return a.enabled; }).length;
        var cards = state.agents.map(agentCard).join('');
        return '<section class="ad-panel ad-register">' +
                '<h3>Register a worker</h3>' +
                '<div class="ad-two">' +
                    '<div class="ad-field"><label for="ad-agent-name">Name</label><input class="ad-input" id="ad-agent-name" type="text" data-field="agentName" placeholder="e.g. Nightjar" autocomplete="off"></div>' +
                    '<div class="ad-field"><label for="ad-agent-role">Role</label><input class="ad-input" id="ad-agent-role" type="text" data-field="agentRole" placeholder="e.g. Audio Worker" autocomplete="off"></div>' +
                '</div>' +
                '<div class="ad-field"><label for="ad-agent-desc">What it does</label><input class="ad-input" id="ad-agent-desc" type="text" data-field="agentDesc" placeholder="Short description" autocomplete="off"></div>' +
                '<button class="ad-btn" type="button" data-action="add-agent">Add worker</button>' +
            '</section>' +
            '<p class="ad-hint">' + enabled + ' of ' + state.agents.length + ' workers are active. Flip a switch to enable or disable a worker, then apply a skill from the library beneath its card.</p>' +
            '<div class="ad-grid">' + (cards || '<div class="ad-empty">No workers yet. Register the first one above.</div>') + '</div>';
    }

    function renderSkills() {
        var list = state.skills.map(function (skill) {
            var users = state.agents.filter(function (agent) { return agent.skills.indexOf(skill.id) !== -1; });
            var userNames = users.map(function (user) { return esc(user.name); }).join(', ');
            return '<div class="ad-skill">' +
                '<div class="ad-skill-main">' +
                    '<h4>' + esc(skill.name) + '</h4>' +
                    '<div class="ad-meta">' + esc(skill.category) + ' &middot; ' + users.length + (users.length === 1 ? ' worker' : ' workers') + '</div>' +
                    (skill.description ? '<p class="ad-desc">' + esc(skill.description) + '</p>' : '') +
                    (userNames ? '<div class="ad-meta" style="margin-top:6px">Applied to ' + userNames + '</div>' : '') +
                '</div>' +
                '<button class="ad-btn ad-danger" type="button" data-action="remove-skill" data-skill="' + skill.id + '">Delete</button>' +
            '</div>';
        }).join('');

        var categories = ['Text', 'Audio', 'Visual', 'Ops', 'Research'];
        var categoryOptions = categories.map(function (category) {
            return '<option value="' + category + '">' + category + '</option>';
        }).join('');
        var agentOptions = state.agents.map(function (agent) {
            return '<option value="' + agent.id + '">' + esc(agent.name) + '</option>';
        }).join('');

        return '<div class="ad-skills">' +
            '<section class="ad-panel">' +
                '<h3>Skill library</h3>' +
                (list ? '<div class="ad-list">' + list + '</div>' : '<div class="ad-empty">No skills yet. Forge the first one.</div>') +
            '</section>' +
            '<section class="ad-panel">' +
                '<h3>Create a skill</h3>' +
                '<div class="ad-field"><label for="ad-skill-name">Skill name</label><input class="ad-input" id="ad-skill-name" type="text" data-field="skillName" placeholder="e.g. Cover Art Direction" autocomplete="off"></div>' +
                '<div class="ad-two">' +
                    '<div class="ad-field"><label for="ad-skill-category">Category</label><select class="ad-select" id="ad-skill-category" data-field="skillCategory">' + categoryOptions + '</select></div>' +
                    '<div class="ad-field"><label for="ad-skill-apply">Apply to</label><select class="ad-select" id="ad-skill-apply" data-field="skillApply"><option value="">No worker yet</option>' + agentOptions + '</select></div>' +
                '</div>' +
                '<div class="ad-field"><label for="ad-skill-desc">Description</label><textarea class="ad-textarea" id="ad-skill-desc" data-field="skillDesc" rows="3" placeholder="What this skill lets a worker do"></textarea></div>' +
                '<button class="ad-btn" type="button" data-action="add-skill">Forge skill</button>' +
                '<p class="ad-hint">New skills land in the library and can be applied to any worker from its card.</p>' +
            '</section>' +
        '</div>';
    }

    function renderFiles() {
        var rows = state.files.map(function (file) {
            return '<tr>' +
                '<td class="ad-file-name">' + esc(file.name) + '</td>' +
                '<td>' + esc(file.type || 'file') + '</td>' +
                '<td>' + fmtBytes(file.size) + '</td>' +
                '<td>' + esc(fmtDate(file.added)) + '</td>' +
                '<td>' +
                    (file.data
                        ? '<a class="ad-btn" href="' + esc(file.data) + '" download="' + esc(file.name) + '">Open</a> '
                        : '<span class="ad-meta">name only</span> ') +
                    '<button class="ad-btn ad-danger" type="button" data-action="remove-file" data-file="' + file.id + '">Delete</button>' +
                '</td>' +
            '</tr>';
        }).join('');

        return '<div class="ad-files">' +
            '<section class="ad-panel">' +
                '<h3>Vault files</h3>' +
                (state.files.length
                    ? '<div class="ad-table-wrap"><table class="ad-table"><thead><tr><th>Name</th><th>Type</th><th>Size</th><th>Added</th><th>Actions</th></tr></thead><tbody>' + rows + '</tbody></table></div>'
                    : '<div class="ad-empty">No files hosted yet. Host a text file below or upload one from this machine.</div>') +
                '<p class="ad-hint">' + fmtBytes(storageBytes()) + ' held in this browser. Files stay on this device — nothing is uploaded to a server.</p>' +
            '</section>' +
            '<section class="ad-panel">' +
                '<h3>Add a file</h3>' +
                '<div class="ad-field"><label for="ad-file-name">File name</label><input class="ad-input" id="ad-file-name" type="text" data-field="fileName" placeholder="e.g. solastalgia-notes.md" autocomplete="off"></div>' +
                '<div class="ad-field"><label for="ad-file-body">Contents</label><textarea class="ad-textarea" id="ad-file-body" data-field="fileBody" rows="5" placeholder="Paste text to host it in the den"></textarea></div>' +
                '<button class="ad-btn" type="button" data-action="add-text-file">Host text file</button>' +
                '<hr class="ad-rule">' +
                '<div class="ad-field"><label for="ad-file-upload">Or upload from this machine</label><input class="ad-input" id="ad-file-upload" type="file" data-field="fileUpload"></div>' +
                '<p class="ad-hint">Uploads up to 750 KB are kept in this browser; larger files are catalogued by name only.</p>' +
            '</section>' +
        '</div>';
    }

    function render() {
        var snapshot = snapshotFields();
        renderStats();
        if (activeTab === 'skills') {
            view.innerHTML = renderSkills();
        } else if (activeTab === 'files') {
            view.innerHTML = renderFiles();
        } else {
            view.innerHTML = renderAgents();
        }
        restoreFields(snapshot);
        den.querySelectorAll('[data-tab]').forEach(function (tab) {
            tab.setAttribute('aria-selected', tab.getAttribute('data-tab') === activeTab ? 'true' : 'false');
        });
    }

    function toggleAgent(id) {
        var agent = findAgent(id);
        if (!agent) { return; }
        agent.enabled = !agent.enabled;
        persist();
        render();
        toast(agent.name + (agent.enabled ? ' enabled.' : ' disabled.'));
    }

    function applySkill(agentId) {
        var agent = findAgent(agentId);
        if (!agent) { return; }
        var select = view.querySelector('[data-skill-select="' + agentId + '"]');
        var skillId = select ? select.value : '';
        if (!skillId) { toast('Choose a skill to apply first.'); return; }
        if (agent.skills.indexOf(skillId) !== -1) { return; }
        agent.skills.push(skillId);
        persist();
        render();
        var skill = findSkill(skillId);
        toast((skill ? skill.name : 'Skill') + ' applied to ' + agent.name + '.');
    }

    function unapplySkill(agentId, skillId) {
        var agent = findAgent(agentId);
        if (!agent) { return; }
        agent.skills = agent.skills.filter(function (id) { return id !== skillId; });
        persist();
        render();
        toast('Skill removed from ' + agent.name + '.');
    }

    function removeAgent(id) {
        var agent = findAgent(id);
        if (!agent) { return; }
        state.agents = state.agents.filter(function (a) { return a.id !== id; });
        persist();
        render();
        toast('Worker removed: ' + agent.name + '.');
    }

    function addAgent() {
        var name = fieldValue('agentName').trim();
        if (!name) { toast('Name the worker first.'); return; }
        var role = fieldValue('agentRole').trim() || 'Worker';
        var description = fieldValue('agentDesc').trim() || 'No description yet.';
        state.agents.push({
            id: uid('ag'),
            name: name,
            role: role,
            model: 'den-core',
            description: description,
            enabled: true,
            skills: []
        });
        setField('agentName', '');
        setField('agentRole', '');
        setField('agentDesc', '');
        persist();
        render();
        toast('Worker registered: ' + name + '.');
    }

    function addSkill() {
        var name = fieldValue('skillName').trim();
        if (!name) { toast('Name the skill first.'); return; }
        var category = fieldValue('skillCategory') || 'Text';
        var description = fieldValue('skillDesc').trim();
        var applyTo = fieldValue('skillApply');
        var skill = { id: uid('sk'), name: name, category: category, description: description };
        state.skills.push(skill);
        if (applyTo) {
            var agent = findAgent(applyTo);
            if (agent && agent.skills.indexOf(skill.id) === -1) { agent.skills.push(skill.id); }
        }
        setField('skillName', '');
        setField('skillDesc', '');
        setField('skillApply', '');
        persist();
        render();
        toast('Skill forged: ' + name + '.');
    }

    function removeSkill(id) {
        var skill = findSkill(id);
        if (!skill) { return; }
        state.skills = state.skills.filter(function (s) { return s.id !== id; });
        state.agents.forEach(function (agent) {
            agent.skills = agent.skills.filter(function (skillId) { return skillId !== id; });
        });
        persist();
        render();
        toast('Skill deleted: ' + skill.name + '.');
    }

    function addTextFile() {
        var name = fieldValue('fileName').trim();
        var body = fieldValue('fileBody');
        if (!name) { toast('Name the file first.'); return; }
        if (!body) { toast('Paste some contents first.'); return; }
        var record = {
            id: uid('f'),
            name: name,
            type: 'text/plain',
            size: new Blob([body]).size,
            added: new Date().toISOString(),
            data: 'data:text/plain;charset=utf-8,' + encodeURIComponent(body)
        };
        state.files.unshift(record);
        if (!persist()) { state.files.shift(); render(); return; }
        setField('fileName', '');
        setField('fileBody', '');
        render();
        toast('File hosted: ' + name + '.');
    }

    function handleUpload(input) {
        var file = input.files && input.files[0];
        if (!file) { return; }
        var record = {
            id: uid('f'),
            name: file.name,
            type: file.type || 'application/octet-stream',
            size: file.size,
            added: new Date().toISOString(),
            data: ''
        };
        if (file.size > MAX_FILE_BYTES) {
            state.files.unshift(record);
            if (!persist()) { state.files.shift(); render(); return; }
            input.value = '';
            render();
            toast('Catalogued by name only — too large to store in the browser.');
            return;
        }
        var reader = new FileReader();
        reader.onload = function () {
            record.data = String(reader.result || '');
            state.files.unshift(record);
            if (!persist()) { state.files.shift(); render(); return; }
            render();
            toast('File hosted: ' + file.name + '.');
        };
        reader.onerror = function () { toast('Could not read that file.'); };
        reader.readAsDataURL(file);
    }

    function removeFile(id) {
        var file = state.files.filter(function (f) { return f.id === id; })[0];
        if (!file) { return; }
        state.files = state.files.filter(function (f) { return f.id !== id; });
        persist();
        render();
        toast('File removed: ' + file.name + '.');
    }

    function openDen() {
        previousOverflow = document.body.style.overflow;
        den.classList.add('ad-open');
        den.removeAttribute('aria-hidden');
        document.body.style.overflow = 'hidden';
        var closeButton = den.querySelector('[data-action="close"]');
        if (closeButton) { closeButton.focus(); }
    }

    function closeDen() {
        den.classList.remove('ad-open');
        den.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = previousOverflow;
        launcher.focus();
    }

    den.addEventListener('click', function (event) {
        var target = event.target;
        if (!target || !target.closest) { return; }

        var tab = target.closest('[data-tab]');
        if (tab && den.contains(tab)) {
            activeTab = tab.getAttribute('data-tab');
            render();
            return;
        }

        var trigger = target.closest('[data-action]');
        if (!trigger || !den.contains(trigger)) { return; }

        var action = trigger.getAttribute('data-action');
        var agentId = trigger.getAttribute('data-agent');
        var skillId = trigger.getAttribute('data-skill');
        var fileId = trigger.getAttribute('data-file');

        if (action === 'close') { closeDen(); return; }
        if (action === 'toggle') { toggleAgent(agentId); return; }
        if (action === 'apply') { applySkill(agentId); return; }
        if (action === 'unapply') { unapplySkill(agentId, skillId); return; }
        if (action === 'remove-agent') { removeAgent(agentId); return; }
        if (action === 'add-agent') { addAgent(); return; }
        if (action === 'add-skill') { addSkill(); return; }
        if (action === 'remove-skill') { removeSkill(skillId); return; }
        if (action === 'add-text-file') { addTextFile(); return; }
        if (action === 'remove-file') { removeFile(fileId); return; }
    });

    view.addEventListener('change', function (event) {
        var target = event.target;
        if (target && target.getAttribute && target.getAttribute('data-field') === 'fileUpload') {
            handleUpload(target);
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && den.classList.contains('ad-open')) { closeDen(); }
    });

    launcher.addEventListener('click', openDen);

    render();
    openDen();
})();
</script>

</body>
</html>
