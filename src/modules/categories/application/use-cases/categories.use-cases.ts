import type { CategoriesRepository } from "@/modules/categories/domain/category.repository";
import type { CreateCategoryPayload } from "@/modules/categories/domain/category.types";

export function listCategoriesUseCase(repository: CategoriesRepository, token: string) {
  return repository.list(token);
}

export function createCategoryUseCase(
  repository: CategoriesRepository,
  token: string,
  payload: CreateCategoryPayload,
) {
  return repository.create(token, payload);
}
