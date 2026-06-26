import type { OrderEntity } from "@/modules/orders/domain/order.types";

export interface OrdersRepository {
  listActive(token: string): Promise<OrderEntity[]>;
  listHistory(token: string): Promise<OrderEntity[]>;
  cancel(token: string, orderId: number): Promise<void>;
}
