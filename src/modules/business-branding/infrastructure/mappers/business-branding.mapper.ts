import type {
  AvailableThemeEntity,
  BusinessBrandingEntity,
} from "@/modules/business-branding/domain/business-branding.entity";

function mapTheme(payload: unknown): AvailableThemeEntity | null {
  if (typeof payload === "string") {
    return {
      key: payload,
      label: payload,
    };
  }

  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const key = String(record.key ?? record.themeKey ?? record.id ?? "");

  if (!key) {
    return null;
  }

  return {
    key,
    label: String(record.label ?? record.name ?? key),
    primaryColor:
      record.primaryColor === null || record.primaryColor === undefined
        ? undefined
        : String(record.primaryColor),
  };
}

export function mapBusinessBranding(payload: Record<string, unknown>): BusinessBrandingEntity {
  const rawThemes = Array.isArray(payload.availableThemes) ? payload.availableThemes : [];
  const availableThemes = rawThemes
    .map(mapTheme)
    .filter((theme): theme is AvailableThemeEntity => Boolean(theme));
  const themeKey = String(payload.themeKey ?? "");

  if (themeKey && !availableThemes.some((theme) => theme.key === themeKey)) {
    availableThemes.unshift({
      key: themeKey,
      label: themeKey,
      primaryColor:
        payload.primaryColor === null || payload.primaryColor === undefined
          ? undefined
          : String(payload.primaryColor),
    });
  }

  return {
    name: String(payload.name ?? "Nova"),
    slug: String(payload.slug ?? ""),
    logoUrl: String(payload.logoUrl ?? ""),
    primaryColor: String(payload.primaryColor ?? ""),
    themeKey,
    availableThemes,
  };
}
