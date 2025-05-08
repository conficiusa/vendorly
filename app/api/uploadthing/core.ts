import { getSession } from "@/lib/auth";
import { prisma } from "@/prisma/prisma-client";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const authmiddleware = async () => {
  const session = await getSession();
  if (!session) throw new UploadThingError("Unauthorized");
  const user = session.user;
  return { userId: user.id };
};

const f = createUploadthing();
export const uploadRouter = {
  profileImageUploader: f({
    image: {
      minFileCount: 1,
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(authmiddleware)
    .onUploadComplete(async ({ metadata, file }) => {
      await prisma.user.update({
        where: { id: metadata.userId },
        data: {
          image: file.ufsUrl,
        },
      });
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
