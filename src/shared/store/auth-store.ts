"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { clearAuthCookies, writeAuthCookies } from "@/shared/lib/api/auth-cookie";
import type { AuthSession, AuthUser } from "@/modules/auth/domain/auth.entity";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  hydrated: boolean;
  setSession: (session: AuthSession) => void;
  setUser: (user: AuthUser) => void;
  clearSession: () => void;
  markHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      hydrated: false,
      setSession: (session) => {
        writeAuthCookies(session.user.role, session.token);
        set({
          token: session.token,
          user: session.user,
        });
      },
      setUser: (user) => {
        const token = get().token;
        if (token) {
          writeAuthCookies(user.role, token);
        }
        set({ user });
      },
      clearSession: () => {
        clearAuthCookies();
        set({ token: null, user: null });
      },
      markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "starcafe-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    },
  ),
);
