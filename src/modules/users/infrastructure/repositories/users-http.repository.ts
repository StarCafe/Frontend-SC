import { apiClient } from "@/shared/lib/api/http-client";
import type { UsersRepository } from "@/modules/users/domain/user.repository";
import type { CreateUserPayload } from "@/modules/users/domain/user.types";
import { mapUser, mapUsers } from "@/modules/users/infrastructure/mappers/user.mapper";

export class HttpUsersRepository implements UsersRepository {
  async list(token: string) {
    const payload = await apiClient<unknown>("/api/v1/admin/users", { token });
    return mapUsers(payload);
  }

  async create(token: string, payload: CreateUserPayload) {
    const response = await apiClient<Record<string, unknown>>("/api/v1/admin/users", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    });

    return mapUser(response);
  }

  async deactivate(token: string, userId: number) {
    await apiClient(`/api/v1/admin/users/${userId}/deactivate`, {
      method: "PATCH",
      token,
    });
  }
}

export const usersRepository = new HttpUsersRepository();
