"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import { useAuthGuard } from "@/modules/auth/presentation/hooks/use-auth-guard";
import { useAuthStore } from "@/shared/store/auth-store";
import { cn } from "@/shared/utils/cn";

export interface NavigationItem {
  href: string;
  label: string;
}

export function RoleShell({
  area,
  role,
  navigation,
  children,
}: {
  area: string;
  role: "ADMIN" | "KITCHEN";
  navigation: NavigationItem[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useAuthGuard(role);
  const clearSession = useAuthStore((state) => state.clearSession);

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen py-6">
      <div className="page-shell grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="glass-panel rounded-[32px] border border-[var(--color-border)] p-5 shadow-[var(--shadow-soft)]">
          <div className="section-grid gap-8">
            <div className="section-grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                StarCafe
              </span>
              <div>
                <h2 className="text-2xl font-semibold">{area}</h2>
                <p className="text-sm text-[var(--color-muted)]">{session.user.name}</p>
              </div>
            </div>

            <nav className="section-grid gap-2">
              {navigation.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm font-medium transition",
                      active ? "bg-[var(--color-primary)] text-white" : "hover:bg-white/70",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <Button
              variant="ghost"
              onClick={() => {
                clearSession();
                router.push(role === "ADMIN" ? "/admin/login" : "/kitchen/login");
              }}
            >
              Cerrar sesion
            </Button>
          </div>
        </aside>

        <div className="section-grid gap-6">{children}</div>
      </div>
    </div>
  );
}
