import { getSession } from "@/lib/auth";
import { ServercreateProductSchema } from "@/lib/schemas/products/create";
import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { transformProductFormData } from "@/lib/utils/product";
import { handlePrismaError } from "@/lib/utils/error";
import { Prisma } from "@/prisma/generated/prisma-client";
import { QueueJob } from "../../utils/job";
import { QUEUE_URLS } from "../../utils/constants";

export const GET = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "You need to be logged in to view products" },
        { status: 401 }
      );
    }

    const userId = session.user?.id || session.session?.userId;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Sorting
    const allowedSortBy = ["name", "price", "stock", "createdAt"];
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
    const orderBy: any = {};
    orderBy[allowedSortBy.includes(sortBy) ? sortBy : "createdAt"] = sortOrder;

    // Base where clause
    const whereClause: Prisma.ProductWhereInput = {
      store: {
        userId: userId,
      },
      OR: search
        ? [
            { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
            {
              description: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ]
        : undefined,
    };

    // Get total count for pagination
    const total = await prisma.product.count({
      where: whereClause,
    });

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        Category: true,
      },
      orderBy,
      take: limit,
      skip: skip,
    });

    return NextResponse.json({
      status: "success",
      data: products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        status: "error",
        error: error.message || "Failed to fetch products",
      },
      { status: 500 }
    );
  }
};

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
    const validationResult = ServercreateProductSchema.safeParse(body);
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
      include: {
        Category: true,
        store: true,
      },
    });

    await QueueJob(QUEUE_URLS.RECOMBEE, { type: "addProduct", product });
    return NextResponse.json({ data: product, status: "success" });
  } catch (error: any) {
    console.error("Error creating product:", error);
    const { message, status } = handlePrismaError(error);
    return NextResponse.json({ error: message }, { status });
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "You need to be logged in to delete products" },
        { status: 401 }
      );
    }

    const userId = session.user?.id || session.session?.userId;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");
    const productIds = searchParams.get("ids");

    // Validate that either single id or multiple ids are provided
    if (!productId && !productIds) {
      return NextResponse.json(
        { error: "No product ID(s) provided" },
        { status: 400 }
      );
    }

    // Convert productIds string to array if it exists
    const idsToDelete = (
      productIds ? productIds.split(",") : [productId]
    ).filter((id): id is string => id !== null);

    // Verify all products belong to the user's store
    const store = await prisma.store.findFirst({
      where: { userId },
      select: { id: true },
    });

    if (!store) {
      return NextResponse.json(
        { error: "No store associated with this account" },
        { status: 400 }
      );
    }

    // Check if all products exist and belong to the user's store
    const existingProducts = await prisma.product.findMany({
      where: {
        id: { in: idsToDelete },
        storeId: store.id,
      },
      select: { id: true },
    });

    if (existingProducts.length !== idsToDelete.length) {
      return NextResponse.json(
        { error: "One or more products not found or not authorized" },
        { status: 404 }
      );
    }

    // Delete the products
    const deletedProducts = await prisma.product.deleteMany({
      where: {
        id: { in: idsToDelete },
        storeId: store.id,
      },
    });

    return NextResponse.json({
      status: "success",
      message: `Successfully deleted ${deletedProducts.count} product(s)`,
      data: {
        deletedCount: deletedProducts.count,
      },
    });
  } catch (error: any) {
    console.error("Error deleting products:", error);
    const { message, status } = handlePrismaError(error);
    return NextResponse.json({ error: message }, { status });
  }
};
