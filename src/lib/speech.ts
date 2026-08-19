/** Fala em inglês com velocidade reduzida, para iniciantes ouvirem palavra por palavra. */
export function speakEn(text: string, rate = 0.6) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = Math.max(0.3, Math.min(1, rate));
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  } catch {
    /* navegador sem suporte a voz */
  }
}

/** Repete a frase palavra por palavra, bem devagar, e depois a frase inteira. */
export function speakEnWordByWord(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const words = text.split(" ").filter(Boolean);
    words.forEach((word) => {
      const utter = new SpeechSynthesisUtterance(word);
      utter.lang = "en-US";
      utter.rate = 0.5;
      window.speechSynthesis.speak(utter);
    });
    const full = new SpeechSynthesisUtterance(text);
    full.lang = "en-US";
    full.rate = 0.65;
    window.speechSynthesis.speak(full);
  } catch {
    /* navegador sem suporte a voz */
  }
}
