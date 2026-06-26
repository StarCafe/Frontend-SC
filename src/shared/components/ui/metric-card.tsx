import { Card } from "@/shared/components/ui/card";

export function MetricCard({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string;
}) {
  return (
    <Card className="rounded-[28px] bg-white p-5 shadow-[var(--shadow-card)]">
      <div className="grid gap-2">
        <p className="text-sm text-[var(--color-muted)]">{label}</p>
        <p className="text-4xl font-semibold tracking-tight text-[var(--color-ink)]">{value}</p>
        <p className="text-sm text-[var(--color-primary)]">{change}</p>
      </div>
    </Card>
  );
}
