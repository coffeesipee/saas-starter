"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { updateBranding } from "@/app/actions/admin/branding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  logoUrl: z.string().url().or(z.literal("")).optional(),
  primaryColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "Must be a valid hex color"),
  secondaryColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "Must be a valid hex color"),
});

export function BrandingForm({ initialData }: { initialData: Partial<z.infer<typeof schema>> }) {
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      logoUrl: initialData.logoUrl || "",
      primaryColor: initialData.primaryColor || "#0f172a",
      secondaryColor: initialData.secondaryColor || "#f8fafc",
    }
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    startTransition(async () => {
      try {
        await updateBranding(data);
        toast.success("Branding updated successfully!");
      } catch (error) {
        toast.error("Failed to update branding");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="logoUrl">Logo URL (Optional)</Label>
        <Input id="logoUrl" placeholder="https://example.com/logo.png" {...register("logoUrl")} />
        {errors.logoUrl && <p className="text-sm text-red-500">{errors.logoUrl.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="primaryColor">Primary Color (Hex)</Label>
        <div className="flex gap-4">
          <Input id="primaryColor" type="color" className="w-16 h-10 p-1" {...register("primaryColor")} />
          <Input placeholder="#0f172a" className="flex-1" {...register("primaryColor")} />
        </div>
        {errors.primaryColor && <p className="text-sm text-red-500">{errors.primaryColor.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="secondaryColor">Secondary Color (Hex)</Label>
        <div className="flex gap-4">
          <Input id="secondaryColor" type="color" className="w-16 h-10 p-1" {...register("secondaryColor")} />
          <Input placeholder="#f8fafc" className="flex-1" {...register("secondaryColor")} />
        </div>
        {errors.secondaryColor && <p className="text-sm text-red-500">{errors.secondaryColor.message as string}</p>}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Branding"}
      </Button>
    </form>
  );
}
