export interface PublicOrderItemInput {
  productId: number;
  quantity: number;
  notes?: string;
  addonIds: number[];
}

export interface PublicCreateOrderPayload {
  customerName: string;
  items: PublicOrderItemInput[];
}
