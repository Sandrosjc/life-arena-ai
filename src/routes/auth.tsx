import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { sfxWin } from "@/lib/sfx";
import gatinho from "@/assets/gatinho.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Criar conta — Chequetto Inglês Fácil" },
      {
        name: "description",
        content:
          "Crie sua conta grátis no Chequetto Inglês Fácil e guarde seu progresso, sua ofensiva e seu XP em qualquer aparelho.",
      },
      { property: "og:title", content: "Criar conta — Chequetto Inglês Fácil" },
      {
        property: "og:description",
        content: "Guarde sua ofensiva, seu XP e suas lições em qualquer aparelho.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const router = useRouter();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (data.session) {
          sfxWin();
          toast.success(t("authWelcome"));
          router.invalidate();
          navigate({ to: "/" });
        } else {
          toast.success(t("authCheckEmail"));
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        sfxWin();
        toast.success(t("authWelcome"));
        router.invalidate();
        navigate({ to: "/" });
      }
    } catch {
      toast.error(t("authError"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
      <div className="card-3d rounded-3xl bg-card p-6">
        <div className="flex items-center gap-3">
          <img src={gatinho} alt="Chequetto, o gatinho mascote" className="size-16 animate-float" />
          <div>
            <h1 className="font-display text-2xl font-extrabold leading-tight text-foreground">
              {t("authTitle")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("authSubtitle")}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("authEmail")}
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none focus:border-primary"
          />
          <input
            type="password"
            required
            minLength={6}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("authPassword")}
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={busy}
            className="btn-3d w-full rounded-2xl bg-primary px-5 py-4 font-display text-lg font-extrabold text-primary-foreground disabled:opacity-60"
          >
            {busy ? t("authLoading") : mode === "signup" ? t("authSignUp") : t("authSignIn")}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          className="mt-4 w-full text-sm font-bold text-primary"
        >
          {mode === "signup" ? t("authToggleSignIn") : t("authToggleSignUp")}
        </button>

        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="mt-2 w-full text-sm font-semibold text-muted-foreground"
        >
          {t("authLater")}
        </button>
      </div>
    </main>
  );
}
