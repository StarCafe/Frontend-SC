import { apiClient } from "@/shared/lib/api/http-client";
import { mapOrder } from "@/modules/orders/infrastructure/orders.repository.impl";
import type { PublicOrderingRepository } from "@/modules/public-ordering/domain/public-ordering.repository";
import type {
  PublicCreateOrderPayload,
  PublicMenuCategory,
  PublicMenuProduct,
  PublicTableSession,
} from "@/modules/public-ordering/domain/public-ordering.types";

function mapMenuProduct(product: Record<string, unknown>): PublicMenuProduct {
  return {
    id: Number(product.id ?? 0),
    categoryId: Number(product.categoryId ?? 0),
    categoryName: String(product.categoryName ?? product.category ?? "Especialidades"),
    name: String(product.name ?? ""),
    description: String(product.description ?? ""),
    price: Number(product.price ?? 0),
    isAvailable: Boolean(product.isAvailable ?? true),
    imageUrl: typeof product.image === "object" && product.image !== null
      ? String((product.image as { url?: string }).url ?? "")
      : product.imageUrl
        ? String(product.imageUrl)
        : null,
  };
}

function groupMenu(payload: unknown): PublicMenuCategory[] {
  const rawProducts = Array.isArray(payload)
    ? payload
    : ((payload as { products?: unknown[]; items?: unknown[] })?.products ??
      (payload as { products?: unknown[]; items?: unknown[] })?.items ??
      []);

  const products = rawProducts
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map(mapMenuProduct);

  const categoriesMap = new Map<number, PublicMenuCategory>();

  products.forEach((product) => {
    if (!categoriesMap.has(product.categoryId)) {
      categoriesMap.set(product.categoryId, {
        id: product.categoryId,
        name: product.categoryName,
        products: [],
      });
    }

    categoriesMap.get(product.categoryId)?.products.push(product);
  });

  return Array.from(categoriesMap.values());
}

function mapSession(payload: Record<string, unknown>): PublicTableSession {
  const activeOrders = Array.isArray(payload.activeOrders) ? payload.activeOrders : [];

  return {
    tableId: Number(payload.tableId ?? payload.id ?? 0),
    tableNumber: Number(payload.tableNumber ?? 0),
    qrToken: String(payload.qrToken ?? ""),
    isActive: Boolean(payload.isActive ?? true),
    activeOrders: activeOrders
      .filter((order): order is Record<string, unknown> => typeof order === "object" && order !== null)
      .map(mapOrder),
    activeOrderCount: Number(payload.activeOrderCount ?? activeOrders.length ?? 0),
    remainingSlots: Number(payload.remainingSlots ?? 0),
    canCreateMoreOrders: Boolean(payload.canCreateMoreOrders ?? false),
  };
}

export class HttpPublicOrderingRepository implements PublicOrderingRepository {
  async getSession(qrToken: string) {
    const payload = await apiClient<Record<string, unknown>>(`/api/v1/public/tables/${qrToken}/session`);
    return mapSession(payload);
  }

  async getMenu() {
    const payload = await apiClient<unknown>("/api/v1/public/menu");
    return groupMenu(payload);
  }

  async createOrder(qrToken: string, input: PublicCreateOrderPayload) {
    const payload = await apiClient<Record<string, unknown>>(`/api/v1/public/tables/${qrToken}/orders`, {
      method: "POST",
      body: JSON.stringify(input),
    });
    return mapOrder(payload);
  }

  async getOrderStatus(orderId: number) {
    const payload = await apiClient<Record<string, unknown>>(`/api/v1/public/orders/${orderId}/status`);
    return mapOrder(payload);
  }
}

export const publicOrderingRepository = new HttpPublicOrderingRepository();
