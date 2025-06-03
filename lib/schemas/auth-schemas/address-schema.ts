import { z } from "zod";

export const addressSchema = z.object({
  region: z.string(),
  city: z.string(),
  address_line1: z.string(),
  address_line2: z.string().optional(),
  digital_address: z.string().optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
