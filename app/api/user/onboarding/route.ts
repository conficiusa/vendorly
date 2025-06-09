import { auth } from "@/lib/auth";
import { prisma } from "@/prisma/prisma-client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized", message: "You must login in to onboard" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        role: body.role.toUpperCase(),
        addresses: body.address
          ? {
              create: {
                region: body.address.region,
                city: body.address.city,
                address_line1: body.address.address_line1,
                address_line2: body.address.address_line2,
                digital_address: body.address.digital_address,
              },
            }
          : undefined,
      },
      include: {
        addresses: true,
      },
    });

    return NextResponse.json({
      message: "Onboarding successful",
      user: updatedUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
};
