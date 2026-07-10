"use client";

import { useEffect, useState } from "react";
import { Save, Upload } from "lucide-react";
import { assignAddonToProductUseCase, listAddonsUseCase } from "@/modules/addons/application/use-cases/addons.use-cases";
import type { AddonEntity } from "@/modules/addons/domain/addon.entity";
import { addonsRepository } from "@/modules/addons/infrastructure/repositories/addons-http.repository";
import { listCategoriesUseCase } from "@/modules/categories/application/use-cases/categories.use-cases";
import type { CategoryEntity } from "@/modules/categories/domain/category.entity";
import { categoriesRepository } from "@/modules/categories/infrastructure/repositories/categories-http.repository";
import {
  activateProductUseCase,
  createProductUseCase,
  deactivateProductUseCase,
  deleteProductImageUseCase,
  listProductsUseCase,
  markProductUnavailableUseCase,
  replaceProductImageUseCase,
  updateProductUseCase,
  uploadProductImageUseCase,
} from "@/modules/products/application/use-cases/products.use-cases";
import type { ProductEntity } from "@/modules/products/domain/product.entity";
import type { CreateProductPayload } from "@/modules/products/domain/product.types";
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

const initialForm: CreateProductPayload = {
  categoryId: 0,
  name: "",
  description: "",
  price: 0,
};

