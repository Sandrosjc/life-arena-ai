import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { Bot, Lightbulb, Mic, Send, Volume2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { chatWithTutor } from "@/lib/conversa.functions";
import { useGame } from "@/lib/game";
import { useI18n, type Locale } from "@/lib/i18n";
import { sfxCoin, sfxTap } from "@/lib/sfx";

export const Route = createFileRoute("/conversa")({
  head: () => ({
    meta: [
      { title: "Simulador de conversa com IA — FluencyBR AI" },
      {
        name: "description",
        content:
          "Converse em inglês com uma IA em cenários reais como pedir um café em Nova York ou passar pela alfândega.",
      },
      { property: "og:title", content: "Simulador de conversa com IA — FluencyBR AI" },
      {
        property: "og:description",
        content: "Pratique inglês falado com feedback instantâneo de pronúncia e gramática.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

type Scenario = {
  id: string;
  emoji: string;
  title: Record<Locale, string>;
  prompt: string;
  opener: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "coffee",
    emoji: "☕",
    title: {
      pt: "Pedindo um café em Nova York",
      es: "Pidiendo un café en Nueva York",
      en: "Ordering coffee in New York",
    },
    prompt: "Ordering coffee at a busy New York coffee shop. You are the barista.",
    opener: "Hi there! Welcome to Brooklyn Beans. What can I get started for you today?",
  },
  {
    id: "customs",
    emoji: "🛂",
    title: {
      pt: "Passando pela alfândega",
      es: "Pasando por la aduana",
      en: "Going through customs",
    },
    prompt: "Passing through airport customs. You are the immigration officer.",
    opener: "Good afternoon. Passport, please. What's the purpose of your visit?",
  },
  {
    id: "interview",
    emoji: "💼",
    title: {
      pt: "Entrevista de emprego",
      es: "Entrevista de trabajo",
      en: "Job interview",
    },
    prompt: "A job interview for an international company. You are the recruiter.",
    opener: "Great to meet you! Could you tell me a little bit about yourself?",
  },
  {
    id: "hotel",
    emoji: "🏨",
    title: {
      pt: "Check-in no hotel",
      es: "Check-in en el hotel",
      en: "Hotel check-in",
    },
    prompt: "Checking in at a hotel front desk. You are the receptionist.",
    opener: "Good evening! Do you have a reservation with us tonight?",
  },
];

type Message = {
  role: "user" | "assistant";
  content: string;
  tip?: string | undefined;
  score?: number | undefined;
};

function ChatPage() {
  const { locale, t } = useI18n();
  const { progress } = useGame();
  const send = useServerFn(chatWithTutor);

  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const speak = (text: string) => {
    sfxTap();
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  };

  const pick = (s: Scenario) => {
    sfxTap();
    setScenario(s);
    setMessages([{ role: "assistant", content: s.opener }]);
    speak(s.opener);
  };

  const submit = async () => {
    const text = input.trim();
    if (!text || !scenario || loading) return;
    sfxTap();
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const result = await send({
        data: {
          scenario: scenario.prompt,
          level: progress.isPro ? "advanced" : "basic",
          nativeLanguage: locale,
          messages: next.slice(-12).map((m) => ({ role: m.role, content: m.content })),
        },
      });
      if (!result.reply) {
        toast.error(t("chatError"));
        return;
      }
      sfxCoin();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: result.reply, tip: result.tip, score: result.score },
      ]);
      speak(result.reply);
    } catch {
      toast.error(t("chatError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <h1 className="font-display text-2xl">{t("chatTitle")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("chatSubtitle")}</p>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => pick(s)}
            className={`card-3d shrink-0 rounded-2xl px-3 py-2 text-left text-xs font-extrabold ${
              scenario?.id === s.id
                ? "border-accent-deep bg-accent text-accent-foreground"
                : "border-border bg-card text-card-foreground"
            }`}
          >
            <span className="mr-1 text-base">{s.emoji}</span>
            {s.title[locale]}
          </button>
        ))}
      </div>

      {!scenario ? (
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <Bot className="size-16 animate-float text-secondary" strokeWidth={1.8} />
          <p className="text-sm font-bold text-muted-foreground">{t("chooseScenario")}</p>
          <p className="text-xs text-muted-foreground">{t("chatEmpty")}</p>
        </div>
      ) : (
        <div className="mt-4 space-y-3 pb-24">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex animate-rise ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm font-semibold ${
                  m.role === "user"
                    ? "rounded-br-md bg-secondary text-secondary-foreground"
                    : "rounded-bl-md bg-muted text-foreground"
                }`}
              >
                <p>{m.content}</p>

                {m.role === "assistant" ? (
                  <button
                    type="button"
                    onClick={() => speak(m.content)}
                    className="mt-2 flex items-center gap-1 text-xs font-extrabold text-secondary"
                  >
                    <Volume2 className="size-4 shrink-0" strokeWidth={2.5} />
                    {t("playAudio")}
                  </button>
                ) : null}

                {m.tip ? (
                  <div className="mt-2 flex items-start gap-2 rounded-2xl bg-gold/15 px-3 py-2 text-xs font-bold text-foreground">
                    <Lightbulb className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={2.5} />
                    <span>
                      {t("pronunciation")}
                      {typeof m.score === "number" ? ` · ${m.score}%` : ""}: {m.tip}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          ))}

          {loading ? (
            <div className="flex justify-start">
              <div className="rounded-3xl rounded-bl-md bg-muted px-4 py-3 text-sm font-bold text-muted-foreground">
                {t("thinking")}
              </div>
            </div>
          ) : null}
          <div ref={bottom} />
        </div>
      )}

      {scenario ? (
        <div className="fixed inset-x-0 bottom-20 z-30 px-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
            className="mx-auto flex max-w-2xl items-center gap-2 rounded-3xl border-2 border-b-4 border-border bg-card p-2 shadow-lg"
          >
            <Mic className="ml-2 size-5 shrink-0 text-muted-foreground" strokeWidth={2.5} />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("typeMessage")}
              aria-label={t("typeMessage")}
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label={t("send")}
              className="btn-3d grid size-10 shrink-0 place-items-center rounded-2xl border-primary-deep bg-primary text-primary-foreground"
            >
              <Send className="size-5" strokeWidth={2.5} />
            </button>
          </form>
        </div>
      ) : null}
    </AppShell>
  );
}
