import { NextRequest } from "next/server";
import Response from "@/app/api/utils/response";
import { BadRequestError } from "@/app/api/utils/errors";
import { prisma } from "@/prisma/prisma-client";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const reference = searchParams.get("reference");

    if (!reference) {
      throw new BadRequestError("Transaction reference is required");
    }

    const transaction = await prisma.transaction.findUnique({
      where: { reference },
      select: {
        id: true,
        reference: true,
        status: true,
        amount: true,
        paymentMethod: true,
        mobileMoneyProvider: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!transaction) {
      throw new BadRequestError("Transaction not found");
    }

    return Response.success({
      transaction,
    });
  } catch (error) {
    console.error("Error checking transaction status:", error);
    return Response.error(error);
  }
};
