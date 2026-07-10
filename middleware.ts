import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("sc_token")?.value;
  const role = request.cookies.get("sc_role")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/login") || pathname.startsWith("/kitchen/login")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (role !== "ADMIN") {
      if (role === "KITCHEN") {
        return NextResponse.redirect(new URL("/kitchen/orders", request.url));
      }

      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/kitchen")) {
    if (!token) {
      return NextResponse.redirect(new URL("/kitchen/login", request.url));
    }

    if (role !== "KITCHEN") {
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }

      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/kitchen/:path*"],
};
