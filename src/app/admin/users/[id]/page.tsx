import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { EditUserForm } from "./edit-user-form";

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await db.user.findUnique({
    where: { id },
    include: {
      memberships: {
        include: { organization: { include: { subscription: { include: { plan: true } } } } },
      },
    },
  });

  if (!user) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link href="/admin/users" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors mb-4">
          <ChevronLeft className="h-4 w-4" /> Back to users
        </Link>
        <h1 className="text-2xl font-bold text-white">{user.name ?? "Unnamed user"}</h1>
        <p className="text-zinc-400 mt-1">{user.email}</p>
      </div>

      {/* Edit form */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-sm font-semibold text-white mb-4">Edit User</h2>
        <EditUserForm user={{ id: user.id, name: user.name, role: user.role, isActive: user.isActive }} />
      </div>

      {/* Memberships */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900">
        <div className="px-6 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-white">Organization Memberships</h2>
        </div>
        <div className="divide-y divide-zinc-800">
          {user.memberships.length === 0 ? (
            <p className="px-6 py-4 text-sm text-zinc-400">No memberships</p>
          ) : (
            user.memberships.map((m) => (
              <div key={m.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <Link href={`/admin/organizations/${m.organizationId}`} className="text-sm font-medium text-white hover:underline">
                    {m.organization.name}
                  </Link>
                  <p className="text-xs text-zinc-400">
                    {m.organization.subscription ? m.organization.subscription.plan.name : "No subscription"}
                  </p>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {m.role}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
