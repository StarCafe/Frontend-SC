import type { OrderEntity } from "@/modules/orders/domain/order.entity";

export interface CashierSearchFilters {
  customerName?: string;
  tableNumber?: number;
  status?: string;
}

export interface CashierRepository {
  search(token: string, filters: CashierSearchFilters): Promise<OrderEntity[]>;
  pay(token: string, orderId: number): Promise<void>;
}
