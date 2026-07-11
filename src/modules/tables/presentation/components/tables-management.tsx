"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { Copy, Download, Power, Plus, RefreshCcw, Share2 } from "lucide-react";
import {
  createTableUseCase,
  deactivateTableUseCase,
  listTablesUseCase,
  regenerateTableQrUseCase,
} from "@/modules/tables/application/use-cases/table.use-cases";
import type { TableEntity } from "@/modules/tables/domain/table.entity";
import { tablesRepository } from "@/modules/tables/infrastructure/repositories/table-http.repository";
import { useAuthGuard } from "@/modules/auth/presentation/hooks/use-auth-guard";
import { HttpError } from "@/shared/lib/api/http-client";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Input } from "@/shared/components/ui/input";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { Spinner } from "@/shared/components/ui/spinner";
import { StatusBadge } from "@/shared/components/ui/status-badge";
import { toast } from "sonner";

export function TablesManagement() {
  const auth = useAuthGuard("ADMIN");
  const [tables, setTables] = useState<TableEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tableNumber, setTableNumber] = useState("1");
  const qrContainersRef = useRef<Record<number, HTMLDivElement | null>>({});

  async function loadTables(token: string) {
    setLoading(true);

    try {
      setTables(await listTablesUseCase(tablesRepository, token));
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudieron cargar las mesas.";
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
      void loadTables(token);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [auth]);

  if (!auth) {
    return null;
  }

  const token = auth.token;

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const created = await createTableUseCase(tablesRepository, token, {
        tableNumber: Number(tableNumber),
      });
      setTables((current) => [created, ...current]);
      setTableNumber(String(Number(tableNumber) + 1));
      toast.success("Mesa creada");
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudo crear la mesa.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRegenerate(tableId: number) {
    try {
      const updated = await regenerateTableQrUseCase(tablesRepository, token, tableId);
      setTables((current) => current.map((table) => (table.id === tableId ? updated : table)));
      toast.success("QR regenerado");
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudo regenerar el QR.";
      toast.error(message);
    }
  }

  async function handleDeactivate(tableId: number) {
    try {
      await deactivateTableUseCase(tablesRepository, token, tableId);
      setTables((current) =>
        current.map((table) => (table.id === tableId ? { ...table, isActive: false } : table)),
      );
      toast.success("Mesa desactivada");
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudo desactivar la mesa.";
      toast.error(message);
    }
  }

  function getQrSvgMarkup(tableId: number) {
    const svg = qrContainersRef.current[tableId]?.querySelector("svg");

    if (!svg) {
      throw new Error("No se encontró el QR para esta mesa.");
    }

    return new XMLSerializer().serializeToString(svg);
  }

  async function handleDownloadQr(table: TableEntity) {
    try {
      const svgMarkup = getQrSvgMarkup(table.id);
      const svgBlob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);
      const image = new Image();

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("No se pudo procesar el QR."));
        image.src = svgUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = image.width || 512;
      canvas.height = image.height || 512;
      const context = canvas.getContext("2d");

      if (!context) {
        URL.revokeObjectURL(svgUrl);
        throw new Error("No se pudo preparar la descarga del QR.");
      }

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(svgUrl);

      const downloadUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `mesa-${table.tableNumber}-qr.png`;
      link.click();

      toast.success("QR descargado");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo descargar el QR.";
      toast.error(message);
    }
  }

  async function handleCopyLink(table: TableEntity) {
    try {
      await navigator.clipboard.writeText(table.qrUrl);
      toast.success("Enlace copiado");
    } catch {
      toast.error("No se pudo copiar el enlace.");
    }
  }

  async function handleShare(table: TableEntity) {
    if (!navigator.share) {
      toast.error("Tu navegador no soporta compartir desde esta pantalla.");
      return;
    }

    try {
      await navigator.share({
        title: `Mesa ${table.tableNumber}`,
        text: `Acceso QR para la mesa ${table.tableNumber}`,
        url: table.qrUrl,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      toast.error("No se pudo compartir el QR.");
    }
  }

  return (
    <div className="section-grid gap-5">
      <SectionHeading
        eyebrow="Tables"
        title="Gestión de mesas y QR"
        description="Crea mesas, regenera QR y controla su estado operativo desde datos reales."
      />

      <Card className="rounded-[24px] bg-white p-5 shadow-[var(--shadow-card)]">
        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleCreate}>
          <Input
            type="number"
            min="1"
            value={tableNumber}
            onChange={(event) => setTableNumber(event.target.value)}
          />
          <Button disabled={submitting} type="submit">
            {submitting ? <Spinner /> : <Plus className="h-4 w-4" />}
            Nueva mesa
          </Button>
        </form>
      </Card>

      {loading ? (
        <Card className="flex items-center gap-3 rounded-[24px] bg-white p-5">
          <Spinner />
          <span>Cargando mesas...</span>
        </Card>
      ) : tables.length ? (
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {tables.map((table) => (
            <Card key={table.id} className="rounded-[24px] bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[30px] sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-[var(--color-muted)]">Mesa</p>
                  <h3 className="text-3xl font-semibold text-[var(--color-ink)]">{table.tableNumber}</h3>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    {table.isActive ? "Mesa operativa" : "Mesa desactivada"}
                  </p>
                </div>
                <StatusBadge status={table.isActive ? "ACTIVE" : "INACTIVE"} label={table.isActive ? "Activa" : "Inactiva"} />
              </div>

              <div className="mt-5 rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:rounded-[28px]">
                <div
                  ref={(element) => {
                    qrContainersRef.current[table.id] = element;
                  }}
                  className="mx-auto w-full max-w-[180px] rounded-[20px] bg-white p-4 sm:rounded-[24px]"
                >
                  <QRCode value={table.qrUrl} className="h-auto w-full" />
                </div>
              </div>

              <div className="mt-4 grid gap-1 text-sm text-[var(--color-muted)]">
                <p className="font-semibold text-[var(--color-ink)]">{table.qrToken}</p>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <Button variant="ghost" onClick={() => handleDownloadQr(table)} type="button">
                  <Download className="h-4 w-4" />
                  Descargar
                </Button>
                <Button variant="ghost" onClick={() => handleCopyLink(table)} type="button">
                  <Copy className="h-4 w-4" />
                  Copiar link
                </Button>
                <Button variant="ghost" onClick={() => handleShare(table)} type="button">
                  <Share2 className="h-4 w-4" />
                  Compartir
                </Button>
              </div>

              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <Button variant="ghost" onClick={() => handleRegenerate(table.id)} type="button">
                  <RefreshCcw className="h-4 w-4" />
                  Regenerar
                </Button>
                <Button
                  disabled={!table.isActive}
                  variant="danger"
                  onClick={() => handleDeactivate(table.id)}
                  type="button"
                >
                  <Power className="h-4 w-4" />
                  Desactivar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No hay mesas registradas" description="Crea la primera mesa para habilitar el flujo QR." />
      )}
    </div>
  );
}
