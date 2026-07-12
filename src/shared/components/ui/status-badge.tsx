import { cn } from "@/shared/utils/cn";

const tones = {
  PENDING: "bg-amber-100 text-amber-800",
  PREPARING: "bg-sky-100 text-sky-800",
  READY: "bg-emerald-100 text-emerald-800",
  PAID: "bg-emerald-950 text-emerald-50",
  CANCELLED: "bg-rose-100 text-rose-800",
  ACTIVE: "bg-emerald-100 text-emerald-800",
  INACTIVE: "bg-zinc-200 text-zinc-700",
  AVAILABLE: "bg-emerald-100 text-emerald-800",
  UNAVAILABLE: "bg-rose-100 text-rose-800",
} as const;

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: keyof typeof tones;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]",
        tones[status],
        className,
      )}
    >
      {label ?? status}
    </span>
  );
}
