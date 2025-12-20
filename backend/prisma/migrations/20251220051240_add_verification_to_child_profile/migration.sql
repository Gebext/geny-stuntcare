/*
  Warnings:

  - A unique constraint covering the columns `[motherId,name]` on the table `ChildProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ChildProfile" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stuntingRisk" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "ChildProfile_motherId_name_key" ON "ChildProfile"("motherId", "name");
