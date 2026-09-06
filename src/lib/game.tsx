import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";


export const MAX_HEARTS = 5;
const HEART_REGEN_MS = 20 * 60 * 1000;
const STORAGE_KEY = "fluencybr.progress";

export type Progress = {
  xp: number;
  coins: number;
  hearts: number;
  lastHeartAt: number;
  streak: number;
  lastStudyDay: string | null;
  completed: Record<string, number>;
  isPro: boolean;
};

const INITIAL: Progress = {
  xp: 0,
  coins: 120,
  hearts: MAX_HEARTS,
  lastHeartAt: 0,
  streak: 0,
  lastStudyDay: null,
  completed: {},
  isPro: false,
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function yesterday() {
  return new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
}

function regenerate(progress: Progress): Progress {
  if (progress.isPro) return { ...progress, hearts: MAX_HEARTS };
  if (progress.hearts >= MAX_HEARTS || !progress.lastHeartAt) return progress;
  const elapsed = Date.now() - progress.lastHeartAt;
  const gained = Math.floor(elapsed / HEART_REGEN_MS);
  if (gained <= 0) return progress;
  const hearts = Math.min(MAX_HEARTS, progress.hearts + gained);
  return {
    ...progress,
    hearts,
    lastHeartAt: hearts >= MAX_HEARTS ? 0 : progress.lastHeartAt + gained * HEART_REGEN_MS,
  };
}

type GameContextValue = {
  progress: Progress;
  hydrated: boolean;
  level: number;
  loseHeart: () => void;
  addHearts: (amount: number) => void;
  refillHearts: () => void;
  spendCoins: (amount: number) => boolean;
  completeLesson: (lessonId: string, stars: number, xp: number) => number;
  activatePro: () => void;
  isUnlocked: (index: number) => boolean;
};

const GameContext = createContext<GameContextValue | null>(null);

/** Junta o progresso do aparelho com o da conta, sempre ficando com o melhor. */
function mergeProgress(local: Progress, remote: Partial<Progress>): Progress {
  const completed = { ...local.completed };
  for (const [id, stars] of Object.entries(remote.completed ?? {})) {
    completed[id] = Math.max(completed[id] ?? 0, stars);
  }
  return {
    ...local,
    xp: Math.max(local.xp, remote.xp ?? 0),
    coins: Math.max(local.coins, remote.coins ?? 0),
    hearts: Math.max(local.hearts, remote.hearts ?? 0),
    streak: Math.max(local.streak, remote.streak ?? 0),
    lastStudyDay: local.lastStudyDay ?? remote.lastStudyDay ?? null,
    isPro: local.isPro || Boolean(remote.isPro),
    completed,
  };
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(INITIAL);
  const [hydrated, setHydrated] = useState(false);
  const [synced, setSynced] = useState(false);
  const { user } = useAuth();


  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setProgress(regenerate({ ...INITIAL, ...(JSON.parse(raw) as Progress) }));
    } catch {
      /* progresso corrompido: recomeça limpo */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const id = setInterval(() => setProgress((p) => regenerate(p)), 30_000);
    return () => clearInterval(id);
  }, [hydrated]);

  const loseHeart = useCallback(() => {
    setProgress((p) => {
      if (p.isPro) return p;
      const hearts = Math.max(0, p.hearts - 1);
      return { ...p, hearts, lastHeartAt: p.lastHeartAt || Date.now() };
    });
  }, []);

  const addHearts = useCallback((amount: number) => {
    setProgress((p) => ({
      ...p,
      hearts: Math.min(MAX_HEARTS, p.hearts + amount),
      lastHeartAt: p.hearts + amount >= MAX_HEARTS ? 0 : p.lastHeartAt || Date.now(),
    }));
  }, []);

  const refillHearts = useCallback(() => {
    setProgress((p) => ({ ...p, hearts: MAX_HEARTS, lastHeartAt: 0 }));
  }, []);

  const spendCoins = useCallback((amount: number) => {
    let ok = false;
    setProgress((p) => {
      if (p.coins < amount) return p;
      ok = true;
      return { ...p, coins: p.coins - amount };
    });
    return ok;
  }, []);

  /** Registra a lição concluída e devolve o bônus de ofensiva ganho. */
  const completeLesson = useCallback((lessonId: string, stars: number, xp: number) => {
    let bonus = 0;
    setProgress((p) => {
      const day = today();
      const isNewDay = p.lastStudyDay !== day;
      const streak = isNewDay ? (p.lastStudyDay === yesterday() ? p.streak + 1 : 1) : p.streak;
      bonus = isNewDay ? 10 + Math.min(streak, 10) * 2 : 0;
      return {
        ...p,
        xp: p.xp + xp + bonus,
        coins: p.coins + Math.round(xp / 2),
        streak,
        lastStudyDay: day,
        completed: { ...p.completed, [lessonId]: Math.max(p.completed[lessonId] ?? 0, stars) },
      };
    });
    return bonus;
  }, []);

  const activatePro = useCallback(() => {
    setProgress((p) => ({ ...p, isPro: true, hearts: MAX_HEARTS, lastHeartAt: 0 }));
  }, []);

  const completedCount = Object.keys(progress.completed).length;

  const isUnlocked = useCallback(
    (index: number) => index <= completedCount,
    [completedCount],
  );

  const value = useMemo<GameContextValue>(
    () => ({
      progress,
      hydrated,
      level: Math.floor(progress.xp / 250) + 1,
      loseHeart,
      addHearts,
      refillHearts,
      spendCoins,
      completeLesson,
      activatePro,
      isUnlocked,
    }),
    [
      progress,
      hydrated,
      loseHeart,
      addHearts,
      refillHearts,
      spendCoins,
      completeLesson,
      activatePro,
      isUnlocked,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame precisa estar dentro de GameProvider");
  return ctx;
}
