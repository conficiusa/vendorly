import { QUEUE_URLS } from "@/app/api/utils/constants";
import { BadRequestError, NotFoundError } from "@/app/api/utils/errors";
import { QueueJob } from "@/app/api/utils/job";
import { prisma } from "@/prisma/prisma-client";

export const fetchProduct = async (
  slug: string | undefined,
  userId?: string,
  sessionId?: string
) => {
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
  if (userId || sessionId) {
    await QueueJob(QUEUE_URLS.RECOMBEE, {
      type: "detailView",
      userId: userId || sessionId,
      productId: product.id,
    });
  }

  return product;
};
