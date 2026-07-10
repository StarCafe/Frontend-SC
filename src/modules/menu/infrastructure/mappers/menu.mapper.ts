import { mapAddon } from "@/modules/addons/infrastructure/mappers/addon.mapper";
import type { MenuCategoryEntity, MenuProductEntity } from "@/modules/menu/domain/menu.entity";

function mapMenuProduct(payload: Record<string, unknown>): MenuProductEntity {
  const rawAddons = Array.isArray(payload.addons) ? payload.addons : [];

  return {
    id: Number(payload.id ?? 0),
    categoryId: Number(payload.categoryId ?? 0),
    categoryName: String(payload.categoryName ?? payload.category ?? "General"),
    name: String(payload.name ?? ""),
    description: String(payload.description ?? ""),
    price: Number(payload.price ?? 0),
    isAvailable: Boolean(payload.isAvailable ?? true),
    imageUrl:
      typeof payload.image === "object" && payload.image !== null
        ? String((payload.image as { url?: string }).url ?? "")
        : payload.imageUrl
          ? String(payload.imageUrl)
          : null,
    addons: rawAddons
      .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
      .map(mapAddon),
  };
}

export function mapMenu(payload: unknown): MenuCategoryEntity[] {
  const raw = Array.isArray(payload)
    ? payload
    : ((payload as { products?: unknown[]; items?: unknown[] })?.products ??
      (payload as { products?: unknown[]; items?: unknown[] })?.items ??
      []);

  const products = raw
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map(mapMenuProduct);

  const categories = new Map<number, MenuCategoryEntity>();

  products.forEach((product) => {
    if (!categories.has(product.categoryId)) {
      categories.set(product.categoryId, {
        id: product.categoryId,
        name: product.categoryName,
        products: [],
      });
    }

    categories.get(product.categoryId)?.products.push(product);
  });

  return Array.from(categories.values());
}
