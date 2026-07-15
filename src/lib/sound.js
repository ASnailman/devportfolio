// UI sound effects for dock/desktop feedback.
//
// Two distinct event sounds are served from public/sounds/ (swap the files
// or the paths below to change them):
//   - open  : opening an app / clicking a link
//   - close : closing a window (the X button)
//
// Each mp3 is fetched once and decoded into an AudioBuffer so repeated plays
// are low-latency and can overlap. A single AudioContext is created lazily on
// first use, because browsers block audio until a user gesture — the context
// only unlocks after a real gesture (click/tap).

const SOUND_URLS = {
  open: '/sounds/zapsplat_multimedia_button_press_plastic_click_002_36869.mp3',
  close: '/sounds/zapsplat_multimedia_button_click_bright_003_92100.mp3',
};

// Per-event default volume (0..1).
const DEFAULT_VOLUME = {
  open: 0.1,
  close: 0.1,
};

let audioCtx = null;
let enabled = true;

// Per-name decode cache + load state so each file is fetched/decoded once.
const buffers = {};
const failed = {};
const promises = {};

// Toggled from the app (mirrors the dock's sound on/off state).
export function setSoundEnabled(value) {
  enabled = !!value;
}

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioCtx = new AudioContextClass();
  }
  return audioCtx;
}

// Fetch + decode one sound. On any failure (e.g. missing file) it's marked
// failed so we stop retrying and simply stay silent for that event.
function loadBuffer(ctx, name) {
  if (buffers[name] || failed[name] || promises[name]) return;
  const url = SOUND_URLS[name];
  if (!url) {
    failed[name] = true;
    return;
  }
  promises[name] = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`sound "${name}" HTTP ${res.status}`);
      return res.arrayBuffer();
    })
    .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
    .then((decoded) => {
      buffers[name] = decoded;
    })
    .catch(() => {
      failed[name] = true;
    });
}

// Warm the cache for every event so the first of each kind is ready.
function preloadAll(ctx) {
  for (const name of Object.keys(SOUND_URLS)) loadBuffer(ctx, name);
}

function playBuffer(ctx, buffer, volume) {
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  source.connect(gain);
  gain.connect(ctx.destination);
  source.start(ctx.currentTime);
}

// Plays a named event sound, honoring the on/off toggle.
export function playSound(name, options = {}) {
  if (typeof window === 'undefined' || !enabled) return;

  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  // First call unlocks the context — warm all buffers so later events are ready.
  preloadAll(ctx);

  const buffer = buffers[name];
  if (!buffer) return; // not decoded yet (or failed) — stay silent this time

  const volume = options.volume ?? DEFAULT_VOLUME[name] ?? 0.1;
  playBuffer(ctx, buffer, volume);
}

export const playOpen = () => playSound('open');
export const playClose = () => playSound('close');
