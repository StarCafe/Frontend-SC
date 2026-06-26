export type OrderStatus = "PENDING" | "PREPARING" | "READY" | "CANCELLED" | "PAID" | string;

export interface OrderItemEntity {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  notes: string;
  status: string;
}

export interface OrderEntity {
  id: number;
  tableId: number;
  tableNumber: number;
  customerName: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItemEntity[];
}
