import type { ReactNode } from "react";
import { Card } from "@/shared/components/ui/card";

export function EmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
}) {
  return (
    <Card className="section-grid place-items-center gap-3 rounded-[28px] p-8 text-center text-[var(--color-ink)] shadow-[var(--shadow-card)]">
      {icon ? (
        <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--color-surface)] text-[var(--color-muted)]">
          {icon}
        </div>
      ) : null}
      <h3 className="text-xl font-semibold text-[var(--color-ink)]">{title}</h3>
      <p className="max-w-md text-[15px] leading-7 text-[var(--color-muted)]">{description}</p>
    </Card>
  );
}
