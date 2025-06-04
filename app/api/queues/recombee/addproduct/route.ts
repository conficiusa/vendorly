import Response from "@/app/api/utils/response";
import { addProductToRecombee } from "@/lib/utils/recombee";
import { Category, Product, Store } from "@/prisma/generated/prisma-client";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextRequest } from "next/server";

export const POST = verifySignatureAppRouter(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { product } = body as {
      product: Product & {
        category: Category | null;
        store: Store;
      };
    };
    console.log("Adding product to recombee", product);
    await addProductToRecombee(product);
    return Response.success("Product added to recombee");
  } catch (error) {
    console.error("Error adding product to recombee:", error);
    return Response.error(error);
  }
});
