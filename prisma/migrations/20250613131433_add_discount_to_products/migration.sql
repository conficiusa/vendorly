-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED');

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "discount" DOUBLE PRECISION,
ADD COLUMN     "discountType" "DiscountType";
