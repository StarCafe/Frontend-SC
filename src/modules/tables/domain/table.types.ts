export interface TableEntity {
  id: number;
  tableNumber: number;
  qrToken: string;
  qrUrl: string;
  isActive: boolean;
}

export interface CreateTablePayload {
  tableNumber: number;
}
