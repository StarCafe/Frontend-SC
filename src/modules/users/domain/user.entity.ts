export type UserRole = "SUPER_ADMIN" | "ADMIN" | "KITCHEN";

export interface UserEntity {
  id: number;
  businessId: number | null;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}
