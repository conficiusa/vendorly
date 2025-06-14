/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumberVerified` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorEnabled` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `twoFactor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "twoFactor" DROP CONSTRAINT "twoFactor_userId_fkey";

-- DropIndex
DROP INDEX "user_phoneNumber_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "phoneNumber",
DROP COLUMN "phoneNumberVerified",
DROP COLUMN "twoFactorEnabled",
ADD COLUMN     "isAnonymous" BOOLEAN DEFAULT false;

-- DropTable
DROP TABLE "twoFactor";
