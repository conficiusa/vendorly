import { BadRequestError, NotFoundError } from "@/app/api/utils/errors";
import { prisma } from "@/prisma/prisma-client";

export const fetchProduct = async (slug: string | undefined) => {
  if (!slug) throw new BadRequestError("product slug not provided");
  const product = await prisma.product.findUnique({
    where: {
      slug,
    },
    include: {
      Category: true,
      store: true,
      Review: {
        include: {
          user: true,
        },
      },
      variantOptions: true,
    },
  });
  if (!product) throw new NotFoundError("product not found");
  return product;
};
