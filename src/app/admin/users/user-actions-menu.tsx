"use client";

import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { MoreHorizontal, UserCheck, UserX, ShieldCheck, ShieldOff, Trash2, ExternalLink } from "lucide-react";
import { toggleUserActive, changeUserRole, deleteUser } from "@/app/actions/admin/users";
import { toast } from "sonner";
import Link from "next/link";
import type { UserRole } from "@/generated/prisma";

export function UserActionsMenu({ userId, isActive, role }: { userId: string; isActive: boolean; role: UserRole }) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={
<button
            id={`user-actions-${userId}`}
            className="p-1 rounded hover:bg-zinc-700 transition-colors outline-none"
          >
            <MoreHorizontal className="h-4 w-4 text-zinc-400" />
          </button>
} />
        <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-700 text-zinc-100">
          <DropdownMenuItem render={
<Link href={`/admin/users/${userId}`} className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" /> View details
            </Link>
} className="cursor-pointer hover:bg-zinc-800" />
          <DropdownMenuSeparator className="bg-zinc-700" />
          <DropdownMenuItem
            className="cursor-pointer hover:bg-zinc-800 gap-2"
            onClick={async () => {
              await toggleUserActive(userId, !isActive);
              toast.success(isActive ? "User deactivated" : "User activated");
            }}
          >
            {isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
            {isActive ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer hover:bg-zinc-800 gap-2"
            onClick={async () => {
              const newRole: UserRole = role === "ADMIN" ? "USER" : "ADMIN";
              await changeUserRole(userId, newRole);
              toast.success(`Role changed to ${newRole}`);
            }}
          >
            {role === "ADMIN" ? <ShieldOff className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
            {role === "ADMIN" ? "Remove admin" : "Make admin"}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-zinc-700" />
          <DropdownMenuItem
            className="cursor-pointer text-red-400 hover:bg-zinc-800 hover:text-red-400 gap-2"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" /> Delete user
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete user"
        description="This action cannot be undone. The user and all their data will be permanently deleted."
        confirmLabel="Delete"
        onConfirm={async () => {
          await deleteUser(userId);
          toast.success("User deleted");
        }}
      />
    </>
  );
}
