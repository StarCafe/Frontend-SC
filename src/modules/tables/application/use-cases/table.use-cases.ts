import type { TablesRepository } from "@/modules/tables/domain/table.repository";
import type { CreateTablePayload } from "@/modules/tables/domain/table.types";

export function listTablesUseCase(repository: TablesRepository, token: string) {
  return repository.list(token);
}

export function createTableUseCase(repository: TablesRepository, token: string, payload: CreateTablePayload) {
  return repository.create(token, payload);
}

export function regenerateTableQrUseCase(repository: TablesRepository, token: string, tableId: number) {
  return repository.regenerateQr(token, tableId);
}

export function deactivateTableUseCase(repository: TablesRepository, token: string, tableId: number) {
  return repository.deactivate(token, tableId);
}
