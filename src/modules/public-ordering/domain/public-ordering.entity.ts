import type { OrderEntity } from "@/modules/orders/domain/order.entity";

export interface PublicTableSession {
  businessId: number;
  businessSlug: string;
  businessName: string;
  businessLogoUrl?: string;
  businessPrimaryColor?: string;
  businessThemeKey?: string;
  tableId: number;
  tableNumber: number;
  qrToken: string;
  isActive: boolean;
  activeOrders: OrderEntity[];
  activeOrderCount: number;
  remainingSlots: number;
  canCreateMoreOrders: boolean;
}
