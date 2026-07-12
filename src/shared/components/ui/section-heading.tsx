import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="section-grid gap-2">
        {eyebrow ? (
          <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
            {eyebrow}
          </span>
        ) : null}
        <div className="section-grid gap-1">
          <h1 className="text-[28px] leading-tight font-bold tracking-[-0.03em] sm:text-[32px]">{title}</h1>
          {description ? <p className="max-w-2xl text-[15px] leading-7 text-[var(--color-muted)]">{description}</p> : null}
        </div>
      </div>
      {action ? <div className="w-full md:w-auto">{action}</div> : null}
    </div>
  );
}
