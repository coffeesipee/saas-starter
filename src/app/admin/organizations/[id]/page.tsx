import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { SubscriptionManager } from "./subscription-manager";
import { FeatureOverrideManager } from "./feature-override-manager";
import { MemberManager } from "./member-manager";


export default async function AdminOrgDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [org, allPlans, allFeatures, allUsers] = await Promise.all([
    db.organization.findUnique({
      where: { id },
      include: {
        subscription: { include: { plan: true } },
        memberships: { include: { user: true } },
        featureOverrides: { include: { feature: true } },
      },
    }),
    db.plan.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    db.feature.findMany({ orderBy: { name: "asc" } }),
    db.user.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, email: true } }),
  ]);

  if (!org) notFound();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link href="/admin/organizations" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors mb-4">
          <ChevronLeft className="h-4 w-4" /> Back to organizations
        </Link>
        <h1 className="text-2xl font-bold text-white">{org.name}</h1>
        <p className="text-zinc-400 mt-1">/{org.slug}</p>
      </div>

      <SubscriptionManager org={org} plans={allPlans} />
      <MemberManager org={org} allUsers={allUsers} />
      <FeatureOverrideManager org={org} features={allFeatures} />
    </div>
  );
}
