import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Allow login page, API routes, and static files
  if (
    pathname === "/login" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/robots.txt" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }
  
  // Check for auth cookie
  const token = req.cookies.get("d4tw_wiki_auth");
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
