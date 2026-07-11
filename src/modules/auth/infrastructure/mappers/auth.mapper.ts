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
    businessId: payload.businessId === null || payload.businessId === undefined ? null : Number(payload.businessId),
    businessName: String(business?.name ?? payload.businessName ?? payload.business_name ?? ""),
    businessSlug: String(business?.slug ?? payload.businessSlug ?? payload.business_slug ?? ""),
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
