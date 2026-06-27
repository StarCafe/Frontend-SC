import { cn } from "@/shared/utils/cn";

export const buttonVariantClasses = {
  primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)]",
  secondary: "bg-[var(--color-secondary)] text-white hover:opacity-90",
  ghost: "bg-transparent text-[var(--color-ink)] hover:bg-white/70",
  danger: "bg-[var(--color-danger)] text-white hover:opacity-90",
} as const;

export const buttonSizeClasses = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-sm",
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
    "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
    buttonVariantClasses[variant],
    buttonSizeClasses[size],
    className,
  );
}
