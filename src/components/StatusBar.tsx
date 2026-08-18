import { useEffect, useState } from "react";
import { Flame, Heart, Infinity as InfinityIcon, Gem, Music, Music2 } from "lucide-react";

import { MAX_HEARTS, useGame } from "@/lib/game";
import { useI18n } from "@/lib/i18n";
import { isMusicOn, startMusic, toggleMusic } from "@/lib/sfx";

export function StatusBar() {
  const { progress } = useGame();
  const { t } = useI18n();
  const [music, setMusic] = useState(true);

  useEffect(() => {
    setMusic(isMusicOn());
    if (isMusicOn()) startMusic();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto grid max-w-2xl grid-cols-3 items-center gap-2 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <Flame className="size-6 shrink-0 text-streak" strokeWidth={2.5} />
          <span className="font-display text-lg font-extrabold text-streak">
            {progress.streak}
          </span>
          <span className="truncate text-xs text-muted-foreground">{t("streak")}</span>
        </div>

        <div className="flex items-center justify-center gap-1">
          {progress.isPro ? (
            <>
              <Heart className="size-6 shrink-0 fill-destructive text-destructive" />
              <InfinityIcon className="size-5 text-destructive" strokeWidth={3} />
            </>
          ) : (
            Array.from({ length: MAX_HEARTS }).map((_, i) => (
              <Heart
                key={i}
                className={
                  i < progress.hearts
                    ? "size-5 shrink-0 fill-destructive text-destructive"
                    : "size-5 shrink-0 fill-locked text-locked"
                }
              />
            ))
          )}
        </div>

        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            aria-label={t("music")}
            onClick={() => setMusic(toggleMusic())}
            className={`rounded-full p-1 ${music ? "text-accent" : "text-muted-foreground"}`}
          >
            {music ? (
              <Music className="size-5" strokeWidth={2.5} />
            ) : (
              <Music2 className="size-5 opacity-50" strokeWidth={2.5} />
            )}
          </button>
          <Gem className="size-5 shrink-0 text-secondary" strokeWidth={2.5} />
          <span className="font-display text-lg font-extrabold text-secondary">
            {progress.coins}
          </span>
        </div>
      </div>
    </header>
  );
}
