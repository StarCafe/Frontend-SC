"use client";

import QRCode from "react-qr-code";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import type { TableEntity } from "@/modules/tables/domain/table.types";

function downloadSvg(table: TableEntity) {
  const svg = document.getElementById(`table-qr-${table.id}`)?.querySelector("svg");

  if (!svg) {
    toast.error("No se encontro el QR para descargar");
    return;
  }

  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);
  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `mesa-${table.tableNumber}.svg`;
  link.click();
  URL.revokeObjectURL(url);
}

export function TableCard({
  table,
  onRegenerate,
  onDeactivate,
}: {
  table: TableEntity;
  onRegenerate: (table: TableEntity) => void;
  onDeactivate: (table: TableEntity) => void;
}) {
  return (
    <Card className="section-grid gap-4 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="section-grid gap-1">
          <h3 className="text-xl font-semibold">Mesa {table.tableNumber}</h3>
          <p className="text-xs text-[var(--color-muted)]">{table.qrToken}</p>
        </div>
        <Badge tone={table.isActive ? "success" : "danger"}>{table.isActive ? "Activa" : "Inactiva"}</Badge>
      </div>

      <div className="rounded-[24px] bg-white p-4" id={`table-qr-${table.id}`}>
        <QRCode value={table.qrUrl} className="h-auto w-full" />
      </div>

      <div className="section-grid gap-1 text-sm text-[var(--color-muted)]">
        <span className="font-medium text-[var(--color-ink)]">QR URL</span>
        <p className="break-all">{table.qrUrl}</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Button variant="secondary" onClick={() => window.open(table.qrUrl, "_blank", "noopener,noreferrer")}>
          Ver QR
        </Button>
        <Button variant="ghost" onClick={() => downloadSvg(table)}>
          Descargar QR
        </Button>
        <Button variant="ghost" onClick={() => window.print()}>
          Imprimir
        </Button>
        <Button variant="ghost" onClick={() => onRegenerate(table)}>
          Regenerar
        </Button>
      </div>

      <Button variant="danger" disabled={!table.isActive} onClick={() => onDeactivate(table)}>
        Desactivar mesa
      </Button>
    </Card>
  );
}
