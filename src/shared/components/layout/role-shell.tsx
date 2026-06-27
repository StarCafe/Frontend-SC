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
import { buttonClasses } from "@/shared/components/ui/button-styles";
import { demoAdminUser, demoKitchenUser } from "@/shared/mock/starcafe-demo";
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
  const session = role === "ADMIN" ? demoAdminUser : demoKitchenUser;
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

  return (
    <div className="min-h-screen py-3 sm:py-5">
      <div className="page-shell grid gap-4 lg:gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="dark-panel rounded-[28px] border border-white/10 p-4 text-white sm:rounded-[36px] sm:p-5 xl:sticky xl:top-5 xl:max-h-[calc(100vh-2.5rem)]">
          <div className="flex h-full flex-col gap-5 xl:gap-8">
            <div className="section-grid gap-2 sm:flex sm:items-end sm:justify-between xl:block">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
                StarCafe
              </span>
              <div>
                <h2 className="text-2xl font-semibold sm:text-3xl">{area}</h2>
                <p className="text-sm text-white/70">
                  {session.name} · {session.roleLabel}
                </p>
              </div>
            </div>

            <nav className="flex gap-2 overflow-x-auto pb-1 xl:grid xl:overflow-visible xl:pb-0">
              {navigation.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition xl:shrink",
                      active
                        ? "bg-[var(--color-primary)] text-white"
                        : "text-white/75 hover:bg-white/8 hover:text-white",
                    )}
                  >
                    {iconByLabel[item.label] ?? (
                      <UtensilsCrossed className="h-4 w-4" />
                    )}
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 xl:mt-auto xl:rounded-[28px]">
              <p className="text-sm leading-6 text-white/70">
                Demo visual con datos hardcodeados para deploy y revision UI/UX.
              </p>
              <Link
                href={role === "ADMIN" ? "/admin/login" : "/kitchen/login"}
                className={buttonClasses({
                  variant: "ghost",
                  className:
                    "mt-4 w-full justify-start border border-white/10 text-white hover:bg-white/10",
                })}
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesion
              </Link>
            </div>
          </div>
        </aside>

        <div className="section-grid gap-4 lg:gap-5">{children}</div>
      </div>
    </div>
  );
}
