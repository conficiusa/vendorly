import { getSession } from "@/lib/auth";
import { NextRequest } from "next/server";
import Response from "@/app/api/utils/response";
import { AuthenticationError, BadRequestError } from "@/app/api/utils/errors";
import { chargeSchema } from "@/lib/schemas/transactions/charge";
import {
  createPendingOrderFromCart,
  createPendingOrderFromProduct,
} from "@/app/api/utils/Order";
import { initiateMobileMoneyCharge } from "@/app/api/utils/paystack";
import { createTransaction } from "../../utils/transaction";

export const POST = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session) {
      throw new AuthenticationError("Please login to complete your purchase");
    }

    const searchParams = req.nextUrl.searchParams;
    const from: "product" | "cart" = searchParams.get("from") as
      | "product"
      | "cart";

    if (!from || !(from === "product" || from === "cart")) {
      throw new BadRequestError(
        "Cannot determine the source of the request; please try again"
      );
    }

    // Getting and validating body
    const body = await req.json();
    const parsedBody = chargeSchema.safeParse(body);
    if (!parsedBody.success) {
      return Response.error(parsedBody.error);
    }

    const { addressId, address, phoneNumber, provider } = parsedBody.data;

    // Create order based on source
    let order;
    if (from === "cart") {
      order = await createPendingOrderFromCart({
        userId: session.user.id,
        addressId: addressId || undefined,
        address: addressId ? undefined : address,
      });
    } else {
      const { productId, variantId } = parsedBody.data;
      if (!productId) {
        throw new BadRequestError(
          "Product ID is required for direct product purchase"
        );
      }
      order = await createPendingOrderFromProduct({
        userId: session.user.id,
        productId,
        variantId: variantId || null,
        addressId: addressId || undefined,
        address: addressId ? undefined : address,
      });
    }

    // Initialize Paystack charge
    const chargeResponse = await initiateMobileMoneyCharge({
      amount: order.total,
      email: session.user.email,
      phoneNumber,
      provider,
      metadata: {
        orderId: order.id,
        userId: session.user.id,
        phoneNumber: session.user.phone,
        email: session.user.email,
      },
    });

    const transaction = await createTransaction({
      amount: order.total,
      mobileMoneyProvider: provider,
      orderId: order.id,
      reference: chargeResponse.data.reference,
      paymentMethod: "MOBILE_MONEY",
    });

    return Response.success({
      message: chargeResponse.message,
      data: chargeResponse.data,
      transactionId: transaction.id,
    });
  } catch (error) {
    console.error(error);
    return Response.error(error);
  }
};
