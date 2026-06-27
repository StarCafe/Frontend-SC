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
    <div className="overflow-x-auto rounded-[24px] border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)] sm:rounded-[28px]">
      <div className="min-w-[720px]">
        <div className="grid border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)] sm:px-5" style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}>
          {headers.map((header) => (
            <div key={header}>{header}</div>
          ))}
        </div>
        <div>
          {rows.map((row, index) => (
            <div
              key={index}
              className={cn("grid items-center gap-4 px-4 py-4 text-sm text-[var(--color-ink)] sm:px-5", index !== rows.length - 1 && "border-b border-[var(--color-border)]")}
              style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}
            >
              {row.map((cell, cellIndex) => (
                <div key={cellIndex}>{cell}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