export function ProductsScreen() {
  const auth = useAuthGuard("ADMIN");
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [addons, setAddons] = useState<AddonEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CreateProductPayload>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [addonSelections, setAddonSelections] = useState<Record<number, string>>({});

  async function loadData(token: string) {
    setLoading(true);

    try {
      const [productsData, categoriesData, addonsData] = await Promise.all([
        listProductsUseCase(productsRepository, token),
        listCategoriesUseCase(categoriesRepository, token),
        listAddonsUseCase(addonsRepository, token),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
      setAddons(addonsData);
      setForm((current) => ({
        ...current,
        categoryId: current.categoryId || categoriesData[0]?.id || 0,
      }));
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudieron cargar los productos.";
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
      const created = await createProductUseCase(productsRepository, auth.token, form);
      setProducts((current) => [created, ...current]);
      setForm({
        categoryId: categories[0]?.id ?? 0,
        name: "",
        description: "",
        price: 0,
      });
      toast.success("Producto creado");
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudo crear el producto.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function refreshProducts() {
    await loadData(auth.token);
  }

  async function handleUpdate(product: ProductEntity) {
    try {
      const updated = await updateProductUseCase(productsRepository, auth.token, product.id, {
        categoryId: product.categoryId,
        name: product.name,
        description: product.description,
        price: product.price,
      });
      setProducts((current) => current.map((item) => (item.id === product.id ? updated : item)));
      setEditingId(null);
      toast.success("Producto actualizado");
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudo actualizar el producto.";
      toast.error(message);
    }
  }

  async function handleProductAction(action: () => Promise<void>, message: string) {
    try {
      await action();
      await refreshProducts();
      toast.success(message);
    } catch (error) {
      const detail = error instanceof HttpError ? error.message : "No se pudo completar la acción.";
      toast.error(detail);
    }
  }

  async function handleImage(productId: number, file: File) {
    const current = products.find((product) => product.id === productId);

    if (!current) {
      return;
    }

    try {
      const updated = current.image
        ? await replaceProductImageUseCase(productsRepository, auth.token, productId, file)
        : await uploadProductImageUseCase(productsRepository, auth.token, productId, file);
      setProducts((items) => items.map((item) => (item.id === productId ? updated : item)));
      toast.success("Imagen actualizada");
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudo actualizar la imagen.";
      toast.error(message);
    }
  }

  async function handleAssignAddon(productId: number) {
    const addonId = Number(addonSelections[productId] ?? 0);

    if (!addonId) {
      toast.error("Selecciona un addon.");
      return;
    }

    try {
      await assignAddonToProductUseCase(addonsRepository, auth.token, productId, addonId);
      await refreshProducts();
      toast.success("Addon asignado");
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudo asignar el addon.";
      toast.error(message);
    }
  }

  return (
    <div className="section-grid gap-5">
      <SectionHeading
        eyebrow="Products"
        title="Catálogo de productos"
        description="Gestiona productos, estado, imagen y addons con los endpoints administrativos reales."
      />

      <Card className="rounded-[24px] bg-white p-5 shadow-[var(--shadow-card)]">
        <form className="grid gap-3 lg:grid-cols-[180px_1fr_1.2fr_160px_auto]" onSubmit={handleCreate}>
          <select
            className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-ink)]"
            value={form.categoryId}
            onChange={(event) => setForm((current) => ({ ...current, categoryId: Number(event.target.value) }))}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <Input
            placeholder="Nombre"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
          <Input
            placeholder="Descripción"
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          />
          <Input
            placeholder="Precio"
            type="number"
            min="0"
            step="0.1"
            value={String(form.price)}
            onChange={(event) => setForm((current) => ({ ...current, price: Number(event.target.value) }))}
          />
          <Button disabled={submitting} type="submit">
            {submitting ? <Spinner /> : <Upload className="h-4 w-4" />}
            Crear producto
          </Button>
        </form>
      </Card>

      {loading ? (
        <Card className="flex items-center gap-3 rounded-[24px] bg-white p-5">
          <Spinner />
          <span>Cargando productos...</span>
        </Card>
      ) : products.length ? (
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {products.map((product) => {
            const categoryName = categories.find((category) => category.id === product.categoryId)?.name ?? `Categoría ${product.categoryId}`;
            const isEditing = editingId === product.id;

            return (
              <Card key={product.id} className="rounded-[24px] bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[30px]">
                {product.image?.url ? (
                  <img alt={product.name} className="h-44 w-full rounded-[24px] object-cover" src={product.image.url} />
                ) : (
                  <div className="flex h-44 items-center justify-center rounded-[24px] bg-[var(--color-surface)] text-sm text-[var(--color-muted)]">
                    Sin imagen
                  </div>
                )}
                <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {isEditing ? (
                      <div className="grid gap-2">
                        <Input
                          value={product.name}
                          onChange={(event) =>
                            setProducts((current) =>
                              current.map((item) =>
                                item.id === product.id ? { ...item, name: event.target.value } : item,
                              ),
                            )
                          }
                        />
                        <Input
                          value={product.description}
                          onChange={(event) =>
                            setProducts((current) =>
                              current.map((item) =>
                                item.id === product.id ? { ...item, description: event.target.value } : item,
                              ),
                            )
                          }
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl font-semibold text-[var(--color-ink)]">{product.name}</h3>
                        <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">{product.description}</p>
                      </>
                    )}
                  </div>
                  <StatusBadge
                    status={product.isAvailable ? "AVAILABLE" : "UNAVAILABLE"}
                    label={product.isAvailable ? "Disponible" : "No disponible"}
                  />
                </div>
                <div className="mt-4 grid gap-2 text-sm text-[var(--color-muted)]">
                  <p>{categoryName}</p>
                  <p className="text-2xl font-semibold text-[var(--color-ink)]">{formatCurrency(product.price)}</p>
                  <p>{product.isActive ? "Activo" : "Inactivo"}</p>
                  <p>
                    Addons: {product.addons.length ? product.addons.map((addon) => addon.name).join(", ") : "Sin addons"}
                  </p>
                </div>
                <div className="mt-4 grid gap-2">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="ghost" onClick={() => setEditingId(isEditing ? null : product.id)} type="button">
                      {isEditing ? "Cancelar" : "Editar"}
                    </Button>
                    {isEditing ? (
                      <Button onClick={() => handleUpdate(product)} type="button">
                        <Save className="h-4 w-4" />
                        Guardar
                      </Button>
                    ) : null}
                    <Button
                      variant="secondary"
                      onClick={() =>
                        handleProductAction(
                          () =>
                            product.isActive
                              ? deactivateProductUseCase(productsRepository, auth.token, product.id)
                              : activateProductUseCase(productsRepository, auth.token, product.id),
                          product.isActive ? "Producto desactivado" : "Producto reactivado",
                        )
                      }
                      type="button"
                    >
                      {product.isActive ? "Desactivar" : "Activar"}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        handleProductAction(
                          () => markProductUnavailableUseCase(productsRepository, auth.token, product.id),
                          "Producto marcado como no disponible",
                        )
                      }
                      type="button"
                    >
                      No disponible
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Input
                      type="file"
                      onChange={(event) => {
                        const file = event.target.files?.[0];

                        if (file) {
                          void handleImage(product.id, file);
                        }
                      }}
                    />
                    {product.image ? (
                      <Button
                        variant="danger"
                        onClick={() =>
                          handleProductAction(
                            () => deleteProductImageUseCase(productsRepository, auth.token, product.id),
                            "Imagen eliminada",
                          )
                        }
                        type="button"
                      >
                        Eliminar imagen
                      </Button>
                    ) : null}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                    <select
                      className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-ink)]"
                      value={addonSelections[product.id] ?? ""}
                      onChange={(event) =>
                        setAddonSelections((current) => ({ ...current, [product.id]: event.target.value }))
                      }
                    >
                      <option value="">Asignar addon</option>
                      {addons.map((addon) => (
                        <option key={addon.id} value={addon.id}>
                          {addon.name}
                        </option>
                      ))}
                    </select>
                    <Button onClick={() => handleAssignAddon(product.id)} type="button">
                      Vincular addon
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState title="No hay productos" description="Crea el primero para que aparezca en el menú y la caja." />
      )}
    </div>
  );
}
