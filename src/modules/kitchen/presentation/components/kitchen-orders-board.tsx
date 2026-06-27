import { demoHistoryOrders, demoOrders } from "@/shared/mock/starcafe-demo";
import { Card } from "@/shared/components/ui/card";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { StatusBadge } from "@/shared/components/ui/status-badge";
import { Button } from "@/shared/components/ui/button";
import { formatDateTime } from "@/shared/utils/format";

const columns = [
  { key: "PENDING", label: "Pendiente" },
  { key: "PREPARING", label: "Preparando" },
  { key: "READY", label: "Listo" },
] as const;

export function KitchenOrdersBoard({ history = false }: { history?: boolean }) {
  if (history) {
    return (
      <div className="section-grid gap-5">
        <SectionHeading
          eyebrow="Kitchen history"
          title="Historial de cocina"
          description="Resumen limpio para validar tiempos, productos despachados y cierres del turno."
        />
        <div className="grid gap-4 xl:grid-cols-2">
          {demoHistoryOrders.map((order) => (
            <Card key={order.id} className="rounded-[28px] bg-white p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-[var(--color-muted)]">{order.table}</p>
                  <h3 className="text-xl font-semibold text-[var(--color-ink)]">{order.customerName}</h3>
                </div>
                <StatusBadge status={order.status} label={order.shortStatus} />
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
      <SectionHeading
        eyebrow="Kitchen board"
        title="Pedidos de cocina"
        description="Pensado para tablet y laptop, con tarjetas grandes, pocos clics y lectura inmediata del estado."
      />
      <div className="grid gap-4 xl:grid-cols-3">
        {columns.map((column) => (
          <div key={column.key} className="section-grid gap-4">
            <div className="rounded-[24px] bg-white px-4 py-3 shadow-[var(--shadow-card)]">
              <h3 className="text-lg font-semibold text-[var(--color-ink)]">{column.label}</h3>
            </div>
            {demoOrders
              .filter((order) => order.status === column.key)
              .map((order) => (
                <Card key={order.id} className="rounded-[28px] bg-white p-5 shadow-[var(--shadow-card)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-[var(--color-muted)]">{order.table}</p>
                      <h4 className="text-2xl font-semibold text-[var(--color-ink)]">{order.customerName}</h4>
                      <p className="text-sm text-[var(--color-muted)]">{formatDateTime(order.createdAt)}</p>
                    </div>
                    <StatusBadge status={order.status} label={order.shortStatus} />
                  </div>
                  <div className="mt-4 grid gap-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="rounded-[20px] bg-[var(--color-surface)] p-4">
                        <p className="font-semibold text-[var(--color-ink)]">
                          {item.quantity} x {item.productName}
                        </p>
                        {item.notes ? <p className="mt-1 text-sm text-[var(--color-muted)]">{item.notes}</p> : null}
                        <Button variant="ghost" className="mt-3 w-full">
                          Marcar item listo
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-2">
                    <Button variant="secondary">Pasar a preparando</Button>
                    <Button>Marcar pedido listo</Button>
                  </div>
                </Card>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
