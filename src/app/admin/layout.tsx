import { requireAdmin } from "@/lib/rbac";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserNav } from "@/components/app/user-nav";
import { Toaster } from "@/components/ui/sonner";
import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  Zap,
  ToggleLeft,
  ChevronRight,
  Shield,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/organizations", label: "Organizations", icon: Building2 },
  { href: "/admin/plans", label: "Plans", icon: CreditCard },
  { href: "/admin/features", label: "Features", icon: Zap },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: ToggleLeft },
  { href: "/admin/branding", label: "Branding", icon: Shield },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-zinc-800 bg-zinc-900 flex flex-col hidden md:flex">
        {/* Brand */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-zinc-800">
          <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Admin Portal</p>
            <p className="text-xs text-zinc-400">SaaS Boilerplate</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <AdminNavLink key={item.href} href={item.href} icon={item.icon}>
              {item.label}
            </AdminNavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800">
          <Link
            href="/app/dashboard"
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ChevronRight className="h-3 w-3" />
            Switch to user app
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-6 flex-shrink-0">
          <h1 className="text-sm font-medium text-zinc-400">Admin Console</h1>
          <UserNav user={{ ...session.user, role: session.user.role as string }} />
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto bg-zinc-950">
          {children}
        </main>
      </div>

      <Toaster />
    </div>
  );
}

function AdminNavLink({
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
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors group"
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      {children}
    </Link>
  );
}
