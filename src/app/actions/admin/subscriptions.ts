"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/rbac";

const subscriptionSchema = z.object({
  organizationId: z.string(),
  planId: z.string(),
  status: z.enum(["ACTIVE", "TRIALING", "PAST_DUE", "CANCELED", "PAUSED"]),
  billingCycleStart: z.string().datetime(),
  billingCycleEnd: z.string().datetime(),
  trialEndsAt: z.string().datetime().optional(),
});

export async function createSubscription(data: z.infer<typeof subscriptionSchema>) {
  await requireAdmin();
  const validated = subscriptionSchema.parse(data);
  const sub = await db.subscription.upsert({
    where: { organizationId: validated.organizationId },
    update: {
      planId: validated.planId,
      status: validated.status,
      billingCycleStart: new Date(validated.billingCycleStart),
      billingCycleEnd: new Date(validated.billingCycleEnd),
      trialEndsAt: validated.trialEndsAt ? new Date(validated.trialEndsAt) : null,
    },
    create: {
      organizationId: validated.organizationId,
      planId: validated.planId,
      status: validated.status,
      billingCycleStart: new Date(validated.billingCycleStart),
      billingCycleEnd: new Date(validated.billingCycleEnd),
      trialEndsAt: validated.trialEndsAt ? new Date(validated.trialEndsAt) : null,
    },
  });
  revalidatePath("/admin/subscriptions");
  revalidatePath(`/admin/organizations/${validated.organizationId}`);
  return { success: true, sub };
}

export async function updateSubscription(
  id: string,
  data: { planId?: string; status?: "ACTIVE" | "TRIALING" | "PAST_DUE" | "CANCELED" | "PAUSED"; billingCycleEnd?: string }
) {
  await requireAdmin();
  const sub = await db.subscription.update({
    where: { id },
    data: {
      ...(data.planId ? { planId: data.planId } : {}),
      ...(data.status ? { status: data.status } : {}),
      ...(data.billingCycleEnd ? { billingCycleEnd: new Date(data.billingCycleEnd) } : {}),
    },
  });
  revalidatePath("/admin/subscriptions");
  revalidatePath(`/admin/organizations/${sub.organizationId}`);
  return { success: true };
}

export async function cancelSubscription(id: string) {
  await requireAdmin();
  const sub = await db.subscription.update({
    where: { id },
    data: { status: "CANCELED" },
  });
  revalidatePath("/admin/subscriptions");
  revalidatePath(`/admin/organizations/${sub.organizationId}`);
  return { success: true };
}
