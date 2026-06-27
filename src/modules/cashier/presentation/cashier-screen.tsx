import { CreditCard, ReceiptText, Search } from "lucide-react";
import { demoCashierResults } from "@/shared/mock/starcafe-demo";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { DemoTable } from "@/shared/components/ui/demo-table";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { StatusBadge } from "@/shared/components/ui/status-badge";

export function CashierScreen() {
  return (
    <div className="section-grid gap-5">
      <SectionHeading
        eyebrow="Cashier"
        title="Caja y cobro de pedidos"
        description="Interfaz inspirada en POS moderno para buscar pedidos, revisar resumen y marcar pagos."
      />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="section-grid gap-5">
          <Card className="rounded-[28px] bg-white p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-muted)]">
              <Search className="h-4 w-4" />
              Buscar por nombre, mesa o estado...
            </div>
          </Card>
          <DemoTable
            headers={["Pedido", "Mesa", "Cliente", "Estado", "Total"]}
            rows={demoCashierResults.map((item) => [
              `#${item.id}`,
              item.table,
              item.customer,
              <StatusBadge key={`${item.id}-status`} status={item.status} />,
              item.total,
            ])}
          />
        </div>
        <Card className="rounded-[30px] bg-white p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-ink)]">Pago actual</h3>
              <p className="text-sm text-[var(--color-muted)]">Mesa 1 · Andrea</p>
            </div>
          </div>
          <div className="mt-5 rounded-[24px] bg-[var(--color-surface)] p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-muted)]">Subtotal</span>
              <span className="font-semibold text-[var(--color-ink)]">$35.00</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-[var(--color-muted)]">Servicio</span>
              <span className="font-semibold text-[var(--color-ink)]">$3.50</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-xl font-semibold text-[var(--color-ink)]">
              <span>Total</span>
              <span>$38.50</span>
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            <Button><ReceiptText className="h-4 w-4" />Marcar como pagado</Button>
            <Button variant="ghost">Imprimir comprobante</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
