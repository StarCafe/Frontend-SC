"use client";

import QRCode from "react-qr-code";
import { Download, Eye, Printer, RefreshCcw, Plus } from "lucide-react";
import { demoTables } from "@/shared/mock/starcafe-demo";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { StatusBadge } from "@/shared/components/ui/status-badge";

export function TablesManagement() {
  return (
    <div className="section-grid gap-5">
      <SectionHeading
        eyebrow="Tables"
        title="Gestión de mesas y QR"
        description="Vista hardcodeada para deploy demo, con foco en claridad operativa y presentación premium."
        action={
          <Button>
            <Plus className="h-4 w-4" />
            Nueva mesa
          </Button>
        }
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {demoTables.map((table) => (
          <Card key={table.id} className="rounded-[30px] bg-white p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[var(--color-muted)]">Mesa {table.tableNumber}</p>
                <h3 className="text-2xl font-semibold text-[var(--color-ink)]">{table.occupancyLabel}</h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{table.minutesLabel}</p>
              </div>
              <StatusBadge status={table.active ? "ACTIVE" : "INACTIVE"} label={table.active ? "Activa" : "Inactiva"} />
            </div>

            <div className="mt-5 rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <div className="mx-auto w-full max-w-[180px] rounded-[24px] bg-white p-4">
                <QRCode value={table.qrUrl} className="h-auto w-full" />
              </div>
            </div>

            <div className="mt-4 grid gap-1 text-sm text-[var(--color-muted)]">
              <p className="font-semibold text-[var(--color-ink)]">{table.qrToken}</p>
              <p className="break-all">{table.qrUrl}</p>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Button variant="secondary"><Eye className="h-4 w-4" />Ver QR</Button>
              <Button variant="ghost"><Download className="h-4 w-4" />Descargar</Button>
              <Button variant="ghost"><Printer className="h-4 w-4" />Imprimir</Button>
              <Button variant="ghost"><RefreshCcw className="h-4 w-4" />Regenerar</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
