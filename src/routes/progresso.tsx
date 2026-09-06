import { createFileRoute, Link } from "@tanstack/react-router";
import { LogOut, Star, Volume2 } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { AdSlot } from "@/components/AdSlot";
import gatinho from "@/assets/gatinho.png";
import { useAuth } from "@/lib/auth";
import { useGame } from "@/lib/game";
import { useI18n } from "@/lib/i18n";
import { MODULES } from "@/lib/lessons";
import { sfxTap } from "@/lib/sfx";
import { speakEn } from "@/lib/speech";

export const Route = createFileRoute("/progresso")({
  head: () => ({
    meta: [
      { title: "Meu progresso — Chequetto Inglês Fácil" },
      {
        name: "description",
        content:
          "Veja suas lições concluídas, suas estrelas e todas as frases em inglês que você já domina no Chequetto.",
      },
      { property: "og:title", content: "Meu progresso — Chequetto Inglês Fácil" },
      {
        property: "og:description",
        content: "Lições concluídas, estrelas conquistadas e frases dominadas em inglês.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const { locale, t } = useI18n();
  const { progress, level } = useGame();
  const { user, signOut } = useAuth();

  const doneLessons = MODULES.flatMap((module) =>
    module.lessons
      .filter((lesson) => (progress.completed[lesson.id] ?? 0) > 0)
      .map((lesson) => ({ module, lesson, stars: progress.completed[lesson.id] ?? 0 })),
  );

  const phrases = doneLessons.flatMap((item) => item.lesson.phrases);

  return (
    <AppShell>
      <section className="animate-rise rounded-3xl bg-gradient-to-br from-secondary to-secondary-deep p-5 text-secondary-foreground">
        <div className="flex items-center gap-3">
          <img src={gatinho} alt="" className="size-16 shrink-0 animate-float" />
          <div>
            <h1 className="font-display text-2xl font-extrabold leading-tight">
              {t("progressTitle")}
            </h1>
            <p className="text-sm opacity-90">{t("progressSubtitle")}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-sm font-bold">
          <span className="rounded-full bg-background/20 px-3 py-1">
            {t("level")} {level}
          </span>
          <span className="rounded-full bg-background/20 px-3 py-1">{progress.xp} XP</span>
          <span className="rounded-full bg-background/20 px-3 py-1">
            {doneLessons.length} {t("lessonsDone")}
          </span>
          <span className="rounded-full bg-background/20 px-3 py-1">
            {phrases.length} {t("masteredPhrases")}
          </span>
        </div>
      </section>

      <AdSlot />

      {doneLessons.length === 0 ? (
        <p className="mt-8 rounded-3xl bg-muted p-6 text-center text-sm font-bold text-muted-foreground">
          {t("progressEmpty")}
        </p>
      ) : (
        <div className="mt-6 space-y-6">
          {doneLessons.map(({ module, lesson, stars }) => (
            <section key={lesson.id} className="card-3d rounded-3xl border-border bg-card p-4">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">
                {module.title[locale]}
              </p>
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-lg">{lesson.title[locale]}</h2>
                <span className="flex shrink-0 items-center gap-0.5 text-gold">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < stars ? "size-4 fill-current" : "size-4 fill-locked text-locked"
                      }
                    />
                  ))}
                </span>
              </div>

              <ul className="mt-3 space-y-2">
                {lesson.phrases.map((phrase) => (
                  <li
                    key={phrase.en}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-muted px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-display text-base">{phrase.en}</p>
                      <p className="truncate text-xs text-muted-foreground">{phrase[locale]}</p>
                    </div>
                    <button
                      type="button"
                      aria-label={`${t("listen")}: ${phrase.en}`}
                      onClick={() => void speakEn(phrase.en, 0.75)}
                      className="btn-3d grid size-10 shrink-0 place-items-center rounded-2xl border-secondary-deep bg-secondary text-secondary-foreground"
                    >
                      <Volume2 className="size-5" strokeWidth={2.5} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <div className="mt-8">
        {user ? (
          <button
            type="button"
            onClick={() => {
              sfxTap();
              void signOut();
            }}
            className="btn-3d flex w-full items-center justify-center gap-2 rounded-2xl border-border bg-muted px-4 py-3 font-display text-base font-extrabold text-muted-foreground"
          >
            <LogOut className="size-5" strokeWidth={2.5} />
            {t("authSignOut")}
          </button>
        ) : (
          <Link
            to="/auth"
            onClick={() => sfxTap()}
            className="btn-3d flex w-full items-center justify-center gap-2 rounded-2xl border-primary-deep bg-primary px-4 py-3 font-display text-base font-extrabold text-primary-foreground"
          >
            {t("authTitle")}
          </Link>
        )}
      </div>
    </AppShell>
  );
}
