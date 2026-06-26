import { apiClient } from "@/shared/lib/api/http-client";
import type { AuthRepository } from "@/modules/auth/domain/auth.repository";
import type { LoginCredentials } from "@/modules/auth/domain/auth.types";
import { mapAuthSession, mapAuthUser } from "@/modules/auth/infrastructure/mappers/auth.mapper";

export class HttpAuthRepository implements AuthRepository {
  async login(credentials: LoginCredentials) {
    const payload = await apiClient<Record<string, unknown>>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    return mapAuthSession(payload);
  }

  async me(token: string) {
    const payload = await apiClient<Record<string, unknown>>("/api/v1/auth/me", {
      token,
    });

    return mapAuthUser(payload);
  }
}

export const authRepository = new HttpAuthRepository();
