"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Clock3, Plus, ShoppingBag, Star } from "lucide-react";
import {
  demoAddons,
  demoMenuTabs,
  demoPublicTableSession,
  demoPublicTableSessionEmpty,
  demoPublicTableSessionFull,
  demoProducts,
} from "@/shared/mock/starcafe-demo";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { ProductVisual } from "@/shared/components/ui/product-visual";
import { StatusBadge } from "@/shared/components/ui/status-badge";
import { formatCurrency } from "@/shared/utils/format";

interface CartLine {
  id: number;
  productId: number;
  quantity: number;
  addons: number[];
  note: string;
}

export function PublicOrderingScreen({ qrToken }: { qrToken: string }) {
  const [activeTab, setActiveTab] = useState("Todos");
  const [selectedId, setSelectedId] = useState(demoProducts[0]?.id ?? 1);
  const [lineCounter, setLineCounter] = useState(3);
  const [productNoteDraft, setProductNoteDraft] = useState("Sin azucar");
  const [selectedAddonIds, setSelectedAddonIds] = useState<number[]>([1]);
  const [cartLines, setCartLines] = useState<CartLine[]>([
    {
      id: 1,
      productId: 1,
      quantity: 1,
      addons: [1],
      note: "Sin azucar",
    },
    {
      id: 2,
      productId: 2,
      quantity: 1,
      addons: [3],
      note: "",
    },
  ]);

  const session =
    qrToken === "0e6cfdb3-5e88-4b8a-bd4d-2a787db16a10"
      ? demoPublicTableSessionFull
      : qrToken === "demo-qr-token"
        ? demoPublicTableSessionEmpty
        : demoPublicTableSession;

  const table = session.table;
  const selectedProduct =
    demoProducts.find((item) => item.id === selectedId) ?? demoProducts[0];

  const availableAddons = demoAddons.filter((addon) => {
    if (selectedProduct.category === "Cafes") {
      return addon.appliesTo === "Cafes";
    }

    if (selectedProduct.category === "Frappes") {
      return addon.appliesTo === "Frappes";
    }

    if (selectedProduct.category === "Sandwiches") {
      return addon.appliesTo === "Sandwiches";
    }

    return false;
  });

  const selectedAddons = demoAddons.filter((addon) =>
    selectedAddonIds.includes(addon.id),
  );

  const filteredProducts =
    activeTab === "Todos"
      ? demoProducts
      : demoProducts.filter((product) => product.category === activeTab);

  const cartItems = useMemo(
    () =>
      cartLines.map((line) => {
        const product =
          demoProducts.find((item) => item.id === line.productId) ?? demoProducts[0];
        const addons = demoAddons.filter((addon) => line.addons.includes(addon.id));
        const addonTotal = addons.reduce((sum, addon) => sum + addon.price, 0);

        return {
          ...line,
          product,
          addons,
          lineTotal: (product.price + addonTotal) * line.quantity,
        };
      }),
    [cartLines],
  );

  const total = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);

  function selectProduct(productId: number) {
    setSelectedId(productId);

    const defaults = demoAddons
      .filter((addon) => {
        const product =
          demoProducts.find((item) => item.id === productId) ?? demoProducts[0];

        if (product.category === "Cafes") {
          return addon.appliesTo === "Cafes";
        }

        if (product.category === "Frappes") {
          return addon.appliesTo === "Frappes";
        }

        if (product.category === "Sandwiches") {
          return addon.appliesTo === "Sandwiches";
        }

        return false;
      })
      .slice(0, productId === 1 ? 1 : 0)
      .map((addon) => addon.id);

    setSelectedAddonIds(defaults);
    setProductNoteDraft(productId === 1 ? "Sin azucar" : "");
  }

  function toggleAddon(addonId: number) {
    setSelectedAddonIds((current) =>
      current.includes(addonId)
        ? current.filter((id) => id !== addonId)
        : [...current, addonId],
    );
  }

  function addSelectedProductToCart() {
    setCartLines((current) => [
      ...current,
      {
        id: lineCounter,
        productId: selectedProduct.id,
        quantity: 1,
        addons: selectedAddonIds,
        note: productNoteDraft.trim(),
      },
    ]);
    setLineCounter((current) => current + 1);
  }

  const selectedPrice =
    selectedProduct.price +
    selectedAddons.reduce((sum, addon) => sum + addon.price, 0);

  return (
    <main className="min-h-screen bg-[var(--color-background)] px-3 py-4 text-white sm:px-4 sm:py-5">
      <div className="mx-auto grid w-full max-w-7xl gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="section-grid gap-5">
          <div className="dark-panel rounded-[26px] border border-white/10 p-4 sm:rounded-[34px] sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 sm:h-11 sm:w-11">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                  <p className="text-sm text-white/60">Mesa {table.tableNumber}</p>
                  <h1 className="text-2xl font-semibold sm:text-3xl">Bienvenido a StarCafe</h1>
                </div>
              </div>

              <div className="flex w-full items-center gap-2 rounded-2xl bg-white/8 px-4 py-3 text-sm text-white/70 sm:w-auto">
                <Clock3 className="h-4 w-4" />
                Cupos restantes: {session.remainingSlots}
              </div>
            </div>

            <div className="mt-4 rounded-[24px] bg-white/6 px-4 py-3 text-sm text-white/75">
              {session.canCreateMoreOrders
                ? session.activeOrdersCount > 0
                  ? "Tienes pedidos en curso. Puedes seguir agregando productos."
                  : "Empieza tu pedido desde esta mesa."
                : "Esta mesa ya alcanzo el maximo de pedidos activos."}
            </div>

            <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
              {demoMenuTabs.map((tab) => (
                <button
                  key={tab}
                  className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-white/8 text-white/70"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <Input
                className="border-white/10 bg-[var(--color-surface)] text-[var(--color-ink)] placeholder:text-[var(--color-muted)]"
                placeholder="Buscar producto..."
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="rounded-[30px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-[var(--color-ink)] shadow-none"
              >
                <ProductVisual accent={product.accent} category={product.category} />

                <div className="mt-4 grid gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold sm:text-xl">{product.name}</p>
                      <p className="text-sm text-[var(--color-muted)]">
                        {product.description}
                      </p>
                    </div>

                    <StatusBadge
                      status={product.available ? "AVAILABLE" : "UNAVAILABLE"}
                      label={product.available ? "Disponible" : "Agotado"}
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold">
                        {formatCurrency(product.price)}
                      </p>
                      <p className="text-xs text-[var(--color-muted)]">
                        {product.category}
                      </p>
                    </div>

                    <Button
                      disabled={!product.available}
                      onClick={() => selectProduct(product.id)}
                      type="button"
                    >
                      <Plus className="h-4 w-4" />
                      Ver mas
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <Card className="rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-[var(--color-ink)] shadow-none sm:rounded-[32px] sm:p-5">
              <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[260px_minmax(0,1fr)]">
                <ProductVisual
                  accent={selectedProduct.accent}
                  category={selectedProduct.category}
                  className="min-h-[220px] md:min-h-[320px]"
                />

                <div className="grid gap-4">
                  <div className="flex items-center gap-2 text-[var(--color-accent)]">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">Favorito del dia</span>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold sm:text-3xl">{selectedProduct.name}</h2>
                    <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--color-muted)]">
                      {selectedProduct.description}
                    </p>
                  </div>

                  <div className="grid gap-2 text-sm text-[var(--color-muted)] sm:grid-cols-3">
                    {[
                      "Grande · +S/1.50",
                      "Mediano · base",
                      "Pequeno · -S/1.50",
                    ].map((size) => (
                      <div
                        key={size}
                        className="rounded-2xl bg-[var(--color-surface-strong)] px-4 py-3"
                      >
                        {size}
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-2 text-sm text-[var(--color-muted)]">
                    <p>Extras disponibles</p>
                    <div className="flex flex-wrap gap-2">
                      {availableAddons.length ? (
                        availableAddons.map((addon) => (
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
                          Este producto no tiene extras por ahora
                        </span>
                      )}
                    </div>
                  </div>

                  <label className="grid gap-2 text-sm text-[var(--color-muted)]">
                    <span>Nota para tu pedido</span>
                    <textarea
                      className="min-h-24 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
                      onChange={(event) => setProductNoteDraft(event.target.value)}
                      placeholder="Ej. Sin azucar, sin hielo, bien caliente..."
                      value={productNoteDraft}
                    />
                  </label>

                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] bg-[var(--color-surface-strong)] px-4 py-4">
                    <div>
                      <p className="text-sm text-[var(--color-muted)]">
                        Precio final
                      </p>
                      <p className="text-2xl font-semibold">
                        {formatCurrency(selectedPrice)}
                      </p>
                    </div>
                    <Button onClick={addSelectedProductToCart} type="button">
                      Agregar al pedido
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-[var(--color-ink)] shadow-none sm:rounded-[32px] sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Estado de tus pedidos</h3>
                  <p className="text-sm text-[var(--color-muted)]">
                    Recibido, preparando y listo sin preguntar.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {session.activeOrders.length ? (
                  session.activeOrders.map((order) => (
                    <div key={order.id} className="rounded-[22px] bg-white p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold">#{order.id}</p>
                          <p className="text-sm text-[var(--color-muted)]">
                            {order.items[0]?.productName}
                          </p>
                        </div>
                        <StatusBadge
                          label={order.shortStatus}
                          status={order.status}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[22px] bg-white p-4 text-sm text-[var(--color-muted)]">
                    Aun no hay pedidos activos para esta mesa.
                  </div>
                )}
              </div>
            </Card>
          </div>
        </section>

        <aside className="dark-panel h-fit rounded-[26px] border border-white/10 p-4 sm:rounded-[34px] sm:p-5 xl:sticky xl:top-5">
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-white/60">Tu pedido</p>
              <h2 className="text-2xl font-semibold">Resumen rapido</h2>
            </div>

            <label className="grid gap-2">
              <span className="text-sm text-white/70">Nombre del cliente</span>
              <Input
                className="border-white/10 bg-[var(--color-surface)] text-[var(--color-ink)] placeholder:text-[var(--color-muted)]"
                placeholder="Ej. Andrea"
              />
            </label>

            <div className="grid gap-3">
              {cartItems.map(({ id, product, quantity, addons, note, lineTotal }) => (
                <div key={id} className="rounded-[22px] bg-white/6 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-white/60">Cantidad: {quantity}</p>
                      {addons.length ? (
                        <p className="mt-1 text-sm text-white/60">
                          Extras: {addons.map((addon) => addon.name).join(", ")}
                        </p>
                      ) : null}
                      {note ? (
                        <p className="mt-1 text-sm text-white/75">Nota: {note}</p>
                      ) : null}
                    </div>
                    <span className="shrink-0 font-semibold">
                      {formatCurrency(lineTotal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[24px] bg-white/6 p-4">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-white/70">
                <span>Servicio</span>
                <span>{formatCurrency(total * 0.1)}</span>
              </div>
              <div className="mt-4 flex items-center justify-between text-xl font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total * 1.1)}</span>
              </div>
            </div>

            <Button className="w-full">Enviar pedido</Button>
          </div>
        </aside>
      </div>
    </main>
  );
}
