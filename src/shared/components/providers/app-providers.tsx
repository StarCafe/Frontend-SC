"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { SessionBootstrap } from "@/modules/auth/presentation/components/session-bootstrap";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <SessionBootstrap />
      {children}
      <Toaster richColors position="top-right" />
    </>
  );
}
