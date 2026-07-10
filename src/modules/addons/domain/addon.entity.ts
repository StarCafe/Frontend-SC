export interface AddonEntity {
  id: number;
  businessId: number | null;
  name: string;
  price: number;
  isActive: boolean;
}
