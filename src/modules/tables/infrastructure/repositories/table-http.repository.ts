import { apiClient } from "@/shared/lib/api/http-client";
import type { TablesRepository } from "@/modules/tables/domain/table.repository";
import type { CreateTablePayload } from "@/modules/tables/domain/table.types";
import { mapTable, mapTablesResponse } from "@/modules/tables/infrastructure/mappers/table.mapper";

export class HttpTablesRepository implements TablesRepository {
  async list(token: string) {
    const payload = await apiClient<unknown>("/api/v1/admin/tables", { token });
    return mapTablesResponse(payload);
  }

  async create(token: string, input: CreateTablePayload) {
    const payload = await apiClient<Record<string, unknown>>("/api/v1/admin/tables", {
      method: "POST",
      token,
      body: JSON.stringify(input),
    });
    return mapTable(payload);
  }

  async regenerateQr(token: string, tableId: number) {
    const payload = await apiClient<Record<string, unknown>>(`/api/v1/admin/tables/${tableId}/regenerate-qr`, {
      method: "PATCH",
      token,
    });
    return mapTable(payload);
  }

  async deactivate(token: string, tableId: number) {
    await apiClient(`/api/v1/admin/tables/${tableId}/deactivate`, {
      method: "PATCH",
      token,
    });
  }
}

export const tablesRepository = new HttpTablesRepository();
