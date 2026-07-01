"use client";

import { useEffect, useState } from "react";
import { removeMember, changeMemberRole } from "@/app/actions/app/organizations";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { X } from "lucide-react";


// Note: data is fetched server-side via props from parent, this is the interactive layer

interface Member {
  id: string;
  userId: string;
  role: string;
  user: { name: string | null; email: string | null };
}

export function MembersClient({
  orgId,
  currentUserId,
  currentUserRole,
  isOwnerOrAdmin,
}: {
  orgId: string;
  currentUserId: string;
  currentUserRole: string;
  isOwnerOrAdmin: boolean;
}) {
  const [members, setMembers] = useState<Member[]>([]);
  const [removeTarget, setRemoveTarget] = useState<Member | null>(null);

  useEffect(() => {
    fetch(`/api/orgs/${orgId}/members`).then((r) => r.json()).then(setMembers).catch(() => {});
  }, [orgId]);

  const initials = (name: string | null, email: string | null) => {
    if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    return email?.[0].toUpperCase() ?? "?";
  };

  return (
    <div className="space-y-2">
      {members.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">Loading members...</p>}
      {members.map((member) => (
        <div key={member.id} className="flex items-center gap-3 py-2.5 border-b last:border-0">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="text-xs bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
              {initials(member.user.name, member.user.email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{member.user.name ?? "Unnamed"}</p>
            <p className="text-xs text-muted-foreground truncate">{member.user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            {isOwnerOrAdmin && member.role !== "OWNER" && member.userId !== currentUserId ? (
              <>
                <Select
                  value={member.role}
                  onValueChange={async (v) => {
                    try {
                      await changeMemberRole(orgId, member.userId, v as "ADMIN" | "MEMBER");
                      setMembers((prev) => prev.map((m) => m.userId === member.userId ? { ...m, role: v as string } : m));
                      toast.success("Role updated");
                    } catch { toast.error("Failed to update role"); }
                  }}
                >
                  <SelectTrigger className="h-7 text-xs w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MEMBER">Member</SelectItem>
                  </SelectContent>
                </Select>
                <button onClick={() => setRemoveTarget(member)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full border bg-muted">{member.role}</span>
            )}
          </div>
        </div>
      ))}

      <ConfirmDialog
        open={!!removeTarget}
        onOpenChange={(o) => !o && setRemoveTarget(null)}
        title="Remove member?"
        description={`Remove ${removeTarget?.user.name ?? removeTarget?.user.email} from this organization?`}
        confirmLabel="Remove"
        onConfirm={async () => {
          if (removeTarget) {
            await removeMember(orgId, removeTarget.userId);
            setMembers((prev) => prev.filter((m) => m.userId !== removeTarget.userId));
            toast.success("Member removed");
          }
        }}
      />
    </div>
  );
}
