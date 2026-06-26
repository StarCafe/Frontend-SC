import { Plus } from "lucide-react";
import { demoCategories } from "@/shared/mock/starcafe-demo";
import { Button } from "@/shared/components/ui/button";
import { DemoTable } from "@/shared/components/ui/demo-table";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { StatusBadge } from "@/shared/components/ui/status-badge";

export function CategoriesScreen() {
  return (
    <div className="section-grid gap-5">
      <SectionHeading
        eyebrow="Categories"
        title="Categorías del menú"
        description="Vista pensada para administrar la carta y mantener consistencia entre productos, addons y menú público."
        action={<Button><Plus className="h-4 w-4" />Crear categoría</Button>}
      />
      <DemoTable
        headers={["Nombre", "Descripción", "Productos", "Estado"]}
        rows={demoCategories.map((category) => [
          <span key={`${category.id}-name`} className="font-semibold">{category.name}</span>,
          category.description,
          `${category.products} productos`,
          <StatusBadge key={`${category.id}-status`} status={category.status} label="Activa" />,
        ])}
      />
    </div>
  );
}
