/**
 * Pronúncia em inglês com voz real gerada por IA (rota /api/tts),
 * com cache em memória, fila (um áudio por vez) e fallback para a voz do navegador.
 */

import { getSfxVolume, isMuted } from "@/lib/sfx";

const cache = new Map<string, string>();
const pending = new Map<string, Promise<string | null>>();
/** Tempo máximo de espera pela voz de IA antes de usar a voz do navegador. */
const TTS_TIMEOUT_MS = 6000;
let current: HTMLAudioElement | null = null;
let token = 0;

function browserFallback(text: string, rate: number) {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = Math.max(0.3, Math.min(1, rate));
    window.speechSynthesis.speak(utter);
    return true;
  } catch {
    return false;
  }
}

async function fetchAudio(text: string, speed: number): Promise<string | null> {
  const key = `${text}|${speed}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const inFlight = pending.get(key);
  if (inFlight) return inFlight;

  const request = (async () => {
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, speed }),
      });
      if (!res.ok) return null;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      cache.set(key, url);
      return url;
    } catch {
      return null;
    } finally {
      pending.delete(key);
    }
  })();

  pending.set(key, request);
  return request;
}

/**
 * Busca o áudio de IA com limite de tempo. Se o endpoint falhar ou demorar,
 * resolve `null` (para cair na voz do navegador) sem travar a tela;
 * a requisição continua em segundo plano e já fica em cache para a próxima vez.
 */
async function fetchAudioWithTimeout(text: string, speed: number): Promise<string | null> {
  const request = fetchAudio(text, speed);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), TTS_TIMEOUT_MS);
  });
  const result = await Promise.race([request, timeout]);
  clearTimeout(timer);
  return result;
}

function stopCurrent() {
  if (current) {
    current.pause();
    current.currentTime = 0;
    current = null;
  }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

function play(url: string, mine: number) {
  return new Promise<void>((resolve) => {
    if (mine !== token) return resolve();
    const audio = new Audio(url);
    audio.volume = isMuted() ? 0 : Math.max(0.1, getSfxVolume());
    current = audio;
    const done = () => resolve();
    audio.onended = done;
    audio.onerror = done;
    void audio.play().catch(done);
  });
}

/** Fala em inglês (voz real). rate menor = mais devagar. */
export async function speakEn(text: string, rate = 0.65) {
  if (typeof window === "undefined") return;
  token += 1;
  const mine = token;
  stopCurrent();
  const speed = Math.max(0.25, Math.min(1.5, rate));
  const url = await fetchAudioWithTimeout(text.trim(), speed);
  if (mine !== token) return;
  if (!url) {
    browserFallback(text, rate);
    return;
  }
  await play(url, mine);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Repete a frase palavra por palavra, bem devagar, e depois a frase inteira. */
export async function speakEnWordByWord(text: string) {
  if (typeof window === "undefined") return;
  token += 1;
  const mine = token;
  stopCurrent();

  const words = text.split(" ").filter(Boolean);
  for (const word of words) {
    if (mine !== token) return;
    const url = await fetchAudioWithTimeout(word, 0.5);
    if (mine !== token) return;
    if (url) await play(url, mine);
    else browserFallback(word, 0.5);
    if (mine !== token) return;
    await sleep(350);
  }

  if (mine !== token) return;
  const full = await fetchAudioWithTimeout(text.trim(), 0.65);
  if (mine !== token) return;
  if (full) await play(full, mine);
  else browserFallback(text, 0.65);
}

/** Pré-carrega o áudio de uma frase (usado ao abrir o exercício). */
export function preloadEn(text: string, rate = 0.65) {
  if (typeof window === "undefined") return;
  void fetchAudio(text.trim(), Math.max(0.25, Math.min(1.5, rate)));
}
