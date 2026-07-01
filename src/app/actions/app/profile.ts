"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/rbac";
import bcrypt from "bcryptjs";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export async function updateProfile(data: z.infer<typeof profileSchema>) {
  const session = await requireAuth();
  const validated = profileSchema.parse(data);
  await db.user.update({ where: { id: session.user.id }, data: validated });
  revalidatePath("/settings");
  return { success: true };
}

export async function changePassword(data: z.infer<typeof passwordSchema>) {
  const session = await requireAuth();
  const validated = passwordSchema.parse(data);

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user?.password) throw new Error("No password set for this account");

  const isValid = await bcrypt.compare(validated.currentPassword, user.password);
  if (!isValid) throw new Error("Current password is incorrect");

  const hashed = await bcrypt.hash(validated.newPassword, 12);
  await db.user.update({ where: { id: session.user.id }, data: { password: hashed } });
  return { success: true };
}
