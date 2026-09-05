import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const LOCALES = ["pt", "es", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  pt: "Português",
  es: "Español",
  en: "English",
};

type Dict = Record<string, string>;

const pt: Dict = {
  appName: "Chequetto Inglês Fácil",
  tabPath: "Trilha",
  tabChat: "Conversa",
  tabShop: "Loja",
  tabProfile: "Perfil",
  streak: "ofensiva",
  hearts: "vidas",
  coins: "moedas",
  pathTitle: "Trilha de Aventura",
  pathSubtitle: "Aprenda inglês de verdade, uma fase por vez.",
  heroBadge: "🏆 SUPERCURSO DE INGLÊS",
  heroTitle: "Fale inglês de verdade, sem medo.",
  heroSubtitle: "Lições de 5 minutinhos, com voz, som e muita comemoração. Comece do zero absoluto!",
  ctaStart: "🚀 Começar agora — é grátis!",
  ctaContinue: "🚀 Continuar minha ofensiva",
  moduleLabel: "Módulo",
  start: "Começar",
  review: "Revisar",
  locked: "Bloqueada",
  continue: "Continuar",
  check: "Verificar",
  correct: "Excelente!",
  wrong: "Ops, não foi dessa vez",
  answerWas: "Resposta certa:",
  chooseTranslation: "Escolha a tradução correta",
  buildSentence: "Monte a frase em inglês",
  typeSentence: "Escreva a frase em inglês",
  typePlaceholder: "Digite aqui...",
  haptics: "Vibração",
  test: "Testar",
  testOk: "Som aplicado!",
  warmUp: "Aquecimento — só ouvir",
  warmUpHelp: "Toque nas palavras e ouça quantas vezes quiser. Sem pressa!",
  listenSlow: "Ouvir devagar",
  repeatWords: "Palavra por palavra",
  gotIt: "Já ouvi, continuar",
  listenWord: "Treino de ouvido",
  listenWordTitle: "Qual palavra você ouviu?",
  playAgain: "Ouvir de novo",
  tryAgain: "Tentar de novo",
  hint: "Ver dica",
  memorizeTitle: "Ouça e memorize",
  memorizeHelp: "Escute a frase 3 vezes. Depois você vai escrevê-la de memória.",
  startTyping: "Já memorizei! Quero escrever",
  tabProgress: "Progresso",
  progressTitle: "Meu progresso",
  progressSubtitle: "Cada frase aqui você já domina de verdade.",
  progressEmpty: "Complete sua primeira lição e suas conquistas aparecem aqui!",
  masteredPhrases: "frases dominadas",
  music: "Música",
  audio: "Áudio",
  musicVolume: "Volume da música",
  sfxVolume: "Volume dos efeitos",
  effects: "Efeitos",
  praise1: "Mandou bem!",
  praise2: "Perfeito!",
  praise3: "Isso aí!",
  praise4: "Você é fera!",
  praise5: "Show de bola!",
  lessonDone: "Lição concluída!",
  xpEarned: "XP conquistado",
  streakBonus: "Bônus de ofensiva",
  totalCoins: "Moedas",
  share: "Compartilhar Conquista",
  backToPath: "Voltar à trilha",
  outOfHearts: "Suas vidas acabaram!",
  outOfHeartsDesc: "Recupere vidas para continuar praticando agora mesmo.",
  watchAd: "Assistir vídeo de 30 segundos para recuperar 1 vida",
  watching: "Reproduzindo anúncio...",
  buyHeart: "Comprar 1 vida",
  buyHearts: "Encher todas as vidas",
  goPro: "Assinar o Pro",
  chatTitle: "Simulador de Conversa",
  chatSubtitle: "Pratique inglês real com a IA, sem medo de errar.",
  chooseScenario: "Escolha um cenário",
  typeMessage: "Escreva em inglês...",
  send: "Enviar",
  pronunciation: "Feedback de pronúncia",
  speakHint: "Toque para simular áudio",
  endChat: "Encerrar conversa",
  shopTitle: "Loja",
  shopSubtitle: "Use suas moedas e continue evoluindo.",
  rewardedAd: "Anúncio recompensado",
  proTitle: "FluencyBR Pro",
  proPrice: "Taxinha mensal de R$ 19,90",
  proCta: "Quero ser Pro",
  proActive: "Plano Pro ativo",
  proBenefit1: "Vidas ilimitadas",
  proBenefit2: "Zero anúncios",
  proBenefit3: "IA de conversação ilimitada",
  proBenefit4: "Certificado de fluência",
  notEnoughCoins: "Moedas insuficientes",
  purchased: "Compra concluída!",
  heartsFull: "Suas vidas já estão cheias",
  language: "Idioma",
  detected: "detectado pela sua região",
  level: "Nível",
  lessonsDone: "lições concluídas",
  brainTitle: "Cérebro Gigante",
  brainSubtitle: "seu cérebro cresce a cada acerto",
  combo: "COMBO",
  perfect: "PERFEITO!",
  sound: "Som",
  soundOn: "Som ligado",
  soundOff: "Som desligado",
  chatEmpty: "Escolha um cenário e comece a falar inglês.",
  thinking: "Digitando...",
  playAudio: "Ouvir",
  chatError: "A IA não respondeu agora. Tente de novo.",
  buyLivesTitle: "Vidas e moedas",
  heartPack: "Pacote de vidas",
  coinPack: "Pacote de moedas",
  streakFreeze: "Escudo de ofensiva",
  streakFreezeDesc: "Protege sua sequência por 1 dia perdido.",
  authTitle: "Crie sua conta grátis",
  authSubtitle: "Guarde seu progresso e continue em qualquer aparelho.",
  authEmail: "Seu e-mail",
  authPassword: "Sua senha",
  authSignUp: "Criar minha conta",
  authSignIn: "Já tenho conta — entrar",
  authToggleSignIn: "Já tenho conta",
  authToggleSignUp: "Quero criar uma conta",
  authCheckEmail: "Enviamos um e-mail de confirmação. Confira sua caixa de entrada!",
  authWelcome: "Bem-vindo de volta!",
  authError: "Não deu certo. Confira o e-mail e a senha.",
  authLater: "Agora não, quero continuar estudando",
  authInviteTitle: "Que bom te ver de novo!",
  authInviteBody: "Crie sua conta grátis para não perder sua ofensiva, seu XP e suas lições.",
  authSignOut: "Sair da conta",
  authLoading: "Um instante...",
};

