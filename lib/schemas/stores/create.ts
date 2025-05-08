import { z } from "zod";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const createStoreSchema = z
  .object({
    name: z
      .string()
      .min(2, "Store name must be at least 2 characters")
      .max(50, "Store name cannot exceed 30 characters"),
    bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
    images: z
      .array(z.instanceof(File))
      .min(1, "At least one store image is required")
      .max(MAX_IMAGES, `Cannot upload more than ${MAX_IMAGES} images`)
      .refine(
        (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
        "Each file size should be less than 5MB"
      )
      .refine(
        (files) =>
          files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
        "Only .jpg, .jpeg, .png and .webp formats are supported"
      ),
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
      if (data.useExistingAddress === false) {
        return data.address !== undefined;
      }
      return true;
    },
    {
      message: "Address is required when not using an existing address",
      path: ["address"],
    }
  );

export type CreateStoreFormData = z.infer<typeof createStoreSchema>;
export { createStoreSchema };
