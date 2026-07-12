import { cn } from "@/shared/utils/cn";
import type { ReactNode } from "react";

export function DemoTable({
  headers,
  rows,
  minWidth = "720px",
  columnTemplate,
}: {
  headers: string[];
  rows: Array<Array<ReactNode>>;
  minWidth?: string;
  columnTemplate?: string;
}) {
  const template = columnTemplate ?? `repeat(${headers.length}, minmax(0, 1fr))`;

  return (
    <div className="w-full overflow-x-auto rounded-[24px] border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)] sm:rounded-[28px]">
      <div style={{ minWidth }}>
        <div
          className="grid border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)] sm:px-5"
          style={{ gridTemplateColumns: template }}
        >
          {headers.map((header) => (
            <div key={header} className="min-w-0 whitespace-nowrap pr-3">
              {header}
            </div>
          ))}
        </div>
        <div>
          {rows.map((row, index) => (
            <div
              key={index}
              className={cn(
                "grid items-center gap-4 px-4 py-4 text-[15px] text-[var(--color-ink)] sm:px-5",
                index !== rows.length - 1 && "border-b border-[var(--color-border)]",
              )}
              style={{ gridTemplateColumns: template }}
            >
              {row.map((cell, cellIndex) => (
                <div key={cellIndex} className="min-w-0 pr-3">
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
