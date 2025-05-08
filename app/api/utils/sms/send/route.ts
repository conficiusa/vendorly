import { NextResponse } from "next/server";
import { sendSMS } from "@/lib/sms/send-sms";

export async function POST(request: Request) {
  try {
    const { phoneNumber, content } = await request.json();

    if (!phoneNumber || !content) {
      return NextResponse.json(
        { error: "Phone number and content are required" },
        { status: 400 }
      );
    }

    const result = await sendSMS(phoneNumber, content);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in SMS API route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send SMS" },
      { status: 500 }
    );
  }
}
