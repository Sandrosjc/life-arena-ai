import { Link } from "@tanstack/react-router";
import { Map, MessagesSquare, ShoppingBag } from "lucide-react";

import { useI18n } from "@/lib/i18n";

const ITEMS = [
  { to: "/", icon: Map, key: "tabPath" },
  { to: "/conversa", icon: MessagesSquare, key: "tabChat" },
  { to: "/loja", icon: ShoppingBag, key: "tabShop" },
] as const;

export function BottomNav() {
  const { t } = useI18n();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-stretch justify-around px-2 py-2">
        {ITEMS.map(({ to, icon: Icon, key }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="flex flex-1 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-muted-foreground transition-colors"
            activeProps={{ className: "bg-muted text-primary" }}
          >
            <Icon className="size-6 shrink-0" strokeWidth={2.5} />
            <span className="text-[11px] font-bold uppercase tracking-wide">{t(key)}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
