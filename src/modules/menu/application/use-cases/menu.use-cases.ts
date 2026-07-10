import type { MenuRepository } from "@/modules/menu/domain/menu.repository";

export function listPublicMenuUseCase(repository: MenuRepository, businessSlug: string) {
  return repository.listPublic(businessSlug);
}
