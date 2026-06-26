"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cancelOrderUseCase, listAdminOrdersUseCase, listOrderHistoryUseCase } from "@/modules/orders/application/orders.use-cases";
import { ordersRepository } from "@/modules/orders/infrastructure/orders.repository.impl";
import type { OrderEntity } from "@/modules/orders/domain/order.types";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { usePolling } from "@/shared/hooks/use-polling";
import { useAuthStore } from "@/shared/store/auth-store";
import { formatCurrency, formatDateTime } from "@/shared/utils/format";

export function AdminOrdersBoard({ history = false }: { history?: boolean }) {
  const token = useAuthStore((state) => state.token);
  const [orders, setOrders] = useState<OrderEntity[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    if (!token) {
      return;
    }

    try {
      const nextOrders = history
        ? await listOrderHistoryUseCase(ordersRepository, token)
        : await listAdminOrdersUseCase(ordersRepository, token);
      setOrders(nextOrders);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar los pedidos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadOrders();
  }, [token]);

  usePolling(() => loadOrders(), history ? 5000 : 3000, Boolean(token));

  return (
    <div className="section-grid gap-6">
      <SectionHeading
        eyebrow="Orders bounded context"
        title={history ? "Historial de pedidos" : "Pedidos activos"}
        description={
          history
            ? "Consulta pedidos finalizados o cerrados para trazabilidad."
            : "Vista operativa con polling cada 3 segundos para detectar cambios sin recargar la pagina."
        }
      />

      {loading ? (
        <EmptyState title="Cargando pedidos" description="Sincronizando datos del backend." />
      ) : orders.length === 0 ? (
        <EmptyState
          title={history ? "No hay historial disponible" : "No hay pedidos activos"}
          description="Cuando el backend reporte pedidos los veras aqui."
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {orders.map((order) => (
            <Card key={order.id} className="section-grid gap-4 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold">Pedido #{order.id}</h3>
                  <p className="text-sm text-[var(--color-muted)]">
                    Mesa {order.tableNumber} · {order.customerName}
                  </p>
                </div>
                <Badge tone={order.status === "READY" ? "success" : order.status === "CANCELLED" ? "danger" : "warning"}>
                  {order.status}
                </Badge>
              </div>

              <div className="grid gap-2 text-sm text-[var(--color-muted)] md:grid-cols-2">
                <p>Total: <span className="font-semibold text-[var(--color-ink)]">{formatCurrency(order.total)}</span></p>
                <p>Creado: <span className="font-semibold text-[var(--color-ink)]">{formatDateTime(order.createdAt)}</span></p>
              </div>

              <div className="section-grid gap-2">
                {order.items.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-white/80 p-3 text-sm">
                    <p className="font-semibold">
                      {item.quantity} x {item.productName}
                    </p>
                    <p className="text-[var(--color-muted)]">{item.status}</p>
                  </div>
                ))}
              </div>

              {!history && order.status !== "CANCELLED" ? (
                <Button
                  variant="danger"
                  onClick={async () => {
                    if (!token) {
                      return;
                    }

                    try {
                      await cancelOrderUseCase(ordersRepository, token, order.id);
                      toast.success(`Pedido #${order.id} cancelado`);
                      await loadOrders();
                    } catch (error) {
                      toast.error(error instanceof Error ? error.message : "No se pudo cancelar el pedido");
                    }
                  }}
                >
                  Cancelar pedido
                </Button>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
