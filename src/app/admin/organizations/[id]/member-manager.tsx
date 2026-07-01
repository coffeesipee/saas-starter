"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addMember, removeMember } from "@/app/actions/admin/organizations";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { toast } from "sonner";
import { Users, X } from "lucide-react";
import type { MembershipRole } from "@/generated/prisma";

interface User { id: string; name: string | null; email: string | null; }
interface Member { id: string; userId: string; role: MembershipRole; user: User; }
interface Org { id: string; memberships: Member[]; }

export function MemberManager({ org, allUsers }: { org: Org; allUsers: User[] }) {
  const memberIds = new Set(org.memberships.map((m) => m.userId));
  const nonMembers = allUsers.filter((u) => !memberIds.has(u.id));
  const [selectedUser, setSelectedUser] = useState(nonMembers[0]?.id ?? "");
  const [selectedRole, setSelectedRole] = useState<MembershipRole>("MEMBER");
  const [removeTarget, setRemoveTarget] = useState<{ userId: string; name: string } | null>(null);
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    if (!selectedUser) return;
    setAdding(true);
    try {
      await addMember(org.id, selectedUser, selectedRole);
      toast.success("Member added");
    } catch { toast.error("Failed to add member"); }
    finally { setAdding(false); }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-2">
        <Users className="h-4 w-4 text-violet-400" />
        <h2 className="text-sm font-semibold text-white">Members</h2>
        <span className="ml-auto text-xs text-zinc-500">{org.memberships.length} member{org.memberships.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Current members */}
      <div className="divide-y divide-zinc-800">
        {org.memberships.map((m) => (
          <div key={m.id} className="px-6 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm text-white">{m.user.name ?? m.user.email}</p>
              <p className="text-xs text-zinc-400">{m.user.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-700 bg-zinc-800">{m.role}</span>
              {m.role !== "OWNER" && (
                <button
                  onClick={() => setRemoveTarget({ userId: m.userId, name: m.user.name ?? m.user.email ?? "this user" })}
                  className="text-zinc-500 hover:text-red-400 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add member */}
      {nonMembers.length > 0 && (
        <div className="px-6 py-4 border-t border-zinc-800 flex items-end gap-3">
          <div className="flex-1 space-y-1.5">
            <p className="text-xs text-zinc-400">Add member</p>
            <Select value={selectedUser} onValueChange={(v) => setSelectedUser(v as string)}>
              <SelectTrigger id="add-member-user" className="bg-zinc-800 border-zinc-700 text-white text-sm h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                {nonMembers.map((u) => (
                  <SelectItem key={u.id} value={u.id}>{u.name ?? u.email}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-32 space-y-1.5">
            <p className="text-xs text-zinc-400">Role</p>
            <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as MembershipRole)}>
              <SelectTrigger id="add-member-role" className="bg-zinc-800 border-zinc-700 text-white text-sm h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                <SelectItem value="ADMIN">ADMIN</SelectItem>
                <SelectItem value="MEMBER">MEMBER</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAdd} disabled={adding} size="sm" className="bg-violet-600 hover:bg-violet-700 text-white h-8">
            Add
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={!!removeTarget}
        onOpenChange={(o) => !o && setRemoveTarget(null)}
        title="Remove member?"
        description={`Remove ${removeTarget?.name} from this organization?`}
        confirmLabel="Remove"
        onConfirm={async () => {
          if (removeTarget) {
            await removeMember(org.id, removeTarget.userId);
            toast.success("Member removed");
            setRemoveTarget(null);
          }
        }}
      />
    </div>
  );
}
