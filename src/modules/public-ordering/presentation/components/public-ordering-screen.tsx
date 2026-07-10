"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3, ShoppingBag } from "lucide-react";
import { createPublicOrderUseCase, getPublicOrderStatusUseCase, getPublicTableSessionUseCase } from "@/modules/public-ordering/application/use-cases/public-ordering.use-cases";
import { publicOrderingRepository } from "@/modules/public-ordering/infrastructure/repositories/public-ordering-http.repository";
import type { PublicTableSession } from "@/modules/public-ordering/domain/public-ordering.entity";
import { listPublicMenuUseCase } from "@/modules/menu/application/use-cases/menu.use-cases";
import type { MenuCategoryEntity } from "@/modules/menu/domain/menu.entity";
import { menuRepository } from "@/modules/menu/infrastructure/repositories/menu-http.repository";
import type { OrderEntity } from "@/modules/orders/domain/order.entity";
import { usePolling } from "@/shared/hooks/use-polling";
import { HttpError } from "@/shared/lib/api/http-client";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Input } from "@/shared/components/ui/input";
import { Spinner } from "@/shared/components/ui/spinner";
import { StatusBadge } from "@/shared/components/ui/status-badge";
import { formatCurrency } from "@/shared/utils/format";
import { toast } from "sonner";

interface CartLine {
  productId: number;
  quantity: number;
  note: string;
  addonIds: number[];
}

