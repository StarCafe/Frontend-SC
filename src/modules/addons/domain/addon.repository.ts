import type { AddonEntity } from "@/modules/addons/domain/addon.entity";
import type { CreateAddonPayload } from "@/modules/addons/domain/addon.types";

export interface AddonsRepository {
  list(token: string): Promise<AddonEntity[]>;
  create(token: string, payload: CreateAddonPayload): Promise<AddonEntity>;
  assignToProduct(token: string, productId: number, addonId: number): Promise<void>;
}
