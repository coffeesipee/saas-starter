"use client";

import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { MoreHorizontal, ExternalLink, XCircle } from "lucide-react";
import { cancelSubscription } from "@/app/actions/admin/subscriptions";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SubscriptionActionsMenu({ subscriptionId, orgId, status }: { subscriptionId: string; orgId: string; status: string }) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={
<button id={`sub-actions-${subscriptionId}`} className="p-1 rounded hover:bg-zinc-700 transition-colors outline-none">
            <MoreHorizontal className="h-4 w-4 text-zinc-400" />
          </button>
} />
        <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-700 text-zinc-100">
          <DropdownMenuItem render={
<Link href={`/admin/organizations/${orgId}`} className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" /> View organization
            </Link>
} className="cursor-pointer hover:bg-zinc-800" />
          {status !== "CANCELED" && (
            <>
              <DropdownMenuSeparator className="bg-zinc-700" />
              <DropdownMenuItem className="cursor-pointer text-red-400 hover:bg-zinc-800 hover:text-red-400 gap-2" onClick={() => setCancelOpen(true)}>
                <XCircle className="h-4 w-4" /> Cancel subscription
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel subscription?"
        description="The subscription status will be changed to CANCELED."
        confirmLabel="Cancel subscription"
        onConfirm={async () => { await cancelSubscription(subscriptionId); toast.success("Subscription canceled"); router.refresh(); }}
      />
    </>
  );
}
