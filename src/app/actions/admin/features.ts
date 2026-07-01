"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/rbac";

const featureSchema = z.object({
  key: z.string().min(2).regex(/^[a-z0-9_]+$/, "Key must be lowercase alphanumeric with underscores"),
  name: z.string().min(2),
  description: z.string().optional(),
  type: z.enum(["BOOLEAN", "NUMBER"]),
  defaultValue: z.string().default("false"),
});

export async function createFeature(data: z.infer<typeof featureSchema>) {
  await requireAdmin();
  const validated = featureSchema.parse(data);
  const feature = await db.feature.create({ data: validated });
  revalidatePath("/admin/features");
  return { success: true, feature };
}

export async function updateFeature(id: string, data: Partial<z.infer<typeof featureSchema>>) {
  await requireAdmin();
  await db.feature.update({ where: { id }, data });
  revalidatePath("/admin/features");
  revalidatePath(`/admin/features/${id}`);
  return { success: true };
}

export async function deleteFeature(id: string) {
  await requireAdmin();
  await db.feature.delete({ where: { id } });
  revalidatePath("/admin/features");
  return { success: true };
}
