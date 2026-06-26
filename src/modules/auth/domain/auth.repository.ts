import type { AuthSession, AuthUser } from "@/modules/auth/domain/auth.entity";
import type { LoginCredentials } from "@/modules/auth/domain/auth.types";

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  me(token: string): Promise<AuthUser>;
}
