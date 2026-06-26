import type { OrdersRepository } from "@/modules/orders/domain/orders.repository";

export function listAdminOrdersUseCase(repository: OrdersRepository, token: string) {
  return repository.listActive(token);
}

export function listOrderHistoryUseCase(repository: OrdersRepository, token: string) {
  return repository.listHistory(token);
}

export function cancelOrderUseCase(repository: OrdersRepository, token: string, orderId: number) {
  return repository.cancel(token, orderId);
}
