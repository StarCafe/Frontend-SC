import type {
  AvailableThemeEntity,
  BusinessBrandingEntity,
} from "@/modules/business-branding/domain/business-branding.entity";

function resolveBusinessBrandingId(payload: Record<string, unknown>, business: Record<string, unknown> | null) {
  const candidates = [
    payload.businessId,
    payload.business_id,
    payload.id,
    business?.id,
    business?.businessId,
    business?.business_id,
  ];

  for (const candidate of candidates) {
    if (candidate !== null && candidate !== undefined && candidate !== "") {
      return Number(candidate);
    }
  }

  return null;
}

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
  const key = String(record.key ?? record.themeKey ?? record.theme_key ?? record.id ?? "");

  if (!key) {
    return null;
  }

  return {
    key,
    label: String(record.label ?? record.name ?? record.displayName ?? record.display_name ?? key),
    primaryColor:
      (record.primaryColor ?? record.primary_color) === null ||
      (record.primaryColor ?? record.primary_color) === undefined
        ? undefined
        : String(record.primaryColor ?? record.primary_color),
  };
}

export function mapBusinessBranding(payload: Record<string, unknown>): BusinessBrandingEntity {
  const business =
    typeof payload.business === "object" && payload.business !== null
      ? (payload.business as Record<string, unknown>)
      : null;
  const rawThemes = Array.isArray(payload.availableThemes)
    ? payload.availableThemes
    : Array.isArray(payload.available_themes)
      ? payload.available_themes
      : [];
  const availableThemes = rawThemes
    .map(mapTheme)
    .filter((theme): theme is AvailableThemeEntity => Boolean(theme));
  const themeKey = String(payload.themeKey ?? payload.theme_key ?? business?.themeKey ?? business?.theme_key ?? "");
  const resolvedPrimaryColor = String(
    payload.primaryColor ??
      payload.primary_color ??
      business?.primaryColor ??
      business?.primary_color ??
      availableThemes.find((theme) => theme.key === themeKey)?.primaryColor ??
      "",
  );

  if (themeKey && !availableThemes.some((theme) => theme.key === themeKey)) {
    availableThemes.unshift({
      key: themeKey,
      label: themeKey,
      primaryColor: resolvedPrimaryColor || undefined,
    });
  }

  return {
    businessId: resolveBusinessBrandingId(payload, business),
    name: String(payload.name ?? payload.businessName ?? payload.business_name ?? business?.name ?? "Nova"),
    slug: String(payload.slug ?? payload.businessSlug ?? payload.business_slug ?? business?.slug ?? ""),
    logoUrl: String(payload.logoUrl ?? payload.logo_url ?? business?.logoUrl ?? business?.logo_url ?? ""),
    primaryColor: resolvedPrimaryColor,
    themeKey,
    availableThemes,
  };
}
