"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BusinessBrandingEntity } from "@/modules/business-branding/domain/business-branding.entity";

interface BusinessBrandingState {
  branding: BusinessBrandingEntity | null;
  brandingsByKey: Record<string, BusinessBrandingEntity>;
  setBranding: (branding: BusinessBrandingEntity) => void;
  clearBranding: () => void;
  findBrandingForBusiness: (context: {
    businessId?: number | null;
    businessSlug?: string;
    businessName?: string;
  }) => BusinessBrandingEntity | null;
}

function buildBrandingKeys(branding: BusinessBrandingEntity) {
  const keys: string[] = [];

  if (branding.businessId !== null && branding.businessId !== undefined) {
    keys.push(`id:${branding.businessId}`);
  }

  if (branding.slug) {
    keys.push(`slug:${branding.slug.trim().toLowerCase()}`);
  }

  if (branding.name) {
    keys.push(`name:${branding.name.trim().toLowerCase()}`);
  }

  return keys;
}

export const useBusinessBrandingStore = create<BusinessBrandingState>()(
  persist(
    (set, get) => ({
      branding: null,
      brandingsByKey: {},
      setBranding: (branding) =>
        set((state) => {
          const nextMap = { ...state.brandingsByKey };

          buildBrandingKeys(branding).forEach((key) => {
            nextMap[key] = branding;
          });

          return {
            branding,
            brandingsByKey: nextMap,
          };
        }),
      clearBranding: () => set({ branding: null }),
      findBrandingForBusiness: ({ businessId, businessSlug, businessName }) => {
        const brandingsByKey = get().brandingsByKey;

        if (businessId !== null && businessId !== undefined) {
          const match = brandingsByKey[`id:${businessId}`];

          if (match) {
            return match;
          }
        }

        if (businessSlug) {
          const match = brandingsByKey[`slug:${businessSlug.trim().toLowerCase()}`];

          if (match) {
            return match;
          }
        }

        if (businessName) {
          const match = brandingsByKey[`name:${businessName.trim().toLowerCase()}`];

          if (match) {
            return match;
          }
        }

        return null;
      },
    }),
    {
      name: "nova-business-branding",
      partialize: (state) => ({
        branding: state.branding,
        brandingsByKey: state.brandingsByKey,
      }),
    },
  ),
);
