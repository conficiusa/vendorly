"use server";

import { prisma } from "@/prisma/prisma-client";

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export const getUser = async (userId: string | null) => {
  if (!userId) {
    throw new AuthenticationError(
      "You must be logged in to access this resource"
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      store: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};
