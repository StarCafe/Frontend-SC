"use client";

import type { ReactNode } from "react";
import { SessionBootstrap } from "@/modules/auth/presentation/components/session-bootstrap";
import { BusinessBrandingBootstrap } from "@/modules/business-branding/presentation/components/business-branding-bootstrap";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <SessionBootstrap />
      <BusinessBrandingBootstrap />
      {children}
      <Toaster richColors position="top-right" />
    </>
  );
}
