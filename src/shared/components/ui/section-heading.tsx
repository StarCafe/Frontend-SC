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
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
            {eyebrow}
          </span>
        ) : null}
        <div className="section-grid gap-1">
          <h1 className="text-[2rem] leading-tight font-semibold tracking-tight sm:text-3xl">{title}</h1>
          {description ? <p className="max-w-2xl text-sm leading-6 text-[var(--color-muted)] sm:text-[15px]">{description}</p> : null}
        </div>
      </div>
      {action ? <div className="w-full md:w-auto">{action}</div> : null}
    </div>
  );
}
