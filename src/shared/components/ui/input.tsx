import { cn } from "@/shared/utils/cn";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/90 px-4 text-sm outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[rgba(159,79,36,0.12)]",
        className,
      )}
      {...props}
    />
  );
}
