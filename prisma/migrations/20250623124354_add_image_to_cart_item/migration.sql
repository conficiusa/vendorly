/*
  Warnings:

  - You are about to drop the column `isAnonymous` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cart_item" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "isAnonymous";
