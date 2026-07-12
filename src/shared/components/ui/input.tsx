import { cn } from "@/shared/utils/cn";
import type { InputHTMLAttributes } from "react";

export const fieldClassName =
  "min-h-11 w-full rounded-[18px] border border-[var(--color-border)] bg-white/96 px-4 text-[15px] font-medium text-[var(--color-ink)] caret-[var(--color-primary)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-black/5";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        fieldClassName,
        className,
      )}
      {...props}
    />
  );
}
