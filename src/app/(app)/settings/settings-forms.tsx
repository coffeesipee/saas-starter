"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { updateProfile, changePassword } from "@/app/actions/app/profile";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const profileSchema = z.object({ name: z.string().min(2) });
const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] });

function ProfileForm({ defaultName }: { defaultName: string }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: defaultName },
  });

  async function onSubmit(data: z.infer<typeof profileSchema>) {
    setLoading(true);
    try { await updateProfile(data); toast.success("Profile updated"); }
    catch { toast.error("Failed to update profile"); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="profile-name">Display name</Label>
        <Input id="profile-name" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save changes
      </Button>
    </form>
  );
}

function PasswordForm() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  async function onSubmit(data: z.infer<typeof passwordSchema>) {
    setLoading(true);
    try { await changePassword(data); toast.success("Password changed"); reset(); }
    catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Failed to change password"); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="current-pw">Current password</Label>
        <Input id="current-pw" type="password" {...register("currentPassword")} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="new-pw">New password</Label>
        <Input id="new-pw" type="password" {...register("newPassword")} />
        {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirm-pw">Confirm new password</Label>
        <Input id="confirm-pw" type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
      </div>
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Change password
      </Button>
    </form>
  );
}

export function SettingsPage({ defaultName }: { defaultName?: string }) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your profile and security</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your display name</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm defaultName={defaultName ?? ""} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
