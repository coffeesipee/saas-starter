"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateFeature } from "@/app/actions/admin/features";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { FeatureType } from "@/generated/prisma";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  defaultValue: z.string().min(1),
});

interface FeatureData { id: string; name: string; description: string | null; type: FeatureType; defaultValue: string; }

export function FeatureEditForm({ feature }: { feature: FeatureData }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: feature.name, description: feature.description ?? "", defaultValue: feature.defaultValue },
  });

  const defaultValue = watch("defaultValue");

  async function onSubmit(data: z.infer<typeof schema>) {
    setLoading(true);
    try {
      await updateFeature(feature.id, data);
      toast.success("Feature updated");
    } catch { toast.error("Failed to update feature"); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="ef-name" className="text-zinc-300">Display Name</Label>
        <Input id="ef-name" {...register("name")} className="bg-zinc-800 border-zinc-700 text-white" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="ef-desc" className="text-zinc-300">Description</Label>
        <Input id="ef-desc" {...register("description")} className="bg-zinc-800 border-zinc-700 text-white" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-zinc-300">Default Value</Label>
        {feature.type === "BOOLEAN" ? (
          <Select value={defaultValue ?? ""} onValueChange={(v) => setValue("defaultValue", v as string)}>
            <SelectTrigger id="ef-default" className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
              <SelectItem value="false">false</SelectItem>
              <SelectItem value="true">true</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Input id="ef-default" type="number" {...register("defaultValue")} className="bg-zinc-800 border-zinc-700 text-white" />
        )}
      </div>
      <div className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800 border border-zinc-700">
        <span className="text-xs text-zinc-400">Type:</span>
        <span className="text-xs font-medium text-white font-mono">{feature.type}</span>
        <span className="text-xs text-zinc-500 ml-1">(cannot be changed)</span>
      </div>
      <Button type="submit" disabled={loading} className="bg-violet-600 hover:bg-violet-700 text-white">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save changes
      </Button>
    </form>
  );
}
