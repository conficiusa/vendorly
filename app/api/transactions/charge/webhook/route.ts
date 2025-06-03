import { AuthorizationError } from "@/app/api/utils/errors";
import { QueueJob } from "@/app/api/utils/job";
import Response from "@/app/api/utils/response";
import { prisma } from "@/prisma/prisma-client";
import { createHmac } from "crypto";
import { NextRequest } from "next/server";
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
function verifySignature(body: string, signature: string): boolean {
  const hash = createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(body)
    .digest("hex");
  return hash === signature;
}
export const POST = async (req: NextRequest) => {
  try {
    const signature = req.headers.get("x-paystack-signature");
    const body = await req.text();

    if (!signature || !verifySignature(body, signature))
      throw new AuthorizationError();

    // early response
    Response.success("webhook received");
    const event = JSON.parse(body);
    const {
      data: {
        reference,
        receiptId,
        metadata: { phoneNumber, email },
      },
    } = event;
    await prisma.transaction.update({
      where: {
        reference,
      },
      data: {
        status: "SUCCESS",
        receiptId: receiptId,
      },
    });

    const jobUrl =
      process.env.NEXT_PUBLIC_APP_URL +
      "/api/transactions/charge/notifications/sms";
    const data = { phoneNumber, email };
    await QueueJob(jobUrl, data);
  } catch (error) {
    console.log(error);
    return Response.error(error);
  }
};
