import Response from "@/app/api/utils/response";
import { addPurchaseToRecombee } from "@/lib/utils/recombee";
import { prisma } from "@/prisma/prisma-client";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextRequest } from "next/server";

export const POST = verifySignatureAppRouter(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { orderId, userId } = body as {
      orderId: string;
      userId: string;
      recommId: string;
    };
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!order) {
      return Response.error("Order not found");
    }

    // Loop through each order item and add purchase to Recombee
    for (const item of order.orderItems) {
      await addPurchaseToRecombee(
        userId,
        item.product.id,
        undefined, // recommId is optional
        item.quantity,
        item.price
      );
    }

    return Response.success("Products added to recombee");
  } catch (error) {
    console.error("Error adding products to recombee:", error);
    return Response.error(error);
  }
});
