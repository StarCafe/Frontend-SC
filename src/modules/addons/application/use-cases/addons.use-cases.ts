import type { AddonsRepository } from "@/modules/addons/domain/addon.repository";
import type { CreateAddonPayload } from "@/modules/addons/domain/addon.types";

export function listAddonsUseCase(repository: AddonsRepository, token: string) {
  return repository.list(token);
}

export function createAddonUseCase(repository: AddonsRepository, token: string, payload: CreateAddonPayload) {
  return repository.create(token, payload);
}

export function assignAddonToProductUseCase(
  repository: AddonsRepository,
  token: string,
  productId: number,
  addonId: number,
) {
  return repository.assignToProduct(token, productId, addonId);
}
