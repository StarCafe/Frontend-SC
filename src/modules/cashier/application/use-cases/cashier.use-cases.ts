import type { CashierRepository, CashierSearchFilters } from "@/modules/cashier/domain/cashier.entity";

export function searchCashierOrdersUseCase(
  repository: CashierRepository,
  token: string,
  filters: CashierSearchFilters,
) {
  return repository.search(token, filters);
}

export function payCashierOrderUseCase(repository: CashierRepository, token: string, orderId: number) {
  return repository.pay(token, orderId);
}
