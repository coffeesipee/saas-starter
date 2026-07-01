import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import type { MembershipRole } from "@/generated/prisma";

/** Get all org memberships for the current session user */
export async function getUserMemberships() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return db.membership.findMany({
    where: { userId: session.user.id },
    include: {
      organization: {
        include: {
          subscription: {
            include: { plan: true },
          },
        },
      },
    },
  });
}

/** Get the user's role in a specific org */
export async function getUserOrgRole(organizationId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId,
      },
    },
  });

  return membership?.role ?? null;
}

/** Require a specific org membership role, else redirect */
export async function requireOrgRole(
  organizationId: string,
  allowedRoles: MembershipRole[]
) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId,
      },
    },
  });

  if (!membership || !allowedRoles.includes(membership.role)) {
    redirect("/dashboard");
  }

  return membership;
}