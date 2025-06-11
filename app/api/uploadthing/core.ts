import { getSession } from "@/lib/auth";
import { prisma } from "@/prisma/prisma-client";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import { QueueJob } from "../utils/job";
import { QUEUE_URLS } from "../utils/constants";

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
  storeLogoUploader: f({
    image: {
      minFileCount: 1,
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(authmiddleware)
    .onUploadComplete(async ({ metadata, file }) => {
      // Update the store with the new logo
      const updatedStore = await prisma.store.update({
        where: { userId: metadata.userId },
        data: {
          logo: file.ufsUrl,
        },
      });

      if (!updatedStore) {
        throw new UploadThingError("Store not found");
      }

      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),
  StoreImages: f({
    image: {
      minFileCount: 1,
      maxFileCount: 5,
      maxFileSize: "4MB",
    },
  })
    .middleware(authmiddleware)
    .onUploadComplete(async ({ metadata, file }) => {
      // Get all the uploaded image URLs
      const imageUrls = [file.ufsUrl];

      // Update the store with the new images in a single operation
      const updatedStore = await prisma.store.update({
        where: { userId: metadata.userId },
        data: {
          images: {
            push: imageUrls,
          },
        },
      });

      if (!updatedStore) {
        throw new UploadThingError("Store not found");
      }

      return { uploadedBy: metadata.userId, urls: imageUrls };
    }),

  productImages: f({
    image: {
      minFileCount: 1,
      maxFileCount: 5,
      maxFileSize: "4MB",
    },
  })
    .input(z.object({ productId: z.string().min(1, "Required") }))
    .middleware(async ({ input }) => {
      const session = await getSession();
      if (!session) throw new UploadThingError("Unauthorized");
      const user = session.user;
      return { userId: user.id, productId: input.productId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const imageUrls = [file.ufsUrl];
      const updatedProduct = await prisma.product.update({
        where: { id: metadata.productId },
        data: { images: { push: imageUrls } },
      });
      await QueueJob(QUEUE_URLS.RECOMBEE, {
        type:"updateItem",
        productId: metadata.productId,
        update: { image: imageUrls[0] },
      });

      if (!updatedProduct) {
        throw new UploadThingError("Product not found");
      }

      return { uploadedBy: metadata.userId, urls: imageUrls };
    }),
  serviceImages: f({
    image: {
      minFileCount: 1,
      maxFileCount: 5,
      maxFileSize: "4MB",
    },
  })
    .input(z.object({ serviceId: z.string().min(1, "Required") }))
    .middleware(async ({ input }) => {
      const session = await getSession();
      if (!session) throw new UploadThingError("Unauthorized");
      const user = session.user;
      return { userId: user.id, serviceId: input.serviceId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const imageUrls = [file.ufsUrl];
      const updatedService = await prisma.service.update({
        where: { id: metadata.serviceId },
        data: { images: { push: imageUrls } },
      });

      if (!updatedService) {
        throw new UploadThingError("Service not found");
      }
      return { uploadedBy: metadata.userId, urls: imageUrls };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
