export type Role = "SUPER_ADMIN" | "ADMIN" | "KITCHEN";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  businessId: number | null;
  businessName?: string;
  businessSlug?: string;
  businessLogoUrl?: string;
  businessPrimaryColor?: string;
  businessThemeKey?: string;
  isActive?: boolean;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}
