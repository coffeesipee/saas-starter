import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

/** Check if current user is ADMIN */
export async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

/** Require ADMIN role, redirect to /dashboard if not */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");
  return session;
}

/** Require valid session, redirect to /login if not */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}