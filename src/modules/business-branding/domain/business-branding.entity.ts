export interface AvailableThemeEntity {
  key: string;
  label: string;
  primaryColor?: string;
}

export interface BusinessBrandingEntity {
  businessId?: number | null;
  name: string;
  slug: string;
  logoUrl: string;
  primaryColor: string;
  themeKey: string;
  availableThemes: AvailableThemeEntity[];
}
