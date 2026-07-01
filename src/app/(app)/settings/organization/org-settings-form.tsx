"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateOrganization } from "@/app/actions/app/organizations";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

interface OrgData { id: string; name: string; description: string | null; }

export function OrgSettingsForm({ org }: { org: OrgData }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: org.name, description: org.description ?? "" },
  });

  async function onSubmit(data: z.infer<typeof schema>) {
    setLoading(true);
    try { await updateOrganization(org.id, data); toast.success("Organization updated"); }
    catch { toast.error("Failed to update organization"); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="org-name-edit">Organization name</Label>
        <Input id="org-name-edit" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="org-desc-edit">Description <span className="text-xs text-muted-foreground">(optional)</span></Label>
        <Input id="org-desc-edit" {...register("description")} />
      </div>
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save changes
      </Button>
    </form>
  );
}
