"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createOrganization } from "@/app/actions/app/organizations";
import { toast } from "sonner";
import { Loader2, Building2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
});

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const name = watch("name", "");

  // Auto-generate slug from name
  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    setValue("slug", slug);
  }

  async function onSubmit(data: z.infer<typeof schema>) {
    setLoading(true);
    try {
      const result = await createOrganization(data);
      if (result.success) {
        toast.success("Organization created! Welcome aboard 🎉");
        router.push("/app/dashboard");
      }
      router.refresh();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to create organization";
      toast.error(message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-violet-600 mb-4 shadow-lg shadow-violet-500/25">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Create your workspace</h1>
          <p className="text-muted-foreground mt-2">
            Set up your organization to get started
          </p>
        </div>

        <Card className="border-0 shadow-xl shadow-black/5">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization name</Label>
                <Input
                  id="org-name"
                  placeholder="Acme Corp"
                  {...register("name")}
                  onChange={(e) => {
                    register("name").onChange(e);
                    handleNameChange(e);
                  }}
                  className="h-11"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="org-slug">
                  Slug <span className="text-xs text-muted-foreground">(URL-friendly name)</span>
                </Label>
                <div className="flex items-center rounded-md border focus-within:ring-1 focus-within:ring-ring overflow-hidden">
                  <span className="px-3 py-2.5 text-sm text-muted-foreground bg-muted border-r">app.io/</span>
                  <Input
                    id="org-slug"
                    placeholder="acme-corp"
                    {...register("slug")}
                    className="border-0 rounded-none focus-visible:ring-0 h-11"
                  />
                </div>
                {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-lg shadow-violet-500/25"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {loading ? "Creating..." : "Create workspace"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          You can change these details later from your organization settings.
        </p>
      </div>
    </div>
  );
}
