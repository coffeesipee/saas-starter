"use client";

import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { MoreHorizontal, ExternalLink, Trash2 } from "lucide-react";
import { deleteOrganization } from "@/app/actions/admin/organizations";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function OrgActionsMenu({ orgId, orgName }: { orgId: string; orgName: string }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={
<button
            id={`org-actions-${orgId}`}
            className="p-1 rounded hover:bg-zinc-700 transition-colors outline-none"
          >
            <MoreHorizontal className="h-4 w-4 text-zinc-400" />
          </button>
} />
        <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-700 text-zinc-100">
          <DropdownMenuItem render={
<Link href={`/admin/organizations/${orgId}`} className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" /> View details
            </Link>
} className="cursor-pointer hover:bg-zinc-800" />
          <DropdownMenuSeparator className="bg-zinc-700" />
          <DropdownMenuItem
            className="cursor-pointer text-red-400 hover:bg-zinc-800 hover:text-red-400 gap-2"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete "${orgName}"?`}
        description="This will permanently delete the organization and all associated memberships, subscriptions, and feature overrides."
        confirmLabel="Delete organization"
        onConfirm={async () => {
          await deleteOrganization(orgId);
          toast.success("Organization deleted");
          router.refresh();
        }}
      />
    </>
  );
}
