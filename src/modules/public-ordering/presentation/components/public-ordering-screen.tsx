"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createPublicOrderUseCase,
  getPublicMenuUseCase,
  getPublicTableSessionUseCase,
} from "@/modules/public-ordering/application/public-ordering.use-cases";
import { publicOrderSchema, type PublicOrderFormValues } from "@/modules/public-ordering/application/public-order.schema";
import { publicOrderingRepository } from "@/modules/public-ordering/infrastructure/public-ordering.repository.impl";
import type { PublicMenuCategory, PublicMenuProduct, PublicTableSession } from "@/modules/public-ordering/domain/public-ordering.types";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Input } from "@/shared/components/ui/input";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { usePolling } from "@/shared/hooks/use-polling";
import { formatCurrency, formatDateTime } from "@/shared/utils/format";

interface CartItem {
  product: PublicMenuProduct;
  quantity: number;
}

export function PublicOrderingScreen({ qrToken }: { qrToken: string }) {
  const [session, setSession] = useState<PublicTableSession | null>(null);
  const [menu, setMenu] = useState<PublicMenuCategory[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<PublicOrderFormValues>({
    resolver: zodResolver(publicOrderSchema),
    defaultValues: { customerName: "" },
  });

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart],
  );

  async function loadSession(showLoading = false) {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const nextSession = await getPublicTableSessionUseCase(publicOrderingRepository, qrToken);
      setSession(nextSession);
      setError(nextSession.isActive ? null : "Esta mesa ya no esta disponible");
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "No se pudo abrir la sesion de mesa";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function loadMenu() {
    try {
      const nextMenu = await getPublicMenuUseCase(publicOrderingRepository);
      setMenu(nextMenu);
    } catch (loadError) {
      toast.error(loadError instanceof Error ? loadError.message : "No se pudo cargar el menu");
    }
  }

  useEffect(() => {
    void Promise.all([loadSession(true), loadMenu()]);
  }, [qrToken]);

  usePolling(() => loadSession(), 3000, true);

  function addToCart(product: PublicMenuProduct) {
    setCart((current) => {
      const found = current.find((item) => item.product.id === product.id);

      if (found) {
        return current.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...current, { product, quantity: 1 }];
    });
  }

  const onSubmit = form.handleSubmit(async (values) => {
    if (!session) {
      return;
    }

    if (cart.length === 0) {
      toast.error("Agrega al menos un producto");
      return;
    }

    if (!session.canCreateMoreOrders) {
      toast.error("Esta mesa ya no puede crear mas pedidos por ahora");
      return;
    }

    try {
      await createPublicOrderUseCase(publicOrderingRepository, qrToken, {
        customerName: values.customerName,
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });
      toast.success("Pedido enviado");
      setCart([]);
      form.reset();
      await loadSession();
    } catch (submitError) {
      toast.error(submitError instanceof Error ? submitError.message : "No se pudo crear el pedido");
    }
  });

  if (loading) {
    return (
      <main className="page-shell py-8">
        <EmptyState title="Cargando mesa" description="Preparando el menu y la sesion de pedidos." />
      </main>
    );
  }

  if (error || !session || !session.isActive) {
    return (
      <main className="page-shell py-8">
        <EmptyState
          title="Mesa no disponible"
          description={error ?? "Este QR ya no tiene una mesa activa asociada."}
        />
      </main>
    );
  }

  return (
    <main className="page-shell py-6 section-grid gap-6">
      <SectionHeading
        eyebrow="Public ordering bounded context"
        title={`Mesa ${session.tableNumber}`}
        description="Experiencia publica, mobile-first y sin autenticacion. El QR solo representa a la mesa."
      />

      <Card className="section-grid gap-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Estado de la sesion</h2>
            <p className="text-sm text-[var(--color-muted)]">
              Pedidos activos: {session.activeOrderCount} · Cupos restantes: {session.remainingSlots}
            </p>
          </div>
          <Badge tone={session.canCreateMoreOrders ? "success" : "warning"}>
            {session.canCreateMoreOrders ? "Puede pedir" : "Sin cupo"}
          </Badge>
        </div>

        {session.activeOrders.length > 0 ? (
          <div className="grid gap-3">
            {session.activeOrders.map((order) => (
              <div key={order.id} className="rounded-[22px] bg-white/80 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-lg font-semibold">Pedido #{order.id}</p>
                    <p className="text-sm text-[var(--color-muted)]">{formatDateTime(order.createdAt)}</p>
                  </div>
                  <Badge tone={order.status === "READY" ? "success" : "warning"}>{order.status}</Badge>
                </div>
                <div className="mt-3 grid gap-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-[var(--color-surface-strong)] p-3 text-sm">
                      <p className="font-semibold">
                        {item.quantity} x {item.productName}
                      </p>
                      <p className="text-[var(--color-muted)]">{item.status}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--color-muted)]">Todavia no hay pedidos activos en esta mesa.</p>
        )}
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="section-grid gap-4">
          {menu.length === 0 ? (
            <EmptyState title="Menu vacio" description="El backend todavia no devolvio productos publicos." />
          ) : (
            menu.map((category) => (
              <section key={category.id} className="section-grid gap-3">
                <h2 className="text-xl font-semibold">{category.name}</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {category.products.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="relative h-48 bg-[var(--color-surface-strong)]">
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-[var(--color-muted)]">
                            Imagen no disponible
                          </div>
                        )}
                      </div>
                      <div className="section-grid gap-3 p-5">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <Badge tone={product.isAvailable ? "success" : "danger"}>
                              {product.isAvailable ? "Disponible" : "Agotado"}
                            </Badge>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{product.description}</p>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-lg font-semibold">{formatCurrency(product.price)}</span>
                          <Button disabled={!product.isAvailable} onClick={() => addToCart(product)}>
                            Agregar
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>

        <Card className="h-fit p-5">
          <form className="section-grid gap-4" onSubmit={onSubmit}>
            <div className="section-grid gap-1">
              <h2 className="text-xl font-semibold">Tu pedido</h2>
              <p className="text-sm text-[var(--color-muted)]">
                Proceso rapido para cliente QR sin cuenta ni login.
              </p>
            </div>
            <label className="section-grid gap-2">
              <span className="text-sm font-medium">Tu nombre</span>
              <Input placeholder="Ej. Andrea" {...form.register("customerName")} />
              {form.formState.errors.customerName ? (
                <span className="text-sm text-[var(--color-danger)]">
                  {form.formState.errors.customerName.message}
                </span>
              ) : null}
            </label>

            <div className="section-grid gap-2">
              {cart.length === 0 ? (
                <div className="rounded-2xl bg-white/80 p-4 text-sm text-[var(--color-muted)]">
                  Aun no agregaste productos.
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="rounded-2xl bg-white/80 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-sm text-[var(--color-muted)]">Cantidad: {item.quantity}</p>
                      </div>
                      <span className="font-semibold">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between text-sm font-semibold">
              <span>Total</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>

            <Button disabled={form.formState.isSubmitting || cart.length === 0 || !session.canCreateMoreOrders} type="submit">
              Enviar pedido
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
