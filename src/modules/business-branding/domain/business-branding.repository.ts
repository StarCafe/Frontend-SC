import type { BusinessBrandingEntity } from "@/modules/business-branding/domain/business-branding.entity";

export interface BusinessBrandingRepository {
  get(token: string): Promise<BusinessBrandingEntity>;
  updateTheme(token: string, themeKey: string): Promise<void>;
  updateLogo(token: string, file: File): Promise<void>;
}
