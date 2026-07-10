import type { OrderEntity } from "@/modules/orders/domain/order.entity";
import type {
  PublicCreateOrderPayload,
} from "@/modules/public-ordering/domain/public-ordering.types";
import type {
  PublicTableSession,
} from "@/modules/public-ordering/domain/public-ordering.entity";

export interface PublicOrderingRepository {
  getSession(qrToken: string): Promise<PublicTableSession>;
  createOrder(qrToken: string, payload: PublicCreateOrderPayload): Promise<OrderEntity>;
  getOrderStatus(orderId: number, qrToken: string): Promise<OrderEntity>;
}
