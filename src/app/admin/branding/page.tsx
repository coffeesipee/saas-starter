import { requireAdmin } from "@/lib/rbac";
import { db } from "@/lib/db";
import { BrandingForm } from "./branding-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Site Branding | Admin",
};

export default async function BrandingPage() {
  await requireAdmin();
  
  const siteConfig = await db.siteConfig.findUnique({ where: { id: "global" } });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Site Branding</h2>
        <p className="text-zinc-400">Manage your SaaS logo and global theme colors.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <BrandingForm initialData={siteConfig || {}} />
      </div>
    </div>
  );
}
