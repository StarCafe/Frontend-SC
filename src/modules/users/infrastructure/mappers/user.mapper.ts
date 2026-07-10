import type { UserEntity, UserRole } from "@/modules/users/domain/user.entity";

function resolveRole(value: unknown): UserRole {
  if (value === "SUPER_ADMIN") {
    return "SUPER_ADMIN";
  }

  if (value === "KITCHEN") {
    return "KITCHEN";
  }

  return "ADMIN";
}

export function mapUser(payload: Record<string, unknown>): UserEntity {
  return {
    id: Number(payload.id ?? 0),
    businessId: payload.businessId === null || payload.businessId === undefined ? null : Number(payload.businessId),
    name: String(payload.name ?? ""),
    email: String(payload.email ?? ""),
    role: resolveRole(payload.role),
    isActive: Boolean(payload.isActive ?? true),
  };
}

export function mapUsers(payload: unknown) {
  const raw = Array.isArray(payload)
    ? payload
    : ((payload as { users?: unknown[]; items?: unknown[] })?.users ??
      (payload as { users?: unknown[]; items?: unknown[] })?.items ??
      []);

  return raw
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map(mapUser);
}
