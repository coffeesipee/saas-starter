"use client";

import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { MoreHorizontal, ExternalLink, Trash2 } from "lucide-react";
import { deletePlan } from "@/app/actions/admin/plans";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function PlanActionsMenu({ planId, planName }: { planId: string; planName: string }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={
<button id={`plan-actions-${planId}`} className="p-1 rounded hover:bg-zinc-700 transition-colors outline-none">
            <MoreHorizontal className="h-4 w-4 text-zinc-400" />
          </button>
} />
        <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-700 text-zinc-100">
          <DropdownMenuItem render={
<Link href={`/admin/plans/${planId}`} className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" /> Edit plan
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
        title={`Delete "${planName}"?`}
        description="This plan will be deleted. Organizations with this plan won't lose their subscriptions but the plan will no longer be selectable."
        confirmLabel="Delete plan"
        onConfirm={async () => { await deletePlan(planId); toast.success("Plan deleted"); router.refresh(); }}
      />
    </>
  );
}
