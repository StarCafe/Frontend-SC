import type { OrderEntity } from "@/modules/orders/domain/order.entity";

export interface PublicTableSession {
  tableId: number;
  tableNumber: number;
  qrToken: string;
  isActive: boolean;
  activeOrders: OrderEntity[];
  activeOrderCount: number;
  remainingSlots: number;
  canCreateMoreOrders: boolean;
}

export interface PublicMenuProduct {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  imageUrl: string | null;
}

export interface PublicMenuCategory {
  id: number;
  name: string;
  products: PublicMenuProduct[];
}
