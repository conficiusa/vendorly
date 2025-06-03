import { z } from "zod";

export const addressSchema = z.object({
  region: z.string().optional(),
  city: z.string().optional(),
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  digital_address: z.string().optional(),
});

export const onboardingSchema = z.object({
  role: z.enum(["customer", "vendor", "other"]),
  address: addressSchema.optional(),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
