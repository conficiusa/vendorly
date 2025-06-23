import { MobileMoneyProvider } from "@/prisma/generated/prisma-client";
import { z } from "zod";
import { validatePhoneNumber } from "@/lib/utils/carrierValidate";

export const chargeSchema = z
  .object({
    productId: z.string().optional(),
    variantId: z.string().optional(),
    phoneNumber: z
      .string()
      .min(10, "Invalid phone number")
      .max(15, "Invalid phone number")
      .regex(/^[0-9]+$/, "Phone number must contain only numbers"),
    provider: z.nativeEnum(MobileMoneyProvider),
    saveForFuture: z.boolean(),
    addressId: z.string().optional(),
    quantity: z.number().min(1, "Quantity must be at least 1").optional(),
    address: z
      .object({
        region: z.string().min(1, "Region is required"),
        city: z.string().min(1, "City is required"),
        digital_address: z.string().min(1, "digital address is required"),
        address_line1: z.string().min(1, "Address line 1 is required"),
        address_line2: z.string().optional(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!validatePhoneNumber(data.provider, data.phoneNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Enter a valid ${data.provider} number`,
        path: ["phoneNumber"],
      });
    }
  })
  .refine(
    (data) => {
      if (data.addressId) {
        return true;
      }
      return (
        data.address?.region &&
        data.address?.city &&
        data.address?.digital_address &&
        data.address?.address_line1
      );
    },
    { message: "Address is required", path: ["addressId"] }
  );

export type ChargeSchemaData = z.infer<typeof chargeSchema>;
