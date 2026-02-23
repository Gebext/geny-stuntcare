-- AlterTable
ALTER TABLE "Anthropometry" ADD COLUMN     "armCircumferenceCm" DOUBLE PRECISION,
ADD COLUMN     "headCircumferenceCm" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ChildProfile" ADD COLUMN     "birthArmCircumference" DOUBLE PRECISION,
ADD COLUMN     "birthHeadCircumference" DOUBLE PRECISION;
