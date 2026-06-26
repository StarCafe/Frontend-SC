import { cn } from "@/shared/utils/cn";

const tones = {
  PENDING: "bg-amber-100 text-amber-700",
  PREPARING: "bg-sky-100 text-sky-700",
  READY: "bg-emerald-100 text-emerald-700",
  PAID: "bg-green-950 text-green-100",
  CANCELLED: "bg-rose-100 text-rose-700",
  ACTIVE: "bg-emerald-100 text-emerald-700",
  INACTIVE: "bg-zinc-200 text-zinc-600",
  AVAILABLE: "bg-emerald-100 text-emerald-700",
  UNAVAILABLE: "bg-rose-100 text-rose-700",
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
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-[0.12em]",
        tones[status],
        className,
      )}
    >
      {label ?? status}
    </span>
  );
}
