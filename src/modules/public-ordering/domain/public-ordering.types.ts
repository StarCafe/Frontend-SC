export interface PublicOrderItemInput {
  productId: number;
  quantity: number;
  notes?: string;
}

export interface PublicCreateOrderPayload {
  customerName: string;
  items: PublicOrderItemInput[];
}
