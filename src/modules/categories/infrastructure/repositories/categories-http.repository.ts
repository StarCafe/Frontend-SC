import { apiClient } from "@/shared/lib/api/http-client";
import type { CategoriesRepository } from "@/modules/categories/domain/category.repository";
import type { CreateCategoryPayload } from "@/modules/categories/domain/category.types";
import { mapCategories, mapCategory } from "@/modules/categories/infrastructure/mappers/category.mapper";

export class HttpCategoriesRepository implements CategoriesRepository {
  async list(token: string) {
    const payload = await apiClient<unknown>("/api/v1/admin/categories", { token });
    return mapCategories(payload);
  }

  async create(token: string, payload: CreateCategoryPayload) {
    const response = await apiClient<Record<string, unknown>>("/api/v1/admin/categories", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    });

    return mapCategory(response);
  }
}

export const categoriesRepository = new HttpCategoriesRepository();
