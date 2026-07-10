import { mapOrder } from "@/modules/orders/infrastructure/mappers/order.mapper";
import type { PublicTableSession } from "@/modules/public-ordering/domain/public-ordering.entity";

export function mapPublicTableSession(payload: Record<string, unknown>): PublicTableSession {
  const business =
    typeof payload.business === "object" && payload.business !== null
      ? (payload.business as Record<string, unknown>)
      : null;
  const table =
    typeof payload.table === "object" && payload.table !== null
      ? (payload.table as Record<string, unknown>)
      : null;
  const activeOrders = Array.isArray(payload.activeOrders) ? payload.activeOrders : [];

  return {
    businessId: Number(business?.id ?? payload.businessId ?? table?.businessId ?? 0),
    businessSlug: String(business?.slug ?? payload.businessSlug ?? ""),
    businessName: String(business?.name ?? payload.businessName ?? "Nova"),
    tableId: Number(table?.id ?? payload.tableId ?? payload.id ?? 0),
    tableNumber: Number(table?.tableNumber ?? payload.tableNumber ?? 0),
    qrToken: String(table?.qrToken ?? payload.qrToken ?? ""),
    isActive: Boolean(table?.isActive ?? payload.isActive ?? true),
    activeOrders: activeOrders
      .filter((order): order is Record<string, unknown> => typeof order === "object" && order !== null)
      .map(mapOrder),
    activeOrderCount: Number(payload.activeOrdersCount ?? payload.activeOrderCount ?? activeOrders.length),
    remainingSlots: Number(payload.remainingSlots ?? 0),
    canCreateMoreOrders: Boolean(payload.canCreateMoreOrders ?? false),
  };
}
