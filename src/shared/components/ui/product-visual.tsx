import { Coffee, CupSoda, Dessert, Snowflake } from "lucide-react";
import { cn } from "@/shared/utils/cn";

const iconMap = {
  Caliente: Coffee,
  Frío: CupSoda,
  Refresco: Snowflake,
  Frappuccino: CupSoda,
  Postres: Dessert,
};

export function ProductVisual({
  category,
  accent,
  className,
}: {
  category: string;
  accent: string;
  className?: string;
}) {
  const Icon = iconMap[category as keyof typeof iconMap] ?? Coffee;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] bg-gradient-to-br p-6 text-white",
        accent,
        className,
      )}
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/12 blur-2xl" />
      <div className="absolute bottom-0 right-0 h-28 w-28 rounded-full bg-black/10 blur-2xl" />
      <div className="relative flex h-full min-h-[148px] items-center justify-center rounded-[24px] border border-white/10 bg-black/10">
        <Icon className="h-16 w-16" />
      </div>
    </div>
  );
}
