import type { CategoryEntity } from "@/modules/categories/domain/category.entity";

export function mapCategory(payload: Record<string, unknown>): CategoryEntity {
  return {
    id: Number(payload.id ?? 0),
    name: String(payload.name ?? ""),
    description: payload.description ? String(payload.description) : undefined,
    isActive: Boolean(payload.isActive ?? true),
  };
}

export function mapCategories(payload: unknown) {
  const raw = Array.isArray(payload)
    ? payload
    : ((payload as { categories?: unknown[]; items?: unknown[] })?.categories ??
      (payload as { categories?: unknown[]; items?: unknown[] })?.items ??
      []);

  return raw
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map(mapCategory);
}
