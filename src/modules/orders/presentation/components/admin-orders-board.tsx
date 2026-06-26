import { demoHistoryOrders, demoOrders } from "@/shared/mock/starcafe-demo";
import { Card } from "@/shared/components/ui/card";
import { DemoTable } from "@/shared/components/ui/demo-table";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { StatusBadge } from "@/shared/components/ui/status-badge";
import { formatCurrency, formatDateTime } from "@/shared/utils/format";
import { Button } from "@/shared/components/ui/button";

export function AdminOrdersBoard({ history = false }: { history?: boolean }) {
  const orders = history ? demoHistoryOrders : demoOrders;

  if (history) {
    return (
      <div className="section-grid gap-5">
        <SectionHeading
          eyebrow="Order history"
          title="Historial de pedidos"
          description="Versión demo para mostrar trazabilidad, filtros y lectura rápida del ciclo completo."
        />
        <DemoTable
          headers={["Pedido", "Mesa", "Cliente", "Estado", "Fecha", "Total"]}
          rows={orders.map((order) => [
            <span key={`${order.id}-id`} className="font-semibold">#{order.id}</span>,
            order.table,
            order.customerName,
            <StatusBadge key={`${order.id}-status`} status={order.status} label={order.shortStatus} />,
            formatDateTime(order.createdAt),
            formatCurrency(order.total),
          ])}
        />
      </div>
    );
  }

  return (
    <div className="section-grid gap-5">
      <SectionHeading
        eyebrow="Live monitoring"
        title="Pedidos en curso"
        description="Monitoreo visual estilo POS con estados claros y acciones rápidas pensadas para operación real."
      />
      <div className="grid gap-5 xl:grid-cols-2">
        {orders.map((order) => (
          <Card key={order.id} className="rounded-[30px] bg-white p-5 shadow-[var(--shadow-card)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-[var(--color-muted)]">#{order.id} · {order.table}</p>
                <h3 className="text-2xl font-semibold text-[var(--color-ink)]">{order.customerName}</h3>
                <p className="text-sm text-[var(--color-muted)]">{formatDateTime(order.createdAt)}</p>
              </div>
              <StatusBadge status={order.status} label={order.shortStatus} />
            </div>
            <div className="mt-4 grid gap-3">
              {order.items.map((item) => (
                <div key={item.id} className="rounded-[22px] bg-[var(--color-surface)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[var(--color-ink)]">
                        {item.quantity} x {item.productName}
                      </p>
                      {item.notes ? <p className="text-sm text-[var(--color-muted)]">{item.notes}</p> : null}
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-lg font-semibold text-[var(--color-ink)]">{formatCurrency(order.total)}</span>
              <div className="flex gap-2">
                <Button variant="ghost">Ver detalle</Button>
                <Button variant="danger">Cancelar pedido</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
