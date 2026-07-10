"use client";

import { useEffect, useState } from "react";
import { CreditCard, Search } from "lucide-react";
import { payCashierOrderUseCase, searchCashierOrdersUseCase } from "@/modules/cashier/application/use-cases/cashier.use-cases";
import type { CashierSearchFilters } from "@/modules/cashier/domain/cashier.entity";
import { cashierRepository } from "@/modules/cashier/infrastructure/repositories/cashier-http.repository";
import type { OrderEntity } from "@/modules/orders/domain/order.entity";
import { useAuthGuard } from "@/modules/auth/presentation/hooks/use-auth-guard";
import { HttpError } from "@/shared/lib/api/http-client";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { DemoTable } from "@/shared/components/ui/demo-table";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Input } from "@/shared/components/ui/input";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { Spinner } from "@/shared/components/ui/spinner";
import { StatusBadge } from "@/shared/components/ui/status-badge";
import { formatCurrency } from "@/shared/utils/format";
import { toast } from "sonner";

const initialFilters: CashierSearchFilters = {
  customerName: "",
  tableNumber: undefined,
  status: "",
};

export function CashierScreen() {
  const auth = useAuthGuard("ADMIN");
  const [filters, setFilters] = useState<CashierSearchFilters>(initialFilters);
  const [orders, setOrders] = useState<OrderEntity[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  async function loadOrders(token: string, nextFilters: CashierSearchFilters) {
    setLoading(true);

    try {
      setOrders(await searchCashierOrdersUseCase(cashierRepository, token, nextFilters));
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudo cargar la caja.";
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
      void loadOrders(token, initialFilters);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [auth]);

  if (!auth) {
    return null;
  }

  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? orders[0] ?? null;

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadOrders(auth.token, filters);
  }

  async function handlePay() {
    if (!selectedOrder) {
      return;
    }

    setPaying(true);

    try {
      await payCashierOrderUseCase(cashierRepository, auth.token, selectedOrder.id);
      toast.success("Pedido cobrado");
      await loadOrders(auth.token, filters);
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudo cobrar el pedido.";
      toast.error(message);
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="section-grid gap-5">
      <SectionHeading
        eyebrow="Cashier"
        title="Caja y cobro de pedidos"
        description="Busca pedidos por cliente, mesa o estado y ejecuta el cobro sin enviar monto manual."
      />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="section-grid gap-5">
          <Card className="rounded-[24px] bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[28px]">
            <form className="grid gap-3 md:grid-cols-4" onSubmit={handleSearch}>
              <Input
                placeholder="Cliente"
                value={filters.customerName ?? ""}
                onChange={(event) => setFilters((current) => ({ ...current, customerName: event.target.value }))}
              />
              <Input
                placeholder="Mesa"
                type="number"
                value={filters.tableNumber ?? ""}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    tableNumber: event.target.value ? Number(event.target.value) : undefined,
                  }))
                }
              />
              <select
                className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-ink)]"
                value={filters.status ?? ""}
                onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
              >
                <option value="">Todos los estados</option>
                <option value="PENDING">PENDING</option>
                <option value="PREPARING">PREPARING</option>
                <option value="READY">READY</option>
                <option value="PAID">PAID</option>
              </select>
              <Button type="submit">
                <Search className="h-4 w-4" />
                Buscar
              </Button>
            </form>
          </Card>

          {loading ? (
            <Card className="flex items-center gap-3 rounded-[24px] bg-white p-5">
              <Spinner />
              <span>Buscando pedidos...</span>
            </Card>
          ) : orders.length ? (
            <DemoTable
              headers={["Pedido", "Mesa", "Cliente", "Estado", "Total"]}
              rows={orders.map((item) => [
                <button
                  key={`${item.id}-link`}
                  className="font-semibold text-left underline-offset-2 hover:underline"
                  onClick={() => setSelectedOrderId(item.id)}
                  type="button"
                >
                  #{item.id}
                </button>,
                `Mesa ${item.tableNumber}`,
                item.customerName,
                <StatusBadge key={`${item.id}-status`} status={item.status as "PENDING"} />,
                formatCurrency(item.total),
              ])}
            />
          ) : (
            <EmptyState title="No hay resultados" description="Ajusta los filtros y vuelve a consultar." />
          )}
        </div>

        <Card className="rounded-[24px] bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[30px] sm:p-5 xl:sticky xl:top-5">
          {selectedOrder ? (
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--color-ink)]">Pago actual</h3>
                  <p className="text-sm text-[var(--color-muted)]">
                    Mesa {selectedOrder.tableNumber} · {selectedOrder.customerName}
                  </p>
                </div>
              </div>
              <div className="mt-5 rounded-[24px] bg-[var(--color-surface)] p-4">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="mb-3 last:mb-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--color-muted)]">
                        {item.quantity} x {item.productName}
                      </span>
                      <span className="font-semibold text-[var(--color-ink)]">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                    {item.addons?.length ? (
                      <p className="text-xs text-[var(--color-muted)]">
                        Extras: {item.addons.map((addon) => addon.name).join(", ")}
                      </p>
                    ) : null}
                  </div>
                ))}
                <div className="mt-4 flex items-center justify-between text-xl font-semibold text-[var(--color-ink)]">
                  <span>Total</span>
                  <span>{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
              <div className="mt-4 grid gap-2">
                <Button disabled={paying || selectedOrder.status === "PAID"} onClick={handlePay} type="button">
                  {paying ? <Spinner /> : null}
                  Marcar como pagado
                </Button>
              </div>
            </>
          ) : (
            <EmptyState title="Selecciona un pedido" description="El detalle de cobro aparecerá aquí." />
          )}
        </Card>
      </div>
    </div>
  );
}