const es: Dict = {
  ...pt,
  tabPath: "Ruta",
  tabChat: "Conversación",
  tabShop: "Tienda",
  tabProfile: "Perfil",
  streak: "racha",
  hearts: "vidas",
  coins: "monedas",
  pathTitle: "Ruta de Aventura",
  pathSubtitle: "Aprende inglés de verdad, una fase a la vez.",
  heroBadge: "🏆 SUPERCURSO DE INGLÉS",
  heroTitle: "Habla inglés de verdad, sin miedo.",
  heroSubtitle: "Lecciones de 5 minutos, con voz, sonido y mucha celebración. ¡Empieza desde cero!",
  ctaStart: "🚀 Empezar ahora — ¡es gratis!",
  ctaContinue: "🚀 Continuar mi racha",
  moduleLabel: "Módulo",
  start: "Empezar",
  review: "Repasar",
  locked: "Bloqueada",
  continue: "Continuar",
  check: "Comprobar",
  correct: "¡Excelente!",
  wrong: "Uy, esta vez no",
  answerWas: "Respuesta correcta:",
  chooseTranslation: "Elige la traducción correcta",
  buildSentence: "Arma la frase en inglés",
  typeSentence: "Escribe la frase en inglés",
  typePlaceholder: "Escribe aquí...",
  haptics: "Vibración",
  test: "Probar",
  testOk: "¡Sonido aplicado!",
  warmUp: "Calentamiento — solo escuchar",
  warmUpHelp: "Toca las palabras y escucha cuantas veces quieras. ¡Sin prisa!",
  listenSlow: "Escuchar lento",
  repeatWords: "Palabra por palabra",
  gotIt: "Ya escuché, seguir",
  listenWord: "Entrenamiento de oído",
  listenWordTitle: "¿Qué palabra escuchaste?",
  playAgain: "Escuchar otra vez",
  tryAgain: "Intentar de nuevo",
  hint: "Ver pista",
  memorizeTitle: "Escucha y memoriza",
  memorizeHelp: "Escucha la frase 3 veces. Después la escribirás de memoria.",
  startTyping: "¡Ya la memoricé! Quiero escribir",
  tabProgress: "Progreso",
  progressTitle: "Mi progreso",
  progressSubtitle: "Cada frase aquí ya la dominas de verdad.",
  progressEmpty: "¡Completa tu primera lección y tus logros aparecerán aquí!",
  masteredPhrases: "frases dominadas",
  music: "Música",
  audio: "Audio",
  musicVolume: "Volumen de la música",
  sfxVolume: "Volumen de los efectos",
  effects: "Efectos",
  praise1: "¡Muy bien!",
  praise2: "¡Perfecto!",
  praise3: "¡Eso es!",
  praise4: "¡Eres crack!",
  praise5: "¡Genial!",
  lessonDone: "¡Lección completada!",
  xpEarned: "XP ganado",
  streakBonus: "Bono de racha",
  totalCoins: "Monedas",
  share: "Compartir logro",
  backToPath: "Volver a la ruta",
  outOfHearts: "¡Te quedaste sin vidas!",
  outOfHeartsDesc: "Recupera vidas para seguir practicando ahora.",
  watchAd: "Ver un video de 30 segundos para recuperar 1 vida",
  watching: "Reproduciendo anuncio...",
  buyHeart: "Comprar 1 vida",
  buyHearts: "Llenar todas las vidas",
  goPro: "Suscribirse a Pro",
  chatTitle: "Simulador de Conversación",
  chatSubtitle: "Practica inglés real con la IA, sin miedo a equivocarte.",
  chooseScenario: "Elige un escenario",
  typeMessage: "Escribe en inglés...",
  send: "Enviar",
  pronunciation: "Feedback de pronunciación",
  speakHint: "Toca para simular audio",
  endChat: "Terminar conversación",
  shopTitle: "Tienda",
  shopSubtitle: "Usa tus monedas y sigue avanzando.",
  rewardedAd: "Anuncio recompensado",
  proPrice: "Cuota mensual de US$ 3,90",
  proCta: "Quiero ser Pro",
  proActive: "Plan Pro activo",
  proBenefit1: "Vidas ilimitadas",
  proBenefit2: "Cero anuncios",
  proBenefit3: "IA de conversación ilimitada",
  proBenefit4: "Certificado de fluidez",
  notEnoughCoins: "Monedas insuficientes",
  purchased: "¡Compra realizada!",
  heartsFull: "Tus vidas ya están llenas",
  language: "Idioma",
  detected: "detectado por tu región",
  level: "Nivel",
  lessonsDone: "lecciones completadas",
  brainTitle: "Cerebro Gigante",
  brainSubtitle: "tu cerebro crece con cada acierto",
  combo: "COMBO",
  perfect: "¡PERFECTO!",
  sound: "Sonido",
  soundOn: "Sonido activado",
  soundOff: "Sonido desactivado",
  chatEmpty: "Elige un escenario y empieza a hablar inglés.",
  thinking: "Escribiendo...",
  playAudio: "Escuchar",
  chatError: "La IA no respondió ahora. Inténtalo de nuevo.",
  buyLivesTitle: "Vidas y monedas",
  heartPack: "Paquete de vidas",
  coinPack: "Paquete de monedas",
  streakFreeze: "Escudo de racha",
  streakFreezeDesc: "Protege tu racha por 1 día perdido.",
  authTitle: "Crea tu cuenta gratis",
  authSubtitle: "Guarda tu progreso y sigue en cualquier dispositivo.",
  authEmail: "Tu correo",
  authPassword: "Tu contraseña",
  authSignUp: "Crear mi cuenta",
  authSignIn: "Ya tengo cuenta — entrar",
  authToggleSignIn: "Ya tengo cuenta",
  authToggleSignUp: "Quiero crear una cuenta",
  authCheckEmail: "Te enviamos un correo de confirmación. ¡Revisa tu bandeja!",
  authWelcome: "¡Bienvenido de vuelta!",
  authError: "No funcionó. Revisa el correo y la contraseña.",
  authLater: "Ahora no, quiero seguir estudiando",
  authInviteTitle: "¡Qué bueno verte otra vez!",
  authInviteBody: "Crea tu cuenta gratis para no perder tu racha, tu XP y tus lecciones.",
  authSignOut: "Cerrar sesión",
  authLoading: "Un momento...",
};

