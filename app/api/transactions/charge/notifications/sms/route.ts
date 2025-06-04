import Response from "@/app/api/utils/response";
import { OrderConfirmation } from "@/lib/sms/messages";
import { sendSMS } from "@/lib/sms/send-sms";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextRequest } from "next/server";

export const POST = verifySignatureAppRouter(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { phoneNumber } = body;

    // Send SMS notification
    await sendSMS(phoneNumber, OrderConfirmation({ orderId: body.orderId }));

    return Response.success("SMS notification sent");
  } catch (error) {
    console.error("Error sending SMS notification:", error);
    return Response.error(error);
  }
});
