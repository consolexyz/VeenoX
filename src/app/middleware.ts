import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const isHomePage = request.nextUrl.pathname === "/";
  response.headers.set("x-is-home-page", isHomePage.toString());
  return response;
}

export const config = {
  matcher: "/:path*",
};
