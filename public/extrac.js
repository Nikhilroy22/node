const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let currentSource = null;
let isPlaying = false;
let audioBuffer = null; // cache the loaded audio

async function loadSound(url) {
    if (audioBuffer) return audioBuffer; // একবার load করা হলে reuse করো

    const resp = await fetch(url);
    const arrayBuffer = await resp.arrayBuffer();
    audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    return audioBuffer;
}

async function toggleSound(url) {
    if (isPlaying) {
        // বন্ধ করো
        if (currentSource) currentSource.stop();
        currentSource = null;
        isPlaying = false;
        return;
    }

    // চালাও
    const buffer = await loadSound(url);
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.loop = true; // continuous background music
    source.connect(audioCtx.destination);
    source.start();

    currentSource = source;
    isPlaying = true;

    source.onended = () => {
        currentSource = null;
        isPlaying = false;
    };
}

// Toggle button
const soundToggleBtn = document.getElementById("soundToggleBtn");
soundToggleBtn.addEventListener("click", async () => {
    await toggleSound('sound/background.mp3');
    soundToggleBtn.textContent = isPlaying ? "🔊 Sound: ON" : "🔇 Sound: OFF";
});



async function playSound(url) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const resp = await fetch(url);
        const arrayBuffer = await resp.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start(0);
        source.onended = () => { try{ ctx.close(); } catch(e){} };
        return new Promise(resolve => source.onended = () => { try{ctx.close();}catch(e){} resolve(); });
    } catch(err) { console.warn('playSound failed', err); return Promise.resolve(); }
}