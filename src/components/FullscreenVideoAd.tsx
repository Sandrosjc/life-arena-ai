import { useEffect, useRef, useState } from "react";
import { Clapperboard, PlayCircle, X } from "lucide-react";

import { useGame } from "@/lib/game";
import { useI18n } from "@/lib/i18n";

/**
 * ══════════════════════════════════════════════════════════════════
 *  ADSTERRA — COLE AQUI O CÓDIGO DO ANÚNCIO EM VÍDEO
 * ──────────────────────────────────────────────────────────────────
 *  Quando você tiver a tag/script da Adsterra, cole no lugar do bloco
 *  <SimulatedVideo /> abaixo (procure por ADSTERRA_SNIPPET).
 *  Enquanto não houver código real, mostramos uma simulação interna.
 * ══════════════════════════════════════════════════════════════════
 */
const AD_SECONDS = 30;

type Props = {
  open: boolean;
  /** Chamado quando a pessoa assistiu até o fim (recompensa liberada). */
  onCompleted: () => void;
  /** Chamado se fechar sem terminar (quando permitido) ou após completar. */
  onClose: () => void;
  /** Se true, o vídeo dá recompensa (vidas); se false, é só intervalo. */
  rewarded?: boolean;
};

export function FullscreenVideoAd({ open, onCompleted, onClose, rewarded = false }: Props) {
  const { t } = useI18n();
  const { progress } = useGame();
  const [seconds, setSeconds] = useState(AD_SECONDS);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    completedRef.current = false;
    setSeconds(AD_SECONDS);
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(id);
          completedRef.current = true;
          onCompleted();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open || progress.isPro) return null;

  const done = seconds <= 0;

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-background">
      {/* topo: selo + contador */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
          {t("adVideoLabel")}
        </span>
        <span className="rounded-full bg-muted px-3 py-1 font-display text-sm text-muted-foreground">
          {done ? t("adDone") : t("adCountdown").replace("{s}", String(seconds))}
        </span>
      </div>

      {/* vídeo ocupa a tela toda */}
      <div className="flex flex-1 items-center justify-center px-4">
        {/* ADSTERRA_SNIPPET: cole o script/tag de vídeo da Adsterra aqui dentro */}
        <div className="relative flex aspect-video w-full max-w-3xl flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border border-dashed border-border bg-muted/40">
          <Clapperboard className="size-20 text-muted-foreground" strokeWidth={1.2} />
          <PlayCircle className="absolute size-24 animate-pulse text-muted-foreground/40" strokeWidth={1} />
          <p className="px-6 text-center text-xs font-bold text-muted-foreground">
            {rewarded ? t("adRewardHint") : t("adBreakHint")}
          </p>
        </div>
      </div>

      {/* botão fechar / continuar — só libera no fim */}
      <div className="px-4 pb-8 pt-4">
        <button
          type="button"
          disabled={!done}
          onClick={onClose}
          className={`btn-3d mx-auto flex w-full max-w-sm items-center justify-center gap-2 rounded-2xl px-4 py-4 font-display text-lg uppercase tracking-wide ${
            done
              ? "border-primary-deep bg-primary text-primary-foreground"
              : "cursor-not-allowed border-border bg-muted text-muted-foreground"
          }`}
        >
          <X className="size-5 shrink-0" strokeWidth={3} />
          {done ? t("adContinue") : t("watching")}
        </button>
        <p className="mt-3 text-center text-xs font-bold text-muted-foreground">
          {t("adRemove")}
        </p>
      </div>
    </div>
  );
}

/** Controle de frequência: no máximo 1 vídeo a cada 2 lições concluídas. */
const AD_FREQ_KEY = "chequetto.lastAdAtLesson";

export function shouldShowLessonAd(completedCount: number, isPro: boolean): boolean {
  if (isPro || completedCount < 1) return false;
  try {
    const last = Number(window.localStorage.getItem(AD_FREQ_KEY) ?? "0");
    return completedCount - last >= 2;
  } catch {
    return false;
  }
}

export function markLessonAdShown(completedCount: number) {
  try {
    window.localStorage.setItem(AD_FREQ_KEY, String(completedCount));
  } catch {
    /* sem storage: ignora */
  }
}
