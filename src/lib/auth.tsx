import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

type AuthValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session: current } }) => {
      setSession(current);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return ctx;
}

/** Conta as visitas para só convidar ao cadastro a partir da segunda vez. */
const VISITS_KEY = "chequetto.visits";
const DISMISSED_KEY = "chequetto.signupDismissedAt";

export function registerVisit(): number {
  try {
    const count = Number(window.localStorage.getItem(VISITS_KEY) ?? "0") + 1;
    window.localStorage.setItem(VISITS_KEY, String(count));
    return count;
  } catch {
    return 1;
  }
}

export function dismissSignup() {
  try {
    window.localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  } catch {
    /* armazenamento indisponível */
  }
}

/** Volta a convidar 24h depois de a pessoa dispensar. */
export function signupRecentlyDismissed(): boolean {
  try {
    const at = Number(window.localStorage.getItem(DISMISSED_KEY) ?? "0");
    return at > 0 && Date.now() - at < 86_400_000;
  } catch {
    return false;
  }
}
