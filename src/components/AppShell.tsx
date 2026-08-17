import { useEffect, type ReactNode } from "react";

import { BottomNav } from "@/components/BottomNav";
import { StatusBar } from "@/components/StatusBar";
import { installAudioUnlock } from "@/lib/sfx";

export function AppShell({ children }: { children: ReactNode }) {
  useEffect(() => installAudioUnlock(), []);

  return (
    <div className="min-h-screen bg-background">
      <StatusBar />
      <main className="mx-auto max-w-2xl px-4 pb-28 pt-4">{children}</main>
      <BottomNav />
    </div>
  );
}
