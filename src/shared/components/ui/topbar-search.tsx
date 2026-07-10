"use client";

import { CalendarDays, Search } from "lucide-react";
import { useAuthStore } from "@/shared/store/auth-store";

export function TopbarSearch() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex flex-col gap-3 rounded-[28px] bg-white p-4 shadow-[var(--shadow-card)] md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 md:min-w-[320px]">
        <Search className="h-4 w-4 text-[var(--color-muted)]" />
        <span className="text-sm text-[var(--color-muted)]">Buscar producto, pedido o mesa...</span>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted)]">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          <span>{new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeStyle: "short" }).format(new Date())}</span>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-[var(--color-surface)] px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] font-semibold text-white">
            {user?.name?.charAt(0).toUpperCase() ?? "N"}
          </div>
          <div>
            <p className="font-semibold text-[var(--color-ink)]">{user?.name ?? "Sin sesión"}</p>
            <p className="text-xs text-[var(--color-muted)]">{user?.role ?? "Invitado"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
