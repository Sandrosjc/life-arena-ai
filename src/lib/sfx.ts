/**
 * Motor de som do app (Web Audio API, sem arquivos externos).
 * Sons curtos, "gostosos" e escaláveis por combo — feito para viciar.
 */

const STORAGE_KEY = "fluencybr.sound";
const MUSIC_KEY = "fluencybr.music";
const SFX_VOL_KEY = "fluencybr.vol.sfx";
const MUSIC_VOL_KEY = "fluencybr.vol.music";

let ctx: AudioContext | null = null;
let muted = false;
let loaded = false;
let musicOn = true;
let sfxVolume = 1;
let musicVolume = 0.6;
let musicNodes: { gain: GainNode; timer: number } | null = null;

type Win = Window & { webkitAudioContext?: typeof AudioContext };

function readVolume(key: string, fallback: number) {
  const raw = window.localStorage.getItem(key);
  const value = raw === null ? NaN : Number(raw);
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : fallback;
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  muted = window.localStorage.getItem(STORAGE_KEY) === "off";
  musicOn = window.localStorage.getItem(MUSIC_KEY) !== "off";
  sfxVolume = readVolume(SFX_VOL_KEY, 1);
  musicVolume = readVolume(MUSIC_VOL_KEY, 0.6);
}

const MUSIC_BASE_GAIN = 0.06;

/** Volume dos efeitos (0 a 1). */
export function getSfxVolume() {
  load();
  return sfxVolume;
}

export function setSfxVolume(value: number) {
  load();
  sfxVolume = Math.min(1, Math.max(0, value));
  window.localStorage.setItem(SFX_VOL_KEY, String(sfxVolume));
  return sfxVolume;
}

/** Volume da música de fundo (0 a 1). */
export function getMusicVolume() {
  load();
  return musicVolume;
}

export function setMusicVolume(value: number) {
  load();
  musicVolume = Math.min(1, Math.max(0, value));
  window.localStorage.setItem(MUSIC_VOL_KEY, String(musicVolume));
  if (musicNodes) musicNodes.gain.gain.value = MUSIC_BASE_GAIN * musicVolume;
  return musicVolume;
}

export function isMuted() {
  load();
  return muted;
}

export function toggleMuted() {
  load();
  muted = !muted;
  window.localStorage.setItem(STORAGE_KEY, muted ? "off" : "on");
  if (!muted) blip(880, 0.08, "triangle", 0.25);
  return muted;
}

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  load();
  if (muted) return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as Win).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

type Wave = OscillatorType;

