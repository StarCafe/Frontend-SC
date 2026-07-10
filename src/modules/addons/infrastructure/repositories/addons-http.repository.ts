import { apiClient } from "@/shared/lib/api/http-client";
import type { AddonsRepository } from "@/modules/addons/domain/addon.repository";
import type { CreateAddonPayload } from "@/modules/addons/domain/addon.types";
import { mapAddon, mapAddons } from "@/modules/addons/infrastructure/mappers/addon.mapper";

export class HttpAddonsRepository implements AddonsRepository {
  async list(token: string) {
    const payload = await apiClient<unknown>("/api/v1/admin/addons", { token });
    return mapAddons(payload);
  }

  async create(token: string, payload: CreateAddonPayload) {
    const response = await apiClient<Record<string, unknown>>("/api/v1/admin/addons", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    });

    return mapAddon(response);
  }

  async assignToProduct(token: string, productId: number, addonId: number) {
    await apiClient(`/api/v1/admin/products/${productId}/addons/${addonId}`, {
      method: "POST",
      token,
    });
  }
}

export const addonsRepository = new HttpAddonsRepository();
