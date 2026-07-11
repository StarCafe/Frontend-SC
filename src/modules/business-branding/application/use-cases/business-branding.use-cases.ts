import type { BusinessBrandingRepository } from "@/modules/business-branding/domain/business-branding.repository";

export function getBusinessBrandingUseCase(repository: BusinessBrandingRepository, token: string) {
  return repository.get(token);
}

export function updateBusinessThemeUseCase(
  repository: BusinessBrandingRepository,
  token: string,
  themeKey: string,
) {
  return repository.updateTheme(token, themeKey);
}

export function updateBusinessLogoUseCase(
  repository: BusinessBrandingRepository,
  token: string,
  file: File,
) {
  return repository.updateLogo(token, file);
}
