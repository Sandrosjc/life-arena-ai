import { Link } from "@tanstack/react-router";
import { HeartCrack, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { RewardedAd } from "@/components/RewardedAd";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGame } from "@/lib/game";
import { useI18n } from "@/lib/i18n";

const REFILL_COST = 350;

export function HeartsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useI18n();
  const { spendCoins, refillHearts } = useGame();

  const buyRefill = () => {
    if (!spendCoins(REFILL_COST)) {
      toast.error(t("notEnoughCoins"));
      return;
    }
    refillHearts();
    toast.success(t("purchased"));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-2 sm:max-w-sm">
        <DialogHeader className="items-center text-center">
          <HeartCrack className="mx-auto size-14 animate-pop text-destructive" strokeWidth={2} />
          <DialogTitle className="font-display text-2xl">{t("outOfHearts")}</DialogTitle>
          <p className="text-sm text-muted-foreground">{t("outOfHeartsDesc")}</p>
        </DialogHeader>

        <div className="space-y-3">
          <RewardedAd onRewarded={() => onOpenChange(false)} />

          <button
            type="button"
            onClick={buyRefill}
            className="btn-3d w-full rounded-2xl border-primary-deep bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground"
          >
            {t("buyHearts")} · {REFILL_COST} 💎
          </button>

          <Link
            to="/loja"
            onClick={() => onOpenChange(false)}
            className="btn-3d flex w-full items-center justify-center gap-2 rounded-2xl border-accent-deep bg-accent px-4 py-3 text-sm font-extrabold text-accent-foreground"
          >
            <Sparkles className="size-4 shrink-0" strokeWidth={2.5} />
            {t("goPro")}
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
