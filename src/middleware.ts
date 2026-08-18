import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/register"];
const TOKEN_COOKIE_NAME = "crm_token";

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bypass public paths (/login, /register)
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // 2. Bypass API requests (non-HTML requests) & static files (.png, .svg, etc.)
  const acceptHeader = request.headers.get("accept") || "";
  if (
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    !acceptHeader.includes("text/html")
  ) {
    return NextResponse.next();
  }

  // 3. Authenticated route check
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
