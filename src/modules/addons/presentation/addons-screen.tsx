"use client";

import { useEffect, useState } from "react";
import { Link2, Plus } from "lucide-react";
import { assignAddonToProductUseCase, createAddonUseCase, listAddonsUseCase } from "@/modules/addons/application/use-cases/addons.use-cases";
import type { AddonEntity } from "@/modules/addons/domain/addon.entity";
import { addonsRepository } from "@/modules/addons/infrastructure/repositories/addons-http.repository";
import { listProductsUseCase } from "@/modules/products/application/use-cases/products.use-cases";
import type { ProductEntity } from "@/modules/products/domain/product.entity";
import { productsRepository } from "@/modules/products/infrastructure/repositories/products-http.repository";
import { useAuthGuard } from "@/modules/auth/presentation/hooks/use-auth-guard";
import { HttpError } from "@/shared/lib/api/http-client";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Input } from "@/shared/components/ui/input";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { Spinner } from "@/shared/components/ui/spinner";
import { StatusBadge } from "@/shared/components/ui/status-badge";
import { formatCurrency } from "@/shared/utils/format";
import { toast } from "sonner";

export function AddonsScreen() {
  const auth = useAuthGuard("ADMIN");
  const [addons, setAddons] = useState<AddonEntity[]>([]);
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("0");
  const [productId, setProductId] = useState("");
  const [addonId, setAddonId] = useState("");

  async function loadData(token: string) {
    setLoading(true);

    try {
      const [addonsData, productsData] = await Promise.all([
        listAddonsUseCase(addonsRepository, token),
        listProductsUseCase(productsRepository, token),
      ]);

      setAddons(addonsData);
      setProducts(productsData);
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudieron cargar los addons.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!auth) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadData(auth.token);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [auth]);

  if (!auth) {
    return null;
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const created = await createAddonUseCase(addonsRepository, auth.token, {
        name,
        price: Number(price),
      });

      setAddons((current) => [created, ...current]);
      setName("");
      setPrice("0");
      toast.success("Addon creado");
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudo crear el addon.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAssign(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!productId || !addonId) {
      toast.error("Selecciona producto y addon.");
      return;
    }

    setAssigning(true);

    try {
      await assignAddonToProductUseCase(addonsRepository, auth.token, Number(productId), Number(addonId));
      await loadData(auth.token);
      toast.success("Addon asignado al producto");
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudo asignar el addon.";
      toast.error(message);
    } finally {
      setAssigning(false);
    }
  }

  return (
    <div className="section-grid gap-5">
      <SectionHeading
        eyebrow="Addons"
        title="Complementos y extras"
        description="Crea addons y asígnalos a productos reales del menú."
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-4">
          <Card className="rounded-[24px] bg-white p-5 shadow-[var(--shadow-card)]">
            <form className="grid gap-3 md:grid-cols-[1fr_180px_auto]" onSubmit={handleCreate}>
              <Input placeholder="Nombre del addon" value={name} onChange={(event) => setName(event.target.value)} />
              <Input
                placeholder="Precio"
                type="number"
                min="0"
                step="0.1"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
              <Button disabled={submitting} type="submit">
                {submitting ? <Spinner /> : <Plus className="h-4 w-4" />}
                Crear addon
              </Button>
            </form>
          </Card>

          {loading ? (
            <Card className="flex items-center gap-3 rounded-[24px] bg-white p-5">
              <Spinner />
              <span>Cargando addons...</span>
            </Card>
          ) : addons.length ? (
            addons.map((addon) => (
              <Card key={addon.id} className="rounded-[24px] bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[28px] sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--color-ink)]">{addon.name}</h3>
                    <p className="text-sm text-[var(--color-muted)]">ID #{addon.id}</p>
                  </div>
                  <StatusBadge status={addon.isActive ? "ACTIVE" : "INACTIVE"} label={addon.isActive ? "Activo" : "Inactivo"} />
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-2xl font-semibold text-[var(--color-ink)]">{formatCurrency(addon.price)}</p>
                </div>
              </Card>
            ))
          ) : (
            <EmptyState title="No hay addons creados" description="Crea el primero para poder vincularlo a productos." />
          )}
        </div>

        <Card className="rounded-[24px] bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[28px] sm:p-5">
          <h3 className="text-xl font-semibold text-[var(--color-ink)]">Asignación rápida</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
            Selecciona un producto y un addon para vincularlos mediante el endpoint real del backend.
          </p>
          <form className="mt-4 grid gap-3" onSubmit={handleAssign}>
            <select
              className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-ink)]"
              value={productId}
              onChange={(event) => setProductId(event.target.value)}
            >
              <option value="">Selecciona producto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            <select
              className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-ink)]"
              value={addonId}
              onChange={(event) => setAddonId(event.target.value)}
            >
              <option value="">Selecciona addon</option>
              {addons.map((addon) => (
                <option key={addon.id} value={addon.id}>
                  {addon.name}
                </option>
              ))}
            </select>
            <Button className="w-full" disabled={assigning} type="submit">
              {assigning ? <Spinner /> : <Link2 className="h-4 w-4" />}
              Guardar asignación
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
