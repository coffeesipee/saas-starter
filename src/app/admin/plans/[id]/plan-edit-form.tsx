"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { updatePlan } from "@/app/actions/admin/plans";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { BillingInterval } from "@/generated/prisma";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.coerce.number().int().min(0).optional(),
  billingInterval: z.enum(["MONTHLY", "YEARLY", "ONE_TIME"]).optional(),
  isActive: z.boolean(),
});

interface PlanData {
  id: string; name: string; description: string | null; price: number | null;
  billingInterval: BillingInterval | null; isActive: boolean;
}

export function PlanEditForm({ plan }: { plan: PlanData }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: plan.name,
      description: plan.description ?? "",
      price: plan.price ?? undefined,
      billingInterval: plan.billingInterval ?? undefined,
      isActive: plan.isActive,
    },
  });

  const isActive = watch("isActive");
  const interval = watch("billingInterval");

  async function onSubmit(data: z.infer<typeof schema>) {
    setLoading(true);
    try {
      await updatePlan(plan.id, data);
      toast.success("Plan updated");
    } catch { toast.error("Failed to update plan"); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="edit-name" className="text-zinc-300">Name</Label>
        <Input id="edit-name" {...register("name")} className="bg-zinc-800 border-zinc-700 text-white" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="edit-desc" className="text-zinc-300">Description</Label>
        <Input id="edit-desc" {...register("description")} className="bg-zinc-800 border-zinc-700 text-white" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="edit-price" className="text-zinc-300">Price (cents)</Label>
          <Input id="edit-price" type="number" {...register("price")} className="bg-zinc-800 border-zinc-700 text-white" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-zinc-300">Billing Interval</Label>
          <Select value={interval ?? ""} onValueChange={(v) => setValue("billingInterval", v as BillingInterval)}>
            <SelectTrigger id="edit-interval" className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
              <SelectItem value="ONE_TIME">One-time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="edit-active" checked={isActive} onCheckedChange={(v) => setValue("isActive", v)} />
        <Label htmlFor="edit-active" className="text-zinc-300">Active</Label>
      </div>
      <Button type="submit" disabled={loading} className="bg-violet-600 hover:bg-violet-700 text-white">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save changes
      </Button>
    </form>
  );
}
