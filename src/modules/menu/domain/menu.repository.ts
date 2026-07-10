import type { MenuCategoryEntity } from "@/modules/menu/domain/menu.entity";

export interface MenuRepository {
  listPublic(businessSlug: string): Promise<MenuCategoryEntity[]>;
}
