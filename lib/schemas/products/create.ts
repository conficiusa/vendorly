import { z } from "zod";

export const createProductSchema = z
  .object({
    name: z.string().min(1, "Product name is required"),
    category: z.string().min(1, "Category is required"),
    categoryRoot: z.string().optional(),
    categoryChild: z.string().optional(),
    categorySubChild: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    faults: z.string().optional(),
    price: z.number().gt(0, "Price must be greater than 0"),
    hasVariants: z.boolean().default(false),
    stock: z.number().gt(0, "Stock must be greater than 0").nullable(),

    images: z
      .array(z.instanceof(File))
      .min(1, "At least one image is required")
      .max(5, "Maximum 5 images allowed")
      .refine(
        (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
        "Each image must be less than 5MB"
      ),
    variants: z
      .object({
        selectedAttributes: z.array(z.string()).default([]),
        attributeValues: z.record(z.array(z.string())).default({}),
        variantStock: z.record(z.number()).default({}),
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.hasVariants) {
        return data.stock === null;
      }
      return data.stock !== null;
    },
    {
      message:
        "Stock must be null when product has variants, and required when it doesn't",
      path: ["stock"],
    }
  );

// find a more effecient way to omit the images
export const ServercreateProductSchema = z
  .object({
    name: z.string().min(1, "Product name is required"),
    category: z.string().min(1, "Category is required"),
    categoryRoot: z.string().optional(),
    categoryChild: z.string().optional(),
    categorySubChild: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    faults: z.string().optional(),
    price: z.number().gt(0, "Price must be greater than 0"),
    hasVariants: z.boolean().default(false),
    stock: z.number().gt(0, "Stock must be greater than 0").nullable(),
    variants: z
      .object({
        selectedAttributes: z.array(z.string()).default([]),
        attributeValues: z.record(z.array(z.string())).default({}),
        variantStock: z.record(z.number()).default({}),
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.hasVariants) {
        return data.stock === null;
      }
      return data.stock !== null;
    },
    {
      message:
        "Stock must be null when product has variants, and required when it doesn't",
      path: ["stock"],
    }
  );

export type CreateProductFormData = z.infer<typeof createProductSchema>;
