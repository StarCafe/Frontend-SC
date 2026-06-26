import { apiClient } from "@/shared/lib/api/http-client";
import type { OrdersRepository } from "@/modules/orders/domain/order.repository";
import { extractOrders } from "@/modules/orders/infrastructure/mappers/order.mapper";

export class HttpOrdersRepository implements OrdersRepository {
  async listActive(token: string) {
    const payload = await apiClient<unknown>("/api/v1/admin/orders", { token });
    return extractOrders(payload);
  }

  async listHistory(token: string) {
    const payload = await apiClient<unknown>("/api/v1/admin/orders/history", { token });
    return extractOrders(payload);
  }

  async cancel(token: string, orderId: number) {
    await apiClient(`/api/v1/admin/orders/${orderId}/cancel`, {
      method: "PATCH",
      token,
    });
  }
}

export const ordersRepository = new HttpOrdersRepository();
