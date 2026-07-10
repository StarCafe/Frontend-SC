"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { listAdminOrdersUseCase } from "@/modules/orders/application/use-cases/order.use-cases";
import type { OrderEntity } from "@/modules/orders/domain/order.entity";
import { ordersRepository } from "@/modules/orders/infrastructure/repositories/order-http.repository";
import { listTablesUseCase } from "@/modules/tables/application/use-cases/table.use-cases";
import type { TableEntity } from "@/modules/tables/domain/table.entity";
import { tablesRepository } from "@/modules/tables/infrastructure/repositories/table-http.repository";
import { useAuthGuard } from "@/modules/auth/presentation/hooks/use-auth-guard";
import { HttpError } from "@/shared/lib/api/http-client";
import { buttonClasses } from "@/shared/components/ui/button-styles";
import { Card } from "@/shared/components/ui/card";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { Spinner } from "@/shared/components/ui/spinner";
import { StatusBadge } from "@/shared/components/ui/status-badge";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const auth = useAuthGuard("ADMIN");
  const [orders, setOrders] = useState<OrderEntity[]>([]);
  const [tables, setTables] = useState<TableEntity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      return;
    }

    async function loadData() {
      setLoading(true);

      try {
        const [ordersData, tablesData] = await Promise.all([
          listAdminOrdersUseCase(ordersRepository, auth.token),
          listTablesUseCase(tablesRepository, auth.token),
        ]);
        setOrders(ordersData);
        setTables(tablesData);
      } catch (error) {
        const message = error instanceof HttpError ? error.message : "No se pudo cargar el dashboard.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [auth]);

  if (!auth) {
    return null;
  }

  if (loading) {
    return (
      <Card className="flex items-center gap-3 rounded-[24px] bg-white p-5">
        <Spinner />
        <span>Cargando dashboard...</span>
      </Card>
    );
  }

  return (
    <div className="section-grid gap-4 text-white sm:gap-5">
      <SectionHeading
        eyebrow="Admin area"
        title="Inicio administrativo"
        description="Resumen operativo en tiempo real para entrar rápido a mesas, pedidos y caja."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="rounded-[26px] bg-white p-5 shadow-[var(--shadow-card)] sm:rounded-[30px] sm:p-5">
          <p className="text-sm font-medium text-[var(--color-muted)]">Mesas registradas</p>
          <p className="mt-2 text-4xl font-semibold text-[var(--color-ink)]">{tables.length}</p>
          <Link
            href="/admin/tables"
            className={buttonClasses({
              variant: "primary",
              className:
                "mt-5 w-fit justify-start bg-[var(--color-primary)] px-4 !text-white hover:bg-[var(--color-primary-strong)]",
            })}
          >
            Ir a Mesas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>

        <Card className="rounded-[26px] bg-white p-5 shadow-[var(--shadow-card)] sm:rounded-[30px] sm:p-5">
          <p className="text-sm font-medium text-[var(--color-muted)]">Pedidos activos</p>
          <p className="mt-2 text-4xl font-semibold text-[var(--color-ink)]">{orders.length}</p>
          <Link
            href="/admin/orders"
            className={buttonClasses({
              variant: "primary",
              className:
                "mt-5 w-fit justify-start bg-[var(--color-primary)] px-4 !text-white hover:bg-[var(--color-primary-strong)]",
            })}
          >
            Ir a Pedidos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>

        <Card className="rounded-[26px] bg-white p-5 shadow-[var(--shadow-card)] sm:rounded-[30px] sm:p-5 sm:col-span-2 xl:col-span-1">
          <p className="text-sm font-medium text-[var(--color-muted)]">Accesos rápidos</p>
          <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3 xl:grid-cols-1">
            <Link href="/admin/products" className="rounded-2xl bg-[var(--color-surface)] px-4 py-3 font-medium !text-black">
              Productos
            </Link>
            <Link href="/admin/cashier" className="rounded-2xl bg-[var(--color-surface)] px-4 py-3 font-medium !text-black">
              Caja
            </Link>
            <Link href="/admin/users" className="rounded-2xl bg-[var(--color-surface)] px-4 py-3 font-medium !text-black">
              Usuarios
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_1fr]">
        <Card className="rounded-[26px] bg-white p-5 shadow-[var(--shadow-card)] sm:rounded-[32px] sm:p-5">
          <h2 className="text-xl font-semibold text-[var(--color-ink)]">Pedidos recientes</h2>
          <div className="mt-4 grid gap-3">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex flex-col items-start gap-3 rounded-[22px] border border-[var(--color-border)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-[var(--color-ink)]">#{order.id} / Mesa {order.tableNumber}</p>
                  <p className="text-sm text-[var(--color-muted)]">{order.items[0]?.productName ?? "Sin items"}</p>
                </div>
                <StatusBadge status={order.status as "PENDING"} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[26px] bg-white p-5 shadow-[var(--shadow-card)] sm:rounded-[32px] sm:p-5">
          <h2 className="text-xl font-semibold text-[var(--color-ink)]">Estado de mesas</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
            {tables.slice(0, 6).map((table) => (
              <div
                key={table.id}
                className={`rounded-[24px] p-4 ${
                  table.isActive
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-surface)] text-[var(--color-ink)]"
                }`}
              >
                <p className="font-semibold">Mesa {table.tableNumber}</p>
                <p className={`mt-2 text-sm ${table.isActive ? "text-white/85" : "text-[var(--color-muted)]"}`}>
                  {table.isActive ? "Activa" : "Inactiva"}
                </p>
                <p className={`text-sm break-all ${table.isActive ? "text-white/90" : "text-[var(--color-muted)]"}`}>
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
