import { Link2, Plus } from "lucide-react";
import { demoAddons } from "@/shared/mock/starcafe-demo";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { StatusBadge } from "@/shared/components/ui/status-badge";
import { formatCurrency } from "@/shared/utils/format";

export function AddonsScreen() {
  return (
    <div className="section-grid gap-5">
      <SectionHeading
        eyebrow="Addons"
        title="Complementos y extras"
        description="Bloque visual para crear addons, revisar precio y asignarlos a productos de forma clara."
        action={<Button className="w-full sm:w-auto"><Plus className="h-4 w-4" />Crear addon</Button>}
      />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-4">
          {demoAddons.map((addon) => (
            <Card key={addon.id} className="rounded-[24px] bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[28px] sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-[var(--color-ink)]">{addon.name}</h3>
                  <p className="text-sm text-[var(--color-muted)]">{addon.appliesTo}</p>
                </div>
                <StatusBadge status={addon.status} label={addon.status === "ACTIVE" ? "Activo" : "Inactivo"} />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-2xl font-semibold text-[var(--color-ink)]">{formatCurrency(addon.price)}</p>
                <Button variant="ghost"><Link2 className="h-4 w-4" />Asignar a producto</Button>
              </div>
            </Card>
          ))}
        </div>
        <Card className="rounded-[24px] bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[28px] sm:p-5">
          <h3 className="text-xl font-semibold text-[var(--color-ink)]">Asignación rápida</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
            Panel demo para mostrar cómo se vería la asignación de addons a un producto sin necesidad de persistencia real todavía.
          </p>
          <div className="mt-4 grid gap-3">
            {["Producto: Frappé Chocolate", "Addon: Shot extra", "Estado: Disponible"].map((item) => (
              <div key={item} className="rounded-2xl bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-ink)]">{item}</div>
            ))}
          </div>
          <Button className="mt-4 w-full">Guardar asignación</Button>
        </Card>
      </div>
    </div>
  );
}
