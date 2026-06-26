import { apiClient } from "@/shared/lib/api/http-client";
import type { TablesRepository } from "@/modules/tables/domain/tables.repository";
import type { CreateTablePayload, TableEntity } from "@/modules/tables/domain/table.types";

function mapTable(payload: Record<string, unknown>): TableEntity {
  return {
    id: Number(payload.id ?? 0),
    tableNumber: Number(payload.tableNumber ?? payload.number ?? 0),
    qrToken: String(payload.qrToken ?? ""),
    qrUrl: String(payload.qrUrl ?? ""),
    isActive: Boolean(payload.isActive ?? true),
  };
}

function mapTablesResponse(payload: unknown): TableEntity[] {
  const raw = Array.isArray(payload)
    ? payload
    : ((payload as { tables?: unknown[]; items?: unknown[] })?.tables ??
      (payload as { tables?: unknown[]; items?: unknown[] })?.items ??
      []);

  return raw
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map(mapTable);
}

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
