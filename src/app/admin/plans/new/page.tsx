"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createPlan } from "@/app/actions/admin/plans";
import { toast } from "sonner";
import { Loader2, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  price: z.coerce.number().int().min(0).optional(),
  billingInterval: z.enum(["MONTHLY", "YEARLY", "ONE_TIME"]).optional(),
  isActive: z.boolean().default(true),
});

export default function NewPlanPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { isActive: true },
  });

  const isActive = watch("isActive");
  const interval = watch("billingInterval");

  async function onSubmit(data: z.infer<typeof schema>) {
    setLoading(true);
    try {
      const result = await createPlan(data);
      toast.success("Plan created");
      router.push(`/admin/plans/${result.plan.id}`);
    } catch { toast.error("Failed to create plan"); setLoading(false); }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <Link href="/admin/plans" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white mb-4">
          <ChevronLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="text-2xl font-bold text-white">New Plan</h1>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="plan-name" className="text-zinc-300">Name</Label>
            <Input id="plan-name" {...register("name")} placeholder="Pro" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="plan-slug" className="text-zinc-300">Slug</Label>
            <Input id="plan-slug" {...register("slug")} placeholder="pro" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
            {errors.slug && <p className="text-xs text-red-400">{errors.slug.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="plan-desc" className="text-zinc-300">Description <span className="text-zinc-500">(optional)</span></Label>
            <Input id="plan-desc" {...register("description")} placeholder="For growing teams" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="plan-price" className="text-zinc-300">Price (cents)</Label>
              <Input id="plan-price" type="number" {...register("price")} placeholder="2900" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
              <p className="text-xs text-zinc-500">e.g. 2900 = $29.00</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-zinc-300">Billing Interval</Label>
              <Select value={interval ?? ""} onValueChange={(v) => setValue("billingInterval", v as "MONTHLY" | "YEARLY" | "ONE_TIME")}>
                <SelectTrigger id="plan-interval" className="bg-zinc-800 border-zinc-700 text-white">
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
            <Switch id="plan-active" checked={isActive} onCheckedChange={(v) => setValue("isActive", v)} />
            <Label htmlFor="plan-active" className="text-zinc-300">Active (visible to users)</Label>
          </div>
          <Button type="submit" disabled={loading} className="bg-violet-600 hover:bg-violet-700 text-white w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Plan
          </Button>
        </form>
      </div>
    </div>
  );
}
