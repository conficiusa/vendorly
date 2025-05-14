import { getSession } from "@/lib/auth";
import { createProductSchema } from "@/lib/schemas/products/create";
import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { transformProductFormData } from "@/lib/utils/product";
import { handlePrismaError } from "@/lib/utils/error";

export const POST = async (req: NextRequest) => {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "You need to be logged in to add a product" },
        { status: 401 }
      );
    }
    const body = await req.json();

    // Validate the request body using Zod schema
    const validationResult = createProductSchema
      .omit({ images: true })
      .safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid data",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    // Find the store associated with the user
    const userId = session.user?.id || session.session?.userId;
    const store = await prisma.store.findFirst({
      where: { userId },
    });
    if (!store) {
      return NextResponse.json(
        { error: "No store associated with this account" },
        { status: 400 }
      );
    }
    const storeId = store.id;

    // Transform the form data to Prisma format
    const productData = await transformProductFormData(
      validationResult.data,
      storeId
    );

    const product = await prisma.product.create({
      data: productData,
    });

    return NextResponse.json({ data: product, status: "success" });
  } catch (error: any) {
    console.error("Error creating product:", error);
    const { message, status } = handlePrismaError(error);
    return NextResponse.json({ error: message }, { status });
  }
};
