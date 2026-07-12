"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getBusinessBrandingUseCase } from "@/modules/business-branding/application/use-cases/business-branding.use-cases";
import { businessBrandingRepository } from "@/modules/business-branding/infrastructure/repositories/business-branding-http.repository";
import { applyBrandingTheme, resetBrandingTheme } from "@/shared/lib/branding/apply-branding";
import { useBusinessBrandingStore } from "@/shared/store/business-branding-store";
import { useAuthStore } from "@/shared/store/auth-store";
import type { BusinessBrandingEntity } from "@/modules/business-branding/domain/business-branding.entity";

function matchesCurrentBusiness(
  brandingBusinessId: number | null | undefined,
  brandingName: string | undefined,
  brandingSlug: string | undefined,
  userBusinessId: number | null | undefined,
  userBusinessName: string | undefined,
  userBusinessSlug: string | undefined,
) {
  if (
    brandingBusinessId !== null &&
    brandingBusinessId !== undefined &&
    userBusinessId !== null &&
    userBusinessId !== undefined
  ) {
    return brandingBusinessId === userBusinessId;
  }

  const normalizedBrandingSlug = brandingSlug?.trim().toLowerCase();
  const normalizedUserSlug = userBusinessSlug?.trim().toLowerCase();

  if (normalizedBrandingSlug && normalizedUserSlug) {
    return normalizedBrandingSlug === normalizedUserSlug;
  }

  const normalizedBrandingName = brandingName?.trim().toLowerCase();
  const normalizedUserName = userBusinessName?.trim().toLowerCase();

  if (normalizedBrandingName && normalizedUserName) {
    return normalizedBrandingName === normalizedUserName;
  }

  return false;
}

function buildBrandingFromUser(
  user:
    | {
        businessId?: number | null;
        businessName?: string;
        businessSlug?: string;
        businessLogoUrl?: string;
        businessPrimaryColor?: string;
        businessThemeKey?: string;
      }
    | null
    | undefined,
): BusinessBrandingEntity | null {
  const hasRealBrandingData = Boolean(
    user?.businessName ||
      user?.businessSlug ||
      user?.businessLogoUrl ||
      user?.businessPrimaryColor ||
      user?.businessThemeKey,
  );

  if (!hasRealBrandingData) {
    return null;
  }

  const resolvedUser = user;

  return {
    businessId: resolvedUser?.businessId ?? null,
    name: resolvedUser?.businessName || "",
    slug: resolvedUser?.businessSlug || "",
    logoUrl: resolvedUser?.businessLogoUrl || "",
    primaryColor: resolvedUser?.businessPrimaryColor || "",
    themeKey: resolvedUser?.businessThemeKey || "",
    availableThemes: resolvedUser?.businessThemeKey
      ? [
          {
            key: resolvedUser.businessThemeKey,
            label: resolvedUser.businessThemeKey,
            primaryColor: resolvedUser.businessPrimaryColor || undefined,
          },
        ]
      : [],
  };
}

function hasBusinessContext(
  user:
    | {
        businessId?: number | null;
        businessName?: string;
        businessSlug?: string;
      }
    | null
    | undefined,
) {
  return Boolean(user?.businessId || user?.businessName || user?.businessSlug);
}

export function BusinessBrandingBootstrap() {
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const hydrated = useAuthStore((state) => state.hydrated);
  const user = useAuthStore((state) => state.user);
  const branding = useBusinessBrandingStore((state) => state.branding);
  const setBranding = useBusinessBrandingStore((state) => state.setBranding);
  const clearBranding = useBusinessBrandingStore((state) => state.clearBranding);
  const findBrandingForBusiness = useBusinessBrandingStore((state) => state.findBrandingForBusiness);
  const isNeutralRoute =
    pathname === "/admin/login" ||
    pathname === "/kitchen/login" ||
    pathname === "/";

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (isNeutralRoute) {
      resetBrandingTheme();
      return;
    }

    if (!token || (user?.role !== "ADMIN" && user?.role !== "KITCHEN")) {
      clearBranding();
      return;
    }

    const sameBusinessAsSession = matchesCurrentBusiness(
      branding?.businessId,
      branding?.name,
      branding?.slug,
      user?.businessId,
      user?.businessName,
      user?.businessSlug,
    );
    const userHasBusinessContext = hasBusinessContext(user);
    const cachedBranding = findBrandingForBusiness({
      businessId: user?.businessId,
      businessSlug: user?.businessSlug,
      businessName: user?.businessName,
    });
    const sameBusinessAsCached = cachedBranding
      ? matchesCurrentBusiness(
          cachedBranding.businessId,
          cachedBranding.name,
          cachedBranding.slug,
          user?.businessId,
          user?.businessName,
          user?.businessSlug,
        )
      : false;

    if (branding && userHasBusinessContext && !sameBusinessAsSession) {
      clearBranding();
    }

    if (cachedBranding && sameBusinessAsCached && (!branding || (userHasBusinessContext && !sameBusinessAsSession))) {
      setBranding(cachedBranding);
    }

    const fallbackBranding = buildBrandingFromUser(user);

    if (fallbackBranding && (!branding || !sameBusinessAsSession)) {
      setBranding(fallbackBranding);
    }

    let cancelled = false;

    void getBusinessBrandingUseCase(businessBrandingRepository, token)
      .then((nextBranding) => {
        if (!cancelled) {
          setBranding(nextBranding);
        }
      })
      .catch(() => {
        if (!cancelled) {
          if (fallbackBranding) {
            setBranding(fallbackBranding);
            return;
          }

          if (userHasBusinessContext && !sameBusinessAsSession) {
            clearBranding();
          }
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    clearBranding,
    findBrandingForBusiness,
    hydrated,
    isNeutralRoute,
    setBranding,
    token,
    user?.businessName,
    user?.businessId,
    user?.businessSlug,
    user?.role,
  ]);

  useEffect(() => {
    if (isNeutralRoute) {
      resetBrandingTheme();
      return;
    }

    if (branding) {
      applyBrandingTheme(branding);
      return;
    }

    resetBrandingTheme();
  }, [branding, isNeutralRoute]);

  return null;
}
