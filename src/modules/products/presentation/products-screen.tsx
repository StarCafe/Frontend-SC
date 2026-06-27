import { Search, SlidersHorizontal, Upload } from "lucide-react";
import { demoCategories, demoProducts } from "@/shared/mock/starcafe-demo";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { ProductVisual } from "@/shared/components/ui/product-visual";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { StatusBadge } from "@/shared/components/ui/status-badge";
import { formatCurrency } from "@/shared/utils/format";

export function ProductsScreen() {
  return (
    <div className="section-grid gap-5">
      <SectionHeading
        eyebrow="Products"
        title="Catálogo de productos"
        description="Cards visuales para gestionar imagen, disponibilidad, categoría y estado sin depender del backend todavía."
        action={<Button className="w-full sm:w-auto"><Upload className="h-4 w-4" />Crear producto</Button>}
      />

      <Card className="rounded-[24px] bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[28px]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-muted)] lg:w-auto">
            <Search className="h-4 w-4" />
            Buscar producto...
          </div>
          <div className="flex flex-wrap gap-2">
            {demoCategories.map((category) => (
              <button key={category.id} className="rounded-full bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-ink)]">
                {category.name}
              </button>
            ))}
            <Button variant="ghost"><SlidersHorizontal className="h-4 w-4" />Filtrar</Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {demoProducts.map((product) => (
          <Card key={product.id} className="rounded-[24px] bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-[30px]">
            <ProductVisual accent={product.accent} category={product.category} />
            <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-ink)]">{product.name}</h3>
                <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">{product.description}</p>
              </div>
              <StatusBadge status={product.available ? "AVAILABLE" : "UNAVAILABLE"} label={product.available ? "Activo" : "Agotado"} />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-[var(--color-muted)]">{product.category}</p>
                <p className="text-2xl font-semibold text-[var(--color-ink)]">{formatCurrency(product.price)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost">Editar</Button>
                <Button variant="secondary">Imagen</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
