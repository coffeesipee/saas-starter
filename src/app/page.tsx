import Link from "next/link";
import { Check, Zap, Building2, Shield, CreditCard, Users } from "lucide-react";

const features = [
  { icon: Shield, title: "Authentication", description: "Email/password + OAuth (GitHub). JWT sessions, role-based access control." },
  { icon: Building2, title: "Organizations", description: "Multi-tenant architecture. Users belong to orgs with OWNER, ADMIN, or MEMBER roles." },
  { icon: CreditCard, title: "Plans & Subscriptions", description: "Flexible plan management. Manually assign subscriptions per organization." },
  { icon: Zap, title: "Feature Flags", description: "Boolean and numeric feature gates. Per-plan defaults with per-org overrides." },
  { icon: Users, title: "Admin Portal", description: "Full CRUD for users, orgs, plans, features, and subscriptions from /admin." },
  { icon: Check, title: "Production Ready", description: "Next.js 16, Prisma, TypeScript, Tailwind CSS. Deploy anywhere in minutes." },
];

const plans = [
  { name: "Free", price: "$0", interval: "/month", description: "Perfect for individuals", features: ["1 organization", "3 feature flags", "Community support"], highlighted: false },
  { name: "Pro", price: "$29", interval: "/month", description: "For growing teams", features: ["Unlimited organizations", "Unlimited features", "Per-org overrides", "Priority support"], highlighted: true },
  { name: "Enterprise", price: "Custom", interval: "", description: "For large organizations", features: ["Everything in Pro", "Custom integrations", "SLA guarantee", "Dedicated support"], highlighted: false },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Nav */}
      <nav className="border-b border-zinc-800 sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="font-semibold text-sm">SaaS Boilerplate</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5">
              Sign in
            </Link>
            <Link href="/register" className="text-sm bg-violet-600 hover:bg-violet-700 text-white px-4 py-1.5 rounded-lg transition-colors font-medium">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-400 text-sm font-medium mb-8">
            <Zap className="h-3.5 w-3.5" />
            Open source SaaS starter kit
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent mb-6 leading-[1.1]">
            Ship your SaaS<br />in days, not months
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10">
            Production-ready boilerplate with auth, organizations, plans, subscriptions, and feature flags. Built with Next.js 16, Prisma, and TypeScript.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              id="hero-cta"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
            >
              Get started free <span className="text-violet-300">→</span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-white px-6 py-3 rounded-xl font-medium transition-all"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold">Everything you need to launch</h2>
            <p className="text-zinc-400 mt-3 max-w-xl mx-auto">
              A complete SaaS foundation with all the modules you'd build anyway — pre-built and ready to customize.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-colors group"
              >
                <div className="h-9 w-9 rounded-lg bg-violet-600/10 border border-violet-600/20 flex items-center justify-center mb-4 group-hover:bg-violet-600/20 transition-colors">
                  <f.icon className="h-4.5 w-4.5 text-violet-400" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 border-t border-zinc-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold">Simple pricing</h2>
            <p className="text-zinc-400 mt-3">Assign plans manually via the admin portal. No Stripe required.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`p-6 rounded-xl border flex flex-col ${
                  plan.highlighted
                    ? "border-violet-500 bg-violet-600/10 shadow-lg shadow-violet-500/10"
                    : "border-zinc-800 bg-zinc-900/50"
                }`}
              >
                {plan.highlighted && (
                  <div className="text-xs font-medium text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full w-fit mb-3">
                    Most popular
                  </div>
                )}
                <p className="text-lg font-semibold">{plan.name}</p>
                <p className="text-sm text-zinc-400 mt-1 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-zinc-400 text-sm">{plan.interval}</span>
                </div>
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-violet-400 flex-shrink-0" />
                      <span className="text-zinc-300">{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`mt-6 block text-center py-2.5 rounded-lg font-medium text-sm transition-all ${
                    plan.highlighted
                      ? "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20"
                      : "border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-white"
                  }`}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            SaaS Boilerplate
          </div>
          <p>Built with Next.js 16, Prisma & TypeScript</p>
        </div>
      </footer>
    </div>
  );
}
