import type { KitchenRepository } from "@/modules/kitchen/domain/kitchen.repository";

export function listKitchenOrdersUseCase(repository: KitchenRepository, token: string) {
  return repository.listActive(token);
}

export function listKitchenHistoryUseCase(repository: KitchenRepository, token: string) {
  return repository.listHistory(token);
}

export function markKitchenOrderPreparingUseCase(repository: KitchenRepository, token: string, orderId: number) {
  return repository.markPreparing(token, orderId);
}

export function markKitchenItemReadyUseCase(repository: KitchenRepository, token: string, itemId: number) {
  return repository.markItemReady(token, itemId);
}

export function markKitchenOrderReadyUseCase(repository: KitchenRepository, token: string, orderId: number) {
  return repository.markReady(token, orderId);
}
