import type { CategoryEntity } from "@/modules/categories/domain/category.entity";
import type { CreateCategoryPayload } from "@/modules/categories/domain/category.types";

export interface CategoriesRepository {
  list(token: string): Promise<CategoryEntity[]>;
  create(token: string, payload: CreateCategoryPayload): Promise<CategoryEntity>;
}
