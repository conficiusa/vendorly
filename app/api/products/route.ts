import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/prisma/generated/prisma-client";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category") || "";
    const skip = (page - 1) * limit;

    // Sorting
    const allowedSortBy = ["name", "price", "createdAt"];
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
    const orderBy: any = {};
    orderBy[allowedSortBy.includes(sortBy) ? sortBy : "createdAt"] = sortOrder;

    // Base where clause
    const whereClause: Prisma.ProductWhereInput = {
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
      Category: category
        ? {
            slug: category,
          }
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
        store: {
          select: {
            name: true,
            slug: true,
            logo: true,
          },
        },
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
        hasMore: skip + products.length < total,
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
