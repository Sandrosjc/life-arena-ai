import { createFileRoute } from "@tanstack/react-router";
import { Check, Crown, Gem, Heart, Snowflake, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Confetti } from "@/components/Confetti";
import { RewardedAd } from "@/components/RewardedAd";
import { MAX_HEARTS, useGame } from "@/lib/game";
import { LOCALES, LOCALE_LABELS, useI18n } from "@/lib/i18n";
import { isMuted, sfxCoin, sfxTap, sfxWin, toggleMuted } from "@/lib/sfx";

export const Route = createFileRoute("/loja")({
  head: () => ({
    meta: [
      { title: "Loja e Plano Pro — Chequetto Inglês Fácil" },
      {
        name: "description",
        content:
          "Compre vidas extras, pacotes de moedas e assine o Pro com vidas ilimitadas, zero anúncios e IA sem limite.",
      },
      { property: "og:title", content: "Loja e Plano Pro — Chequetto Inglês Fácil" },
      {
        property: "og:description",
        content: "Vidas extras, moedas e o plano Pro do Chequetto Inglês Fácil.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopPage,
});

const HEART_PACKS = [
  { hearts: 1, cost: 100 },
  { hearts: 3, cost: 250 },
  { hearts: MAX_HEARTS, cost: 350 },
];

function ShopPage() {
  const { t, locale, setLocale } = useI18n();
  const { progress, addHearts, spendCoins, activatePro } = useGame();
  const [party, setParty] = useState(false);
  const [muted, setMuted] = useState(() => isMuted());

  const buyHearts = (hearts: number, cost: number) => {
    if (progress.hearts >= MAX_HEARTS && !progress.isPro) {
      toast.info(t("heartsFull"));
      return;
    }
    if (!spendCoins(cost)) {
      toast.error(t("notEnoughCoins"));
      return;
    }
    addHearts(hearts);
    sfxCoin();
    toast.success(t("purchased"));
  };

  const goPro = () => {
    sfxTap();
    activatePro();
    sfxWin();
    setParty(true);
    setTimeout(() => setParty(false), 2600);
    toast.success(t("proActive"));
  };

  return (
    <AppShell>
      {party ? <Confetti pieces={90} /> : null}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-2xl">{t("shopTitle")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("shopSubtitle")}</p>
        </div>
        <button
          type="button"
          aria-label={muted ? t("soundOff") : t("soundOn")}
          onClick={() => setMuted(toggleMuted())}
          className="btn-3d grid size-11 shrink-0 place-items-center rounded-2xl border-border bg-card"
        >
          {muted ? (
            <VolumeX className="size-5 text-muted-foreground" strokeWidth={2.5} />
          ) : (
            <Volume2 className="size-5 text-primary" strokeWidth={2.5} />
          )}
        </button>
      </div>

      <div className="mt-4 card-3d flex items-center justify-between rounded-3xl border-secondary/30 bg-secondary/10 px-4 py-3">
        <span className="text-xs font-extrabold uppercase tracking-wide text-secondary">
          {t("coins")}
        </span>
        <span className="flex items-center gap-1 font-display text-2xl text-secondary">
          <Gem className="size-5 shrink-0" strokeWidth={2.5} />
          {progress.coins}
        </span>
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
          {t("buyLivesTitle")}
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {HEART_PACKS.map((pack) => (
            <button
              key={pack.hearts}
              type="button"
              onClick={() => buyHearts(pack.hearts, pack.cost)}
              className="btn-3d card-3d rounded-2xl border-destructive/30 bg-destructive/5 px-2 py-4 text-center"
            >
              <Heart
                className="mx-auto size-8 fill-destructive text-destructive"
                strokeWidth={2}
              />
              <p className="mt-1 font-display text-lg">
                {pack.hearts === MAX_HEARTS ? t("buyHearts") : `+${pack.hearts}`}
              </p>
              <p className="text-xs font-extrabold text-secondary">{pack.cost} 💎</p>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <RewardedAd />
      </section>

      <section className="mt-6 card-3d flex items-start gap-3 rounded-3xl border-secondary/30 bg-card p-4">
        <Snowflake className="mt-0.5 size-6 shrink-0 text-secondary" strokeWidth={2.5} />
        <div className="min-w-0">
          <p className="font-display text-lg">{t("streakFreeze")}</p>
          <p className="text-xs text-muted-foreground">{t("streakFreezeDesc")}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!spendCoins(200)) {
              toast.error(t("notEnoughCoins"));
              return;
            }
            sfxCoin();
            toast.success(t("purchased"));
          }}
          className="btn-3d ml-auto shrink-0 rounded-2xl border-secondary-deep bg-secondary px-3 py-2 text-xs font-extrabold text-secondary-foreground"
        >
          200 💎
        </button>
      </section>

      <section className="relative mt-6 overflow-hidden rounded-3xl border-2 border-b-4 border-accent-deep bg-gradient-to-br from-accent via-accent to-secondary p-5 text-accent-foreground">
        <Sparkles className="pointer-events-none absolute -right-4 -top-4 size-28 opacity-25" />
        <div className="flex items-center gap-2">
          <Crown className="size-7 shrink-0 text-gold" strokeWidth={2.5} />
          <h2 className="font-display text-2xl text-accent-foreground">{t("proTitle")}</h2>
        </div>
        <p className="mt-1 text-sm font-bold opacity-90">{t("proPrice")}</p>

        <ul className="mt-4 space-y-2 text-sm font-bold">
          {["proBenefit1", "proBenefit2", "proBenefit3", "proBenefit4"].map((key) => (
            <li key={key} className="flex items-center gap-2">
              <Check className="size-5 shrink-0 text-gold" strokeWidth={3} />
              {t(key)}
            </li>
          ))}
        </ul>

        <button
          type="button"
          disabled={progress.isPro}
          onClick={goPro}
          className="btn-3d mt-5 w-full rounded-2xl border-gold bg-background px-4 py-3 font-display text-lg uppercase tracking-wide text-accent"
        >
          {progress.isPro ? t("proActive") : t("proCta")}
        </button>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
          {t("language")}
        </h2>
        <div className="flex gap-2">
          {LOCALES.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                sfxTap();
                setLocale(code);
              }}
              className={`card-3d flex-1 rounded-2xl px-3 py-2 text-xs font-extrabold ${
                locale === code
                  ? "border-primary-deep bg-primary text-primary-foreground"
                  : "border-border bg-card text-card-foreground"
              }`}
            >
              {LOCALE_LABELS[code]}
            </button>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
