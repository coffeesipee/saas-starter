import { db } from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrgActionsMenu } from "./org-actions-menu";

export default async function AdminOrganizationsPage() {
  const orgs = await db.organization.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      subscription: { include: { plan: true } },
      _count: { select: { memberships: true } },
    },
  });

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    TRIALING: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    PAST_DUE: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    CANCELED: "bg-red-500/10 text-red-400 border-red-500/20",
    PAUSED: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Organizations</h1>
          <p className="text-zinc-400 mt-1">{orgs.length} organizations</p>
        </div>
        <Link href="/admin/organizations/new">
          <Button id="new-org-btn" className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
            <Plus className="h-4 w-4" /> New Organization
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Organization</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Members</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {orgs.map((org) => (
              <tr key={org.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4">
                  <Link href={`/admin/organizations/${org.id}`} className="hover:underline">
                    <p className="font-medium text-white">{org.name}</p>
                    <p className="text-xs text-zinc-400">{org.slug}</p>
                  </Link>
                </td>
                <td className="px-6 py-4 text-zinc-300">
                  {org.subscription?.plan.name ?? <span className="text-zinc-500">None</span>}
                </td>
                <td className="px-6 py-4">
                  {org.subscription ? (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[org.subscription.status]}`}>
                      {org.subscription.status}
                    </span>
                  ) : (
                    <span className="text-zinc-500 text-xs">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-zinc-300">{org._count.memberships}</td>
                <td className="px-6 py-4 text-zinc-400 text-xs">
                  {org.createdAt.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <OrgActionsMenu orgId={org.id} orgName={org.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
