import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    // Collect the category id and all its ancestors
    const categoryIds: string[] = [];
    let current = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true, parentId: true },
    });

    while (current) {
      categoryIds.push(current.id);
      if (!current.parentId) break;
      current = await prisma.category.findUnique({
        where: { id: current.parentId },
        select: { id: true, parentId: true },
      });
    }

    const variantAttributes = await prisma.variantAttribute.findMany({
      where: {
        categories: {
          some: {
            categoryId: { in: categoryIds },
          },
        },
      },
    });

    const formattedAttributes = variantAttributes.map((attribute) => ({
      id: attribute.id,
      name: attribute.name,
      values: attribute.values,
    }));

    return NextResponse.json(formattedAttributes);
  } catch (error) {
    console.error("Error fetching variant attributes:", error);
    return NextResponse.json(
      { error: "Failed to fetch variant attributes" },
      { status: 500 }
    );
  }
}
