"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Clock3, Plus, ShoppingBag, Star } from "lucide-react";
import {
  demoMenuTabs,
  demoOrders,
  demoProducts,
  demoTables,
} from "@/shared/mock/starcafe-demo";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { ProductVisual } from "@/shared/components/ui/product-visual";
import { StatusBadge } from "@/shared/components/ui/status-badge";
import { formatCurrency } from "@/shared/utils/format";

export function PublicOrderingScreen({ qrToken }: { qrToken: string }) {
  const [activeTab, setActiveTab] = useState("Todos");
  const [selectedId, setSelectedId] = useState(demoProducts[0]?.id ?? 1);
  const [cart, setCart] = useState<Record<number, number>>({ 1: 2, 2: 1 });
  const table = demoTables.find((item) => item.qrToken === qrToken) ?? demoTables[0];
  const selectedProduct = demoProducts.find((item) => item.id === selectedId) ?? demoProducts[0];
  const filteredProducts = activeTab === "Todos"
    ? demoProducts
    : demoProducts.filter((product) => product.category === activeTab);

  const cartItems = useMemo(
    () => demoProducts.filter((product) => cart[product.id]).map((product) => ({ product, quantity: cart[product.id] })),
    [cart],
  );
  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <main className="min-h-screen bg-[var(--color-background)] px-4 py-5 text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="section-grid gap-5">
          <div className="dark-panel rounded-[34px] border border-white/10 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                  <p className="text-sm text-white/60">Mesa {table.tableNumber}</p>
                  <h1 className="text-3xl font-semibold">Bienvenido a StarCafe</h1>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white/8 px-4 py-3 text-sm text-white/70">
                <Clock3 className="h-4 w-4" />
                Cupos restantes: 2
              </div>
            </div>

            <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
              {demoMenuTabs.map((tab) => (
                <button
                  key={tab}
                  className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === tab ? "bg-[var(--color-primary)] text-white" : "bg-white/8 text-white/70"}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <Input className="border-white/10 bg-white/8 text-white placeholder:text-white/45" placeholder="Buscar producto..." />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="rounded-[30px] border border-white/8 bg-white/[0.03] p-4 text-white shadow-none">
                <ProductVisual accent={product.accent} category={product.category} />
                <div className="mt-4 grid gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xl font-semibold">{product.name}</p>
                      <p className="text-sm text-white/60">{product.description}</p>
                    </div>
                    <StatusBadge status={product.available ? "AVAILABLE" : "UNAVAILABLE"} label={product.available ? "Disponible" : "Agotado"} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold">{formatCurrency(product.price)}</p>
                      <p className="text-xs text-white/45">{product.category}</p>
                    </div>
                    <Button
                      disabled={!product.available}
                      onClick={() => {
                        setSelectedId(product.id);
                        setCart((current) => ({ ...current, [product.id]: (current[product.id] ?? 0) + 1 }));
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      Agregar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <Card className="rounded-[32px] border border-white/8 bg-white/[0.03] p-5 text-white shadow-none">
              <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
                <ProductVisual accent={selectedProduct.accent} category={selectedProduct.category} className="min-h-[320px]" />
                <div className="grid gap-4">
                  <div className="flex items-center gap-2 text-[var(--color-accent)]">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">Favorito del día</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-semibold">{selectedProduct.name}</h2>
                    <p className="mt-2 max-w-xl text-sm leading-7 text-white/65">{selectedProduct.description}</p>
                  </div>
                  <div className="grid gap-2 text-sm text-white/70 sm:grid-cols-3">
                    {["Grande · +S/1.50", "Mediano · base", "Pequeño · -S/1.50"].map((size) => (
                      <div key={size} className="rounded-2xl bg-white/6 px-4 py-3">{size}</div>
                    ))}
                  </div>
                  <div className="grid gap-2 text-sm text-white/70">
                    <p>Complementos sugeridos:</p>
                    <div className="flex flex-wrap gap-2">
                      {["Shot extra", "Leche vegetal", "Jarabe vainilla"].map((addon) => (
                        <span key={addon} className="rounded-full border border-white/10 px-3 py-2">{addon}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-[24px] bg-white/8 px-4 py-4">
                    <div>
                      <p className="text-sm text-white/60">Precio final</p>
                      <p className="text-2xl font-semibold">{formatCurrency(selectedProduct.price)}</p>
                    </div>
                    <Button>Agregar al pedido</Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="rounded-[32px] border border-white/8 bg-white/[0.03] p-5 text-white shadow-none">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary)]">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Estado de tus pedidos</h3>
                  <p className="text-sm text-white/60">Recibido, preparando y listo sin preguntar.</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                {demoOrders.slice(0, 2).map((order) => (
                  <div key={order.id} className="rounded-[22px] bg-white/6 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold">#{order.id}</p>
                        <p className="text-sm text-white/60">{order.items[0]?.productName}</p>
                      </div>
                      <StatusBadge status={order.status} label={order.shortStatus} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <aside className="dark-panel h-fit rounded-[34px] border border-white/10 p-5">
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-white/60">Tu pedido</p>
              <h2 className="text-2xl font-semibold">Resumen rápido</h2>
            </div>
            <label className="grid gap-2">
              <span className="text-sm text-white/70">Nombre del cliente</span>
              <Input className="border-white/10 bg-white/8 text-white placeholder:text-white/45" placeholder="Ej. Andrea" />
            </label>
            <div className="grid gap-3">
              {cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="rounded-[22px] bg-white/6 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-white/60">Cantidad: {quantity}</p>
                    </div>
                    <span className="font-semibold">{formatCurrency(product.price * quantity)}</span>
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
