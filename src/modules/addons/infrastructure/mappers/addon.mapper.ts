import type { AddonEntity } from "@/modules/addons/domain/addon.entity";

export function mapAddon(payload: Record<string, unknown>): AddonEntity {
  return {
    id: Number(payload.id ?? 0),
    businessId: payload.businessId === null || payload.businessId === undefined ? null : Number(payload.businessId),
    name: String(payload.name ?? ""),
    price: Number(payload.price ?? 0),
    isActive: Boolean(payload.isActive ?? true),
  };
}

export function mapAddons(payload: unknown) {
  const raw = Array.isArray(payload)
    ? payload
    : ((payload as { addons?: unknown[]; items?: unknown[] })?.addons ??
      (payload as { addons?: unknown[]; items?: unknown[] })?.items ??
      []);

  return raw
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map(mapAddon);
}
