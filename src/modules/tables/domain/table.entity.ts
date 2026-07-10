export interface TableEntity {
  id: number;
  businessId?: number | null;
  businessName?: string;
  businessSlug?: string;
  tableNumber: number;
  qrToken: string;
  qrUrl: string;
  isActive: boolean;
}
