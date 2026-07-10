import { apiClient } from "@/shared/lib/api/http-client";
import type { PublicOrderingRepository } from "@/modules/public-ordering/domain/public-ordering.repository";
import type { PublicCreateOrderPayload } from "@/modules/public-ordering/domain/public-ordering.types";
import { mapOrder } from "@/modules/orders/infrastructure/mappers/order.mapper";
import {
  mapPublicTableSession,
} from "@/modules/public-ordering/infrastructure/mappers/public-ordering.mapper";

export class HttpPublicOrderingRepository implements PublicOrderingRepository {
  async getSession(qrToken: string) {
    const payload = await apiClient<Record<string, unknown>>(`/api/v1/public/tables/${qrToken}/session`);
    return mapPublicTableSession(payload);
  }

  async createOrder(qrToken: string, input: PublicCreateOrderPayload) {
    const payload = await apiClient<Record<string, unknown>>(`/api/v1/public/tables/${qrToken}/orders`, {
      method: "POST",
      body: JSON.stringify(input),
    });
    return mapOrder(payload);
  }

  async getOrderStatus(orderId: number, qrToken: string) {
    const payload = await apiClient<Record<string, unknown>>(`/api/v1/public/orders/${orderId}/status`, {
      query: { qrToken },
    });
    return mapOrder(payload);
  }
}

export const publicOrderingRepository = new HttpPublicOrderingRepository();
