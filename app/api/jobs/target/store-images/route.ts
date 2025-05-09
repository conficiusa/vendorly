import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";

export async function POST(req: Request) {
  try {
    const { storeId, images } = await req.json();

    if (!storeId || !images?.length) {
      return NextResponse.json(
        { error: "Store ID and images are required" },
        { status: 400 }
      );
    }

    // Update store with the new image URLs
    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: {
        images: {
          push: images, // Add new image URLs to the existing array
        },
      },
    });

    return NextResponse.json({
      message: "Store images updated successfully",
      store: updatedStore,
    });
  } catch (error) {
    console.error("Error updating store images:", error);
    return NextResponse.json(
      { error: "Failed to update store images" },
      { status: 500 }
    );
  }
}
