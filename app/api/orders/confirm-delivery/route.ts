import { getSession } from "@/lib/auth";
import { NextRequest } from "next/server";
import Response from "@/app/api/utils/response";
import { AuthenticationError, BadRequestError } from "@/app/api/utils/errors";
import { prisma } from "@/prisma/prisma-client";

export const POST = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session) {
      throw new AuthenticationError("Please login to confirm delivery");
    }

    const body = await req.json();
    const { itemId } = body;

    if (!itemId) {
      throw new BadRequestError("Order item ID is required");
    }

    // Find the order item and verify ownership
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        id: itemId,
        order: {
          userId: session.user.id,
        },
      },
      include: {
        order: true,
      },
    });

    if (!orderItem) {
      throw new BadRequestError(
        "Order item not found or you don't have permission to access it"
      );
    }

    // Check if the item is in a valid status for delivery confirmation
    if (orderItem.status !== "PROCESSING" && orderItem.status !== "SHIPPED") {
      throw new BadRequestError(
        `Cannot confirm delivery for items with status: ${orderItem.status}`
      );
    }

    // Update the order item status to DELIVERED
    const updatedOrderItem = await prisma.orderItem.update({
      where: {
        id: itemId,
      },
      data: {
        status: "DELIVERED",
      },
    });

    return Response.success({
      message: "Delivery confirmed successfully",
      orderItem: updatedOrderItem,
    });
  } catch (error) {
    console.error("Error confirming delivery:", error);
    return Response.error(error);
  }
};
