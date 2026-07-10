import type { ProductsRepository } from "@/modules/products/domain/product.repository";
import type { CreateProductPayload, UpdateProductPayload } from "@/modules/products/domain/product.types";

export function listProductsUseCase(repository: ProductsRepository, token: string) {
  return repository.list(token);
}

export function createProductUseCase(repository: ProductsRepository, token: string, payload: CreateProductPayload) {
  return repository.create(token, payload);
}

export function updateProductUseCase(
  repository: ProductsRepository,
  token: string,
  productId: number,
  payload: UpdateProductPayload,
) {
  return repository.update(token, productId, payload);
}

export function activateProductUseCase(repository: ProductsRepository, token: string, productId: number) {
  return repository.activate(token, productId);
}

export function deactivateProductUseCase(repository: ProductsRepository, token: string, productId: number) {
  return repository.deactivate(token, productId);
}

export function markProductUnavailableUseCase(repository: ProductsRepository, token: string, productId: number) {
  return repository.markUnavailable(token, productId);
}

export function uploadProductImageUseCase(
  repository: ProductsRepository,
  token: string,
  productId: number,
  file: File,
) {
  return repository.uploadImage(token, productId, file);
}

export function replaceProductImageUseCase(
  repository: ProductsRepository,
  token: string,
  productId: number,
  file: File,
) {
  return repository.replaceImage(token, productId, file);
}

export function deleteProductImageUseCase(repository: ProductsRepository, token: string, productId: number) {
  return repository.deleteImage(token, productId);
}
