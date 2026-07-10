export type OrderStatus = "PENDING" | "PREPARING" | "READY" | "CANCELLED" | "PAID" | string;

export interface OrderItemAddonEntity {
  addonId: number;
  name: string;
  price: number;
}

export interface OrderItemEntity {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  notes: string;
  status: string;
  addons?: OrderItemAddonEntity[];
}

export interface OrderEntity {
  id: number;
  businessId?: number | null;
  tableId: number;
  tableNumber: number;
  customerName: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItemEntity[];
}
