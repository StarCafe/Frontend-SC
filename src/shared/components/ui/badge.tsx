import { cn } from "@/shared/utils/cn";
import type { HTMLAttributes } from "react";

const toneClasses = {
  neutral: "bg-white/80 text-[var(--color-muted)]",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-rose-100 text-rose-800",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof toneClasses }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
