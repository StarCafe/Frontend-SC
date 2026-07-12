import { cn } from "@/shared/utils/cn";

export function Switch({
  checked,
  disabled,
  onCheckedChange,
  ariaLabel,
}: {
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (nextValue: boolean) => void;
  ariaLabel: string;
}) {
  return (
    <button
      aria-checked={checked}
      aria-label={ariaLabel}
      className={cn(
        "relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        checked
          ? "border-transparent bg-[var(--color-primary)]"
          : "border-[var(--color-border-strong)] bg-[var(--color-surface-muted)]",
        disabled && "cursor-not-allowed opacity-50",
      )}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      role="switch"
      type="button"
    >
      <span
        className={cn(
          "inline-block h-6 w-6 rounded-full bg-white shadow-sm transition",
          checked ? "translate-x-7" : "translate-x-1",
        )}
      />
    </button>
  );
}
