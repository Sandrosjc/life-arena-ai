import type { Locale } from "./i18n";

export type Phrase = {
  en: string;
  pt: string;
  es: string;
};

export type Lesson = {
  id: string;
  title: Record<Locale, string>;
  phrases: Phrase[];
};

export type Module = {
  id: string;
  title: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  tone: "primary" | "secondary" | "accent";
  lessons: Lesson[];
};

export const MODULES: Module[] = [
  {
    id: "m1",
    tone: "primary",
    title: {
      pt: "Fundamentos Básicos",
      es: "Fundamentos Básicos",
      en: "Basic Foundations",
    },
    subtitle: { pt: "Iniciante", es: "Principiante", en: "Beginner" },
    lessons: [
      {
        id: "m1l1",
        title: { pt: "Primeiros olás", es: "Primeros saludos", en: "First hellos" },
        phrases: [
          { en: "Good morning", pt: "Bom dia", es: "Buenos días" },
          { en: "My name is Ana", pt: "Meu nome é Ana", es: "Mi nombre es Ana" },
          { en: "Nice to meet you", pt: "Prazer em conhecer você", es: "Mucho gusto" },
          { en: "How are you today", pt: "Como você está hoje", es: "¿Cómo estás hoy?" },
        ],
      },
      {
        id: "m1l2",
        title: { pt: "Sobre você", es: "Sobre ti", en: "About you" },
        phrases: [
          { en: "I am from Brazil", pt: "Eu sou do Brasil", es: "Soy de Brasil" },
          { en: "I live in a big city", pt: "Eu moro em uma cidade grande", es: "Vivo en una ciudad grande" },
          { en: "I have two brothers", pt: "Eu tenho dois irmãos", es: "Tengo dos hermanos" },
          { en: "I am learning English", pt: "Eu estou aprendendo inglês", es: "Estoy aprendiendo inglés" },
        ],
      },
      {
        id: "m1l3",
        title: { pt: "Dia a dia", es: "Día a día", en: "Daily life" },
        phrases: [
          { en: "I wake up early", pt: "Eu acordo cedo", es: "Me despierto temprano" },
          { en: "She drinks coffee every morning", pt: "Ela toma café toda manhã", es: "Ella toma café cada mañana" },
          { en: "We work from home", pt: "Nós trabalhamos de casa", es: "Trabajamos desde casa" },
          { en: "They study at night", pt: "Eles estudam à noite", es: "Ellos estudian por la noche" },
        ],
      },
      {
        id: "m1l4",
        title: { pt: "Números e horas", es: "Números y horas", en: "Numbers and time" },
        phrases: [
          { en: "It is three o'clock", pt: "São três horas", es: "Son las tres" },
          { en: "The meeting is at ten", pt: "A reunião é às dez", es: "La reunión es a las diez" },
          { en: "I need five minutes", pt: "Eu preciso de cinco minutos", es: "Necesito cinco minutos" },
          { en: "Today is Monday", pt: "Hoje é segunda-feira", es: "Hoy es lunes" },
        ],
      },
      {
        id: "m1l5",
        title: { pt: "Perguntas úteis", es: "Preguntas útiles", en: "Useful questions" },
        phrases: [
          { en: "Where is the bathroom", pt: "Onde fica o banheiro", es: "¿Dónde está el baño?" },
          { en: "How much does it cost", pt: "Quanto custa", es: "¿Cuánto cuesta?" },
          { en: "Can you help me please", pt: "Você pode me ajudar por favor", es: "¿Puedes ayudarme por favor?" },
          { en: "I do not understand", pt: "Eu não entendo", es: "No entiendo" },
        ],
      },
    ],
  },
  {
    id: "m2",
    tone: "secondary",
    title: {
      pt: "Viagem e Aeroporto",
      es: "Viaje y Aeropuerto",
      en: "Travel and Airport",
    },
    subtitle: { pt: "Prático", es: "Práctico", en: "Practical" },
    lessons: [
      {
        id: "m2l1",
        title: { pt: "No check-in", es: "En el check-in", en: "At check-in" },
        phrases: [
          { en: "Here is my passport", pt: "Aqui está meu passaporte", es: "Aquí está mi pasaporte" },
          { en: "I have one suitcase", pt: "Eu tenho uma mala", es: "Tengo una maleta" },
          { en: "Is the flight on time", pt: "O voo está no horário", es: "¿El vuelo está a tiempo?" },
          { en: "I would like a window seat", pt: "Eu gostaria de um assento na janela", es: "Quisiera un asiento junto a la ventana" },
        ],
      },
      {
        id: "m2l2",
        title: { pt: "Na alfândega", es: "En la aduana", en: "At customs" },
        phrases: [
          { en: "I am here on vacation", pt: "Estou aqui de férias", es: "Estoy aquí de vacaciones" },
          { en: "I will stay for ten days", pt: "Vou ficar por dez dias", es: "Me quedaré diez días" },
          { en: "Nothing to declare", pt: "Nada a declarar", es: "Nada que declarar" },
          { en: "I am staying at a hotel downtown", pt: "Estou hospedado em um hotel no centro", es: "Me hospedo en un hotel en el centro" },
        ],
      },
      {
        id: "m2l3",
        title: { pt: "No hotel", es: "En el hotel", en: "At the hotel" },
        phrases: [
          { en: "I have a reservation", pt: "Eu tenho uma reserva", es: "Tengo una reserva" },
          { en: "What time is breakfast", pt: "Que horas é o café da manhã", es: "¿A qué hora es el desayuno?" },
          { en: "The air conditioning is not working", pt: "O ar-condicionado não está funcionando", es: "El aire acondicionado no funciona" },
          { en: "Can I have a late checkout", pt: "Posso fazer o checkout mais tarde", es: "¿Puedo hacer el checkout más tarde?" },
        ],
      },
      {
        id: "m2l4",
        title: { pt: "Comendo fora", es: "Comiendo fuera", en: "Eating out" },
        phrases: [
          { en: "A table for two please", pt: "Uma mesa para dois por favor", es: "Una mesa para dos por favor" },
          { en: "I would like a large coffee", pt: "Eu gostaria de um café grande", es: "Quisiera un café grande" },
          { en: "Can I see the menu", pt: "Posso ver o cardápio", es: "¿Puedo ver el menú?" },
          { en: "The bill please", pt: "A conta por favor", es: "La cuenta por favor" },
        ],
      },
      {
        id: "m2l5",
        title: { pt: "Se locomovendo", es: "Moverse", en: "Getting around" },
        phrases: [
          { en: "How do I get downtown", pt: "Como eu chego ao centro", es: "¿Cómo llego al centro?" },
          { en: "Is there a subway station near here", pt: "Tem uma estação de metrô perto daqui", es: "¿Hay una estación de metro cerca?" },
          { en: "Please take me to the airport", pt: "Por favor me leve ao aeroporto", es: "Por favor lléveme al aeropuerto" },
          { en: "I think I am lost", pt: "Acho que estou perdido", es: "Creo que estoy perdido" },
        ],
      },
    ],
  },
  {
    id: "m3",
    tone: "accent",
    title: {
      pt: "Inglês Corporativo",
      es: "Inglés Corporativo",
      en: "Business English",
    },
    subtitle: { pt: "Avançado", es: "Avanzado", en: "Advanced" },
    lessons: [
      {
        id: "m3l1",
        title: { pt: "Reuniões", es: "Reuniones", en: "Meetings" },
        phrases: [
          { en: "Let us start the meeting", pt: "Vamos começar a reunião", es: "Empecemos la reunión" },
          { en: "Could you share your screen", pt: "Você poderia compartilhar sua tela", es: "¿Podrías compartir tu pantalla?" },
          { en: "I will follow up by email", pt: "Vou dar retorno por e-mail", es: "Haré seguimiento por correo" },
          { en: "Let us schedule a call next week", pt: "Vamos agendar uma call na próxima semana", es: "Agendemos una llamada la próxima semana" },
        ],
      },
      {
        id: "m3l2",
        title: { pt: "E-mails", es: "Correos", en: "Emails" },
        phrases: [
          { en: "Thank you for your quick reply", pt: "Obrigado pela resposta rápida", es: "Gracias por tu respuesta rápida" },
          { en: "Please find the report attached", pt: "Segue o relatório em anexo", es: "Adjunto encontrarás el informe" },
          { en: "I am writing to confirm our agreement", pt: "Escrevo para confirmar nosso acordo", es: "Escribo para confirmar nuestro acuerdo" },
          { en: "Let me know if you need anything else", pt: "Me avise se precisar de mais alguma coisa", es: "Avísame si necesitas algo más" },
        ],
      },
      {
        id: "m3l3",
        title: { pt: "Negociação", es: "Negociación", en: "Negotiation" },
        phrases: [
          { en: "That is beyond our budget", pt: "Isso está acima do nosso orçamento", es: "Eso supera nuestro presupuesto" },
          { en: "We can offer a small discount", pt: "Podemos oferecer um pequeno desconto", es: "Podemos ofrecer un pequeño descuento" },
          { en: "What is your best price", pt: "Qual é o seu melhor preço", es: "¿Cuál es su mejor precio?" },
          { en: "We have a deal", pt: "Temos um acordo", es: "Tenemos un trato" },
        ],
      },
      {
        id: "m3l4",
        title: { pt: "Apresentações", es: "Presentaciones", en: "Presentations" },
        phrases: [
          { en: "Today I will present our results", pt: "Hoje vou apresentar nossos resultados", es: "Hoy presentaré nuestros resultados" },
          { en: "Revenue grew by twenty percent", pt: "A receita cresceu vinte por cento", es: "Los ingresos crecieron veinte por ciento" },
          { en: "Let us look at the next slide", pt: "Vamos ver o próximo slide", es: "Veamos la siguiente diapositiva" },
          { en: "Any questions so far", pt: "Alguma pergunta até aqui", es: "¿Alguna pregunta hasta ahora?" },
        ],
      },
      {
        id: "m3l5",
        title: { pt: "Entrevista de emprego", es: "Entrevista de trabajo", en: "Job interview" },
        phrases: [
          { en: "I have five years of experience", pt: "Eu tenho cinco anos de experiência", es: "Tengo cinco años de experiencia" },
          { en: "I work well under pressure", pt: "Eu trabalho bem sob pressão", es: "Trabajo bien bajo presión" },
          { en: "I led a team of ten people", pt: "Eu liderei um time de dez pessoas", es: "Lideré un equipo de diez personas" },
          { en: "I am looking for a new challenge", pt: "Estou buscando um novo desafio", es: "Busco un nuevo desafío" },
        ],
      },
    ],
  },
];

