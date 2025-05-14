import { z } from "zod";

export const updateStoreSchema = z
  .object({
    name: z
      .string()
      .min(2, "Store name must be at least 2 characters")
      .max(50, "Store name cannot exceed 50 characters")
      .optional(),
    bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
    logo: z.string().url("Logo must be a valid URL").optional(),
    images: z
      .array(z.string().url("Each image must be a valid URL"))
      .max(5, "Cannot have more than 5 images")
      .optional(),
    useExistingAddress: z.boolean().optional(),
    selectedAddressId: z.string().optional(),
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
  .refine(
    (data) => {
      if (data.useExistingAddress) {
        return !!data.selectedAddressId;
      }
      return true;
    },
    {
      message: "Please select an existing address",
      path: ["selectedAddressId"],
    }
  )
  .refine(
    (data) => {
      if (!data.useExistingAddress && data.address) {
        return true;
      }
      return true;
    },
    {
      message: "Address is required when not using an existing address",
      path: ["address"],
    }
  );

export type UpdateStoreFormData = z.infer<typeof updateStoreSchema>;
