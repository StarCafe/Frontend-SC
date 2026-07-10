import { apiClient } from "@/shared/lib/api/http-client";
import type { ProductsRepository } from "@/modules/products/domain/product.repository";
import type { CreateProductPayload, UpdateProductPayload } from "@/modules/products/domain/product.types";
import { mapProduct, mapProducts } from "@/modules/products/infrastructure/mappers/product.mapper";

function toImageFormData(file: File) {
  const formData = new FormData();
  formData.append("image", file);
  return formData;
}

export class HttpProductsRepository implements ProductsRepository {
  async list(token: string) {
    const payload = await apiClient<unknown>("/api/v1/admin/products", { token });
    return mapProducts(payload);
  }

  async create(token: string, payload: CreateProductPayload) {
    const response = await apiClient<Record<string, unknown>>("/api/v1/admin/products", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    });

    return mapProduct(response);
  }

  async update(token: string, productId: number, payload: UpdateProductPayload) {
    const response = await apiClient<Record<string, unknown>>(`/api/v1/admin/products/${productId}`, {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    });

    return mapProduct(response);
  }

  async activate(token: string, productId: number) {
    await apiClient(`/api/v1/admin/products/${productId}/activate`, {
      method: "PATCH",
      token,
    });
  }

  async deactivate(token: string, productId: number) {
    await apiClient(`/api/v1/admin/products/${productId}/deactivate`, {
      method: "PATCH",
      token,
    });
  }

  async markUnavailable(token: string, productId: number) {
    await apiClient(`/api/v1/admin/products/${productId}/unavailable`, {
      method: "PATCH",
      token,
    });
  }

  async uploadImage(token: string, productId: number, file: File) {
    const response = await apiClient<Record<string, unknown>>(`/api/v1/admin/products/${productId}/image`, {
      method: "POST",
      token,
      body: toImageFormData(file),
    });

    return mapProduct(response);
  }

  async replaceImage(token: string, productId: number, file: File) {
    const response = await apiClient<Record<string, unknown>>(`/api/v1/admin/products/${productId}/image`, {
      method: "PATCH",
      token,
      body: toImageFormData(file),
    });

    return mapProduct(response);
  }

  async deleteImage(token: string, productId: number) {
    await apiClient(`/api/v1/admin/products/${productId}/image`, {
      method: "DELETE",
      token,
    });
  }
}

export const productsRepository = new HttpProductsRepository();
