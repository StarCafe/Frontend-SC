import type { AuthSession, AuthUser, Role } from "@/modules/auth/domain/auth.entity";

function resolveRole(value: unknown): Role {
  return value === "KITCHEN" ? "KITCHEN" : "ADMIN";
}

export function mapAuthUser(payload: Record<string, unknown>): AuthUser {
  return {
    id: Number(payload.id ?? 0),
    name: String(payload.name ?? payload.fullName ?? payload.username ?? "Usuario StarCafe"),
    email: String(payload.email ?? ""),
    role: resolveRole(payload.role),
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
