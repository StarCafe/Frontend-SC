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
        "relative inline-flex h-8 w-14 shrink-0 touch-manipulation cursor-pointer items-center rounded-full border transition-[background-color,filter,transform,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.97]",
        checked
          ? "border-transparent bg-[var(--color-primary)] hover:brightness-95 active:brightness-90"
          : "border-[var(--color-border-strong)] bg-[var(--color-surface-muted)] hover:bg-black/5 active:bg-black/10",
        disabled && "cursor-not-allowed opacity-50 active:scale-100 hover:brightness-100",
      )}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      role="switch"
      type="button"
    >
      <span
        className={cn(
          "inline-block h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-150 ease-out",
          checked ? "translate-x-7" : "translate-x-1",
        )}
      />
    </button>
  );
}