export const ALL_LESSONS = MODULES.flatMap((m) =>
  m.lessons.map((lesson) => ({ lesson, module: m })),
);

export function findLesson(lessonId: string) {
  return ALL_LESSONS.find((item) => item.lesson.id === lessonId);
}

export function lessonOrder(lessonId: string) {
  return ALL_LESSONS.findIndex((item) => item.lesson.id === lessonId);
}

export type Exercise =
  | {
      kind: "choice";
      phrase: Phrase;
      options: string[];
    }
  | {
      kind: "blocks";
      phrase: Phrase;
      tokens: string[];
    }
  | {
      kind: "type";
      phrase: Phrase;
    };

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

/** Normaliza a resposta: ignora maiúsculas, acentos, pontuação e espaços extras. */
export function normalizeAnswer(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Distância de edição simples, para perdoar 1 errinho de digitação. */
function editDistance(a: string, b: string) {
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let prev = dp[0]!;
    dp[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const tmp = dp[j]!;
      dp[j] = Math.min(dp[j]! + 1, dp[j - 1]! + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[b.length]!;
}

/** Aceita a resposta com tolerância a 1 errinho (amigável para iniciantes). */
export function isAnswerCorrect(answer: string, expected: string) {
  const a = normalizeAnswer(answer);
  const b = normalizeAnswer(expected);
  if (!a) return false;
  if (a === b) return true;
  return editDistance(a, b) <= Math.max(1, Math.floor(b.length / 18));
}

/** Gera os exercícios da lição: escolha, blocos e escrita (mais fácil primeiro). */
export function buildExercises(lesson: Lesson, module: Module): Exercise[] {
  const pool = module.lessons
    .flatMap((l) => l.phrases)
    .filter((p) => !lesson.phrases.some((own) => own.en === p.en));

  return lesson.phrases.map((phrase, index) => {
    const cycle = index % 3;
    if (cycle === 0) {
      const distractors = shuffle(pool).slice(0, 2).map((p) => p.en);
      return {
        kind: "choice" as const,
        phrase,
        options: shuffle([phrase.en, ...distractors]),
      };
    }
    if (cycle === 2) {
      return { kind: "type" as const, phrase };
    }
    const words = phrase.en.split(" ");
    const extra = shuffle(pool)
      .slice(0, 1)
      .map((p) => p.en.split(" ")[0]!)
      .filter((w) => !words.includes(w));
    return {
      kind: "blocks" as const,
      phrase,
      tokens: shuffle([...words, ...extra]),
    };
  });
}
