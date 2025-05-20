import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { transformServiceFormData } from "@/lib/utils/service";
import { getSession } from "@/lib/auth";
import { Prisma } from "@/prisma/generated/prisma-client";

export const GET = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "You need to be logged in to view services" },
        { status: 401 }
      );
    }

    const userId = session.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Sorting
    const allowedSortBy = ["name", "rate", "createdAt"];
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
    const orderBy: any = {};
    orderBy[allowedSortBy.includes(sortBy) ? sortBy : "createdAt"] = sortOrder;

    // Base where clause
    const whereClause: Prisma.ServiceWhereInput = {
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
    const total = await prisma.service.count({
      where: whereClause,
    });

    const products = await prisma.service.findMany({
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
    console.error("Error fetching services:", error);
    return NextResponse.json(
      {
        status: "error",
        error: error.message || "Failed to fetch services",
      },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get store for the current user
    const store = await prisma.store.findUnique({
      where: { userId: session.user.id },
    });

    if (!store) {
      return NextResponse.json(
        { status: "error", message: "Store not found" },
        { status: 404 }
      );
    }

    const formData = await req.json();
    const serviceData = await transformServiceFormData(formData, store.id);

    // Create the service
    const service = await prisma.service.create({
      data: serviceData,
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
    });

    return NextResponse.json({
      status: "success",
      data: service,
    });
  } catch (error: any) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      {
        status: "error",
        error: error.message || "Failed to create service",
      },
      { status: 500 }
    );
  }
};