const en: Dict = {
  ...pt,
  tabPath: "Path",
  tabChat: "Chat",
  tabShop: "Shop",
  tabProfile: "Profile",
  streak: "streak",
  hearts: "hearts",
  coins: "coins",
  pathTitle: "Adventure Path",
  pathSubtitle: "Learn real English, one stage at a time.",
  heroBadge: "🏆 ENGLISH SUPERCOURSE",
  heroTitle: "Speak real English, fearlessly.",
  heroSubtitle: "5-minute lessons with voice, sound and big celebrations. Start from absolute zero!",
  ctaStart: "🚀 Start now — it's free!",
  ctaContinue: "🚀 Continue my streak",
  moduleLabel: "Module",
  start: "Start",
  review: "Review",
  locked: "Locked",
  continue: "Continue",
  check: "Check",
  correct: "Excellent!",
  wrong: "Oops, not this time",
  answerWas: "Correct answer:",
  chooseTranslation: "Choose the correct translation",
  buildSentence: "Build the sentence in English",
  typeSentence: "Type the sentence in English",
  typePlaceholder: "Type here...",
  haptics: "Vibration",
  test: "Test",
  testOk: "Sound applied!",
  warmUp: "Warm-up — just listen",
  warmUpHelp: "Tap the words and listen as many times as you want. No rush!",
  listenSlow: "Listen slowly",
  repeatWords: "Word by word",
  gotIt: "Got it, continue",
  listenWord: "Ear training",
  listenWordTitle: "Which word did you hear?",
  playAgain: "Play again",
  tryAgain: "Try again",
  hint: "Show hint",
  memorizeTitle: "Listen and memorize",
  memorizeHelp: "Listen to the sentence 3 times. Then you'll type it from memory.",
  startTyping: "I memorized it! Let me type",
  tabProgress: "Progress",
  progressTitle: "My progress",
  progressSubtitle: "You truly master every sentence listed here.",
  progressEmpty: "Finish your first lesson and your achievements will show up here!",
  masteredPhrases: "mastered sentences",
  music: "Music",
  audio: "Audio",
  musicVolume: "Music volume",
  sfxVolume: "Effects volume",
  effects: "Effects",
  praise1: "Nice one!",
  praise2: "Perfect!",
  praise3: "That's it!",
  praise4: "You rock!",
  praise5: "Awesome!",
  lessonDone: "Lesson complete!",
  xpEarned: "XP earned",
  streakBonus: "Streak bonus",
  totalCoins: "Coins",
  share: "Share achievement",
  backToPath: "Back to path",
  outOfHearts: "You ran out of hearts!",
  outOfHeartsDesc: "Refill your hearts to keep practicing right now.",
  watchAd: "Watch a 30-second video to get 1 heart back",
  watching: "Playing ad...",
  buyHeart: "Buy 1 heart",
  buyHearts: "Refill all hearts",
  goPro: "Get Pro",
  chatTitle: "Conversation Simulator",
  chatSubtitle: "Practice real English with AI, no fear of mistakes.",
  chooseScenario: "Choose a scenario",
  typeMessage: "Type in English...",
  send: "Send",
  pronunciation: "Pronunciation feedback",
  speakHint: "Tap to simulate audio",
  endChat: "End conversation",
  shopTitle: "Shop",
  shopSubtitle: "Spend your coins and keep leveling up.",
  rewardedAd: "Rewarded ad",
  proPrice: "Monthly fee of US$ 3.90",
  proCta: "Go Pro",
  proActive: "Pro plan active",
  proBenefit1: "Unlimited hearts",
  proBenefit2: "Zero ads",
  proBenefit3: "Unlimited AI conversation",
  proBenefit4: "Fluency certificate",
  notEnoughCoins: "Not enough coins",
  purchased: "Purchase complete!",
  heartsFull: "Your hearts are already full",
  language: "Language",
  detected: "detected from your region",
  level: "Level",
  lessonsDone: "lessons completed",
  brainTitle: "Giant Brain",
  brainSubtitle: "your brain grows with every hit",
  combo: "COMBO",
  perfect: "PERFECT!",
  sound: "Sound",
  soundOn: "Sound on",
  soundOff: "Sound off",
  chatEmpty: "Pick a scenario and start speaking English.",
  thinking: "Typing...",
  playAudio: "Listen",
  chatError: "The AI didn't answer. Try again.",
  buyLivesTitle: "Hearts and coins",
  heartPack: "Hearts pack",
  coinPack: "Coins pack",
  streakFreeze: "Streak shield",
  streakFreezeDesc: "Protects your streak for 1 missed day.",
  authTitle: "Create your free account",
  authSubtitle: "Save your progress and continue on any device.",
  authEmail: "Your email",
  authPassword: "Your password",
  authSignUp: "Create my account",
  authSignIn: "I already have an account — sign in",
  authToggleSignIn: "I already have an account",
  authToggleSignUp: "I want to create an account",
  authCheckEmail: "We sent you a confirmation email. Check your inbox!",
  authWelcome: "Welcome back!",
  authError: "That didn't work. Check your email and password.",
  authLater: "Not now, I want to keep studying",
  authInviteTitle: "Great to see you again!",
  authInviteBody: "Create your free account so you never lose your streak, XP and lessons.",
  authSignOut: "Sign out",
  authLoading: "One moment...",
};

