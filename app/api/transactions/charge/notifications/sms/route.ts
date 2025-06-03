import Response from "@/app/api/utils/response";
import { OrderConfirmation } from "@/lib/sms/messages";
import { sendSMS } from "@/lib/sms/send-sms";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextRequest } from "next/server";

export const POST = verifySignatureAppRouter(async (req: NextRequest) => {
  const body = await req.json();
  const { phoneNumber, orderId } = body;
  await sendSMS(phoneNumber, OrderConfirmation(orderId));
  return Response.success("smessage sent");
});
