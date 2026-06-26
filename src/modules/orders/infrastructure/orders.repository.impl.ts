import { apiClient } from "@/shared/lib/api/http-client";
import type { OrdersRepository } from "@/modules/orders/domain/orders.repository";
import type { OrderEntity, OrderItemEntity } from "@/modules/orders/domain/order.types";

function mapOrderItem(item: Record<string, unknown>): OrderItemEntity {
  return {
    id: Number(item.id ?? 0),
    productId: Number(item.productId ?? 0),
    productName: String(item.productName ?? item.name ?? ""),
    quantity: Number(item.quantity ?? 0),
    unitPrice: Number(item.unitPrice ?? item.price ?? 0),
    notes: String(item.notes ?? ""),
    status: String(item.status ?? "PENDING"),
  };
}

export function mapOrder(order: Record<string, unknown>): OrderEntity {
  const items = Array.isArray(order.items) ? order.items : [];

  return {
    id: Number(order.id ?? 0),
    tableId: Number(order.tableId ?? 0),
    tableNumber: Number(order.tableNumber ?? 0),
    customerName: String(order.customerName ?? "Cliente"),
    status: String(order.status ?? "PENDING"),
    total: Number(order.total ?? 0),
    createdAt: String(order.createdAt ?? ""),
    updatedAt: String(order.updatedAt ?? order.createdAt ?? ""),
    items: items
      .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
      .map(mapOrderItem),
  };
}

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
