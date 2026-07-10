import type { OrderEntity, OrderItemAddonEntity, OrderItemEntity } from "@/modules/orders/domain/order.entity";

function mapOrderItemAddon(item: Record<string, unknown>): OrderItemAddonEntity {
  return {
    addonId: Number(item.addonId ?? item.id ?? 0),
    name: String(item.name ?? ""),
    price: Number(item.price ?? 0),
  };
}

function mapOrderItem(item: Record<string, unknown>): OrderItemEntity {
  const addons = Array.isArray(item.addons) ? item.addons : [];

  return {
    id: Number(item.id ?? 0),
    productId: Number(item.productId ?? 0),
    productName: String(item.productName ?? item.name ?? ""),
    quantity: Number(item.quantity ?? 0),
    unitPrice: Number(item.unitPrice ?? item.price ?? 0),
    notes: String(item.notes ?? ""),
    status: String(item.status ?? "PENDING"),
    addons: addons
      .filter((addon): addon is Record<string, unknown> => typeof addon === "object" && addon !== null)
      .map(mapOrderItemAddon),
  };
}

export function mapOrder(order: Record<string, unknown>): OrderEntity {
  const items = Array.isArray(order.items) ? order.items : [];

  return {
    id: Number(order.id ?? 0),
    businessId: order.businessId === null || order.businessId === undefined ? null : Number(order.businessId),
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

export function extractOrders(payload: unknown) {
  const raw = Array.isArray(payload)
    ? payload
    : ((payload as { orders?: unknown[]; items?: unknown[] })?.orders ??
      (payload as { orders?: unknown[]; items?: unknown[] })?.items ??
      []);

  return raw
    .filter((order): order is Record<string, unknown> => typeof order === "object" && order !== null)
    .map(mapOrder);
}
