import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PlanEditForm } from "./plan-edit-form";
import { PlanFeaturesManager } from "./plan-features-manager";

export default async function AdminPlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [plan, allFeatures] = await Promise.all([
    db.plan.findUnique({
      where: { id },
      include: { planFeatures: { include: { feature: true } } },
    }),
    db.feature.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!plan) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link href="/admin/plans" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white mb-4">
          <ChevronLeft className="h-4 w-4" /> Back to plans
        </Link>
        <h1 className="text-2xl font-bold text-white">{plan.name}</h1>
        <p className="text-zinc-400 mt-1 font-mono text-sm">{plan.slug}</p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-sm font-semibold text-white mb-4">Plan Settings</h2>
        <PlanEditForm plan={plan} />
      </div>

      <PlanFeaturesManager plan={plan} allFeatures={allFeatures} />
    </div>
  );
}
