import type { PublicOrderingRepository } from "@/modules/public-ordering/domain/public-ordering.repository";
import type { PublicCreateOrderPayload } from "@/modules/public-ordering/domain/public-ordering.types";

export function getPublicTableSessionUseCase(repository: PublicOrderingRepository, qrToken: string) {
  return repository.getSession(qrToken);
}

export function getPublicMenuUseCase(repository: PublicOrderingRepository) {
  return repository.getMenu();
}

export function createPublicOrderUseCase(
  repository: PublicOrderingRepository,
  qrToken: string,
  payload: PublicCreateOrderPayload,
) {
  return repository.createOrder(qrToken, payload);
}

export function getPublicOrderStatusUseCase(repository: PublicOrderingRepository, orderId: number) {
  return repository.getOrderStatus(orderId);
}
