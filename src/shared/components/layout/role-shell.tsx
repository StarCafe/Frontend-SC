"use client";

import Link from "next/link";
import {
  Coffee,
  CupSoda,
  LayoutDashboard,
  LogOut,
  Package,
  Receipt,
  Settings,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { useAuthGuard } from "@/modules/auth/presentation/hooks/use-auth-guard";
import { buttonClasses } from "@/shared/components/ui/button-styles";
import { Spinner } from "@/shared/components/ui/spinner";
import { useBusinessBrandingStore } from "@/shared/store/business-branding-store";
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
  const auth = useAuthGuard(role);
  const clearSession = useAuthStore((state) => state.clearSession);
  const branding = useBusinessBrandingStore((state) => state.branding);
  const sessionLabel = useMemo(() => {
    if (!auth?.user) {
      return "";
    }

    return (
      branding?.name ||
      auth.user.businessName ||
      (auth.user.businessId ? `Cafeteria #${auth.user.businessId}` : "Sin cafeteria")
    );
  }, [auth?.user, branding?.name]);
  const iconByLabel: Record<string, ReactNode> = {
    Dashboard: <LayoutDashboard className="h-4 w-4" />,
    Mesas: <Coffee className="h-4 w-4" />,
    Productos: <Package className="h-4 w-4" />,
    Categorias: <Package className="h-4 w-4" />,
    Addons: <CupSoda className="h-4 w-4" />,
    Pedidos: <Receipt className="h-4 w-4" />,
    Historial: <Receipt className="h-4 w-4" />,
    Caja: <Receipt className="h-4 w-4" />,
    Usuarios: <Users className="h-4 w-4" />,
    Ajustes: <Settings className="h-4 w-4" />,
  };

  if (!auth) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-[var(--color-ink)] shadow-[var(--shadow-card)]">
          <Spinner />
          <span>Validando sesion...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-2 py-2 sm:px-0 sm:py-5">
      <div className="page-shell app-shell-mobile grid gap-3 sm:gap-4 lg:gap-5 xl:grid-cols-[292px_minmax(0,1fr)]">
        <aside className="dark-panel rounded-[30px] border border-white/10 p-3 text-white sm:rounded-[36px] sm:p-5 xl:sticky xl:top-5 xl:z-20 xl:min-h-[calc(100vh-2.5rem)] xl:max-h-[calc(100vh-2.5rem)]">
          <div className="flex h-full flex-col gap-4 xl:gap-8">
            <div className="section-grid gap-3 sm:flex sm:items-end sm:justify-between xl:block">
              {branding?.logoUrl ? (
                <img
                  alt={branding.name}
                  className="h-14 w-14 rounded-[20px] bg-white/95 object-cover p-1.5 shadow-[0_14px_30px_rgba(0,0,0,0.18)]"
                  src={branding.logoUrl}
                />
              ) : (
                <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">
                  Nova
                </span>
              )}
              <div className="section-grid gap-1">
                <h2 className="text-[1.9rem] leading-none font-semibold sm:text-3xl">
                  {area}
                </h2>
                <p className="text-sm text-white/70">
                  {auth.user.name} / {auth.user.role}
                </p>
                <p className="text-xs text-white/45">{sessionLabel}</p>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="flex items-center gap-3">
                {branding?.logoUrl ? (
                  <img
                    alt={branding.name}
                    className="h-14 w-14 rounded-[20px] bg-white/95 object-cover p-1.5"
                    src={branding.logoUrl}
                  />
                ) : (
                  <div
                    className="grid h-14 w-14 place-items-center rounded-[20px] text-base font-semibold text-white shadow-[0_12px_22px_rgba(0,0,0,0.16)]"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    {(branding?.name ?? sessionLabel ?? area).slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-white">
                    {branding?.name ?? auth.user.businessName ?? sessionLabel}
                  </p>
                  <p className="truncate text-xs text-white/60">
                    {branding?.themeKey || "Tema activo"}
                  </p>
                </div>
              </div>
            </div>

            <nav className="grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-1 xl:gap-2">
              {navigation.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex min-h-[76px] flex-col items-start justify-between rounded-[22px] border border-transparent bg-white/5 px-3 py-3 text-left text-xs font-medium transition sm:min-h-[84px] sm:px-4 sm:text-sm xl:min-h-0 xl:flex-row xl:items-center xl:gap-3 xl:rounded-2xl xl:px-4 xl:py-3",
                      active
                        ? "border-white/10 bg-[var(--color-primary)] text-white shadow-[0_16px_28px_rgba(0,0,0,0.18)]"
                        : "text-white/75 hover:border-white/8 hover:bg-white/8 hover:text-white",
                    )}
                  >
                    {iconByLabel[item.label] ?? (
                      <UtensilsCrossed className="h-4 w-4" />
                    )}
                    <span className="leading-tight">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 xl:mt-auto xl:rounded-[28px]">
              <button
                className={buttonClasses({
                  variant: "ghost",
                  className:
                    "w-full justify-start border border-white/10 text-white hover:bg-white/10",
                })}
                onClick={() => clearSession()}
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesion
              </button>
            </div>
          </div>
        </aside>

        <div className="section-grid gap-4 lg:gap-5">{children}</div>
      </div>
    </div>
  );
}
