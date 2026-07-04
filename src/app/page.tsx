"use client";

import Link from "next/link";
import { Check, Zap, Building2, Shield, CreditCard, Users, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Shield, title: "Enterprise Authentication", description: "Bulletproof email/password & OAuth flows with JWT sessions and role-based access control." },
  { icon: Building2, title: "Multi-Tenant Architecture", description: "Built for B2B. Users seamlessly collaborate within organizations with granular permissions." },
  { icon: CreditCard, title: "Flexible Billing", description: "Tiered plans, usage-based billing, and manual assignments all managed in one dashboard." },
  { icon: Zap, title: "Feature Flags", description: "Ship faster with boolean and numeric feature gates. Per-plan defaults and per-org overrides." },
  { icon: Users, title: "Powerful Admin Console", description: "Gain complete control with full CRUD for users, orgs, plans, features, and subscriptions." },
  { icon: Check, title: "Production Ready", description: "Built on Next.js 16, Prisma, TypeScript, and Tailwind CSS. Deploy anywhere in minutes." },
];

const plans = [
  { name: "Starter", price: "$0", interval: "/mo", description: "Perfect for testing the waters", features: ["1 organization", "3 feature flags", "Community support"], highlighted: false },
  { name: "Pro", price: "$49", interval: "/mo", description: "For growing businesses", features: ["Unlimited organizations", "Unlimited features", "Per-org overrides", "Priority support"], highlighted: true },
  { name: "Scale", price: "Custom", interval: "", description: "For large-scale operations", features: ["Everything in Pro", "Custom integrations", "99.9% uptime SLA", "Dedicated success manager"], highlighted: false },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Nav */}
        <nav className="border-b border-zinc-800/50 sticky top-0 z-50 bg-zinc-950/70 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold tracking-tight text-lg">SaaS Boilerplate</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                Sign in
              </Link>
              <Link href="/register" className="text-sm bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-lg transition-all font-medium shadow-md shadow-primary/20">
                Get started
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative pt-32 pb-24 px-6 flex flex-col items-center text-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto flex flex-col items-center"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8 shadow-sm shadow-primary/10">
              <Zap className="h-4 w-4" />
              The ultimate starting point for your next big idea
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
              Ship your SaaS in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-500">
                days, not months
              </span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed">
              Stop reinventing the wheel. Get a production-ready foundation with authentication, multi-tenancy, subscriptions, and RBAC out of the box.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                href="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
              >
                Start building for free <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all"
              >
                View demo
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Features */}
        <section className="py-24 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-transparent" />
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-7xl mx-auto relative z-10"
          >
            <div className="text-center mb-16">
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything you need to scale</motion.h2>
              <motion.p variants={fadeInUp} className="text-zinc-400 max-w-2xl mx-auto text-lg">
                We've built all the boring stuff so you can focus on your core product and features.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  variants={fadeInUp}
                  className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm hover:bg-zinc-800/60 hover:border-zinc-700 transition-all group"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{f.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Pricing */}
        <section className="py-24 px-6 border-t border-zinc-800/50">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Simple, transparent pricing</motion.h2>
              <motion.p variants={fadeInUp} className="text-zinc-400 max-w-2xl mx-auto text-lg">
                Choose the perfect plan for your business. No hidden fees or surprises.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  variants={fadeInUp}
                  className={`relative p-8 rounded-3xl flex flex-col ${
                    plan.highlighted
                      ? "bg-gradient-to-b from-primary/20 to-zinc-900/50 border border-primary/50 shadow-2xl shadow-primary/20"
                      : "bg-zinc-900/50 border border-zinc-800"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-zinc-400 h-12">{plan.description}</p>
                  
                  <div className="my-8">
                    <span className="text-5xl font-extrabold">{plan.price}</span>
                    <span className="text-zinc-400 text-lg ml-1">{plan.interval}</span>
                  </div>
                  
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-zinc-200">{feat}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    href="/register"
                    className={`w-full py-4 rounded-xl font-semibold text-center transition-all ${
                      plan.highlighted
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                        : "bg-zinc-800 hover:bg-zinc-700 text-white"
                    }`}
                  >
                    Get started
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-zinc-800/80 py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-md bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <span className="font-semibold text-zinc-200">SaaS Boilerplate</span>
            </div>
            <p className="text-zinc-500 text-sm">
              © {new Date().getFullYear()} SaaS Boilerplate. Built with Next.js & Prisma.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
