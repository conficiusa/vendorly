import { getSession } from "@/lib/auth";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { status: "error", error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        first_name: true,
        last_name: true,
        onboarded: true,
        phone: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          status: "error",
          error: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      user,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
