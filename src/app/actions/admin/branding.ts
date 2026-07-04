"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/rbac";

const updateBrandingSchema = z.object({
  logoUrl: z.string().url().or(z.literal("")).optional(),
  primaryColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "Must be a valid hex color"),
  secondaryColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "Must be a valid hex color"),
});

export async function updateBranding(data: z.infer<typeof updateBrandingSchema>) {
  await requireAdmin();
  const validated = updateBrandingSchema.parse(data);

  // Use "global" as the single row ID
  await db.siteConfig.upsert({
    where: { id: "global" },
    update: {
      logoUrl: validated.logoUrl || null,
      primaryColor: validated.primaryColor,
      secondaryColor: validated.secondaryColor,
    },
    create: {
      id: "global",
      logoUrl: validated.logoUrl || null,
      primaryColor: validated.primaryColor,
      secondaryColor: validated.secondaryColor,
    },
  });

  // Revalidate entire app because layout.tsx uses it
  revalidatePath("/", "layout");
  return { success: true };
}
