import type { AddonEntity } from "@/modules/addons/domain/addon.entity";

export interface MenuProductEntity {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  imageUrl: string | null;
  addons: AddonEntity[];
}

export interface MenuCategoryEntity {
  id: number;
  name: string;
  products: MenuProductEntity[];
}
