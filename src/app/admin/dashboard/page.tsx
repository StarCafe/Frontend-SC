import { Card } from "@/shared/components/ui/card";
import { SectionHeading } from "@/shared/components/ui/section-heading";

const highlights = [
  "Arquitectura por bounded contexts en src/modules",
  "Cliente HTTP y estado desacoplados de la presentacion",
  "Base lista para crecer con productos, categorias, addons, caja y usuarios",
];

export default function AdminDashboardPage() {
  return (
    <div className="section-grid gap-6">
      <SectionHeading
        eyebrow="Admin area"
        title="Dashboard de operaciones"
        description="Punto de entrada del area ADMIN con una base DDD lista para seguir ampliando flujos."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item} className="p-5">
            <p className="text-sm leading-6 text-[var(--color-muted)]">{item}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
