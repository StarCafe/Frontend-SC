"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getBusinessBrandingUseCase } from "@/modules/business-branding/application/use-cases/business-branding.use-cases";
import { businessBrandingRepository } from "@/modules/business-branding/infrastructure/repositories/business-branding-http.repository";
import { applyBrandingTheme, resetBrandingTheme } from "@/shared/lib/branding/apply-branding";
import { useBusinessBrandingStore } from "@/shared/store/business-branding-store";
import { useAuthStore } from "@/shared/store/auth-store";

function matchesCurrentBusiness(
  brandingName: string | undefined,
  brandingSlug: string | undefined,
  userBusinessName: string | undefined,
  userBusinessSlug: string | undefined,
) {
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

export function BusinessBrandingBootstrap() {
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const hydrated = useAuthStore((state) => state.hydrated);
  const user = useAuthStore((state) => state.user);
  const branding = useBusinessBrandingStore((state) => state.branding);
  const setBranding = useBusinessBrandingStore((state) => state.setBranding);
  const clearBranding = useBusinessBrandingStore((state) => state.clearBranding);
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
      branding?.name,
      branding?.slug,
      user?.businessName,
      user?.businessSlug,
    );

    if (branding && !sameBusinessAsSession) {
      clearBranding();
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
          if (!sameBusinessAsSession) {
            clearBranding();
          }
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    branding,
    clearBranding,
    hydrated,
    isNeutralRoute,
    setBranding,
    token,
    user?.businessName,
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
