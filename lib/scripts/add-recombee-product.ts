import "dotenv/config";
import { addProductToRecombee } from "../utils/recombee";
import { prisma } from "@/prisma/prisma-client";

async function main() {
  console.log(`Adding products to recombee`);
  await prisma.product
    .findMany({
      include: {
        Category: true,
        store: true,
      },
    })
    .then(async (products) => {
      if (products.length > 0) {
        await addProductToRecombee(products[0]);
        console.log("Added first product to recombee");
      } else {
        console.log("No products found to add");
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error adding products to recombee:", error);
      process.exit(1);
    });
}

main();
