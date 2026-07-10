import type { TableEntity } from "@/modules/tables/domain/table.entity";

export function mapTable(payload: Record<string, unknown>): TableEntity {
  return {
    id: Number(payload.id ?? 0),
    businessId: payload.businessId === null || payload.businessId === undefined ? null : Number(payload.businessId),
    businessName: String(payload.businessName ?? ""),
    businessSlug: String(payload.businessSlug ?? ""),
    tableNumber: Number(payload.tableNumber ?? payload.number ?? 0),
    qrToken: String(payload.qrToken ?? ""),
    qrUrl: String(payload.qrUrl ?? ""),
    isActive: Boolean(payload.isActive ?? true),
  };
}

export function mapTablesResponse(payload: unknown): TableEntity[] {
  const raw = Array.isArray(payload)
    ? payload
    : ((payload as { tables?: unknown[]; items?: unknown[] })?.tables ??
      (payload as { tables?: unknown[]; items?: unknown[] })?.items ??
      []);

  return raw
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map(mapTable);
}
