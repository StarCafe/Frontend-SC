import type { AuthSession, AuthUser, Role } from "@/modules/auth/domain/auth.entity";

function resolveRole(value: unknown): Role {
  if (value === "SUPER_ADMIN") {
    return "SUPER_ADMIN";
  }

  if (value === "KITCHEN") {
    return "KITCHEN";
  }

  return "ADMIN";
}

function resolveBusinessId(payload: Record<string, unknown>, business: Record<string, unknown> | null) {
  const candidates = [
    payload.businessId,
    payload.business_id,
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

export function mapAuthUser(payload: Record<string, unknown>): AuthUser {
  const business =
    typeof payload.business === "object" && payload.business !== null
      ? (payload.business as Record<string, unknown>)
      : null;

  return {
    id: Number(payload.id ?? 0),
    name: String(payload.name ?? payload.fullName ?? payload.username ?? "Usuario StarCafe"),
    email: String(payload.email ?? ""),
    role: resolveRole(payload.role),
    businessId: resolveBusinessId(payload, business),
    businessName: String(business?.name ?? payload.businessName ?? payload.business_name ?? ""),
    businessSlug: String(business?.slug ?? payload.businessSlug ?? payload.business_slug ?? ""),
    businessLogoUrl: String(business?.logoUrl ?? business?.logo_url ?? payload.logoUrl ?? payload.logo_url ?? ""),
    businessPrimaryColor: String(
      business?.primaryColor ?? business?.primary_color ?? payload.primaryColor ?? payload.primary_color ?? "",
    ),
    businessThemeKey: String(business?.themeKey ?? business?.theme_key ?? payload.themeKey ?? payload.theme_key ?? ""),
    isActive: payload.isActive === undefined ? true : Boolean(payload.isActive),
  };
}

export function mapAuthSession(payload: Record<string, unknown>): AuthSession {
  const userPayload =
    (payload.user as Record<string, unknown> | undefined) ??
    (payload.me as Record<string, unknown> | undefined) ??
    payload;

  return {
    token: String(payload.token ?? payload.jwt ?? payload.accessToken ?? ""),
    user: mapAuthUser(userPayload),
  };
}
