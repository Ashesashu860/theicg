import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, AUTH_COOKIE_VALUE } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthed =
    request.cookies.get(AUTH_COOKIE)?.value === AUTH_COOKIE_VALUE;

  if (pathname === "/login") {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    return NextResponse.redirect(adminUrl);
  }

  if (pathname.startsWith("/portal") && !isAuthed) {
    const loginUrl = new URL("/admin", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/admin" && isAuthed) {
    return NextResponse.redirect(new URL("/portal/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/login", "/admin"],
};
