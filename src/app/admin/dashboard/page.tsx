import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { demoOrders, demoTables } from "@/shared/mock/starcafe-demo";
import { buttonClasses } from "@/shared/components/ui/button-styles";
import { Card } from "@/shared/components/ui/card";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { StatusBadge } from "@/shared/components/ui/status-badge";

export default function AdminDashboardPage() {
  return (
    <div className="section-grid gap-5">
      <SectionHeading
        eyebrow="Admin area"
        title="Inicio administrativo"
        description="Vista simple y operativa. Desde aqui el admin entra a las secciones reales del sistema sin KPIs inventados."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-[30px] bg-white p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm text-[var(--color-muted)]">Mesas registradas</p>
          <p className="mt-2 text-4xl font-semibold text-[var(--color-ink)]">{demoTables.length}</p>
          <Link href="/admin/tables" className={buttonClasses({ variant: "ghost", className: "mt-4 justify-start px-0" })}>
            Ir a Mesas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
        <Card className="rounded-[30px] bg-white p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm text-[var(--color-muted)]">Pedidos activos</p>
          <p className="mt-2 text-4xl font-semibold text-[var(--color-ink)]">{demoOrders.length}</p>
          <Link href="/admin/orders" className={buttonClasses({ variant: "ghost", className: "mt-4 justify-start px-0" })}>
            Ir a Pedidos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
        <Card className="rounded-[30px] bg-white p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm text-[var(--color-muted)]">Accesos rápidos</p>
          <div className="mt-3 grid gap-2 text-sm">
            <Link href="/admin/products" className="rounded-2xl bg-[var(--color-surface)] px-4 py-3 text-[var(--color-ink)]">Productos</Link>
            <Link href="/admin/cashier" className="rounded-2xl bg-[var(--color-surface)] px-4 py-3 text-[var(--color-ink)]">Caja</Link>
            <Link href="/admin/users" className="rounded-2xl bg-[var(--color-surface)] px-4 py-3 text-[var(--color-ink)]">Usuarios</Link>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_1fr]">
        <Card className="rounded-[32px] bg-white p-5 shadow-[var(--shadow-card)]">
          <h2 className="text-xl font-semibold text-[var(--color-ink)]">Pedidos recientes</h2>
          <div className="mt-4 grid gap-3">
            {demoOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-[22px] border border-[var(--color-border)] px-4 py-4">
                <div>
                  <p className="font-semibold text-[var(--color-ink)]">#{order.id} · {order.table}</p>
                  <p className="text-sm text-[var(--color-muted)]">{order.items[0]?.productName}</p>
                </div>
                <StatusBadge status={order.status} label={order.shortStatus} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[32px] bg-white p-5 shadow-[var(--shadow-card)]">
          <h2 className="text-xl font-semibold text-[var(--color-ink)]">Estado de mesas</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {demoTables.map((table) => (
              <div key={table.id} className={`rounded-[24px] p-4 ${table.active ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-surface)] text-[var(--color-ink)]"}`}>
                <p className="font-semibold">Mesa {table.tableNumber}</p>
                <p className={`mt-2 text-sm ${table.active ? "text-white/75" : "text-[var(--color-muted)]"}`}>
                  {table.active ? "Activa" : "Inactiva"}
                </p>
                <p className={`text-sm break-all ${table.active ? "text-white/75" : "text-[var(--color-muted)]"}`}>
                  {table.qrToken}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
