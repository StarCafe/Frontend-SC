import { apiClient } from "@/shared/lib/api/http-client";
import type { PublicOrderingRepository } from "@/modules/public-ordering/domain/public-ordering.repository";
import type { PublicCreateOrderPayload } from "@/modules/public-ordering/domain/public-ordering.types";
import { mapOrder } from "@/modules/orders/infrastructure/mappers/order.mapper";
import {
  groupMenu,
  mapPublicTableSession,
} from "@/modules/public-ordering/infrastructure/mappers/public-ordering.mapper";

export class HttpPublicOrderingRepository implements PublicOrderingRepository {
  async getSession(qrToken: string) {
    const payload = await apiClient<Record<string, unknown>>(`/api/v1/public/tables/${qrToken}/session`);
    return mapPublicTableSession(payload);
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
