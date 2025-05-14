import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/prisma/prisma-client";

//get store by id
export const GET = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          status: "error",
          error: "You need to be logged in to access this resource",
        },
        { status: 401 }
      );
    }
    if (session.user.role !== "VENDOR" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          status: "error",
          error: "You are not authorized to access this resource",
        },
        { status: 403 }
      );
    }
    const { id } = await params;
    const store = await prisma.store.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!store) {
      return new Response("Store not found", { status: 404 });
    }

    return NextResponse.json({ status: "success", store });
  } catch (error: any) {
    return NextResponse.json({ status: "error", error: error.message });
  }
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updateData = await request.json();

    const { id } = await params;
    // Verify store ownership
    const store = await prisma.store.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    if (store.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update store with provided data
    const updatedStore = await prisma.store.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Store updated successfully",
      store: updatedStore,
    });
  } catch (error) {
    console.error("Error updating store:", error);
    return NextResponse.json(
      { error: "Failed to update store" },
      { status: 500 }
    );
  }
}
