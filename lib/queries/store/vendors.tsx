"use server";

import { prisma } from "@/prisma/prisma-client";

export const getUserStore = async (userId: string | null) => {
  if (!userId) {
    throw new Error("You must be logged in to access this resource");
  }

  const store = await prisma.store.findUnique({
    where: {
      userId,
    },
  });

  if (!store) {
    throw new Error("Store not found");
  }

  return store;
};
