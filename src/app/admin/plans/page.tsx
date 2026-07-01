import { db } from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlanActionsMenu } from "./plan-actions-menu";

function formatPrice(price: number | null, interval: string | null) {
  if (price === null) return "Free";
  const dollars = (price / 100).toFixed(2);
  if (!interval) return `$${dollars}`;
  const map: Record<string, string> = { MONTHLY: "/mo", YEARLY: "/yr", ONE_TIME: "" };
  return `$${dollars}${map[interval] ?? ""}`;
}

export default async function AdminPlansPage() {
  const plans = await db.plan.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { planFeatures: true, subscriptions: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Plans</h1>
          <p className="text-zinc-400 mt-1">{plans.length} pricing tiers</p>
        </div>
        <Link href="/admin/plans/new">
          <Button id="new-plan-btn" className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
            <Plus className="h-4 w-4" /> New Plan
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-lg font-semibold text-white">{plan.name}</p>
                <p className="text-xs text-zinc-500 font-mono">{plan.slug}</p>
              </div>
              <PlanActionsMenu planId={plan.id} planName={plan.name} />
            </div>
            <p className="text-2xl font-bold text-violet-400 mb-3">
              {formatPrice(plan.price, plan.billingInterval)}
            </p>
            {plan.description && <p className="text-sm text-zinc-400 mb-4">{plan.description}</p>}
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <span>{plan._count.planFeatures} features</span>
              <span>·</span>
              <span>{plan._count.subscriptions} subscriptions</span>
              <span className={`ml-auto px-1.5 py-0.5 rounded-full border ${plan.isActive ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/10" : "border-zinc-600 text-zinc-500 bg-zinc-800"}`}>
                {plan.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <Link href={`/admin/plans/${plan.id}`} className="mt-4 block text-center text-sm text-violet-400 hover:text-violet-300 transition-colors">
              Manage features →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
