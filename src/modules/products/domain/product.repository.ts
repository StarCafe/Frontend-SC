import type { ProductEntity } from "@/modules/products/domain/product.entity";
import type { CreateProductPayload, UpdateProductPayload } from "@/modules/products/domain/product.types";

export interface ProductsRepository {
  list(token: string): Promise<ProductEntity[]>;
  create(token: string, payload: CreateProductPayload): Promise<ProductEntity>;
  update(token: string, productId: number, payload: UpdateProductPayload): Promise<ProductEntity>;
  activate(token: string, productId: number): Promise<void>;
  deactivate(token: string, productId: number): Promise<void>;
  markUnavailable(token: string, productId: number): Promise<void>;
  uploadImage(token: string, productId: number, file: File): Promise<ProductEntity>;
  replaceImage(token: string, productId: number, file: File): Promise<ProductEntity>;
  deleteImage(token: string, productId: number): Promise<void>;
}
