"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { RoleShell } from "@/shared/components/layout/role-shell";

const adminNavigation = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/tables", label: "Mesas" },
  { href: "/admin/products", label: "Productos" },
  { href: "/admin/categories", label: "Categorias" },
  { href: "/admin/addons", label: "Addons" },
  { href: "/admin/orders", label: "Pedidos" },
  { href: "/admin/orders/history", label: "Historial" },
  { href: "/admin/cashier", label: "Caja" },
  { href: "/admin/users", label: "Usuarios" },
  { href: "/admin/settings", label: "Ajustes" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <RoleShell area="Administrador" role="ADMIN" navigation={adminNavigation}>
      {children}
    </RoleShell>
  );
}
