import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import gatinho from "@/assets/gatinho.png";
import {
  dismissSignup,
  registerVisit,
  signupRecentlyDismissed,
  useAuth,
} from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

/**
 * Na primeira visita ninguém é incomodado: a pessoa conhece o app.
 * A partir da segunda visita convidamos a criar conta — e dá para pular.
 */
export function SignupInvite() {
  const { t } = useI18n();
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading || user) return;
    const visits = registerVisit();
    if (visits >= 2 && !signupRecentlyDismissed()) {
      const id = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(id);
    }
    return;
    // registra a visita apenas quando sabemos que ninguém está logado
  }, [loading, user]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-4 sm:items-center">
      <div className="card-3d w-full max-w-sm animate-rise rounded-3xl bg-card p-6 text-center">
        <img src={gatinho} alt="" className="mx-auto size-20 animate-float" />
        <h2 className="mt-3 font-display text-2xl font-extrabold text-foreground">
          {t("authInviteTitle")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("authInviteBody")}</p>
        <Link
          to="/auth"
          onClick={() => setOpen(false)}
          className="btn-3d mt-5 block rounded-2xl bg-primary px-5 py-4 font-display text-lg font-extrabold text-primary-foreground"
        >
          {t("authSignUp")}
        </Link>
        <button
          type="button"
          onClick={() => {
            dismissSignup();
            setOpen(false);
          }}
          className="mt-3 w-full text-sm font-semibold text-muted-foreground"
        >
          {t("authLater")}
        </button>
      </div>
    </div>
  );
}
