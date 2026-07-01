import { db } from "@/lib/db";
import { StatCard } from "@/components/admin/stat-card";
import { Users, Building2, CreditCard, Zap, TrendingUp, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboardPage() {
  const [userCount, orgCount, subCount, planCount, recentSubs] = await Promise.all([
    db.user.count(),
    db.organization.count(),
    db.subscription.count({ where: { status: "ACTIVE" } }),
    db.plan.count({ where: { isActive: true } }),
    db.subscription.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        organization: true,
        plan: true,
      },
    }),
  ]);

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    TRIALING: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    PAST_DUE: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    CANCELED: "bg-red-500/10 text-red-400 border-red-500/20",
    PAUSED: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-1">Overview of your SaaS platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={userCount}
          icon={Users}
          description="Registered accounts"
          className="bg-zinc-900 border-zinc-800 text-white"
        />
        <StatCard
          title="Organizations"
          value={orgCount}
          icon={Building2}
          description="Active workspaces"
          className="bg-zinc-900 border-zinc-800 text-white"
        />
        <StatCard
          title="Active Subscriptions"
          value={subCount}
          icon={TrendingUp}
          description="Paying customers"
          className="bg-zinc-900 border-zinc-800 text-white"
        />
        <StatCard
          title="Active Plans"
          value={planCount}
          icon={CreditCard}
          description="Available pricing tiers"
          className="bg-zinc-900 border-zinc-800 text-white"
        />
      </div>

      {/* Recent Subscriptions */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900">
        <div className="px-6 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-white">Recent Subscriptions</h2>
        </div>
        <div className="divide-y divide-zinc-800">
          {recentSubs.length === 0 ? (
            <div className="px-6 py-8 text-center text-zinc-500 flex flex-col items-center gap-2">
              <AlertCircle className="h-8 w-8 opacity-50" />
              <p className="text-sm">No subscriptions yet</p>
            </div>
          ) : (
            recentSubs.map((sub) => (
              <div key={sub.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{sub.organization.name}</p>
                  <p className="text-xs text-zinc-400">{sub.plan.name}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[sub.status]}`}>
                  {sub.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
