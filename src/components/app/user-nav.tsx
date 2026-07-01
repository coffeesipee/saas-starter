"use client";

import { signOut } from "next-auth/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";

interface UserNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  };
}

export function UserNav({ user }: UserNavProps) {
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.[0].toUpperCase() ?? "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
<button
          id="user-nav-trigger"
          className="flex items-center gap-2 rounded-full p-1 hover:bg-accent transition-colors outline-none"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
            <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden sm:block max-w-32 truncate">
            {user.name ?? user.email}
          </span>
        </button>
} />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <p className="font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <Badge variant="outline" className="w-fit text-xs mt-1">{user.role}</Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={
<Link href="/settings" className="flex items-center gap-2 cursor-pointer">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
} />
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
