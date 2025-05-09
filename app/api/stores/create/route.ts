import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { CreateStoreFormData } from "@/lib/schemas/stores/create";
import { prisma } from "@/prisma/prisma-client";
import { generateUniqueSlug } from "@/lib/utils";
import { PrismaClientKnownRequestError } from "@/prisma/generated/prisma-client/runtime/library";

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
