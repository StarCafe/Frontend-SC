import { Card } from "@/shared/components/ui/card";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="section-grid gap-2 p-6 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm leading-6 text-[var(--color-muted)]">{description}</p>
    </Card>
  );
}
