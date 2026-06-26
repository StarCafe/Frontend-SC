import { cn } from "@/shared/utils/cn";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass-panel rounded-[28px] border border-[var(--color-border)] shadow-[var(--shadow-soft)]",
        className,
      )}
      {...props}
    />
  );
}
