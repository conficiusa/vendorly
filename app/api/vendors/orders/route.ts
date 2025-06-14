import { NextRequest } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { getSession } from "@/lib/auth";
import Response from "../../utils/response";
import { AuthenticationError } from "../../utils/errors";
import { Prisma, OrderStatus } from "@/prisma/generated/prisma-client";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

export async function GET(req: NextRequest) {
  try {
    // Ensure the user is authenticated and has a store
    const session = await getSession();
    if (!session?.user || !session.store) {
      throw new AuthenticationError();
    }

    const storeId = session.store.id as string;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || String(DEFAULT_PAGE), 10);
    const limit = parseInt(
      searchParams.get("limit") || String(DEFAULT_LIMIT),
      10
    );
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || ""; // e.g. processing, shipped, delivered, etc.

    const where: Prisma.OrderWhereInput = {
      orderItems: {
        some: {
          storeId,
          ...(status && status !== "all"
            ? { status: status as OrderStatus }
            : {}),
        },
      },
      ...(search
        ? {
            OR: [
              { id: { contains: search, mode: "insensitive" as const } },
              {
                user: {
                  first_name: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
              },
              {
                user: {
                  last_name: { contains: search, mode: "insensitive" as const },
                },
              },
              {
                user: {
                  email: { contains: search, mode: "insensitive" as const },
                },
              },
            ],
          }
        : {}),
    } as const;

    const skip = (page - 1) * limit;

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
            },
          },
          _count: {
            select: { orderItems: true },
          },
          orderItems: {
            select: {
              status: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
    ]);

    const pages = Math.ceil(total / limit);

    return Response.success({
      orders,
      pagination: {
        total,
        pages,
        currentPage: page,
        limit,
        hasMore: page < pages,
      },
    });
  } catch (err: any) {
    console.error("[GET /api/vendors/orders]", err);
    return Response.error(err);
  }
}
