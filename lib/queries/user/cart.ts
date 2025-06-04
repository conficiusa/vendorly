import { Prisma } from "@/prisma/generated/prisma-client";
import { prisma } from "@/prisma/prisma-client";
import { unstable_cache as cache } from "next/cache";

export const fetchCartCount = cache(
  async (userId?: string, sessionId?: string) => {
    const where: Prisma.CartWhereInput = {
      OR: [{ userId }, { sessionId: sessionId }],
    };
    const cart = await prisma.cart.findFirst({
      where,
      select: {
        id: true,
      },
    });

    const cartCount = await prisma.cartItem.count({
      where: { cartId: cart?.id },
    });
    return cartCount;
  },
  ["cartCount"]
);
