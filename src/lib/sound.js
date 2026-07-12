// Click sound for dock/UI feedback.
//
// Plays a custom click sound from `public/sounds/click.mp3` if you've added one
// (drop any .mp3 there — no code change needed). Until that file exists (or if
// it fails to load), it falls back to a synthesized click so the UI is never
// silent. The mp3 is fetched once and decoded into an AudioBuffer so repeated
// clicks are low-latency and can overlap.
//
// A single AudioContext is created lazily on first use, because browsers block
// audio until a user gesture, so we can't create it at module load time.

// Path to an optional user-supplied click sound (served from /public).
const CLICK_SOUND_URL = '/sounds/click.mp3';

let audioCtx = null;

// Decoded mp3 cache + load state so we only fetch/decode once.
let clickBuffer = null;
let clickBufferPromise = null;
let clickBufferFailed = false;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioCtx = new AudioContextClass();
  }
  return audioCtx;
}

// Fetch + decode the mp3 once. On any failure (e.g. file not present yet) we
// mark it failed so we stop retrying and use the synth fallback instead.
function loadClickBuffer(ctx) {
  if (clickBuffer || clickBufferFailed || clickBufferPromise) return;
  clickBufferPromise = fetch(CLICK_SOUND_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`click sound HTTP ${res.status}`);
      return res.arrayBuffer();
    })
    .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
    .then((decoded) => {
      clickBuffer = decoded;
    })
    .catch(() => {
      clickBufferFailed = true;
    });
}

// Plays the decoded mp3 buffer.
function playBuffer(ctx, buffer) {
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.9, ctx.currentTime);
  source.connect(gain);
  gain.connect(ctx.destination);
  source.start(ctx.currentTime);
}

// Fallback: a synthesized physical click. A real click is a broadband impulse,
// not a tone — so we make a brief burst of white noise with a fast decay,
// muffled through a low-pass filter for a natural "tick/clack".
function playSynthClick(ctx) {
  const duration = 0.03; // ~30ms — sharp and short
  const frameCount = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, frameCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    const t = i / frameCount;
    // Fast cubic decay so the noise collapses into a click, not a hiss.
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 3);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(3000, ctx.currentTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.45, ctx.currentTime);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  source.start(ctx.currentTime);
  // Buffer stops itself at end-of-data; no manual stop() needed.
}

export function playClick() {
  if (typeof window === 'undefined') return;

  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  // Kick off the mp3 load on first use; plays synth until it's ready.
  if (!clickBuffer && !clickBufferFailed) loadClickBuffer(ctx);

  if (clickBuffer) {
    playBuffer(ctx, clickBuffer);
  } else {
    playSynthClick(ctx);
  }
}
