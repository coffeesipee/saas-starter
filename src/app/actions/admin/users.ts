"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/rbac";
import type { UserRole } from "@/generated/prisma";

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(["ADMIN", "USER"]).optional(),
  isActive: z.boolean().optional(),
});

export async function updateUser(id: string, data: z.infer<typeof updateUserSchema>) {
  await requireAdmin();
  const validated = updateUserSchema.parse(data);

  await db.user.update({ where: { id }, data: validated });
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}`);
  return { success: true };
}

export async function deleteUser(id: string) {
  await requireAdmin();
  await db.user.delete({ where: { id } });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function toggleUserActive(id: string, isActive: boolean) {
  await requireAdmin();
  await db.user.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}`);
  return { success: true };
}

export async function changeUserRole(id: string, role: UserRole) {
  await requireAdmin();
  await db.user.update({ where: { id }, data: { role } });
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}`);
  return { success: true };
}
