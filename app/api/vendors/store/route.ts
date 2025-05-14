import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/prisma/prisma-client";
import { updateStoreSchema } from "@/lib/schemas/stores/update";
import { PrismaClientKnownRequestError } from "@/prisma/generated/prisma-client/runtime/library";
import { CreateStoreFormData } from "@/lib/schemas/stores/create";
import { generateUniqueSlug } from "@/lib/utils";

// Get vendor's own store
export async function GET() {
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

    if (session.user.role !== "VENDOR") {
      return NextResponse.json(
        {
          status: "error",
          error: "Only vendors can access this resource",
        },
        { status: 403 }
      );
    }

    const store = await prisma.store.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!store) {
      return NextResponse.json(
        {
          status: "error",
          error: "Store not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: "success", data: store });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", error: error.message },
      { status: 500 }
    );
  }
}
//create a store

export async function POST(request: Request) {
  try {
    // Get the authenticated session
    const session = await getSession();

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a vendor
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "VENDOR") {
      return NextResponse.json(
        { error: "Only vendors can create stores" },
        { status: 403 }
      );
    }

    // Parse request body
    const body: CreateStoreFormData = await request.json();

    // Generate unique slug
    const slug = await generateUniqueSlug(body.name, (slug) =>
      prisma.store.findUnique({ where: { slug } })
    );

    // Validate address data if creating new address
    if (
      !body.useExistingAddress &&
      (!body.address?.address_line1 ||
        !body.address?.city ||
        !body.address?.region)
    ) {
      return NextResponse.json(
        { error: "Missing required address fields" },
        { status: 400 }
      );
    }

    // Create store with address
    const store = await prisma.store.create({
      data: {
        name: body.name,
        slug,
        bio: body.bio,
        userId: session.user.id,
        address: body.useExistingAddress
          ? {
              connect: {
                id: body.selectedAddressId,
              },
            }
          : {
              create: {
                address_line1: body.address!.address_line1,
                address_line2: body.address?.address_line2,
                city: body.address!.city,
                region: body.address!.region,
                digital_address: body.address?.digital_address,
              },
            },
      },
      include: {
        address: true,
      },
    });

    return NextResponse.json(
      {
        message: "Store created successfully",
        store,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating store:", error);
    if (
      error instanceof Error &&
      error.message === "Could not generate unique slug"
    ) {
      return NextResponse.json(
        { error: "Could not generate unique store URL" },
        { status: 400 }
      );
    }
    if (error instanceof PrismaClientKnownRequestError) {
      const errorMessage = error.message.includes("Unique constraint failed")
        ? "Cannot create multiple stores"
        : "Failed to create store";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create store" },
      { status: 500 }
    );
  }
}

// Update vendor's own store
export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "VENDOR") {
      return NextResponse.json(
        {
          status: "error",
          error: "Only vendors can access this resource",
        },
        { status: 403 }
      );
    }

    const updateData = await request.json();

    // Validate the update data
    const validationResult = updateStoreSchema.safeParse(updateData);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          status: "error",
          error: "Invalid data",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    // Get the store first to verify ownership
    const store = await prisma.store.findUnique({
      where: { userId: session.user.id },
      select: { id: true, name: true },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Prepare the update data
    const {
      useExistingAddress,
      selectedAddressId,
      address,
      name,
      ...restData
    } = validationResult.data;

    // Generate new slug if name is being updated
    let slug;
    if (name && name !== store.name) {
      slug = await generateUniqueSlug(name, (slug) =>
        prisma.store.findUnique({ where: { slug } })
      );
    }

    // Update store with validated data
    const updatedStore = await prisma.store.update({
      where: { id: store.id },
      data: {
        ...restData,
        ...(name && { name }),
        ...(slug && { slug }),
        // Handle address based on whether using existing or new address
        ...(useExistingAddress
          ? { addressId: selectedAddressId }
          : address
            ? { address: { create: address } }
            : {}),
      },
      include: {
        address: true,
      },
    });

    return NextResponse.json({
      message: "Store updated successfully",
      store: updatedStore,
    });
  } catch (error) {
    console.error("Error updating store:", error);
    if (
      error instanceof Error &&
      error.message === "Could not generate unique slug"
    ) {
      return NextResponse.json(
        { error: "Could not generate unique store URL" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update store" },
      { status: 500 }
    );
  }
}
