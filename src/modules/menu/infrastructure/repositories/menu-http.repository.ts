import { apiClient } from "@/shared/lib/api/http-client";
import type { MenuRepository } from "@/modules/menu/domain/menu.repository";
import { mapMenu } from "@/modules/menu/infrastructure/mappers/menu.mapper";

export class HttpMenuRepository implements MenuRepository {
  async listPublic(businessSlug: string) {
    const payload = await apiClient<unknown>("/api/v1/public/menu", {
      query: { businessSlug },
    });

    return mapMenu(payload);
  }
}

export const menuRepository = new HttpMenuRepository();
