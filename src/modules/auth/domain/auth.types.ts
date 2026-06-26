export type Role = "ADMIN" | "KITCHEN";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  isActive?: boolean;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
