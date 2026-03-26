/*
  Warnings:

  - You are about to drop the column `aadhaar` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfDeath` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `isAlive` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `maritalStatus` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `nationality` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `pan` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `religion` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `successionClass` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `willBeneficiary` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the `FamilyRelation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FamilyRelation" DROP CONSTRAINT "FamilyRelation_fromPersonId_fkey";

-- DropForeignKey
ALTER TABLE "FamilyRelation" DROP CONSTRAINT "FamilyRelation_toPersonId_fkey";

-- DropIndex
DROP INDEX "Person_goldenRecordId_idx";

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "aadhaar",
DROP COLUMN "dateOfDeath",
DROP COLUMN "isAlive",
DROP COLUMN "maritalStatus",
DROP COLUMN "nationality",
DROP COLUMN "pan",
DROP COLUMN "religion",
DROP COLUMN "successionClass",
DROP COLUMN "willBeneficiary",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "headline" TEXT,
ADD COLUMN     "state" TEXT;

-- DropTable
DROP TABLE "FamilyRelation";

-- CreateTable
CREATE TABLE "Connection" (
    "id" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "labelHindi" TEXT,
    "degree" INTEGER NOT NULL DEFAULT 1,
    "side" TEXT,
    "since" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "verticals" TEXT[],
    "heirClass" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Connection_fromId_idx" ON "Connection"("fromId");

-- CreateIndex
CREATE INDEX "Connection_toId_idx" ON "Connection"("toId");

-- CreateIndex
CREATE INDEX "Connection_type_idx" ON "Connection"("type");

-- CreateIndex
CREATE INDEX "Connection_degree_idx" ON "Connection"("degree");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_fromId_toId_label_key" ON "Connection"("fromId", "toId", "label");

-- CreateIndex
CREATE INDEX "Person_state_city_idx" ON "Person"("state", "city");

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
