import type { CreateTablePayload, TableEntity } from "@/modules/tables/domain/table.types";

export interface TablesRepository {
  list(token: string): Promise<TableEntity[]>;
  create(token: string, payload: CreateTablePayload): Promise<TableEntity>;
  regenerateQr(token: string, tableId: number): Promise<TableEntity>;
  deactivate(token: string, tableId: number): Promise<void>;
}
