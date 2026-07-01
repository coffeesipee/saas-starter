-- CreateEnum
CREATE TYPE "BillingInterval" AS ENUM ('MONTHLY', 'YEARLY', 'ONE_TIME');

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "billingInterval" "BillingInterval",
ADD COLUMN     "price" INTEGER;
