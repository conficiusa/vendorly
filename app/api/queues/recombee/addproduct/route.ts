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
    await addProductToRecombee(product);
    return Response.success("SMS notification sent");
  } catch (error) {
    console.error("Error sending SMS notification:", error);
    return Response.error(error);
  }
});
