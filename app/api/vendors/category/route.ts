import { CategoryType } from "@/prisma/generated/prisma-client";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

// Helper to build nested category tree
function buildCategoryTree(categories: any[]) {
  const map: Record<string, any> = {};
  const roots: any[] = [];

  categories.forEach((cat) => {
    map[cat.id] = { ...cat, children: [] };
  });

  categories.forEach((cat) => {
    if (cat.parentId) {
      const parent = map[cat.parentId];
      if (parent) parent.children.push(map[cat.id]);
      else roots.push(map[cat.id]);
    } else {
      roots.push(map[cat.id]);
    }
  });

  return roots;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const nested = searchParams.get("nested") === "true";

  // fetch all if no type
  if (!type) {
    try {
      const categories = await prisma.category.findMany({
        orderBy: {
          name: "asc",
        },
      });

      if (nested) {
        return NextResponse.json(buildCategoryTree(categories));
      }

      return NextResponse.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return NextResponse.json(
        { error: "Failed to fetch categories" },
        { status: 500 }
      );
    }
  }

  // fetch by type
  try {
    const categories = await prisma.category.findMany({
      where: { type: type as CategoryType },
      orderBy: {
        name: "asc",
      },
    });

    if (nested) {
      return NextResponse.json(buildCategoryTree(categories));
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
