"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateUser } from "@/app/actions/admin/users";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { UserRole } from "@/generated/prisma";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.enum(["ADMIN", "USER"]),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export function EditUserForm({ user }: { user: { id: string; name: string | null; role: UserRole; isActive: boolean } }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: user.name ?? "", role: user.role, isActive: user.isActive },
  });

  const isActive = watch("isActive");
  const role = watch("role");

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      await updateUser(user.id, data);
      toast.success("User updated successfully");
    } catch {
      toast.error("Failed to update user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-zinc-300">Name</Label>
        <Input id="name" {...register("name")} className="bg-zinc-800 border-zinc-700 text-white" />
        {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label className="text-zinc-300">Role</Label>
        <Select value={role} onValueChange={(v) => setValue("role", v as UserRole)}>
          <SelectTrigger id="role" className="bg-zinc-800 border-zinc-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
            <SelectItem value="USER">USER</SelectItem>
            <SelectItem value="ADMIN">ADMIN</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="isActive"
          checked={isActive}
          onCheckedChange={(v) => setValue("isActive", v)}
        />
        <Label htmlFor="isActive" className="text-zinc-300">Active account</Label>
      </div>

      <Button type="submit" disabled={loading} className="bg-violet-600 hover:bg-violet-700 text-white">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save changes
      </Button>
    </form>
  );
}
