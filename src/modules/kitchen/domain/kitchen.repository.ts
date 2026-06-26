import type { OrderEntity } from "@/modules/orders/domain/order.entity";

export interface KitchenRepository {
  listActive(token: string): Promise<OrderEntity[]>;
  listHistory(token: string): Promise<OrderEntity[]>;
  markPreparing(token: string, orderId: number): Promise<void>;
  markItemReady(token: string, itemId: number): Promise<void>;
  markReady(token: string, orderId: number): Promise<void>;
}
