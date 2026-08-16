import { useEffect, useRef, useState } from "react";
import { Brain, Sparkles, Zap } from "lucide-react";

import { useGame } from "@/lib/game";
import { useI18n } from "@/lib/i18n";
import { sfxBrain } from "@/lib/sfx";

/** O CÉREBRO GIGANTE: mascote central que cresce e pulsa com o XP do usuário. */
export function BrainPower() {
  const { progress, level } = useGame();
  const { t } = useI18n();
  const [charging, setCharging] = useState(false);
  const previousXp = useRef(progress.xp);

  const xpInLevel = progress.xp % 250;
  const pct = Math.round((xpInLevel / 250) * 100);
  const scale = 1 + Math.min(level - 1, 10) * 0.03;

  useEffect(() => {
    if (progress.xp > previousXp.current) {
      setCharging(true);
      const id = setTimeout(() => setCharging(false), 900);
      previousXp.current = progress.xp;
      return () => clearTimeout(id);
    }
    previousXp.current = progress.xp;
    return undefined;
  }, [progress.xp]);

  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-b-4 border-accent/30 bg-gradient-to-br from-accent/15 via-secondary/10 to-primary/15 px-4 py-6">
      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-accent/20 blur-2xl" />

      <div className="relative flex flex-col items-center gap-3 text-center">
        <button
          type="button"
          aria-label={t("brainTitle")}
          onClick={() => {
            sfxBrain();
            setCharging(true);
            setTimeout(() => setCharging(false), 900);
          }}
          className="relative grid place-items-center"
          style={{ transform: `scale(${scale})` }}
        >
          <span className="absolute size-40 rounded-full bg-accent/25 blur-xl animate-brain-glow" />
          <Brain
            className={`relative size-32 text-accent drop-shadow-lg sm:size-40 ${
              charging ? "animate-brain-zap" : "animate-float"
            }`}
            strokeWidth={1.6}
          />
          <Sparkles
            className="absolute -right-2 -top-2 size-8 text-gold animate-float"
            strokeWidth={2.5}
          />
        </button>

        <div className="flex items-center gap-2">
          <Zap className="size-5 shrink-0 text-gold" strokeWidth={3} />
          <h2 className="font-display text-xl">
            {t("brainTitle")} · {t("level")} {level}
          </h2>
        </div>

        <div className="h-4 w-full max-w-xs overflow-hidden rounded-full bg-background/70">
          <div
            className="h-full rounded-full bg-gradient-to-r from-secondary via-accent to-primary transition-[width] duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
          {xpInLevel}/250 XP · {t("brainSubtitle")}
        </p>
      </div>
    </section>
  );
}
