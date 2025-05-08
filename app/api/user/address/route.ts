import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { PrismaClient } from "@/prisma/generated/prisma-client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const addresses = await prisma.address.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      status: "success",
      data: addresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
