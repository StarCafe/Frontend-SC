import { cn } from "@/shared/utils/cn";

export const buttonVariantClasses = {
  primary:
    "border border-transparent bg-[var(--color-primary)] text-white shadow-[0_12px_24px_rgba(0,0,0,0.14)] hover:bg-[var(--color-primary-strong)]",
  secondary:
    "border border-[var(--color-border-strong)] bg-white text-[var(--color-ink)] hover:bg-[var(--color-surface)]",
  ghost:
    "border border-[var(--color-border)] bg-transparent text-[var(--color-ink)] hover:bg-white/70",
  danger:
    "border border-transparent bg-[var(--color-danger)] text-white shadow-[0_12px_24px_rgba(0,0,0,0.12)] hover:brightness-95",
} as const;

export const buttonSizeClasses = {
  sm: "min-h-11 px-4 text-[14px]",
  md: "min-h-11 px-5 text-[15px]",
  lg: "min-h-12 px-6 text-[15px]",
} as const;

export function buttonClasses({
  className,
  variant = "primary",
  size = "md",
}: {
  className?: string;
  variant?: keyof typeof buttonVariantClasses;
  size?: keyof typeof buttonSizeClasses;
}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-[18px] font-semibold tracking-[-0.01em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-55",
    buttonVariantClasses[variant],
    buttonSizeClasses[size],
    className,
  );
}
