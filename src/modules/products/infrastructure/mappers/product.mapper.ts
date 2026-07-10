import { mapAddon } from "@/modules/addons/infrastructure/mappers/addon.mapper";
import type { ProductEntity, ProductImageEntity } from "@/modules/products/domain/product.entity";

function mapProductImage(payload: Record<string, unknown>): ProductImageEntity {
  return {
    id: Number(payload.id ?? 0),
    fileName: String(payload.file_name ?? payload.fileName ?? ""),
    mimeType: String(payload.mime_type ?? payload.mimeType ?? ""),
    fileSize: Number(payload.file_size ?? payload.fileSize ?? 0),
    url: String(payload.url ?? ""),
  };
}

export function mapProduct(payload: Record<string, unknown>): ProductEntity {
  const rawAddons = Array.isArray(payload.addons) ? payload.addons : [];
  const image =
    typeof payload.image === "object" && payload.image !== null
      ? mapProductImage(payload.image as Record<string, unknown>)
      : null;

  return {
    id: Number(payload.id ?? 0),
    businessId: payload.businessId === null || payload.businessId === undefined ? null : Number(payload.businessId),
    categoryId: Number(payload.categoryId ?? 0),
    name: String(payload.name ?? ""),
    description: String(payload.description ?? ""),
    price: Number(payload.price ?? 0),
    isAvailable: Boolean(payload.isAvailable ?? true),
    isActive: Boolean(payload.isActive ?? true),
    addons: rawAddons
      .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
      .map(mapAddon),
    image,
  };
}

export function mapProducts(payload: unknown) {
  const raw = Array.isArray(payload)
    ? payload
    : ((payload as { products?: unknown[]; items?: unknown[] })?.products ??
      (payload as { products?: unknown[]; items?: unknown[] })?.items ??
      []);

  return raw
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map(mapProduct);
}
