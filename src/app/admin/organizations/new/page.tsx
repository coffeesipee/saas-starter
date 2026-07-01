"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createOrganization } from "@/app/actions/admin/organizations";
import { toast } from "sonner";
import { Loader2, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().optional(),
});

export default function NewOrganizationPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(data: z.infer<typeof schema>) {
    setLoading(true);
    try {
      const result = await createOrganization(data);
      toast.success("Organization created");
      router.push(`/admin/organizations/${result.org.id}`);
    } catch (e) {
      toast.error("Failed to create organization");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <Link href="/admin/organizations" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors mb-4">
          <ChevronLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="text-2xl font-bold text-white">New Organization</h1>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="org-name" className="text-zinc-300">Name</Label>
            <Input id="org-name" {...register("name")} placeholder="Acme Corp" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="org-slug" className="text-zinc-300">Slug</Label>
            <Input id="org-slug" {...register("slug")} placeholder="acme-corp" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
            {errors.slug && <p className="text-xs text-red-400">{errors.slug.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="org-desc" className="text-zinc-300">Description <span className="text-zinc-500">(optional)</span></Label>
            <Input id="org-desc" {...register("description")} placeholder="A short description" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
          </div>
          <Button type="submit" disabled={loading} className="bg-violet-600 hover:bg-violet-700 text-white w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Organization
          </Button>
        </form>
      </div>
    </div>
  );
}
