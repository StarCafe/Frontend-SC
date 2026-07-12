"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BusinessBrandingEntity } from "@/modules/business-branding/domain/business-branding.entity";

interface BusinessBrandingState {
  branding: BusinessBrandingEntity | null;
  setBranding: (branding: BusinessBrandingEntity) => void;
  clearBranding: () => void;
}

export const useBusinessBrandingStore = create<BusinessBrandingState>()(
  persist(
    (set) => ({
      branding: null,
      setBranding: (branding) => set({ branding }),
      clearBranding: () => set({ branding: null }),
    }),
    {
      name: "nova-business-branding",
      partialize: (state) => ({
        branding: state.branding,
      }),
    },
  ),
);
