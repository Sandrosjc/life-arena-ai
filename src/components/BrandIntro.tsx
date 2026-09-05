import { useEffect, useState } from "react";

import gatinho from "@/assets/gatinho.png";
import { useI18n } from "@/lib/i18n";
import { sfxFanfare } from "@/lib/sfx";

const SESSION_KEY = "chequetto.introSeen";

/** Abertura da marca: aparece uma vez por sessão, deixando claro que é o Chequetto. */
export function BrandIntro() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) return;
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* armazenamento indisponível */
    }
    setOpen(true);
    const id = setTimeout(() => setOpen(false), 2600);
    return () => clearTimeout(id);
  }, []);

  if (!open) return null;

  return (
    <button
      type="button"
      aria-label={t("brandEnter")}
      onClick={() => {
        sfxFanfare();
        setOpen(false);
      }}
      className="fixed inset-0 z-[60] flex w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-primary to-primary-deep px-6 text-primary-foreground"
    >
      <img src={gatinho} alt="" className="size-32 animate-float drop-shadow-xl" />
      <h1 className="font-display text-5xl font-extrabold tracking-tight">{t("brandName")}</h1>
      <p className="max-w-xs rounded-full bg-gold px-4 py-2 text-center font-display text-sm font-extrabold uppercase tracking-widest text-gold-foreground">
        {t("brandTagline")}
      </p>
      <span className="mt-2 animate-pulse text-sm font-bold opacity-90">{t("brandEnter")}</span>
    </button>
  );
}
