import { QUEUE_URLS } from "@/app/api/utils/constants";
import { BadRequestError, NotFoundError } from "@/app/api/utils/errors";
import { QueueJob } from "@/app/api/utils/job";
import { Prisma } from "@/prisma/generated/prisma-client";
import { prisma } from "@/prisma/prisma-client";

export const fetchProduct = async (
  slug: string | undefined,
  productId: string | undefined,
  userId?: string,
  sessionId?: string
) => {
  if (!slug && !productId)
    throw new BadRequestError("product slug or id not provided");

  const whereClause: Prisma.ProductWhereInput = {
    OR: [
      slug ? { slug } : undefined,
      productId ? { id: productId } : undefined,
    ].filter(Boolean) as Prisma.ProductWhereInput[],
  };

  const product = await prisma.product.findFirst({
    where: whereClause,
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
  if (userId || sessionId) {
    await QueueJob(QUEUE_URLS.RECOMBEE, {
      type: "detailView",
      userId: userId || sessionId,
      productId: product.id,
    });
  }

  return product;
};
