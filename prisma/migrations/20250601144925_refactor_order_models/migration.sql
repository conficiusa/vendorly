/*
  Warnings:

  - You are about to drop the column `pendingOrderId` on the `order_item` table. All the data in the column will be lost.
  - You are about to drop the `pending_order` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_pendingOrderId_fkey";

-- DropForeignKey
ALTER TABLE "pending_order" DROP CONSTRAINT "pending_order_orderId_fkey";

-- DropForeignKey
ALTER TABLE "pending_order" DROP CONSTRAINT "pending_order_userId_fkey";

-- AlterTable
ALTER TABLE "order_item" DROP COLUMN "pendingOrderId";

-- DropTable
DROP TABLE "pending_order";

-- DropEnum
DROP TYPE "PendingOrderStatus";
