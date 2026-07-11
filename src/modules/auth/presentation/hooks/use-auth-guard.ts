"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/store/auth-store";
import type { Role } from "@/modules/auth/domain/auth.entity";

export function useAuthGuard(expectedRole: Role) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!token || !user) {
      router.replace(expectedRole === "ADMIN" ? "/admin/login" : "/kitchen/login");
      return;
    }

    if (user.role !== expectedRole) {
      if (user.role === "ADMIN") {
        router.replace("/admin/dashboard");
        return;
      }

      if (user.role === "KITCHEN") {
        router.replace("/kitchen/orders");
        return;
      }

      router.replace("/");
      return;
    }
  }, [expectedRole, hydrated, pathname, router, token, user]);

  if (!hydrated || !token || !user || user.role !== expectedRole) {
    return null;
  }

  return { token, user };
}
