/*
  Warnings:

  - You are about to drop the column `cartData` on the `pending_order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order_item" ADD COLUMN     "pendingOrderId" TEXT,
ADD COLUMN     "productVariantOptionId" TEXT;

-- AlterTable
ALTER TABLE "pending_order" DROP COLUMN "cartData";

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_productVariantOptionId_fkey" FOREIGN KEY ("productVariantOptionId") REFERENCES "product_variant_option"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_pendingOrderId_fkey" FOREIGN KEY ("pendingOrderId") REFERENCES "pending_order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
