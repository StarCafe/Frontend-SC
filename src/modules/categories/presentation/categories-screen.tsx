"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { createCategoryUseCase, listCategoriesUseCase } from "@/modules/categories/application/use-cases/categories.use-cases";
import type { CategoryEntity } from "@/modules/categories/domain/category.entity";
import { categoriesRepository } from "@/modules/categories/infrastructure/repositories/categories-http.repository";
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
import { toast } from "sonner";

export function CategoriesScreen() {
  const auth = useAuthGuard("ADMIN");
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function loadCategories(token: string) {
    setLoading(true);

    try {
      setCategories(await listCategoriesUseCase(categoriesRepository, token));
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudieron cargar las categorías.";
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
      void loadCategories(auth.token);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [auth]);

  if (!auth) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const created = await createCategoryUseCase(categoriesRepository, auth.token, { name, description });
      setCategories((current) => [created, ...current]);
      setName("");
      setDescription("");
      toast.success("Categoría creada");
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudo crear la categoría.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="section-grid gap-5">
      <SectionHeading
        eyebrow="Categories"
        title="Categorías del menú"
        description="Gestiona categorías reales para el menú público y los productos administrativos."
      />

      <Card className="rounded-[24px] bg-white p-5 shadow-[var(--shadow-card)]">
        <form className="grid gap-3 md:grid-cols-[1fr_1.2fr_auto]" onSubmit={handleSubmit}>
          <Input placeholder="Nombre" value={name} onChange={(event) => setName(event.target.value)} />
          <Input
            placeholder="Descripción"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <Button disabled={submitting} type="submit">
            {submitting ? <Spinner /> : <Plus className="h-4 w-4" />}
            Crear categoría
          </Button>
        </form>
      </Card>

      {loading ? (
        <Card className="flex items-center gap-3 rounded-[24px] bg-white p-5">
          <Spinner />
          <span>Cargando categorías...</span>
        </Card>
      ) : categories.length ? (
        <DemoTable
          headers={["Nombre", "Descripción", "Estado"]}
          rows={categories.map((category) => [
            <span key={`${category.id}-name`} className="font-semibold">{category.name}</span>,
            category.description,
            <StatusBadge
              key={`${category.id}-status`}
              status={category.isActive ? "ACTIVE" : "INACTIVE"}
              label={category.isActive ? "Activa" : "Inactiva"}
            />,
          ])}
        />
      ) : (
        <EmptyState
          title="No hay categorías creadas"
          description="Crea la primera categoría para empezar a organizar el menú."
        />
      )}
    </div>
  );
}
