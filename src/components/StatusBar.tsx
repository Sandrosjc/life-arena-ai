import { Flame, Heart, Infinity as InfinityIcon, Gem } from "lucide-react";

import { MAX_HEARTS, useGame } from "@/lib/game";
import { useI18n } from "@/lib/i18n";

export function StatusBar() {
  const { progress } = useGame();
  const { t } = useI18n();

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
          <Gem className="size-5 shrink-0 text-secondary" strokeWidth={2.5} />
          <span className="font-display text-lg font-extrabold text-secondary">
            {progress.coins}
          </span>
        </div>
      </div>
    </header>
  );
}
