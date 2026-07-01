import { db } from "@/lib/db";
import Link from "next/link";
import { SubscriptionActionsMenu } from "./subscription-actions-menu";

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  TRIALING: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  PAST_DUE: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  CANCELED: "bg-red-500/10 text-red-400 border-red-500/20",
  PAUSED: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

function formatPrice(price: number | null, interval: string | null) {
  if (price === null) return "Free";
  const dollars = (price / 100).toFixed(2);
  const map: Record<string, string> = { MONTHLY: "/mo", YEARLY: "/yr", ONE_TIME: "" };
  return `$${dollars}${interval ? (map[interval] ?? "") : ""}`;
}

export default async function AdminSubscriptionsPage() {
  const subscriptions = await db.subscription.findMany({
    orderBy: { createdAt: "desc" },
    include: { organization: true, plan: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Subscriptions</h1>
        <p className="text-zinc-400 mt-1">{subscriptions.length} total</p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Organization</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Billing Cycle</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4">
                  <Link href={`/admin/organizations/${sub.organizationId}`} className="hover:underline">
                    <p className="font-medium text-white">{sub.organization.name}</p>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <p className="text-zinc-300">{sub.plan.name}</p>
                  <p className="text-xs text-zinc-500">{formatPrice(sub.plan.price, sub.plan.billingInterval)}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[sub.status]}`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-zinc-400">
                  {sub.billingCycleStart.toLocaleDateString()} → {sub.billingCycleEnd.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <SubscriptionActionsMenu subscriptionId={sub.id} orgId={sub.organizationId} status={sub.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
