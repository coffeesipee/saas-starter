"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createFeature } from "@/app/actions/admin/features";
import { toast } from "sonner";
import { Loader2, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const schema = z.object({
  key: z.string().min(2).regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, underscores only"),
  name: z.string().min(2),
  description: z.string().optional(),
  type: z.enum(["BOOLEAN", "NUMBER"]),
  defaultValue: z.string().default("false"),
});

export default function NewFeaturePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { type: "BOOLEAN" as const, defaultValue: "false" },
  });

  const type = watch("type");

  async function onSubmit(data: z.infer<typeof schema>) {
    setLoading(true);
    try {
      await createFeature(data);
      toast.success("Feature created");
      router.push("/admin/features");
    } catch { toast.error("Failed to create feature"); setLoading(false); }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <Link href="/admin/features" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white mb-4">
          <ChevronLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="text-2xl font-bold text-white">New Feature</h1>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="feat-key" className="text-zinc-300">Key <span className="text-zinc-500 text-xs">(unique identifier)</span></Label>
            <Input id="feat-key" {...register("key")} placeholder="api_access" className="bg-zinc-800 border-zinc-700 text-white font-mono placeholder:text-zinc-500" />
            {errors.key && <p className="text-xs text-red-400">{errors.key.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="feat-name" className="text-zinc-300">Display Name</Label>
            <Input id="feat-name" {...register("name")} placeholder="API Access" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="feat-desc" className="text-zinc-300">Description <span className="text-zinc-500">(optional)</span></Label>
            <Input id="feat-desc" {...register("description")} placeholder="Allows API access" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-zinc-300">Type</Label>
              <Select value={type} onValueChange={(v) => { setValue("type", v as "BOOLEAN" | "NUMBER"); setValue("defaultValue", v === "BOOLEAN" ? "false" : "0"); }}>
                <SelectTrigger id="feat-type" className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                  <SelectItem value="BOOLEAN">BOOLEAN</SelectItem>
                  <SelectItem value="NUMBER">NUMBER</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="feat-default" className="text-zinc-300">Default Value</Label>
              {type === "BOOLEAN" ? (
                <Select value={watch("defaultValue") || ""} onValueChange={(v) => setValue("defaultValue", v as string)}>
                  <SelectTrigger id="feat-default" className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                    <SelectItem value="false">false</SelectItem>
                    <SelectItem value="true">true</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input id="feat-default" type="number" {...register("defaultValue")} className="bg-zinc-800 border-zinc-700 text-white" />
              )}
            </div>
          </div>
          <Button type="submit" disabled={loading} className="bg-violet-600 hover:bg-violet-700 text-white w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Feature
          </Button>
        </form>
      </div>
    </div>
  );
}
