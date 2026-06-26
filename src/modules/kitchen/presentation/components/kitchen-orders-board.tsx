"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  listKitchenHistoryUseCase,
  listKitchenOrdersUseCase,
  markKitchenItemReadyUseCase,
  markKitchenOrderPreparingUseCase,
  markKitchenOrderReadyUseCase,
} from "@/modules/kitchen/application/use-cases/kitchen.use-cases";
import { kitchenRepository } from "@/modules/kitchen/infrastructure/repositories/kitchen-http.repository";
import type { OrderEntity } from "@/modules/orders/domain/order.entity";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { usePolling } from "@/shared/hooks/use-polling";
import { useAuthStore } from "@/shared/store/auth-store";
import { formatDateTime } from "@/shared/utils/format";

export function KitchenOrdersBoard({ history = false }: { history?: boolean }) {
  const token = useAuthStore((state) => state.token);
  const [orders, setOrders] = useState<OrderEntity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      const nextOrders = history
        ? await listKitchenHistoryUseCase(kitchenRepository, token)
        : await listKitchenOrdersUseCase(kitchenRepository, token);
      setOrders(nextOrders);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar los pedidos de cocina");
    } finally {
      setLoading(false);
    }
  }, [history, token]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadOrders();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadOrders]);

  usePolling(() => loadOrders(), history ? 5000 : 2500, Boolean(token));

  async function runAction(action: () => Promise<void>, successMessage: string) {
    try {
      await action();
      toast.success(successMessage);
      await loadOrders();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar el pedido");
    }
  }

  return (
    <div className="section-grid gap-6">
      <SectionHeading
        eyebrow="Kitchen bounded context"
        title={history ? "Historial de cocina" : "Tablero de preparacion"}
        description="Interfaz enfocada en velocidad operativa con polling y acciones de estado muy directas."
      />

      {loading ? (
        <EmptyState title="Cargando cocina" description="Recibiendo tickets activos desde el backend." />
      ) : orders.length === 0 ? (
        <EmptyState
          title={history ? "No hay historial de cocina" : "No hay pedidos en cocina"}
          description="Cuando entren pedidos apareceran aqui."
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {orders.map((order) => (
            <Card key={order.id} className="section-grid gap-4 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-semibold">Mesa {order.tableNumber}</h3>
                  <p className="text-sm text-[var(--color-muted)]">
                    Pedido #{order.id} · {formatDateTime(order.createdAt)}
                  </p>
                </div>
                <Badge tone={order.status === "READY" ? "success" : "warning"}>{order.status}</Badge>
              </div>

              <div className="section-grid gap-3">
                {order.items.map((item) => (
                  <div key={item.id} className="rounded-[22px] bg-white/85 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold">
                          {item.quantity} x {item.productName}
                        </p>
                        {item.notes ? <p className="mt-1 text-sm text-[var(--color-muted)]">{item.notes}</p> : null}
                      </div>
                      <Badge tone={item.status === "READY" ? "success" : "warning"}>{item.status}</Badge>
                    </div>
                    {!history && item.status !== "READY" ? (
                      <Button
                        className="mt-3 w-full"
                        variant="ghost"
                        onClick={() => {
                          if (!token) {
                            return;
                          }

                          void runAction(
                            () => markKitchenItemReadyUseCase(kitchenRepository, token, item.id),
                            `Item ${item.productName} listo`,
                          );
                        }}
                      >
                        Marcar item listo
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>

              {!history ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (!token) {
                        return;
                      }

                      void runAction(
                        () => markKitchenOrderPreparingUseCase(kitchenRepository, token, order.id),
                        `Pedido #${order.id} en preparacion`,
                      );
                    }}
                  >
                    Pasar a PREPARING
                  </Button>
                  <Button
                    onClick={() => {
                      if (!token) {
                        return;
                      }

                      void runAction(
                        () => markKitchenOrderReadyUseCase(kitchenRepository, token, order.id),
                        `Pedido #${order.id} listo para entregar`,
                      );
                    }}
                  >
                    Marcar pedido READY
                  </Button>
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
