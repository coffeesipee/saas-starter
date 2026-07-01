import { PrismaClient } from "../src/generated/prisma/client.ts";
import bcrypt from "bcryptjs";

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });


async function main() {
  console.log("🌱 Seeding database...");

  // ─── Users ────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123!", 12);
  const userPassword = await bcrypt.hash("user123!", 12);

  const admin = await db.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN",
      isActive: true,
    },
  });

  const user = await db.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "Jane Doe",
      email: "user@example.com",
      password: userPassword,
      role: "USER",
      isActive: true,
    },
  });

  console.log(`✅ Users: admin@example.com / admin123! | user@example.com / user123!`);

  // ─── Features ─────────────────────────────────────────────────
  const apiAccess = await db.feature.upsert({
    where: { key: "api_access" },
    update: {},
    create: { key: "api_access", name: "API Access", description: "Access to the REST API", type: "BOOLEAN", defaultValue: "false" },
  });

  const maxProjects = await db.feature.upsert({
    where: { key: "max_projects" },
    update: {},
    create: { key: "max_projects", name: "Max Projects", description: "Maximum number of projects", type: "NUMBER", defaultValue: "3" },
  });

  const analytics = await db.feature.upsert({
    where: { key: "advanced_analytics" },
    update: {},
    create: { key: "advanced_analytics", name: "Advanced Analytics", description: "Detailed analytics and reporting", type: "BOOLEAN", defaultValue: "false" },
  });

  console.log("✅ Features: api_access, max_projects, advanced_analytics");

  // ─── Plans ────────────────────────────────────────────────────
  const freePlan = await db.plan.upsert({
    where: { slug: "free" },
    update: {},
    create: { name: "Free", slug: "free", description: "Perfect for individuals", price: 0, billingInterval: "MONTHLY", isActive: true },
  });

  const proPlan = await db.plan.upsert({
    where: { slug: "pro" },
    update: {},
    create: { name: "Pro", slug: "pro", description: "For growing teams", price: 2900, billingInterval: "MONTHLY", isActive: true },
  });

  console.log("✅ Plans: Free ($0/mo), Pro ($29/mo)");

  // ─── Plan Features ────────────────────────────────────────────
  // Free plan features
  await db.planFeature.upsert({
    where: { planId_featureId: { planId: freePlan.id, featureId: apiAccess.id } },
    update: {}, create: { planId: freePlan.id, featureId: apiAccess.id, value: "false" },
  });
  await db.planFeature.upsert({
    where: { planId_featureId: { planId: freePlan.id, featureId: maxProjects.id } },
    update: {}, create: { planId: freePlan.id, featureId: maxProjects.id, value: "3" },
  });
  await db.planFeature.upsert({
    where: { planId_featureId: { planId: freePlan.id, featureId: analytics.id } },
    update: {}, create: { planId: freePlan.id, featureId: analytics.id, value: "false" },
  });

  // Pro plan features
  await db.planFeature.upsert({
    where: { planId_featureId: { planId: proPlan.id, featureId: apiAccess.id } },
    update: {}, create: { planId: proPlan.id, featureId: apiAccess.id, value: "true" },
  });
  await db.planFeature.upsert({
    where: { planId_featureId: { planId: proPlan.id, featureId: maxProjects.id } },
    update: {}, create: { planId: proPlan.id, featureId: maxProjects.id, value: "100" },
  });
  await db.planFeature.upsert({
    where: { planId_featureId: { planId: proPlan.id, featureId: analytics.id } },
    update: {}, create: { planId: proPlan.id, featureId: analytics.id, value: "true" },
  });

  console.log("✅ Plan features assigned");

  // ─── Organization + Membership ────────────────────────────────
  const org = await db.organization.upsert({
    where: { slug: "acme-corp" },
    update: {},
    create: { name: "Acme Corp", slug: "acme-corp", description: "Demo organization" },
  });

  await db.membership.upsert({
    where: { userId_organizationId: { userId: user.id, organizationId: org.id } },
    update: {},
    create: { userId: user.id, organizationId: org.id, role: "OWNER" },
  });

  console.log("✅ Organization: Acme Corp (user@example.com is OWNER)");

  // ─── Subscription ─────────────────────────────────────────────
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

  await db.subscription.upsert({
    where: { organizationId: org.id },
    update: {},
    create: {
      organizationId: org.id,
      planId: proPlan.id,
      status: "ACTIVE",
      billingCycleStart: now,
      billingCycleEnd: nextMonth,
    },
  });

  console.log("✅ Subscription: Acme Corp → Pro plan (ACTIVE)");
  console.log("\n🎉 Seed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
