import { z } from "zod";
import { addressSchema } from "./address-schema";

export const completeProfileSchema = z.object({
  gender: z.enum(["MALE", "FEMALE"], {
    required_error: "Gender is required",
  }),
  phone: z.string().min(5, { message: "Phone is required" }),
  address: addressSchema.partial().optional(),
});

export type CompleteProfileData = z.infer<typeof completeProfileSchema>; 