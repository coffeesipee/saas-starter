"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/rbac";
import { getUserOrgRole } from "@/lib/memberships";

const orgSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
});

export async function createOrganization(data: z.infer<typeof orgSchema>) {
  const session = await requireAuth();
  const validated = orgSchema.parse(data);

  const org = await db.organization.create({
    data: {
      ...validated,
      memberships: {
        create: {
          userId: session.user.id,
          role: "OWNER",
        },
      },
    },
  });

  revalidatePath("/dashboard");
  return { success: true, org };
}

export async function updateOrganization(orgId: string, data: { name?: string; description?: string }) {
  const session = await requireAuth();
  const role = await getUserOrgRole(orgId);
  if (!role || !["OWNER", "ADMIN"].includes(role)) {
    throw new Error("Insufficient permissions");
  }

  await db.organization.update({ where: { id: orgId }, data });
  revalidatePath("/settings/organization");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function removeMember(orgId: string, userId: string) {
  const session = await requireAuth();
  const requesterRole = await getUserOrgRole(orgId);
  if (!requesterRole || !["OWNER", "ADMIN"].includes(requesterRole)) {
    throw new Error("Insufficient permissions");
  }
  // Can't remove the owner unless you are the owner removing someone else
  await db.membership.delete({
    where: { userId_organizationId: { userId, organizationId: orgId } },
  });
  revalidatePath("/settings/members");
  return { success: true };
}

export async function leaveOrganization(orgId: string) {
  const session = await requireAuth();
  await db.membership.delete({
    where: { userId_organizationId: { userId: session.user.id, organizationId: orgId } },
  });
  revalidatePath("/dashboard");
  return { success: true };
}

export async function changeMemberRole(orgId: string, userId: string, role: "ADMIN" | "MEMBER") {
  const session = await requireAuth();
  const requesterRole = await getUserOrgRole(orgId);
  if (!requesterRole || !["OWNER", "ADMIN"].includes(requesterRole)) {
    throw new Error("Insufficient permissions");
  }
  await db.membership.update({
    where: { userId_organizationId: { userId, organizationId: orgId } },
    data: { role },
  });
  revalidatePath("/settings/members");
  return { success: true };
}
