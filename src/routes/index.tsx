import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Crown, Lock, Star } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { BrainPower } from "@/components/BrainPower";
import gatinho from "@/assets/gatinho.png";
import { useGame } from "@/lib/game";
import { sfxFanfare, sfxTap } from "@/lib/sfx";
import { hapticWin } from "@/lib/haptics";
import { useI18n } from "@/lib/i18n";
import { ALL_LESSONS, MODULES } from "@/lib/lessons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trilha de Aventura — Chequetto Inglês Fácil" },
      {
        name: "description",
        content:
          "Avance pela trilha de fases do Chequetto Inglês Fácil: fundamentos, viagem e inglês corporativo em lições rápidas.",
      },
      { property: "og:title", content: "Trilha de Aventura — Chequetto Inglês Fácil" },
      {
        property: "og:description",
        content: "Fases desbloqueáveis, vidas, ofensiva e XP para aprender inglês todo dia.",
      },
    ],
  }),
  component: PathPage,
});

const TONE = {
  primary: {
    ring: "border-primary-deep bg-primary text-primary-foreground",
    soft: "bg-primary/10 text-primary",
    chip: "bg-primary text-primary-foreground",
  },
  secondary: {
    ring: "border-secondary-deep bg-secondary text-secondary-foreground",
    soft: "bg-secondary/10 text-secondary",
    chip: "bg-secondary text-secondary-foreground",
  },
  accent: {
    ring: "border-accent-deep bg-accent text-accent-foreground",
    soft: "bg-accent/10 text-accent",
    chip: "bg-accent text-accent-foreground",
  },
} as const;

const OFFSETS = ["translate-x-0", "translate-x-16", "translate-x-24", "translate-x-16", "-translate-x-16", "-translate-x-24"];

function PathPage() {
  const { locale, t } = useI18n();
  const { progress, isUnlocked, level } = useGame();

  const completedCount = Object.keys(progress.completed).length;
  const nextLessonId =
    ALL_LESSONS[Math.min(completedCount, ALL_LESSONS.length - 1)]?.lesson.id ?? "";

  return (
    <AppShell>
      <BrainPower />

      <section className="mb-6 mt-4 animate-rise rounded-3xl bg-gradient-to-br from-primary to-primary-deep p-5 text-primary-foreground">
        <div className="flex justify-center">
          <span className="animate-pulse rounded-full bg-gold px-4 py-1.5 font-display text-sm font-extrabold uppercase tracking-widest text-gold-foreground shadow-lg">
            {t("heroBadge")}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <img
            src={gatinho}
            alt="Chequetto, o gatinho mascote do curso de inglês"
            width={816}
            height={816}
            className="size-20 shrink-0 animate-float drop-shadow-md"
          />
          <div>
            <h1 className="font-display text-3xl font-extrabold leading-tight">{t("heroTitle")}</h1>
            <p className="mt-1 text-sm opacity-90">{t("heroSubtitle")}</p>
          </div>
        </div>
        <Link
          to="/licao/$licaoId"
          params={{ licaoId: nextLessonId }}
          onClick={() => { sfxFanfare(); hapticWin(); }}
          className="btn-3d mt-4 flex items-center justify-center gap-2 rounded-2xl bg-gold px-5 py-4 font-display text-lg font-extrabold text-gold-foreground shadow-xl hover:scale-[1.02]"
        >
          {completedCount === 0 ? t("ctaStart") : t("ctaContinue")}
        </Link>
        <div className="mt-4 flex items-center gap-4 text-sm font-bold">
          <span className="rounded-full bg-background/20 px-3 py-1">
            {t("level")} {level}
          </span>
          <span className="rounded-full bg-background/20 px-3 py-1">
            {completedCount} {t("lessonsDone")}
          </span>
          <span className="rounded-full bg-background/20 px-3 py-1">{progress.xp} XP</span>
        </div>
      </section>

      <div className="space-y-10">
        {MODULES.map((module) => {
          const tone = TONE[module.tone];
          return (
            <section key={module.id}>
              <div className={`card-3d mb-6 rounded-3xl border-transparent ${tone.chip} px-4 py-3`}>
                <p className="text-[11px] font-extrabold uppercase tracking-widest opacity-80">
                  {t("moduleLabel")} {module.id.slice(1)} · {module.subtitle[locale]}
                </p>
                <h2 className="font-display text-xl leading-tight">{module.title[locale]}</h2>
              </div>

              <ol className="flex flex-col items-center gap-4">
                {module.lessons.map((lesson) => {
                  const globalIndex = ALL_LESSONS.findIndex(
                    (item) => item.lesson.id === lesson.id,
                  );
                  const stars = progress.completed[lesson.id] ?? 0;
                  const done = stars > 0;
                  const unlocked = isUnlocked(globalIndex);
                  const offset = OFFSETS[globalIndex % OFFSETS.length];

                  return (
                    <li key={lesson.id} className={`flex flex-col items-center ${offset}`}>
                      {unlocked ? (
                        <Link
                          to="/licao/$licaoId"
                          params={{ licaoId: lesson.id }}
                          aria-label={lesson.title[locale]}
                          onClick={() => sfxTap()}
                          className={`btn-3d grid size-20 place-items-center rounded-full ${tone.ring} ${
                            !done ? "animate-float shadow-lg" : ""
                          }`}
                        >
                          {done ? (
                            <Crown className="size-9" strokeWidth={2.5} />
                          ) : (
                            <Star className="size-9 fill-current" strokeWidth={2} />
                          )}
                        </Link>
                      ) : (
                        <div className="grid size-20 place-items-center rounded-full border-b-4 border-border bg-locked text-muted-foreground">
                          <Lock className="size-8" strokeWidth={2.5} />
                        </div>
                      )}

                      <p
                        className={`mt-2 max-w-[9rem] text-center text-xs font-bold ${
                          unlocked ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {lesson.title[locale]}
                      </p>

                      {done ? (
                        <span className="mt-1 flex items-center gap-0.5 text-gold">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <Star
                              key={i}
                              className={
                                i < stars ? "size-3.5 fill-current" : "size-3.5 fill-locked text-locked"
                              }
                            />
                          ))}
                        </span>
                      ) : null}

                      {!unlocked ? (
                        <span className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                          {t("locked")}
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ol>

              {module.lessons.every((l) => (progress.completed[l.id] ?? 0) > 0) ? (
                <p
                  className={`mt-6 flex items-center justify-center gap-2 rounded-2xl ${tone.soft} py-2 text-sm font-bold`}
                >
                  <Check className="size-4 shrink-0" strokeWidth={3} />
                  {module.title[locale]} 100%
                </p>
              ) : null}
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
