import { PrismaClient } from "@/generated/prisma/client";

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prismaPg: PrismaClient | undefined;
};

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

export const db = globalForPrisma.prismaPg ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaPg = db;
}