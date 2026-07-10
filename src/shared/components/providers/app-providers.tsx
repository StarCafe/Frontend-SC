"use client";

import type { ReactNode } from "react";
import { SessionBootstrap } from "@/modules/auth/presentation/components/session-bootstrap";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <SessionBootstrap />
      {children}
      <Toaster richColors position="top-right" />
    </>
  );
}
