import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserMemberships } from "@/lib/memberships";
import { Toaster } from "@/components/ui/sonner";
import { UserNav } from "@/components/app/user-nav";
import {
  LayoutDashboard,
  Settings,
  CreditCard,
  Building2,
  Users,
  Shield,
} from "lucide-react";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const memberships = await getUserMemberships();
  const firstOrg = memberships[0]?.organization;

  // Redirect to onboarding if no org
  // (handled per-page to allow the onboarding page itself to render)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-950">
      {/* Top navigation bar */}
      <header className="h-14 border-b bg-white dark:bg-zinc-900 dark:border-zinc-800 sticky top-0 z-10">
        <div className="h-full max-w-screen-xl mx-auto flex items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="font-semibold text-sm">SaaS App</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Org badge */}
            {firstOrg && (
              <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground border rounded-full px-3 py-1 bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700">
                <Building2 className="h-3.5 w-3.5" />
                <span className="max-w-32 truncate">{firstOrg.name}</span>
              </div>
            )}

            {/* Admin badge */}
            {session.user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1.5 text-xs text-violet-600 border border-violet-200 dark:border-violet-800 dark:text-violet-400 rounded-full px-2.5 py-1 hover:bg-violet-50 dark:hover:bg-violet-950 transition-colors"
              >
                <Shield className="h-3 w-3" /> Admin
              </Link>
            )}

            <UserNav user={session.user} />
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-screen-xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-52 flex-shrink-0 hidden md:block py-6 px-3">
          <nav className="space-y-0.5">
            <NavLink href="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
            {firstOrg && (
              <>
                <NavLink href="/billing" icon={CreditCard}>Billing</NavLink>
                <NavLink href="/settings/members" icon={Users}>Members</NavLink>
                <NavLink href="/settings/organization" icon={Building2}>Organization</NavLink>
              </>
            )}
            <NavLink href="/settings" icon={Settings}>Settings</NavLink>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 min-w-0">{children}</main>
      </div>

      <Toaster />
    </div>
  );
}

function NavLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground transition-colors"
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      {children}
    </Link>
  );
}