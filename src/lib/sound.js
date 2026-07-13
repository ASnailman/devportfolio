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

// Fallback: a synthesized soft "thock" — modeled on a lubed linear (red) switch
// bottoming out on a custom keyboard. It's deliberately low and muffled (no
// bright, harsh high-frequency tick): a short low-frequency body resonance for
// the deep "thock", plus a very quiet, soft transient for the plastic contact,
// both rounded off through a gentle low-pass. Soft attacks avoid onset clicks.
function playSynthClick(ctx) {
  const now = ctx.currentTime;

  // Master chain: everything runs through a gentle low-pass so nothing is sharp.
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.6, now);

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.setValueAtTime(3600, now); // soft but with a bit of click
  lowpass.Q.setValueAtTime(0.7, now);

  master.connect(lowpass);
  lowpass.connect(ctx.destination);

  // 1) Body "thock": a low sine that drops slightly in pitch and decays fast.
  const body = ctx.createOscillator();
  body.type = 'sine';
  body.frequency.setValueAtTime(185, now);
  body.frequency.exponentialRampToValueAtTime(120, now + 0.06);

  const bodyGain = ctx.createGain();
  bodyGain.gain.setValueAtTime(0.0001, now);
  bodyGain.gain.linearRampToValueAtTime(0.9, now + 0.004); // soft 4ms attack
  bodyGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.075);

  body.connect(bodyGain);
  bodyGain.connect(master);
  body.start(now);
  body.stop(now + 0.09);

  // 2) Contact transient: a very short, quiet noise burst, band-limited so it
  //    reads as a soft "thd" rather than a bright click.
  const noiseDur = 0.018;
  const frames = Math.max(1, Math.floor(ctx.sampleRate * noiseDur));
  const noiseBuffer = ctx.createBuffer(1, frames, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < frames; i++) {
    const t = i / frames;
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2);
  }

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(2700, now); // higher = more audible "click"
  bandpass.Q.setValueAtTime(0.8, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.0001, now);
  noiseGain.gain.linearRampToValueAtTime(0.7, now + 0.001); // snappier, louder tick
  noiseGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.025);

  noise.connect(bandpass);
  bandpass.connect(noiseGain);
  noiseGain.connect(master);
  noise.start(now);
  // Sources free themselves once stopped / drained; no manual cleanup needed.
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
