"use client";

import { useEffect, useState } from "react";
import {
  listKitchenHistoryUseCase,
  listKitchenOrdersUseCase,
  markKitchenItemReadyUseCase,
  markKitchenOrderPreparingUseCase,
  markKitchenOrderReadyUseCase,
} from "@/modules/kitchen/application/use-cases/kitchen.use-cases";
import type { OrderEntity } from "@/modules/orders/domain/order.entity";
import { kitchenRepository } from "@/modules/kitchen/infrastructure/repositories/kitchen-http.repository";
import { useAuthGuard } from "@/modules/auth/presentation/hooks/use-auth-guard";
import { HttpError } from "@/shared/lib/api/http-client";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { Spinner } from "@/shared/components/ui/spinner";
import { StatusBadge } from "@/shared/components/ui/status-badge";
import { formatDateTime } from "@/shared/utils/format";
import { toast } from "sonner";

const columns = [
  { key: "PENDING", label: "Pendiente" },
  { key: "PREPARING", label: "Preparando" },
  { key: "READY", label: "Listo" },
] as const;

export function KitchenOrdersBoard({ history = false }: { history?: boolean }) {
  const auth = useAuthGuard("KITCHEN");
  const [orders, setOrders] = useState<OrderEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  async function loadOrders(token: string) {
    setLoading(true);

    try {
      const data = history
        ? await listKitchenHistoryUseCase(kitchenRepository, token)
        : await listKitchenOrdersUseCase(kitchenRepository, token);
      setOrders(data);
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudieron cargar los pedidos de cocina.";
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

  async function runAction(key: string, action: () => Promise<void>) {
    setBusyKey(key);

    try {
      await action();
      await loadOrders(auth.token);
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudo completar la acción.";
      toast.error(message);
    } finally {
      setBusyKey(null);
    }
  }

  if (loading) {
    return (
      <Card className="flex items-center gap-3 rounded-[24px] bg-white p-5">
        <Spinner />
        <span>Cargando cocina...</span>
      </Card>
    );
  }

  if (!orders.length) {
    return (
      <EmptyState
        title={history ? "No hay historial en cocina" : "No hay pedidos activos"}
        description={history ? "Todavía no se han cerrado pedidos en este turno." : "Cuando entren pedidos aparecerán aquí."}
      />
    );
  }

  if (history) {
    return (
      <div className="section-grid gap-5">
        <SectionHeading eyebrow="Kitchen history" title="Historial de cocina" />
        <div className="grid gap-4 md:grid-cols-2">
          {orders.map((order) => (
            <Card key={order.id} className="rounded-[24px] bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[28px] sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-[var(--color-muted)]">Mesa {order.tableNumber}</p>
                  <h3 className="text-xl font-semibold text-[var(--color-ink)]">{order.customerName}</h3>
                </div>
                <StatusBadge status={order.status as "PENDING"} />
              </div>
              <p className="mt-3 text-sm text-[var(--color-muted)]">{formatDateTime(order.createdAt)}</p>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="section-grid gap-5">
      <SectionHeading eyebrow="Kitchen board" title="Pedidos de cocina" />
      <div className="grid gap-4 xl:grid-cols-3">
        {columns.map((column) => (
          <div key={column.key} className="section-grid gap-4">
            <div className="rounded-[20px] bg-white px-4 py-3 shadow-[var(--shadow-card)] sm:rounded-[24px]">
              <h3 className="text-lg font-semibold text-[var(--color-ink)]">{column.label}</h3>
            </div>
            {orders
              .filter((order) => order.status === column.key)
              .map((order) => (
                <Card key={order.id} className="rounded-[24px] bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[28px] sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-[var(--color-muted)]">Mesa {order.tableNumber}</p>
                      <h4 className="text-2xl font-semibold text-[var(--color-ink)]">{order.customerName}</h4>
                      <p className="text-sm text-[var(--color-muted)]">{formatDateTime(order.createdAt)}</p>
                    </div>
                    <StatusBadge status={order.status as "PENDING"} />
                  </div>
                  <div className="mt-4 grid gap-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="rounded-[18px] bg-[var(--color-surface)] p-4 sm:rounded-[20px]">
                        <p className="font-semibold text-[var(--color-ink)]">
                          {item.quantity} x {item.productName}
                        </p>
                        {item.notes ? <p className="mt-1 text-sm text-[var(--color-muted)]">{item.notes}</p> : null}
                        <Button
                          className="mt-3 w-full"
                          disabled={item.status === "READY" || busyKey === `item-${item.id}`}
                          variant="ghost"
                          onClick={() =>
                            runAction(`item-${item.id}`, () =>
                              markKitchenItemReadyUseCase(kitchenRepository, auth.token, item.id),
                            )
                          }
                          type="button"
                        >
                          {busyKey === `item-${item.id}` ? <Spinner /> : null}
                          Marcar item listo
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-2">
                    <Button
                      disabled={order.status !== "PENDING" || busyKey === `preparing-${order.id}`}
                      variant="secondary"
                      onClick={() =>
                        runAction(`preparing-${order.id}`, () =>
                          markKitchenOrderPreparingUseCase(kitchenRepository, auth.token, order.id),
                        )
                      }
                      type="button"
                    >
                      Pasar a preparando
                    </Button>
                    <Button
                      disabled={order.status === "READY" || busyKey === `ready-${order.id}`}
                      onClick={() =>
                        runAction(`ready-${order.id}`, () =>
                          markKitchenOrderReadyUseCase(kitchenRepository, auth.token, order.id),
                        )
                      }
                      type="button"
                    >
                      Marcar pedido listo
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
