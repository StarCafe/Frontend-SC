export type Role = "SUPER_ADMIN" | "ADMIN" | "KITCHEN";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  businessId: number | null;
  isActive?: boolean;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}
