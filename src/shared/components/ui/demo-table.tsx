import { cn } from "@/shared/utils/cn";
import type { ReactNode } from "react";

export function DemoTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: Array<Array<ReactNode>>;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)]">
      <div className="grid border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]" style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}>
        {headers.map((header) => (
          <div key={header}>{header}</div>
        ))}
      </div>
      <div>
        {rows.map((row, index) => (
          <div
            key={index}
            className={cn("grid items-center gap-4 px-5 py-4 text-sm text-[var(--color-ink)]", index !== rows.length - 1 && "border-b border-[var(--color-border)]")}
            style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}
          >
            {row.map((cell, cellIndex) => (
              <div key={cellIndex}>{cell}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
