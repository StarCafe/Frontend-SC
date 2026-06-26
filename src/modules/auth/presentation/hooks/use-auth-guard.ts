"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/store/auth-store";
import type { Role } from "@/modules/auth/domain/auth.entity";

export function useAuthGuard(expectedRole: Role) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, user, hydrated } = useAuthStore((state) => ({
    token: state.token,
    user: state.user,
    hydrated: state.hydrated,
  }));

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!token || !user) {
      router.replace(expectedRole === "ADMIN" ? "/admin/login" : "/kitchen/login");
      return;
    }

    if (user.role !== expectedRole) {
      router.replace(user.role === "ADMIN" ? "/admin/dashboard" : "/kitchen/orders");
      return;
    }
  }, [expectedRole, hydrated, pathname, router, token, user]);

  if (!hydrated || !token || !user || user.role !== expectedRole) {
    return null;
  }

  return { token, user };
}
