import type { AddonEntity } from "@/modules/addons/domain/addon.entity";

export interface ProductImageEntity {
  id: number;
  fileName: string;
  mimeType: string;
  fileSize: number;
  url: string;
}

export interface ProductEntity {
  id: number;
  businessId: number | null;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  isActive: boolean;
  addons: AddonEntity[];
  image: ProductImageEntity | null;
}
