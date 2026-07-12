import { cn } from "@/shared/utils/cn";

export const buttonVariantClasses = {
  primary:
    "border border-transparent bg-[var(--color-primary)] text-white shadow-[0_12px_24px_rgba(0,0,0,0.14)] hover:brightness-95 active:brightness-90",
  secondary:
    "border border-[var(--color-border-strong)] bg-white text-[var(--color-ink)] hover:bg-black/5 active:bg-black/10",
  ghost:
    "border border-[var(--color-border)] bg-transparent text-[var(--color-ink)] hover:bg-black/4 active:bg-black/8",
  danger:
    "border border-transparent bg-[var(--color-danger)] text-white shadow-[0_12px_24px_rgba(0,0,0,0.12)] hover:brightness-95 active:brightness-90",
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
    "inline-flex touch-manipulation cursor-pointer items-center justify-center gap-2 rounded-[18px] font-semibold tracking-[-0.01em] transition-[background-color,filter,transform,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-55 disabled:active:scale-100 disabled:hover:brightness-100",
    buttonVariantClasses[variant],
    buttonSizeClasses[size],
    className,
  );
}
