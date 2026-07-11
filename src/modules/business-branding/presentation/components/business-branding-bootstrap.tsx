"use client";

import { useEffect } from "react";
import { getBusinessBrandingUseCase } from "@/modules/business-branding/application/use-cases/business-branding.use-cases";
import { businessBrandingRepository } from "@/modules/business-branding/infrastructure/repositories/business-branding-http.repository";
import { applyBrandingTheme, resetBrandingTheme } from "@/shared/lib/branding/apply-branding";
import { useBusinessBrandingStore } from "@/shared/store/business-branding-store";
import { useAuthStore } from "@/shared/store/auth-store";

export function BusinessBrandingBootstrap() {
  const token = useAuthStore((state) => state.token);
  const hydrated = useAuthStore((state) => state.hydrated);
  const user = useAuthStore((state) => state.user);
  const branding = useBusinessBrandingStore((state) => state.branding);
  const setBranding = useBusinessBrandingStore((state) => state.setBranding);
  const clearBranding = useBusinessBrandingStore((state) => state.clearBranding);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!token || user?.role !== "ADMIN") {
      clearBranding();
      return;
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
          clearBranding();
        }
      });

    return () => {
      cancelled = true;
    };
  }, [clearBranding, hydrated, setBranding, token, user?.role]);

  useEffect(() => {
    if (branding) {
      applyBrandingTheme(branding);
      return;
    }

    resetBrandingTheme();
  }, [branding]);

  return null;
}
