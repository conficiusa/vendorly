import {
  MobileMoneyProvider,
  PaymentMethod,
} from "@/prisma/generated/prisma-client";
import { prisma } from "@/prisma/prisma-client";

export async function createTransaction({
  reference,
  amount,
  paymentMethod = "MOBILE_MONEY",
  mobileMoneyProvider,
  orderId,
}: {
  reference: string;
  amount: number;
  paymentMethod: PaymentMethod;
  mobileMoneyProvider: MobileMoneyProvider;
  orderId: string;
  channel?: string;
}) {
  return prisma.transaction.create({
    data: {
      reference,
      amount,
      paymentMethod,
      mobileMoneyProvider,
      orderId,
      status: "PENDING",
    },
  });
}
