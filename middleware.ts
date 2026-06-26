import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function redirectToLogin(request: NextRequest, path: string) {
  const url = request.nextUrl.clone();
  url.pathname = path;
  return NextResponse.redirect(url);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get("sc_role")?.value;

  const isAdminPath = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isKitchenPath = pathname.startsWith("/kitchen") && pathname !== "/kitchen/login";

  if (isAdminPath && role !== "ADMIN") {
    return redirectToLogin(request, "/admin/login");
  }

  if (isKitchenPath && role !== "KITCHEN") {
    return redirectToLogin(request, "/kitchen/login");
  }

  if (pathname === "/admin/login" && role === "ADMIN") {
    return redirectToLogin(request, "/admin/dashboard");
  }

  if (pathname === "/kitchen/login" && role === "KITCHEN") {
    return redirectToLogin(request, "/kitchen/orders");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/kitchen/:path*"],
};
