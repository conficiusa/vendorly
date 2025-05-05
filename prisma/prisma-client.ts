import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "@/prisma/generated/prisma-client";

export const prisma = new PrismaClient().$extends(withAccelerate());


