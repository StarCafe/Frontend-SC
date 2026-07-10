import type { UsersRepository } from "@/modules/users/domain/user.repository";
import type { CreateUserPayload } from "@/modules/users/domain/user.types";

export function listUsersUseCase(repository: UsersRepository, token: string) {
  return repository.list(token);
}

export function createUserUseCase(repository: UsersRepository, token: string, payload: CreateUserPayload) {
  return repository.create(token, payload);
}

export function deactivateUserUseCase(repository: UsersRepository, token: string, userId: number) {
  return repository.deactivate(token, userId);
}
