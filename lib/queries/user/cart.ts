import { getSessionId } from "@/lib/utils/session";
import { Prisma } from "@/prisma/generated/prisma-client";
import { prisma } from "@/prisma/prisma-client";
import { unstable_cache as cache } from "next/cache";

export const fetchCartCount = cache(
  async (userId: string) => {
    const sessionId = await getSessionId();

    const where: Prisma.CartWhereInput = {
      OR: [{ userId }, { sessionId: sessionId }],
    };
    const cartCount = await prisma.cart.count({
      where,
    });
    return cartCount;
  },
  ["cartCount"]
);
