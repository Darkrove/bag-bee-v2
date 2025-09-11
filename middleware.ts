import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "@/lib/jwt"; // minimal JWT utility

export function middleware(req: NextRequest) {
  const token = req.cookies.get("next-auth.session-token")?.value;
  if (!token || !verifyJwt(token)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/protected/:path*"],
};