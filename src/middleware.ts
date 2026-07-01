import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Use edge-safe auth (no Prisma, no bcrypt)
const { auth } = NextAuth(authConfig);

export default auth(function middleware(req: NextRequest & { auth: { user?: { role?: string } } | null }) {
  const session = (req as { auth: { user?: { role?: string } } | null }).auth;
  const { pathname } = req.nextUrl;

  // Public auth routes — allow through, redirect if already logged in
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (session) return NextResponse.redirect(new URL("/dashboard", req.url));
    return NextResponse.next();
  }

  // Admin routes — require ADMIN role
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (session.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // All other routes — require a session
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};