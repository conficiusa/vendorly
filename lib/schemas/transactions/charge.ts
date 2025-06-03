import { MobileMoneyProvider } from "@/prisma/generated/prisma-client";
import { z } from "zod";

export const chargeSchema = z.object({
  productId: z.string().optional(),
  variantId: z.string().optional(),
  phoneNumber: z
    .string()
    .min(10)
    .max(15)
    .regex(/^[0-9]+$/, "Phone number must contain only numbers"),
  provider: z.nativeEnum(MobileMoneyProvider),
  saveForFuture: z.boolean(),
  addressId: z.string(),
  address: z
    .object({
      region: z.string().min(1, "Region is required"),
      city: z.string().min(1, "City is required"),
      digital_address: z.string().min(1, "digital address is required"),
      address_line1: z.string().min(1, "Address line 1 is required"),
      address_line2: z.string().optional(),
    })
    .optional(),
});

export type ChargeSchemaData = z.infer<typeof chargeSchema>;
