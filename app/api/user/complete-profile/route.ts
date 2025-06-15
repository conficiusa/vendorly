import { getSession } from "@/lib/auth";
import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { completeProfileSchema } from "@/lib/schemas/auth-schemas/complete-profile-schema";

export const POST = async (req: NextRequest) => {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized", message: "You must be logged in" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const parsed = completeProfileSchema.parse(body);

    const { address, ...userFields } = parsed;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        gender: userFields.gender,
        phone: userFields.phone,
        ...(address
          ? {
              addresses: {
                create: {
                  region: address.region ?? "",
                  city: address.city ?? "",
                  address_line1: address.address_line1 ?? "",
                  address_line2: address.address_line2,
                  digital_address: address.digital_address,
                },
              },
            }
          : {}),
      },
      include: {
        addresses: true,
      },
    });

    return NextResponse.json({ message: "Profile completed", user: updatedUser });
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