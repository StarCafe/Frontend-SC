import { apiClient } from "@/shared/lib/api/http-client";
import type { BusinessBrandingRepository } from "@/modules/business-branding/domain/business-branding.repository";
import { mapBusinessBranding } from "@/modules/business-branding/infrastructure/mappers/business-branding.mapper";

function toLogoFormData(file: File) {
  const formData = new FormData();
  formData.append("logo", file);
  return formData;
}

export class HttpBusinessBrandingRepository implements BusinessBrandingRepository {
  async get(token: string) {
    const payload = await apiClient<Record<string, unknown>>("/api/v1/admin/business", {
      token,
    });

    return mapBusinessBranding(payload);
  }

  async updateTheme(token: string, themeKey: string) {
    await apiClient("/api/v1/admin/business/theme", {
      method: "PATCH",
      token,
      body: JSON.stringify({ themeKey }),
    });
  }

  async updateLogo(token: string, file: File) {
    await apiClient("/api/v1/admin/business/logo", {
      method: "PATCH",
      token,
      body: toLogoFormData(file),
    });
  }
}

export const businessBrandingRepository = new HttpBusinessBrandingRepository();
