"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/rbac";
import type { BillingInterval } from "@/generated/prisma";

const planSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  price: z.number().int().min(0).optional(),
  billingInterval: z.enum(["MONTHLY", "YEARLY", "ONE_TIME"]).optional(),
  isActive: z.boolean().optional(),
});

export async function createPlan(data: z.infer<typeof planSchema>) {
  await requireAdmin();
  const validated = planSchema.parse(data);
  const plan = await db.plan.create({ data: validated as {
    name: string;
    slug: string;
    description?: string;
    price?: number;
    billingInterval?: BillingInterval;
    isActive?: boolean;
  }});
  revalidatePath("/admin/plans");
  return { success: true, plan };
}

export async function updatePlan(id: string, data: Partial<z.infer<typeof planSchema>>) {
  await requireAdmin();
  await db.plan.update({ where: { id }, data: data as Parameters<typeof db.plan.update>[0]["data"] });
  revalidatePath("/admin/plans");
  revalidatePath(`/admin/plans/${id}`);
  return { success: true };
}

export async function deletePlan(id: string) {
  await requireAdmin();
  await db.plan.delete({ where: { id } });
  revalidatePath("/admin/plans");
  return { success: true };
}

export async function setPlanFeature(planId: string, featureId: string, value: string) {
  await requireAdmin();
  await db.planFeature.upsert({
    where: { planId_featureId: { planId, featureId } },
    update: { value },
    create: { planId, featureId, value },
  });
  revalidatePath(`/admin/plans/${planId}`);
  return { success: true };
}

export async function removePlanFeature(planId: string, featureId: string) {
  await requireAdmin();
  await db.planFeature.delete({
    where: { planId_featureId: { planId, featureId } },
  });
  revalidatePath(`/admin/plans/${planId}`);
  return { success: true };
}
