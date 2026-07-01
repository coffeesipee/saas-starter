"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/rbac";
import type { MembershipRole } from "@/generated/prisma";

const orgSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().optional(),
});

export async function createOrganization(data: z.infer<typeof orgSchema>) {
  await requireAdmin();
  const validated = orgSchema.parse(data);
  const org = await db.organization.create({ data: validated });
  revalidatePath("/admin/organizations");
  return { success: true, org };
}

export async function updateOrganization(id: string, data: Partial<z.infer<typeof orgSchema>>) {
  await requireAdmin();
  await db.organization.update({ where: { id }, data });
  revalidatePath("/admin/organizations");
  revalidatePath(`/admin/organizations/${id}`);
  return { success: true };
}

export async function deleteOrganization(id: string) {
  await requireAdmin();
  await db.organization.delete({ where: { id } });
  revalidatePath("/admin/organizations");
  return { success: true };
}

export async function addMember(orgId: string, userId: string, role: MembershipRole) {
  await requireAdmin();
  await db.membership.upsert({
    where: { userId_organizationId: { userId, organizationId: orgId } },
    update: { role },
    create: { userId, organizationId: orgId, role },
  });
  revalidatePath(`/admin/organizations/${orgId}`);
  return { success: true };
}

export async function removeMember(orgId: string, userId: string) {
  await requireAdmin();
  await db.membership.delete({
    where: { userId_organizationId: { userId, organizationId: orgId } },
  });
  revalidatePath(`/admin/organizations/${orgId}`);
  return { success: true };
}

export async function setFeatureOverride(orgId: string, featureId: string, value: string) {
  await requireAdmin();
  await db.featureOverride.upsert({
    where: { organizationId_featureId: { organizationId: orgId, featureId } },
    update: { value },
    create: { organizationId: orgId, featureId, value },
  });
  revalidatePath(`/admin/organizations/${orgId}`);
  return { success: true };
}

export async function removeFeatureOverride(orgId: string, featureId: string) {
  await requireAdmin();
  await db.featureOverride.delete({
    where: { organizationId_featureId: { organizationId: orgId, featureId } },
  });
  revalidatePath(`/admin/organizations/${orgId}`);
  return { success: true };
}
