/**
 * Motor de som do app (Web Audio API, sem arquivos externos).
 * Sons curtos, "gostosos" e escaláveis por combo — feito para viciar.
 */

const STORAGE_KEY = "fluencybr.sound";

let ctx: AudioContext | null = null;
let muted = false;
let loaded = false;

type Win = Window & { webkitAudioContext?: typeof AudioContext };

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  muted = window.localStorage.getItem(STORAGE_KEY) === "off";
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
  const t0 = ac.currentTime + start;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(freq, t0);
  if (bend) osc.frequency.exponentialRampToValueAtTime(Math.max(40, bend), t0 + duration);
  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
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
  amp.gain.value = gain;
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
  };

  const events: (keyof WindowEventMap)[] = ["pointerdown", "touchstart", "keydown", "click"];
  const remove = () => events.forEach((e) => window.removeEventListener(e, unlock));
  events.forEach((e) => window.addEventListener(e, unlock, { passive: true }));
  return remove;
}
