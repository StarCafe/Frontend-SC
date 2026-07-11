export interface CreateProductPayload {
  categoryId: number;
  name: string;
  description: string;
  price: number;
}

export interface UpdateProductPayload {
  categoryId: number;
  name: string;
  description: string;
  price: number;
  isAvailable?: boolean;
}
