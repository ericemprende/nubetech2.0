"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";

/**
 * Shell de la aplicación: barra lateral de navegación (fija, estilo "night rail")
 * + topbar + contenido de la página activa. Equivalente en estructura al
 * Sidebar/Topbar de la demo (ver /demo/index.html), pero como componentes
 * reales de Next.js con enrutamiento por archivo.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "z-20 flex w-64 shrink-0 flex-col gap-1 border-r border-border bg-[#0B0F16] p-4 text-slate-200",
          "fixed inset-y-0 left-0 md:static md:flex",
          mobileOpen ? "flex" : "hidden md:flex"
        )}
      >
        <div className="mb-4 flex items-center gap-2 px-2">
          <span className="font-display text-lg font-semibold text-white">
            Nubeletech
          </span>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Contenido */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
          <button
            className="rounded-md p-2 hover:bg-muted md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="text-sm font-medium text-muted-foreground">
            {NAV_ITEMS.find((i) => i.href === pathname)?.label ?? ""}
          </div>
          <div />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
