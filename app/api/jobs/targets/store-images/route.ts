import { prisma } from "@/prisma/prisma-client";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { UTApi } from "uploadthing/server";

// 👇 Verify that this messages comes from QStash
const utapi = new UTApi({});
export const POST = verifySignatureAppRouter(async (req: Request) => {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;
    const storeId = formData.get("storeId") as string;

    if (!image || !storeId) {
      return new Response("Missing image or storeId", { status: 400 });
    }

    // // Upload the image
    const { data, error } = await utapi.uploadFiles(image);
    if (error) {
      throw new Error("Failed to upload image");
    }

    // // Update store with the new image URL
    await prisma.store.update({
      where: {
        id: storeId,
      },
      data: {
        images: {
          push: data.ufsUrl,
        },
      },
    });

    return new Response("Image uploaded and store updated successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return new Response("Failed to process image", { status: 500 });
  }
});
