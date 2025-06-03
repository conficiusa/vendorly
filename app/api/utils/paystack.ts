import { MobileMoneyProvider } from "@/prisma/generated/prisma-client";
import { PaymentError } from "./errors";
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function initiateMobileMoneyCharge({
  amount,
  email,
  phoneNumber,
  provider,
  metadata = {},
}: {
  amount: number;
  email: string;
  phoneNumber: string;
  provider: MobileMoneyProvider;
  metadata?: Record<string, any>;
}) {
  // Map provider to Paystack code
  const providerMap: Record<MobileMoneyProvider, string> = {
    MTN: "mtn",
    AIRTELTIGO: "atl",
    TELECEL: "vod", // Telecel is Vodafone in Paystack
  };
  const providerCode = providerMap[provider];

  console.log(providerCode);

  const res = await fetch("https://api.paystack.co/charge", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100),
      email,
      currency: "GHS",
      mobile_money: {
        phone: phoneNumber,
        provider: providerCode,
      },
      metadata,
    }),
  });
  const data = await res.json();
  console.log(data);
  if (!res.ok) throw new PaymentError(data.message || "Failed to initialize payment");
  return data;
}
