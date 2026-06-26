import { apiClient } from "@/shared/lib/api/http-client";
import type { AuthRepository } from "@/modules/auth/domain/auth.repository";
import type { AuthSession, AuthUser, LoginCredentials, Role } from "@/modules/auth/domain/auth.types";

function resolveRole(value: unknown): Role {
  return value === "KITCHEN" ? "KITCHEN" : "ADMIN";
}

function mapUser(payload: Record<string, unknown>): AuthUser {
  return {
    id: Number(payload.id ?? 0),
    name: String(payload.name ?? payload.fullName ?? payload.username ?? "Usuario StarCafe"),
    email: String(payload.email ?? ""),
    role: resolveRole(payload.role),
    isActive: payload.isActive === undefined ? true : Boolean(payload.isActive),
  };
}

function mapSession(payload: Record<string, unknown>): AuthSession {
  const userPayload =
    (payload.user as Record<string, unknown> | undefined) ??
    (payload.me as Record<string, unknown> | undefined) ??
    payload;

  return {
    token: String(payload.token ?? payload.jwt ?? payload.accessToken ?? ""),
    user: mapUser(userPayload),
  };
}

export class HttpAuthRepository implements AuthRepository {
  async login(credentials: LoginCredentials) {
    const payload = await apiClient<Record<string, unknown>>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    return mapSession(payload);
  }

  async me(token: string) {
    const payload = await apiClient<Record<string, unknown>>("/api/v1/auth/me", {
      token,
    });

    return mapUser(payload);
  }
}

export const authRepository = new HttpAuthRepository();
