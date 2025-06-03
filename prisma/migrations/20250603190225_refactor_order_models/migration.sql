/*
  Warnings:

  - You are about to drop the column `channel` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "channel",
ADD COLUMN     "receiptId" TEXT;
