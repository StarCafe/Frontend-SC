"use client";

import { useEffect, useState } from "react";
import { cancelOrderUseCase, listAdminOrdersUseCase, listOrderHistoryUseCase } from "@/modules/orders/application/use-cases/order.use-cases";
import type { OrderEntity } from "@/modules/orders/domain/order.entity";
import { ordersRepository } from "@/modules/orders/infrastructure/repositories/order-http.repository";
import { useAuthGuard } from "@/modules/auth/presentation/hooks/use-auth-guard";
import { HttpError } from "@/shared/lib/api/http-client";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { DemoTable } from "@/shared/components/ui/demo-table";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { Spinner } from "@/shared/components/ui/spinner";
import { StatusBadge } from "@/shared/components/ui/status-badge";
import { formatCurrency, formatDateTime } from "@/shared/utils/format";
import { toast } from "sonner";

export function AdminOrdersBoard({ history = false }: { history?: boolean }) {
  const auth = useAuthGuard("ADMIN");
  const [orders, setOrders] = useState<OrderEntity[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders(token: string) {
    setLoading(true);

    try {
      const data = history
        ? await listOrderHistoryUseCase(ordersRepository, token)
        : await listAdminOrdersUseCase(ordersRepository, token);
      setOrders(data);
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudieron cargar los pedidos.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!auth) {
      return;
    }

    const token = auth.token;
    const timeoutId = window.setTimeout(() => {
      void loadOrders(token);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [auth, history]);

  if (!auth) {
    return null;
  }

  async function handleCancel(orderId: number) {
    try {
      await cancelOrderUseCase(ordersRepository, auth.token, orderId);
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? { ...order, status: "CANCELLED" } : order)),
      );
      toast.success("Pedido cancelado");
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudo cancelar el pedido.";
      toast.error(message);
    }
  }

  if (loading) {
    return (
      <Card className="flex items-center gap-3 rounded-[24px] bg-white p-5">
        <Spinner />
        <span>Cargando pedidos...</span>
      </Card>
    );
  }

  if (!orders.length) {
    return (
      <EmptyState
        title={history ? "No hay historial todavía" : "No hay pedidos activos"}
        description={history ? "Aún no existen pedidos cerrados en esta cafetería." : "Los nuevos pedidos aparecerán aquí."}
      />
    );
  }

  if (history) {
    return (
      <div className="section-grid gap-5">
        <SectionHeading eyebrow="Order history" title="Historial de pedidos" />
        <DemoTable
          headers={["Pedido", "Mesa", "Cliente", "Estado", "Fecha", "Total"]}
          rows={orders.map((order) => [
            <span key={`${order.id}-id`} className="font-semibold">#{order.id}</span>,
            `Mesa ${order.tableNumber}`,
            order.customerName,
            <StatusBadge key={`${order.id}-status`} status={order.status as "PENDING"} />,
            formatDateTime(order.createdAt),
            formatCurrency(order.total),
          ])}
        />
      </div>
    );
  }

  return (
    <div className="section-grid gap-5">
      <SectionHeading eyebrow="Live monitoring" title="Pedidos en curso" />
      <div className="grid gap-5 xl:grid-cols-2">
        {orders.map((order) => (
          <Card key={order.id} className="rounded-[24px] bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[30px] sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-[var(--color-muted)]">#{order.id} · Mesa {order.tableNumber}</p>
                <h3 className="text-2xl font-semibold text-[var(--color-ink)]">{order.customerName}</h3>
                <p className="text-sm text-[var(--color-muted)]">{formatDateTime(order.createdAt)}</p>
              </div>
              <StatusBadge status={order.status as "PENDING"} />
            </div>
            <div className="mt-4 grid gap-3">
              {order.items.map((item) => (
                <div key={item.id} className="rounded-[18px] bg-[var(--color-surface)] p-4 sm:rounded-[22px]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[var(--color-ink)]">
                        {item.quantity} x {item.productName}
                      </p>
                      {item.notes ? <p className="text-sm text-[var(--color-muted)]">{item.notes}</p> : null}
                      {item.addons?.length ? (
                        <p className="text-sm text-[var(--color-muted)]">
                          Extras: {item.addons.map((addon) => addon.name).join(", ")}
                        </p>
                      ) : null}
                    </div>
                    <StatusBadge status={item.status as "PENDING"} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-lg font-semibold text-[var(--color-ink)]">{formatCurrency(order.total)}</span>
              <Button
                disabled={order.status === "PAID" || order.status === "CANCELLED"}
                variant="danger"
                onClick={() => handleCancel(order.id)}
                type="button"
              >
                Cancelar pedido
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
