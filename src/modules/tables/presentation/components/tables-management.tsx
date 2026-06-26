"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createTableUseCase,
  deactivateTableUseCase,
  listTablesUseCase,
  regenerateTableQrUseCase,
} from "@/modules/tables/application/use-cases/table.use-cases";
import { createTableSchema, type CreateTableFormValues } from "@/modules/tables/application/schemas/create-table.schema";
import { tablesRepository } from "@/modules/tables/infrastructure/repositories/table-http.repository";
import type { TableEntity } from "@/modules/tables/domain/table.entity";
import { useAuthStore } from "@/shared/store/auth-store";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Input } from "@/shared/components/ui/input";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { TableCard } from "@/modules/tables/presentation/components/table-card";

export function TablesManagement() {
  const token = useAuthStore((state) => state.token);
  const [tables, setTables] = useState<TableEntity[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<CreateTableFormValues>({
    resolver: zodResolver(createTableSchema),
    defaultValues: { tableNumber: 1 },
  });

  const loadTables = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      setLoading(true);
      const nextTables = await listTablesUseCase(tablesRepository, token);
      setTables(nextTables);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar las mesas");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadTables();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadTables]);

  const handleCreate = form.handleSubmit(async (values) => {
    if (!token) {
      return;
    }

    try {
      await createTableUseCase(tablesRepository, token, values);
      toast.success("Mesa creada");
      form.reset({ tableNumber: values.tableNumber + 1 });
      await loadTables();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo crear la mesa");
    }
  });

  const handleRegenerate = async (table: TableEntity) => {
    if (!token) {
      return;
    }

    try {
      const updated = await regenerateTableQrUseCase(tablesRepository, token, table.id);
      setTables((current) => current.map((item) => (item.id === table.id ? updated : item)));
      toast.success(`QR regenerado para mesa ${table.tableNumber}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo regenerar el QR");
    }
  };

  const handleDeactivate = async (table: TableEntity) => {
    if (!token) {
      return;
    }

    try {
      await deactivateTableUseCase(tablesRepository, token, table.id);
      setTables((current) =>
        current.map((item) => (item.id === table.id ? { ...item, isActive: false } : item)),
      );
      toast.success(`Mesa ${table.tableNumber} desactivada`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo desactivar la mesa");
    }
  };

  return (
    <div className="section-grid gap-6">
      <SectionHeading
        eyebrow="Tables bounded context"
        title="Gestion de mesas con QR"
        description="Cada mesa vive como agregado del dominio tables. La UI solo orquesta casos de uso y reacciona a estados."
      />

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <form className="glass-panel rounded-[28px] border border-[var(--color-border)] p-5 shadow-[var(--shadow-soft)] section-grid gap-4 h-fit" onSubmit={handleCreate}>
          <div className="section-grid gap-1">
            <h2 className="text-xl font-semibold">Crear mesa</h2>
            <p className="text-sm text-[var(--color-muted)]">
              Formulario validado con zod y desacoplado del repositorio HTTP.
            </p>
          </div>
          <label className="section-grid gap-2">
            <span className="text-sm font-medium">Numero de mesa</span>
            <Input type="number" min={1} {...form.register("tableNumber", { valueAsNumber: true })} />
            {form.formState.errors.tableNumber ? (
              <span className="text-sm text-[var(--color-danger)]">
                {form.formState.errors.tableNumber.message}
              </span>
            ) : null}
          </label>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Registrar mesa
          </Button>
        </form>

        <div className="section-grid gap-4">
          {loading ? (
            <EmptyState title="Cargando mesas" description="Consultando el backend para obtener QR y estado actual." />
          ) : tables.length === 0 ? (
            <EmptyState title="No hay mesas registradas" description="Crea la primera mesa para empezar a generar QRs." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {tables.map((table) => (
                <TableCard
                  key={table.id}
                  table={table}
                  onRegenerate={handleRegenerate}
                  onDeactivate={handleDeactivate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
