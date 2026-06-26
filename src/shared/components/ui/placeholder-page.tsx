import { Card } from "@/shared/components/ui/card";
import { SectionHeading } from "@/shared/components/ui/section-heading";

export function PlaceholderPage({
  title,
  domain,
  description,
}: {
  title: string;
  domain: string;
  description: string;
}) {
  return (
    <div className="section-grid gap-6">
      <SectionHeading eyebrow={domain} title={title} description={description} />
      <Card className="p-6">
        <p className="max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
          Este modulo ya tiene su bounded context creado dentro de `src/modules/{domain}` con capas
          `domain`, `application`, `infrastructure` y `presentation`, listo para implementar los
          siguientes casos de uso sin mezclar responsabilidades en la UI.
        </p>
      </Card>
    </div>
  );
}
