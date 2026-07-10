import type { UserEntity } from "@/modules/users/domain/user.entity";
import type { CreateUserPayload } from "@/modules/users/domain/user.types";

export interface UsersRepository {
  list(token: string): Promise<UserEntity[]>;
  create(token: string, payload: CreateUserPayload): Promise<UserEntity>;
  deactivate(token: string, userId: number): Promise<void>;
}
