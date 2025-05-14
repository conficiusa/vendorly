import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  faults: z.string().optional(),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(/^\d*\.?\d*$/, "Invalid price format"),
  images: z
    .array(z.instanceof(File))
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images allowed")
    .refine(
      (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
      "Each image must be less than 5MB"
    ),
  hasVariants: z.boolean().default(false),
  variants: z
    .object({
      selectedAttributes: z.array(z.string()).default([]),
      attributeValues: z.record(z.array(z.string())).default({}),
      variantStock: z.record(z.number()).default({}),
    })
    .optional(),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
