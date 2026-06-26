"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { RoleShell } from "@/shared/components/layout/role-shell";

const kitchenNavigation = [
  { href: "/kitchen/orders", label: "Pedidos" },
  { href: "/kitchen/history", label: "Historial" },
];

export default function KitchenLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/kitchen/login") {
    return <>{children}</>;
  }

  return (
    <RoleShell area="Cocina" role="KITCHEN" navigation={kitchenNavigation}>
      {children}
    </RoleShell>
  );
}
