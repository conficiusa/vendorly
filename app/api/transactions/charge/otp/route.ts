import { getSession } from "@/lib/auth";
import { NextRequest } from "next/server";
import Response from "@/app/api/utils/response";
import { AuthenticationError, BadRequestError } from "@/app/api/utils/errors";
import { z } from "zod";

const verifyOtpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
  reference: z.string().min(1, "Reference is required"),
});

export const POST = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session) {
      throw new AuthenticationError("Please login to complete your purchase");
    }

    const body = await req.json();
    const parsedBody = verifyOtpSchema.safeParse(body);
    if (!parsedBody.success) {
      return Response.error(parsedBody.error);
    }

    const { otp, reference } = parsedBody.data;

    const res = await fetch("https://api.paystack.co/charge/submit_otp", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp,
        reference,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new BadRequestError(data.message || "Failed to verify OTP");
    }

    return Response.success({
      message: data.message,
      data: data.data,
    });
  } catch (error) {
    console.error(error);
    return Response.error(error);
  }
};
