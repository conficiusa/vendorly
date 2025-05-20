"use server";
import { CreateProductFormData } from "@/lib/schemas/products/create";
import { Prisma } from "@/prisma/generated/prisma-client";
import { generateUniqueSlug } from "@/lib/utils";
import { prisma } from "@/prisma/prisma-client";

type ProductFormDataWithoutImages = Omit<CreateProductFormData, "images">;

export async function transformProductFormData(
  formData: ProductFormDataWithoutImages,
  storeId: string
): Promise<Prisma.ProductCreateInput> {
  // Generate unique slug
  const slug = await generateUniqueSlug(formData.name, (slug) =>
    prisma.product.findUnique({ where: { slug } })
  );

  // Base product data
  const productData: Prisma.ProductCreateInput = {
    name: formData.name,
    slug,
    description: formData.description,
    price: parseFloat(formData.price),
    stock: formData.hasVariants ? 0 : parseInt(formData.stock || "0"),
    faults: formData.faults,
    images: [], // Initialize with empty array, will be updated after image upload
    store: {
      connect: {
        id: storeId,
      },
    },
    Category: formData.category
      ? {
          connect: {
            id: formData.category,
          },
        }
      : undefined,
  };

  // If product has variants, create variant options
  if (formData.hasVariants && formData.variants) {
    const { selectedAttributes, attributeValues, variantStock } =
      formData.variants;

    // Calculate total stock from variants
    const totalStock = Object.values(variantStock).reduce(
      (sum, stock) => sum + stock,
      0
    );
    productData.stock = totalStock;

    // Create variant options
    const variantOptions: Prisma.ProductVariantOptionCreateWithoutProductInput[] =
      [];

    // Generate all possible combinations of selected attributes
    const attr1 = selectedAttributes[0];
    const attr2 = selectedAttributes[1];
    const values1 = attributeValues[attr1] || [];
    const values2 = attributeValues[attr2] || [];

    for (const val1 of values1) {
      for (const val2 of values2) {
        const key = `${val1}-${val2}`;
        const stock = variantStock[key] || 0;

        variantOptions.push({
          attributes: {
            [attr1]: val1,
            [attr2]: val2,
          },
          stock,
        });
      }
    }

    productData.variantOptions = {
      create: variantOptions,
    };
  }

  return productData;
}