export function PublicOrderingScreen({ qrToken }: { qrToken: string }) {
  const [session, setSession] = useState<PublicTableSession | null>(null);
  const [menu, setMenu] = useState<MenuCategoryEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedAddonIds, setSelectedAddonIds] = useState<number[]>([]);
  const [note, setNote] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [creating, setCreating] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderEntity | null>(null);

  async function loadSessionAndMenu() {
    setLoading(true);

    try {
      const nextSession = await getPublicTableSessionUseCase(publicOrderingRepository, qrToken);
      setSession(nextSession);
      const categories = await listPublicMenuUseCase(menuRepository, nextSession.businessSlug);
      setMenu(categories);
      setSelectedProductId((current) => current ?? categories[0]?.products[0]?.id ?? null);
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudo cargar la mesa pública.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSessionAndMenu();
  }, [qrToken]);

  const selectedProduct = useMemo(() => {
    if (!selectedProductId) {
      return null;
    }

    for (const category of menu) {
      const product = category.products.find((item) => item.id === selectedProductId);

      if (product) {
        return product;
      }
    }

    return null;
  }, [menu, selectedProductId]);

  const cartSummary = useMemo(
    () =>
      cart.map((line) => {
        const product = menu.flatMap((category) => category.products).find((item) => item.id === line.productId);

        if (!product) {
          return null;
        }

        const addons = product.addons.filter((addon) => line.addonIds.includes(addon.id));
        const lineTotal = (product.price + addons.reduce((sum, addon) => sum + addon.price, 0)) * line.quantity;

        return {
          ...line,
          product,
          addons,
          lineTotal,
        };
      }).filter((item): item is NonNullable<typeof item> => item !== null),
    [cart, menu],
  );

  const total = cartSummary.reduce((sum, item) => sum + item.lineTotal, 0);

  usePolling(
    async () => {
      if (!createdOrderId) {
        return;
      }

      try {
        setOrderStatus(await getPublicOrderStatusUseCase(publicOrderingRepository, createdOrderId, qrToken));
      } catch (error) {
        const message = error instanceof HttpError ? error.message : "No se pudo consultar el estado del pedido.";
        toast.error(message);
      }
    },
    8000,
    Boolean(createdOrderId),
  );

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-[var(--color-ink)] shadow-[var(--shadow-card)]">
          <Spinner />
          <span>Cargando mesa...</span>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="page-shell py-8">
        <EmptyState title="Mesa no disponible" description="No fue posible obtener la sesión pública para este QR." />
      </main>
    );
  }

  if (!selectedProduct) {
    return (
      <main className="page-shell py-8">
        <EmptyState title="Menú no disponible" description="No hay productos públicos para esta cafetería todavía." />
      </main>
    );
  }

  function toggleAddon(addonId: number) {
    setSelectedAddonIds((current) =>
      current.includes(addonId)
        ? current.filter((id) => id !== addonId)
        : [...current, addonId],
    );
  }

  function addSelectedProductToCart() {
    setCart((current) => [
      ...current,
      {
        productId: selectedProduct.id,
        quantity: 1,
        note: note.trim(),
        addonIds: selectedAddonIds,
      },
    ]);
    setSelectedAddonIds([]);
    setNote("");
  }

  async function handleCreateOrder() {
    if (!session.canCreateMoreOrders) {
      toast.error("Esta mesa ya alcanzó su límite de pedidos activos.");
      return;
    }

    if (!customerName.trim()) {
      toast.error("Ingresa el nombre del cliente.");
      return;
    }

    if (!cart.length) {
      toast.error("Agrega al menos un producto.");
      return;
    }

    setCreating(true);

    try {
      const order = await createPublicOrderUseCase(publicOrderingRepository, qrToken, {
        customerName: customerName.trim(),
        items: cart.map((line) => ({
          productId: line.productId,
          quantity: line.quantity,
          notes: line.note,
          addonIds: line.addonIds,
        })),
      });

      setCreatedOrderId(order.id);
      setOrderStatus(order);
      setCart([]);
      toast.success("Pedido enviado");
      await loadSessionAndMenu();
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudo crear el pedido.";
      toast.error(message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--color-background)] px-2 py-2 text-white sm:px-4 sm:py-5">
      <div className="app-shell-mobile mx-auto grid w-full min-w-0 gap-4 sm:gap-5 xl:max-w-7xl xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="section-grid min-w-0 gap-5">
          <div className="dark-panel w-full max-w-full overflow-hidden rounded-[28px] border border-white/10 p-4 sm:rounded-[34px] sm:p-5">
            <div className="flex flex-col gap-4">
              <div className="min-w-0">
                <p className="text-sm text-white/60">Mesa {session.tableNumber}</p>
                <h1 className="text-[1.8rem] leading-tight font-semibold break-words sm:text-3xl">
                  {session.businessName}
                </h1>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white/8 px-4 py-3 text-sm text-white/70">
                <Clock3 className="h-4 w-4" />
                Cupos restantes: {session.remainingSlots}
              </div>
            </div>
            <div className="mt-4 rounded-[24px] bg-white/6 px-4 py-3 text-sm text-white/75">
              {session.canCreateMoreOrders
                ? `Pedidos activos: ${session.activeOrderCount}. Puedes seguir ordenando desde esta mesa.`
                : "Esta mesa ya alcanzó el máximo de pedidos activos."}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-[280px_minmax(0,1fr)]">
            <Card className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-[var(--color-ink)] shadow-none">
              <h2 className="text-xl font-semibold">Menú</h2>
              <div className="mt-4 grid gap-2">
                {menu.map((category) => (
                  <div key={category.id} className="rounded-2xl bg-white p-3">
                    <p className="text-sm font-semibold text-[var(--color-muted)]">{category.name}</p>
                    <div className="mt-2 grid gap-2">
                      {category.products.map((product) => (
                        <button
                          key={product.id}
                          className={`rounded-2xl border px-3 py-3 text-left ${
                            selectedProductId === product.id
                              ? "border-[var(--color-primary)] bg-[var(--color-primary)]/8"
                              : "border-[var(--color-border)]"
                          }`}
                          disabled={!product.isAvailable}
                          onClick={() => setSelectedProductId(product.id)}
                          type="button"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold">{product.name}</p>
                              <p className="text-sm text-[var(--color-muted)]">{product.description}</p>
                            </div>
                            <StatusBadge
                              status={product.isAvailable ? "AVAILABLE" : "UNAVAILABLE"}
                              label={product.isAvailable ? "Disponible" : "Agotado"}
                            />
                          </div>
                          <p className="mt-2 text-sm font-semibold">{formatCurrency(product.price)}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-[var(--color-ink)] shadow-none sm:p-5">
              <div className="grid gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">{selectedProduct.name}</h2>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{selectedProduct.description}</p>
                </div>
                <p className="text-2xl font-semibold">{formatCurrency(selectedProduct.price)}</p>
                <div className="grid gap-2">
                  <p className="text-sm text-[var(--color-muted)]">Extras disponibles</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.addons.length ? (
                      selectedProduct.addons.map((addon) => (
                        <button
                          key={addon.id}
                          className={`rounded-full border px-3 py-2 transition ${
                            selectedAddonIds.includes(addon.id)
                              ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                              : "border-[var(--color-border)] bg-white text-[var(--color-ink)]"
                          }`}
                          onClick={() => toggleAddon(addon.id)}
                          type="button"
                        >
                          {addon.name} +{formatCurrency(addon.price)}
                        </button>
                      ))
                    ) : (
                      <span className="rounded-full border border-[var(--color-border)] bg-white px-3 py-2 text-[var(--color-muted)]">
                        Este producto no tiene extras
                      </span>
                    )}
                  </div>
                </div>
                <label className="grid gap-2 text-sm text-[var(--color-muted)]">
                  <span>Nota para tu pedido</span>
                  <textarea
                    className="min-h-24 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Ej. Sin azúcar, sin hielo..."
                    value={note}
                  />
                </label>
                <Button disabled={!selectedProduct.isAvailable} onClick={addSelectedProductToCart} type="button">
                  Agregar al pedido
                </Button>
              </div>
            </Card>
          </div>

          <Card className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-[var(--color-ink)] shadow-none">
            <h3 className="text-xl font-semibold">Pedidos activos de la mesa</h3>
            <div className="mt-4 grid gap-3">
              {session.activeOrders.length ? (
                session.activeOrders.map((order) => (
                  <div key={order.id} className="rounded-[22px] bg-white p-4">
                    <div className="grid gap-3 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold">#{order.id}</p>
                        <p className="text-sm text-[var(--color-muted)]">{order.customerName}</p>
                      </div>
                      <StatusBadge status={order.status as "PENDING"} />
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState title="Sin pedidos activos" description="Todavía no hay pedidos en curso para esta mesa." />
              )}
            </div>
          </Card>
        </section>

        <aside className="dark-panel h-fit min-w-0 w-full max-w-full overflow-hidden rounded-[28px] border border-white/10 p-4 sm:rounded-[34px] sm:p-5 xl:sticky xl:top-5">
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-white/60">Tu pedido</p>
              <h2 className="text-[1.8rem] font-semibold sm:text-2xl">Resumen rápido</h2>
            </div>

            <label className="grid gap-2">
              <span className="text-sm text-white/70">Nombre del cliente</span>
              <Input
                className="border-white/10 bg-[var(--color-surface)] text-[var(--color-ink)] placeholder:text-[var(--color-muted)]"
                placeholder="Ej. Andrea"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
              />
            </label>

            <div className="grid gap-3">
              {cartSummary.map(({ product, quantity, addons, note: lineNote, lineTotal }, index) => (
                <div key={`${product.id}-${index}`} className="rounded-[22px] bg-white/6 p-4">
                  <div className="grid gap-3 sm:flex sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-white/60">Cantidad: {quantity}</p>
                      {addons.length ? (
                        <p className="mt-1 text-sm text-white/60">
                          Extras: {addons.map((addon) => addon.name).join(", ")}
                        </p>
                      ) : null}
                      {lineNote ? <p className="mt-1 text-sm text-white/75">Nota: {lineNote}</p> : null}
                    </div>
                    <span className="shrink-0 font-semibold">{formatCurrency(lineTotal)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[24px] bg-white/6 p-4">
              <div className="flex items-center justify-between text-xl font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <Button className="w-full" disabled={creating || !session.canCreateMoreOrders} onClick={handleCreateOrder} type="button">
              {creating ? <Spinner /> : <ShoppingBag className="h-4 w-4" />}
              Enviar pedido
            </Button>

            {orderStatus ? (
              <div className="rounded-[24px] bg-white/6 p-4">
                <p className="text-sm text-white/60">Último pedido creado</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">#{orderStatus.id}</p>
                    <p className="text-sm text-white/70">{orderStatus.customerName}</p>
                  </div>
                  <StatusBadge status={orderStatus.status as "PENDING"} />
                </div>
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </main>
  );
}
