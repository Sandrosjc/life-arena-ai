import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { BarChart3, KeyRound, Lock, X } from "lucide-react";

import { getAdminStatus, lockAdmin, unlockAdmin } from "@/lib/admin.functions";
import { useGame, MAX_HEARTS } from "@/lib/game";
import { useI18n } from "@/lib/i18n";

/**
 * Gatilho secreto (canto inferior esquerdo, quase invisível) que abre o painel
 * master. A senha NUNCA fica no código: é conferida no servidor contra o
 * segredo ADMIN_PANEL_PASSWORD e o desbloqueio vive em cookie de sessão.
 */
export function SecretAdminTrigger() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"analytics" | "keys">("analytics");

  const { progress, level } = useGame();
  const { locale } = useI18n();

  const unlock = useServerFn(unlockAdmin);
  const lock = useServerFn(lockAdmin);
  const status = useServerFn(getAdminStatus);

  useEffect(() => {
    if (!open || unlocked) return;
    void status({}).then((r) => setUnlocked(r.unlocked));
  }, [open, unlocked, status]);

  const submit = async () => {
    setBusy(true);
    setError(false);
    try {
      const res = await unlock({ data: { password } });
      if (res.ok) {
        setUnlocked(true);
        setPassword("");
      } else {
        setError(true);
        setPassword("");
      }
    } finally {
      setBusy(false);
    }
  };

  const lessons = Object.keys(progress.completed).length;
  const stars = Object.values(progress.completed).reduce((a, b) => a + b, 0);
  const region =
    typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "—";

  return (
    <>
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => setOpen(true)}
        className="fixed bottom-0 left-0 z-[60] size-5 cursor-default bg-foreground opacity-[0.02]"
      />

      {open ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-foreground/80 px-4">
          <div className="w-full max-w-sm rounded-3xl border-2 border-b-4 border-border bg-card p-5 text-card-foreground">
            {!unlocked ? (
              <div className="space-y-3">
                <h2 className="flex items-center gap-2 font-display text-xl">
                  <Lock className="size-5 shrink-0 text-accent" strokeWidth={2.5} />
                  Painel Master
                </h2>
                <input
                  type="password"
                  value={password}
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void submit();
                  }}
                  placeholder="Senha"
                  aria-label="Senha do painel master"
                  className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-semibold outline-none focus:border-accent"
                />
                {error ? (
                  <p className="text-xs font-extrabold text-destructive">Senha incorreta.</p>
                ) : null}
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busy || !password}
                    onClick={() => void submit()}
                    className="btn-3d flex-1 rounded-2xl border-primary-deep bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground"
                  >
                    Entrar
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="btn-3d rounded-2xl border-border bg-muted px-4 py-3 text-sm font-extrabold text-muted-foreground"
                  >
                    <X className="size-4" strokeWidth={3} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTab("analytics")}
                    className={`flex flex-1 items-center justify-center gap-1 rounded-2xl px-3 py-2 text-xs font-extrabold ${
                      tab === "analytics"
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <BarChart3 className="size-4 shrink-0" strokeWidth={2.5} />
                    Analytics
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("keys")}
                    className={`flex flex-1 items-center justify-center gap-1 rounded-2xl px-3 py-2 text-xs font-extrabold ${
                      tab === "keys"
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <KeyRound className="size-4 shrink-0" strokeWidth={2.5} />
                    Chaves
                  </button>
                </div>

                {tab === "analytics" ? (
                  <div className="space-y-2">
                    <div className="rounded-2xl bg-muted px-4 py-3">
                      <p className="text-xs font-extrabold uppercase text-muted-foreground">
                        XP total · nível
                      </p>
                      <p className="font-display text-2xl">
                        {progress.xp} · {level}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        ["Lições feitas", String(lessons)],
                        ["Estrelas", String(stars)],
                        ["Ofensiva", `${progress.streak} d`],
                        ["Moedas", String(progress.coins)],
                        ["Vidas", `${progress.hearts}/${MAX_HEARTS}`],
                        ["Plano", progress.isPro ? "PRO" : "Grátis"],
                        ["Idioma", locale.toUpperCase()],
                        ["Região", region],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl bg-muted px-3 py-2">
                          <p className="truncate text-[10px] font-extrabold uppercase text-muted-foreground">
                            {label}
                          </p>
                          <p className="truncate font-display text-base">{value}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Dados deste dispositivo. Para métricas de todos os usuários, ative o backend.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-muted px-4 py-3 text-xs font-bold text-muted-foreground">
                    Chaves e segredos ficam só no servidor (ADMIN_PANEL_PASSWORD, SESSION_SECRET,
                    LOVABLE_API_KEY) e nunca são exibidos aqui.
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await lock({});
                      setUnlocked(false);
                      setOpen(false);
                    }}
                    className="btn-3d flex-1 rounded-2xl border-border bg-muted px-4 py-3 text-sm font-extrabold text-muted-foreground"
                  >
                    Sair
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="btn-3d flex-1 rounded-2xl border-primary-deep bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