const DICTS: Record<Locale, Dict> = { pt, es, en };

const SPANISH_REGIONS = new Set([
  "ES", "MX", "AR", "CO", "CL", "PE", "UY", "PY", "BO", "EC", "VE", "CR", "PA",
  "GT", "HN", "NI", "SV", "DO", "CU", "PR",
]);

/** Fuso horário -> idioma (aproxima a região geográfica de quem acessa). */
function localeFromTimeZone(): Locale | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    if (!tz) return null;
    const [area = "", city = ""] = tz.split("/");
    if (area === "America") {
      const PT_CITIES = new Set([
        "Sao_Paulo", "Bahia", "Fortaleza", "Recife", "Belem", "Manaus", "Cuiaba",
        "Campo_Grande", "Porto_Velho", "Rio_Branco", "Boa_Vista", "Maceio",
        "Araguaina", "Santarem", "Noronha", "Eirunepe",
      ]);
      if (PT_CITIES.has(city)) return "pt";
      const ES_CITIES = new Set([
        "Mexico_City", "Bogota", "Lima", "Santiago", "Argentina", "Buenos_Aires",
        "Montevideo", "Asuncion", "La_Paz", "Caracas", "Guayaquil", "Havana",
        "Santo_Domingo", "Panama", "Guatemala", "Tegucigalpa", "Managua",
        "El_Salvador", "Costa_Rica", "Puerto_Rico", "Cancun", "Monterrey",
        "Tijuana", "Hermosillo", "Merida", "Chihuahua", "Mazatlan",
      ]);
      if (ES_CITIES.has(city) || tz.startsWith("America/Argentina")) return "es";
    }
    if (tz === "Europe/Lisbon" || tz === "Atlantic/Azores" || tz === "Atlantic/Madeira") return "pt";
    if (tz === "Africa/Luanda" || tz === "Africa/Maputo" || tz === "Africa/Bissau") return "pt";
    if (tz === "Europe/Madrid" || tz === "Atlantic/Canary" || tz === "Africa/Ceuta") return "es";
  } catch {
    /* fuso indisponível: seguimos pelo idioma do navegador */
  }
  return null;
}

export function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "pt";
  const langs = [navigator.language, ...(navigator.languages ?? [])];
  for (const raw of langs) {
    if (!raw) continue;
    const lower = raw.toLowerCase();
    const region = raw.split("-")[1]?.toUpperCase();
    if (lower.startsWith("pt")) return "pt";
    if (lower.startsWith("es")) return "es";
    if (region && SPANISH_REGIONS.has(region)) return "es";
  }
  return localeFromTimeZone() ?? "en";
}

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  autoDetected: boolean;
  t: (key: keyof typeof pt | string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "fluencybr.locale";

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");
  const [autoDetected, setAutoDetected] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && LOCALES.includes(saved)) {
      setLocaleState(saved);
      return;
    }
    const detected = detectLocale();
    setLocaleState(detected);
    setAutoDetected(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    setAutoDetected(false);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const t = (key: string) => DICTS[locale][key] ?? DICTS.pt[key] ?? key;

  return (
    <LocaleContext.Provider value={{ locale, setLocale, autoDetected, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useI18n precisa estar dentro de LocaleProvider");
  return ctx;
}