function tone(
  freq: number,
  start: number,
  duration: number,
  wave: Wave,
  gain: number,
  bend?: number,
) {
  const ac = audio();
  if (!ac) return;
  const level = gain * sfxVolume;
  if (level <= 0.0002) return;
  const t0 = ac.currentTime + start;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(freq, t0);
  if (bend) osc.frequency.exponentialRampToValueAtTime(Math.max(40, bend), t0 + duration);
  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(level, t0 + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(amp).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

function blip(freq: number, dur = 0.08, wave: Wave = "square", gain = 0.15) {
  tone(freq, 0, dur, wave, gain);
}

function noiseBurst(duration = 0.35, gain = 0.18) {
  const ac = audio();
  if (!ac) return;
  const frames = Math.floor(ac.sampleRate * duration);
  const buffer = ac.createBuffer(1, frames, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames) ** 2;
  }
  const src = ac.createBufferSource();
  const filter = ac.createBiquadFilter();
  const amp = ac.createGain();
  src.buffer = buffer;
  filter.type = "highpass";
  filter.frequency.value = 1400;
  amp.gain.value = gain * sfxVolume;
  src.connect(filter).connect(amp).connect(ac.destination);
  src.start();
}

/** Toque leve em botões e seleções. */
export const sfxTap = () => blip(520, 0.05, "triangle", 0.09);

/** Acerto: fanfarra que sobe conforme o combo (0, 1, 2...). */
export function sfxCorrect(combo = 0) {
  const semitone = Math.min(combo, 8) * 1;
  const base = 523.25 * 2 ** (semitone / 12);
  const chord = [1, 1.26, 1.5, 2];
  chord.forEach((mult, i) => {
    tone(base * mult, i * 0.055, 0.28, "triangle", 0.2);
    tone(base * mult * 2, i * 0.055, 0.16, "sine", 0.08);
  });
  noiseBurst(0.28, 0.12);
}

/** Erro: buzz grave e curto. */
export function sfxWrong() {
  tone(196, 0, 0.22, "sawtooth", 0.16, 110);
  tone(146, 0.06, 0.26, "square", 0.12, 90);
}

/** Moedas caindo. */
export function sfxCoin() {
  [1318, 1568, 2093].forEach((f, i) => tone(f, i * 0.05, 0.14, "square", 0.12));
}

/** Fim de lição / conquista: fanfarra grande. */
export function sfxWin() {
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
  notes.forEach((f, i) => {
    tone(f, i * 0.1, 0.4, "triangle", 0.22);
    tone(f / 2, i * 0.1, 0.4, "sine", 0.12);
  });
  tone(1567.98, 0.55, 0.9, "triangle", 0.2);
  noiseBurst(0.7, 0.16);
}

/** Vida perdida. */
export function sfxHeartLost() {
  tone(440, 0, 0.5, "sine", 0.18, 120);
}

/** Cérebro carregando poder. */
export function sfxBrain() {
  tone(220, 0, 0.7, "sine", 0.14, 880);
  tone(330, 0.1, 0.6, "triangle", 0.1, 1320);
}

/** Clique de tecla ao digitar (bem suave). */
export const sfxKey = () => blip(760, 0.03, "sine", 0.05);

/** Palmas da plateia comemorando o acerto. */
export function sfxApplause(intensity = 1) {
  const claps = Math.round(14 * Math.min(2, Math.max(0.5, intensity)));
  for (let i = 0; i < claps; i += 1) {
    const at = Math.random() * 0.75;
    window.setTimeout(() => noiseBurst(0.09, 0.07 + Math.random() * 0.05), at * 1000);
  }
  noiseBurst(0.5, 0.05);
}

/** Foguetinho subindo e estourando. */
export function sfxRocket() {
  tone(180, 0, 0.6, "sawtooth", 0.1, 1400);
  noiseBurst(0.55, 0.06);
  window.setTimeout(() => {
    noiseBurst(0.5, 0.16);
    [1046.5, 1318.5, 1568].forEach((f, i) => tone(f, i * 0.04, 0.25, "triangle", 0.14));
  }, 560);
}


/* ---------------- Música de fundo (loop suave, volume baixo) ---------------- */

const MELODY = [
  392.0, 523.25, 587.33, 523.25, 440.0, 523.25, 659.25, 523.25,
  349.23, 440.0, 523.25, 440.0, 392.0, 493.88, 587.33, 493.88,
];

export function isMusicOn() {
  load();
  return musicOn;
}

function musicStep(ac: AudioContext, gain: GainNode, step: number) {
  const freq = MELODY[step % MELODY.length]!;
  const t0 = ac.currentTime;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, t0);
  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(1, t0 + 0.08);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);
  osc.connect(amp).connect(gain);
  osc.start(t0);
  osc.stop(t0 + 0.6);

  // baixo suave a cada 4 tempos
  if (step % 4 === 0) {
    const bass = ac.createOscillator();
    const bamp = ac.createGain();
    bass.type = "triangle";
    bass.frequency.setValueAtTime(freq / 4, t0);
    bamp.gain.setValueAtTime(0.0001, t0);
    bamp.gain.exponentialRampToValueAtTime(0.8, t0 + 0.1);
    bamp.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.1);
    bass.connect(bamp).connect(gain);
    bass.start(t0);
    bass.stop(t0 + 1.2);
  }
}

export function startMusic() {
  load();
  if (musicNodes || !musicOn) return;
  const ac = audio();
  if (!ac) return;
  const gain = ac.createGain();
  gain.gain.value = MUSIC_BASE_GAIN * musicVolume; // fundo suave
  gain.connect(ac.destination);
  let step = 0;
  musicStep(ac, gain, step);
  const timer = window.setInterval(() => {
    step += 1;
    musicStep(ac, gain, step);
  }, 480);
  musicNodes = { gain, timer };
}

export function stopMusic() {
  if (!musicNodes) return;
  window.clearInterval(musicNodes.timer);
  musicNodes.gain.disconnect();
  musicNodes = null;
}

export function toggleMusic() {
  load();
  musicOn = !musicOn;
  window.localStorage.setItem(MUSIC_KEY, musicOn ? "on" : "off");
  if (musicOn) startMusic();
  else stopMusic();
  return musicOn;
}

/**
 * Destrava o áudio no primeiro toque/clique (política de autoplay do iOS/Android).
 * Cria o AudioContext, resume e toca um buffer silencioso.
 */
export function installAudioUnlock() {
  if (typeof window === "undefined") return () => {};
  let done = false;

  const unlock = () => {
    if (done) return;
    load();
    if (muted) return; // continua ouvindo até o usuário ligar o som
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as Win).webkitAudioContext;
      if (!Ctor) return;
      ctx = new Ctor();
    }
    void ctx.resume();
    const buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(ctx.destination);
    src.start(0);
    done = true;
    remove();
    if (musicOn) startMusic();
  };

  const events: (keyof WindowEventMap)[] = ["pointerdown", "touchstart", "keydown", "click"];
  const remove = () => events.forEach((e) => window.removeEventListener(e, unlock));
  events.forEach((e) => window.addEventListener(e, unlock, { passive: true }));
  return remove;
}
