"use client";

import { useEffect } from "react";
import { loadAuthenticatedUserUseCase } from "@/modules/auth/application/auth.use-cases";
import { authRepository } from "@/modules/auth/infrastructure/auth.repository.impl";
import { useAuthStore } from "@/shared/store/auth-store";

export function SessionBootstrap() {
  const { token, user, hydrated, setUser, clearSession } = useAuthStore((state) => ({
    token: state.token,
    user: state.user,
    hydrated: state.hydrated,
    setUser: state.setUser,
    clearSession: state.clearSession,
  }));

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

  return null;
}
