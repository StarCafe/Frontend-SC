import type { AuthSession, AuthUser, LoginCredentials } from "@/modules/auth/domain/auth.types";

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  me(token: string): Promise<AuthUser>;
}
