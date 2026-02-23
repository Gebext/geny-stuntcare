/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "AiAnalysis" ADD COLUMN     "zScore" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "MotherAiAnalysis" (
    "id" TEXT NOT NULL,
    "motherId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "bmiScore" INTEGER NOT NULL,
    "lilaScore" INTEGER NOT NULL,
    "nutritionScore" INTEGER NOT NULL,
    "ttdScore" INTEGER NOT NULL,
    "pregnancyScore" INTEGER NOT NULL,
    "recommendations" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MotherAiAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MotherAiAnalysis_motherId_key" ON "MotherAiAnalysis"("motherId");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "MotherAiAnalysis" ADD CONSTRAINT "MotherAiAnalysis_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "MotherProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
