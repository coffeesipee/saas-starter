import { db } from "@/lib/db";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { UserActionsMenu } from "./user-actions-menu";
import { UserPlus } from "lucide-react";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { memberships: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-zinc-400 mt-1">{users.length} registered accounts</p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Orgs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4">
                  <Link href={`/admin/users/${user.id}`} className="hover:underline">
                    <p className="font-medium text-white">{user.name ?? "—"}</p>
                    <p className="text-xs text-zinc-400">{user.email}</p>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                    user.role === "ADMIN"
                      ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                      : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                    user.isActive
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}>
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-300">{user._count.memberships}</td>
                <td className="px-6 py-4 text-zinc-400 text-xs">
                  {user.createdAt.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <UserActionsMenu userId={user.id} isActive={user.isActive} role={user.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
