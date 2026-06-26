import { apiClient } from "@/shared/lib/api/http-client";
import { mapOrder } from "@/modules/orders/infrastructure/orders.repository.impl";
import type { KitchenRepository } from "@/modules/kitchen/domain/kitchen.repository";

function extractOrders(payload: unknown) {
  const raw = Array.isArray(payload)
    ? payload
    : ((payload as { orders?: unknown[]; items?: unknown[] })?.orders ??
      (payload as { orders?: unknown[]; items?: unknown[] })?.items ??
      []);

  return raw
    .filter((order): order is Record<string, unknown> => typeof order === "object" && order !== null)
    .map(mapOrder);
}

export class HttpKitchenRepository implements KitchenRepository {
  async listActive(token: string) {
    const payload = await apiClient<unknown>("/api/v1/kitchen/orders", { token });
    return extractOrders(payload);
  }

  async listHistory(token: string) {
    const payload = await apiClient<unknown>("/api/v1/kitchen/orders/history", { token });
    return extractOrders(payload);
  }

  async markPreparing(token: string, orderId: number) {
    await apiClient(`/api/v1/kitchen/orders/${orderId}/preparing`, {
      method: "PATCH",
      token,
    });
  }

  async markItemReady(token: string, itemId: number) {
    await apiClient(`/api/v1/kitchen/order-items/${itemId}/ready`, {
      method: "PATCH",
      token,
    });
  }

  async markReady(token: string, orderId: number) {
    await apiClient(`/api/v1/kitchen/orders/${orderId}/ready`, {
      method: "PATCH",
      token,
    });
  }
}

export const kitchenRepository = new HttpKitchenRepository();
