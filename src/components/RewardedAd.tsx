import { useEffect, useState } from "react";
import { PlayCircle, Video } from "lucide-react";
import { toast } from "sonner";

import { MAX_HEARTS, useGame } from "@/lib/game";
import { useI18n } from "@/lib/i18n";

export function RewardedAd({ onRewarded }: { onRewarded?: () => void }) {
  const { t } = useI18n();
  const { addHearts, progress } = useGame();
  const [seconds, setSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (seconds === null) return;
    if (seconds <= 0) {
      setSeconds(null);
      addHearts(1);
      toast.success(t("purchased"));
      onRewarded?.();
      return;
    }
    const id = setTimeout(() => setSeconds((s) => (s ?? 1) - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds, addHearts, onRewarded, t]);

  const full = progress.hearts >= MAX_HEARTS || progress.isPro;

  return (
    <div className="card-3d rounded-3xl border-secondary/30 bg-secondary/10 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Video className="size-5 shrink-0 text-secondary" strokeWidth={2.5} />
        <span className="text-xs font-extrabold uppercase tracking-wide text-secondary">
          {t("rewardedAd")}
        </span>
      </div>
      <button
        type="button"
        disabled={seconds !== null || full}
        onClick={() => setSeconds(30)}
        className="btn-3d flex w-full items-center justify-center gap-2 rounded-2xl border-secondary-deep bg-secondary px-4 py-3 text-sm font-extrabold text-secondary-foreground"
      >
        <PlayCircle className="size-5 shrink-0" strokeWidth={2.5} />
        {seconds !== null ? `${t("watching")} ${seconds}s` : t("watchAd")}
      </button>
      {full ? (
        <p className="mt-2 text-center text-xs text-muted-foreground">{t("heartsFull")}</p>
      ) : null}
    </div>
  );
}
