import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Flame, PartyPopper, Share2, X } from "lucide-react";
import { toast } from "sonner";

import { HeartsDialog } from "@/components/HeartsDialog";
import { StatusBar } from "@/components/StatusBar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useGame } from "@/lib/game";
import { useI18n } from "@/lib/i18n";
import { buildExercises, findLesson, type Exercise } from "@/lib/lessons";

export const Route = createFileRoute("/licao/$licaoId")({
  head: () => ({
    meta: [
      { title: "Lição interativa — FluencyBR AI" },
      {
        name: "description",
        content: "Traduza frases, monte sentenças em inglês e ganhe XP com feedback instantâneo.",
      },
      { property: "og:title", content: "Lição interativa — FluencyBR AI" },
      {
        property: "og:description",
        content: "Exercícios rápidos de inglês com correção na hora e sistema de vidas.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: ({ params }) => {
    if (!findLesson(params.licaoId)) throw notFound();
  },
  component: LessonPage,
});

type Status = "idle" | "correct" | "wrong";

function LessonPage() {
  const { licaoId } = Route.useParams();
  const navigate = useNavigate();
  const { locale, t } = useI18n();
  const { progress, loseHeart, completeLesson } = useGame();

  const entry = findLesson(licaoId)!;
  const [exercises] = useState<Exercise[]>(() =>
    buildExercises(entry.lesson, entry.module),
  );

  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [choice, setChoice] = useState<string | null>(null);
  const [built, setBuilt] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [heartsDialog, setHeartsDialog] = useState(false);
  const [finished, setFinished] = useState<{ xp: number; bonus: number } | null>(null);

  const exercise = exercises[index]!;
  const total = exercises.length;
  const nativeText = exercise.phrase[locale === "en" ? "pt" : locale];

  useEffect(() => {
    if (progress.hearts === 0 && !progress.isPro && !finished) setHeartsDialog(true);
  }, [progress.hearts, progress.isPro, finished]);

  const answer = exercise.kind === "choice" ? (choice ?? "") : built.join(" ");
  const canCheck = answer.trim().length > 0;

  const check = () => {
    const ok = answer.trim().toLowerCase() === exercise.phrase.en.toLowerCase();
    setStatus(ok ? "correct" : "wrong");
    if (!ok) {
      setMistakes((m) => m + 1);
      loseHeart();
    }
  };

  const next = () => {
    if (index + 1 >= total) {
      const xp = Math.max(10, (total - mistakes) * 15);
      const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
      const bonus = completeLesson(licaoId, stars, xp);
      setFinished({ xp, bonus });
      return;
    }
    setIndex((i) => i + 1);
    setStatus("idle");
    setChoice(null);
    setBuilt([]);
  };

  const share = async () => {
    const text = `Acabei de concluir "${entry.lesson.title[locale]}" no FluencyBR AI e ganhei ${
      (finished?.xp ?? 0) + (finished?.bonus ?? 0)
    } XP! 🔥 ${progress.streak} dias de ofensiva.`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "FluencyBR AI", text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("Conquista copiada!");
      }
    } catch {
      /* compartilhamento cancelado */
    }
  };

  const progressPct = Math.round((index / total) * 100);

  return (
    <div className="min-h-screen bg-background">
      <StatusBar />

      <div className="mx-auto max-w-2xl px-4 pt-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={t("backToPath")}
            onClick={() => navigate({ to: "/" })}
            className="rounded-full p-1 text-muted-foreground"
          >
            <X className="size-6" strokeWidth={3} />
          </button>
          <div className="h-4 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <p className="mt-6 text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
          {exercise.kind === "choice" ? t("chooseTranslation") : t("buildSentence")}
        </p>
        <h1 className="mt-2 font-display text-2xl leading-snug">{nativeText}</h1>

        {exercise.kind === "choice" ? (
          <div className="mt-6 space-y-3">
            {exercise.options.map((option) => {
              const selected = choice === option;
              return (
                <button
                  key={option}
                  type="button"
                  disabled={status !== "idle"}
                  onClick={() => setChoice(option)}
                  className={`card-3d w-full rounded-2xl px-4 py-4 text-left text-base font-bold transition-colors ${
                    selected
                      ? "border-secondary bg-secondary/10 text-secondary"
                      : "border-border bg-card text-card-foreground"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-6">
            <div className="card-3d min-h-24 rounded-2xl border-dashed border-border bg-muted/40 p-3">
              <div className="flex flex-wrap gap-2">
                {built.map((token, i) => (
                  <button
                    key={`${token}-${i}`}
                    type="button"
                    disabled={status !== "idle"}
                    onClick={() => setBuilt((b) => b.filter((_, idx) => idx !== i))}
                    className="card-3d rounded-xl border-border bg-card px-3 py-2 text-sm font-bold"
                  >
                    {token}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {exercise.tokens.map((token, i) => {
                const used = built.filter((b) => b === token).length;
                const available = exercise.tokens.filter((tk) => tk === token).length;
                const isUsed = used >= available;
                return (
                  <button
                    key={`${token}-${i}`}
                    type="button"
                    disabled={status !== "idle" || isUsed}
                    onClick={() => setBuilt((b) => [...b, token])}
                    className={`card-3d rounded-xl px-3 py-2 text-sm font-bold ${
                      isUsed
                        ? "border-transparent bg-muted text-transparent"
                        : "border-border bg-card text-card-foreground"
                    }`}
                  >
                    {token}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="h-40" />

      <footer
        className={`fixed inset-x-0 bottom-0 border-t-2 px-4 py-4 ${
          status === "correct"
            ? "animate-pop border-primary bg-success-soft"
            : status === "wrong"
              ? "animate-shake border-destructive bg-destructive-soft"
              : "border-border bg-background"
        }`}
      >
        <div className="mx-auto max-w-2xl">
          {status !== "idle" ? (
            <div className="mb-3 flex items-start gap-2">
              {status === "correct" ? (
                <Check className="size-6 shrink-0 text-primary" strokeWidth={3} />
              ) : (
                <X className="size-6 shrink-0 text-destructive" strokeWidth={3} />
              )}
              <div>
                <p
                  className={`font-display text-lg ${
                    status === "correct" ? "text-primary" : "text-destructive"
                  }`}
                >
                  {status === "correct" ? t("correct") : t("wrong")}
                </p>
                {status === "wrong" ? (
                  <p className="text-sm font-bold text-destructive">
                    {t("answerWas")} {exercise.phrase.en}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          <button
            type="button"
            disabled={status === "idle" && !canCheck}
            onClick={status === "idle" ? check : next}
            className={`btn-3d w-full rounded-2xl px-4 py-4 font-display text-lg uppercase tracking-wide ${
              status === "wrong"
                ? "border-destructive-deep bg-destructive text-destructive-foreground"
                : "border-primary-deep bg-primary text-primary-foreground"
            }`}
          >
            {status === "idle" ? t("check") : t("continue")}
          </button>
        </div>
      </footer>

      <HeartsDialog
        open={heartsDialog}
        onOpenChange={(open) => {
          setHeartsDialog(open);
          if (!open && progress.hearts === 0) navigate({ to: "/" });
        }}
      />

      <Dialog open={finished !== null}>
        <DialogContent showCloseButton={false} className="rounded-3xl border-2 text-center sm:max-w-sm">
          <PartyPopper className="mx-auto size-16 animate-pop text-gold" strokeWidth={2} />
          <h2 className="font-display text-2xl">{t("lessonDone")}</h2>

          <div className="grid grid-cols-3 gap-2">
            <div className="card-3d rounded-2xl border-primary/30 bg-primary/10 p-3">
              <p className="font-display text-xl text-primary">+{finished?.xp ?? 0}</p>
              <p className="text-[11px] font-bold text-muted-foreground">{t("xpEarned")}</p>
            </div>
            <div className="card-3d rounded-2xl border-streak/30 bg-streak/10 p-3">
              <p className="flex items-center justify-center gap-1 font-display text-xl text-streak">
                <Flame className="size-4 shrink-0" strokeWidth={3} />+{finished?.bonus ?? 0}
              </p>
              <p className="text-[11px] font-bold text-muted-foreground">{t("streakBonus")}</p>
            </div>
            <div className="card-3d rounded-2xl border-secondary/30 bg-secondary/10 p-3">
              <p className="font-display text-xl text-secondary">
                +{Math.round((finished?.xp ?? 0) / 2)}
              </p>
              <p className="text-[11px] font-bold text-muted-foreground">{t("totalCoins")}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={share}
            className="btn-3d flex w-full items-center justify-center gap-2 rounded-2xl border-accent-deep bg-accent px-4 py-3 font-extrabold text-accent-foreground"
          >
            <Share2 className="size-5 shrink-0" strokeWidth={2.5} />
            {t("share")}
          </button>

          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="btn-3d w-full rounded-2xl border-primary-deep bg-primary px-4 py-3 font-extrabold text-primary-foreground"
          >
            {t("backToPath")}
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
