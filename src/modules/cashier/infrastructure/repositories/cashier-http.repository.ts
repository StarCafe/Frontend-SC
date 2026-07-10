import { apiClient } from "@/shared/lib/api/http-client";
import type { CashierRepository, CashierSearchFilters } from "@/modules/cashier/domain/cashier.entity";
import { extractOrders } from "@/modules/orders/infrastructure/mappers/order.mapper";

export class HttpCashierRepository implements CashierRepository {
  async search(token: string, filters: CashierSearchFilters) {
    const payload = await apiClient<unknown>("/api/v1/admin/cashier/orders/search", {
      token,
      query: filters,
    });

    return extractOrders(payload);
  }

  async pay(token: string, orderId: number) {
    await apiClient(`/api/v1/admin/cashier/orders/${orderId}/pay`, {
      method: "POST",
      token,
    });
  }
}

export const cashierRepository = new HttpCashierRepository();
