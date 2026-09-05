import { Link } from "@tanstack/react-router";
import { PlayCircle } from "lucide-react";

import { useGame } from "@/lib/game";
import { useI18n } from "@/lib/i18n";

type Props = { variant?: "banner" | "video" };

/** Espaço reservado para publicidade. Some completamente para quem é Pro. */
export function AdSlot({ variant = "banner" }: Props) {
  const { t } = useI18n();
  const { progress } = useGame();

  if (progress.isPro) return null;

  return (
    <aside className="my-6 rounded-3xl border border-dashed border-border bg-muted/40 p-4">
      <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
        {variant === "video" ? t("adVideoLabel") : t("adLabel")}
      </p>
      <div
        className={`mt-2 grid place-items-center rounded-2xl bg-background/60 ${
          variant === "video" ? "aspect-video" : "h-24"
        }`}
      >
        {variant === "video" ? (
          <PlayCircle className="size-12 text-muted-foreground" strokeWidth={1.5} />
        ) : (
          <span className="text-xs font-bold text-muted-foreground">728 x 90</span>
        )}
      </div>
      <Link to="/loja" className="mt-3 block text-center text-xs font-bold text-primary">
        {t("adRemove")}
      </Link>
    </aside>
  );
}
