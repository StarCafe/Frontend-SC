import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { demoOrders, demoTables } from "@/shared/mock/starcafe-demo";
import { buttonClasses } from "@/shared/components/ui/button-styles";
import { Card } from "@/shared/components/ui/card";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { StatusBadge } from "@/shared/components/ui/status-badge";

export default function AdminDashboardPage() {
  return (
    <div className="section-grid gap-5 text-white">
      <SectionHeading
        eyebrow="Admin area"
        title="Inicio administrativo"
        description="Vista simple y operativa. Desde aqui el admin entra a las secciones reales del sistema sin KPIs inventados."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="rounded-[24px] bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[30px] sm:p-5">
          <p className="text-sm font-medium text-[var(--color-muted)]">
            Mesas registradas
          </p>
          <p className="mt-2 text-4xl font-semibold text-[var(--color-ink)]">
            {demoTables.length}
          </p>
          <Link
            href="/admin/tables"
            className={buttonClasses({
              variant: "primary",
              className:
                "mt-4 w-fit justify-start bg-[var(--color-primary)] px-4 !text-white hover:bg-[var(--color-primary-strong)]",
            })}
          >
            Ir a Mesas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>

        <Card className="rounded-[24px] bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[30px] sm:p-5">
          <p className="text-sm font-medium text-[var(--color-muted)]">
            Pedidos activos
          </p>
          <p className="mt-2 text-4xl font-semibold text-[var(--color-ink)]">
            {demoOrders.length}
          </p>
          <Link
            href="/admin/orders"
            className={buttonClasses({
              variant: "primary",
              className:
                "mt-4 w-fit justify-start bg-[var(--color-primary)] px-4 !text-white hover:bg-[var(--color-primary-strong)]",
            })}
          >
            Ir a Pedidos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>

        <Card className="rounded-[24px] bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[30px] sm:p-5 sm:col-span-2 xl:col-span-1">
          <p className="text-sm font-medium text-[var(--color-muted)]">
            Accesos rapidos
          </p>
          <div className="mt-3 grid gap-2 text-sm">
            <Link
              href="/admin/products"
              className="rounded-2xl bg-[var(--color-surface)] px-4 py-3 font-medium !text-black"
            >
              Productos
            </Link>
            <Link
              href="/admin/cashier"
              className="rounded-2xl bg-[var(--color-surface)] px-4 py-3 font-medium !text-black"
            >
              Caja
            </Link>
            <Link
              href="/admin/users"
              className="rounded-2xl bg-[var(--color-surface)] px-4 py-3 font-medium !text-black"
            >
              Usuarios
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_1fr]">
        <Card className="rounded-[24px] bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[32px] sm:p-5">
          <h2 className="text-xl font-semibold text-[var(--color-ink)]">
            Pedidos recientes
          </h2>
          <div className="mt-4 grid gap-3">
            {demoOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[var(--color-border)] px-4 py-4"
              >
                <div>
                  <p className="font-semibold text-[var(--color-ink)]">
                    #{order.id} · {order.table}
                  </p>
                  <p className="text-sm text-[var(--color-muted)]">
                    {order.items[0]?.productName}
                  </p>
                </div>
                <StatusBadge status={order.status} label={order.shortStatus} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[24px] bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[32px] sm:p-5">
          <h2 className="text-xl font-semibold text-[var(--color-ink)]">
            Estado de mesas
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
            {demoTables.map((table) => (
              <div
                key={table.id}
                className={`rounded-[24px] p-4 ${
                  table.active
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-surface)] text-[var(--color-ink)]"
                }`}
              >
                <p className="font-semibold">Mesa {table.tableNumber}</p>
                <p
                  className={`mt-2 text-sm ${
                    table.active ? "text-white/85" : "text-[var(--color-muted)]"
                  }`}
                >
                  {table.active ? "Activa" : "Inactiva"}
                </p>
                <p
                  className={`text-sm break-all ${
                    table.active ? "text-white/90" : "text-[var(--color-muted)]"
                  }`}
                >
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
