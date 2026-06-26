import type { AuthRepository } from "@/modules/auth/domain/auth.repository";
import type { LoginCredentials } from "@/modules/auth/domain/auth.types";

export function loginUseCase(repository: AuthRepository, credentials: LoginCredentials) {
  return repository.login(credentials);
}

export function loadAuthenticatedUserUseCase(repository: AuthRepository, token: string) {
  return repository.me(token);
}
