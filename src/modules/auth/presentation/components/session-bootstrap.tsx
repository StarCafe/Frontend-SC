"use client";

import { useEffect } from "react";
import { loadAuthenticatedUserUseCase } from "@/modules/auth/application/use-cases/auth.use-cases";
import { authRepository } from "@/modules/auth/infrastructure/repositories/auth-http.repository";
import { useAuthStore } from "@/shared/store/auth-store";

export function SessionBootstrap() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const setUser = useAuthStore((state) => state.setUser);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    if (!hydrated || !token || user) {
      return;
    }

    loadAuthenticatedUserUseCase(authRepository, token)
      .then(setUser)
      .catch(() => {
        clearSession();
      });
  }, [clearSession, hydrated, setUser, token, user]);

  useEffect(() => {
    if (!hydrated || !token) {
      return;
    }

    if (user?.isActive === false) {
      clearSession();
    }
  }, [clearSession, hydrated, token, user]);

  return null;
}
