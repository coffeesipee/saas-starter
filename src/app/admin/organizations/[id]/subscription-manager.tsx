"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createSubscription, cancelSubscription } from "@/app/actions/admin/subscriptions";
import { toast } from "sonner";
import { Loader2, CreditCard, XCircle } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

interface Plan { id: string; name: string; }
interface Subscription { id: string; planId: string; status: string; billingCycleStart: Date; billingCycleEnd: Date; plan: Plan; }
interface Org { id: string; name: string; subscription: Subscription | null; }

export function SubscriptionManager({ org, plans }: { org: Org; plans: Plan[] }) {
  const [loading, setLoading] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [planId, setPlanId] = useState(org.subscription?.planId ?? plans[0]?.id ?? "");
  const [status, setStatus] = useState<string>(org.subscription?.status ?? "ACTIVE");
  const [start, setStart] = useState(org.subscription?.billingCycleStart.toISOString().slice(0, 10) ?? new Date().toISOString().slice(0, 10));
  const [end, setEnd] = useState(org.subscription?.billingCycleEnd.toISOString().slice(0, 10) ?? new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));

  async function handleSave() {
    setLoading(true);
    try {
      await createSubscription({
        organizationId: org.id,
        planId,
        status: status as "ACTIVE" | "TRIALING" | "PAST_DUE" | "CANCELED" | "PAUSED",
        billingCycleStart: new Date(start).toISOString(),
        billingCycleEnd: new Date(end).toISOString(),
      });
      toast.success("Subscription saved");
    } catch { toast.error("Failed to save subscription"); }
    finally { setLoading(false); }
  }

  const statusColors: Record<string, string> = {
    ACTIVE: "text-emerald-400", TRIALING: "text-blue-400",
    PAST_DUE: "text-yellow-400", CANCELED: "text-red-400", PAUSED: "text-zinc-400",
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="h-4 w-4 text-violet-400" />
        <h2 className="text-sm font-semibold text-white">Subscription</h2>
        {org.subscription && (
          <span className={`ml-auto text-xs font-medium ${statusColors[org.subscription.status]}`}>
            {org.subscription.status}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-zinc-300 text-xs">Plan</Label>
          <Select value={planId} onValueChange={(v) => setPlanId(v as string)}>
            <SelectTrigger id="sub-plan" className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
              {plans.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-zinc-300 text-xs">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as string)}>
            <SelectTrigger id="sub-status" className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
              {["ACTIVE", "TRIALING", "PAST_DUE", "CANCELED", "PAUSED"].map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-zinc-300 text-xs">Billing Start</Label>
          <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-zinc-300 text-xs">Billing End</Label>
          <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white" />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button onClick={handleSave} disabled={loading} className="bg-violet-600 hover:bg-violet-700 text-white">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {org.subscription ? "Update Subscription" : "Create Subscription"}
        </Button>
        {org.subscription && (
          <Button variant="outline" onClick={() => setCancelOpen(true)} className="border-red-800 text-red-400 hover:bg-red-950 hover:text-red-300">
            <XCircle className="mr-2 h-4 w-4" /> Cancel
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel subscription?"
        description="The organization's subscription will be marked as canceled. This can be re-activated at any time."
        confirmLabel="Cancel subscription"
        onConfirm={async () => {
          if (org.subscription) {
            await cancelSubscription(org.subscription.id);
            toast.success("Subscription canceled");
          }
        }}
      />
    </div>
  );
}
