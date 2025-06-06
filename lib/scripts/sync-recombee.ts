import { prisma } from "@/prisma/prisma-client";
import { syncProductsWithRecombee } from "../utils/recombee";

async function main() {
  try {
    console.log("Starting Recombee catalog sync...");

    // Fetch all products with their categories
    const products = await prisma.product.findMany({
      include: {
        Category: true,
      },
    });

    console.log(`Found ${products.length} products to sync`);

    // Sync products with Recombee
    await syncProductsWithRecombee(products.map((product) => ({
      ...product,
      category: product.Category
    })));

    console.log("Recombee catalog sync completed successfully");
  } catch (error) {
    console.error("Error during Recombee catalog sync:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
