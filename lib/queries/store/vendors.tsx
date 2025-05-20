"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/prisma/prisma-client";

export const getUserStore = async () => {
  const session = await getSession();

  if (!session) {
    throw new Error("You must be logged in to access this resource");
  }

  const store = await prisma.store.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!store) {
    throw new Error("Store not found");
  }

  return store;
};
