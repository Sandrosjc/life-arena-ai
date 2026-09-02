import { isMuted } from "./sfx";

const KEY = "fluencybr.haptics";

/** Vibração está ligada? (padrão: sim, se o aparelho suportar) */
export function isHapticsOn() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) !== "off";
}

export function toggleHaptics() {
  const next = !isHapticsOn();
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, next ? "on" : "off");
  }
  return next;
}

export function hapticsSupported() {
  return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
}

/** Vibra respeitando a preferência de haptics e o mudo dos efeitos. */
function vibrate(pattern: number | number[]) {
  if (!hapticsSupported() || !isHapticsOn() || isMuted()) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* aparelho sem vibração */
  }
}

/** Toque curto de acerto. */
export const hapticCorrect = () => vibrate(30);
/** Toque duplo de erro. */
export const hapticWrong = () => vibrate([25, 60, 25]);
/** Comemoração de fim de lição. */
export const hapticWin = () => vibrate([40, 60, 40, 60, 120]);
