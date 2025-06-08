import { getSession } from "@/lib/auth";
import { AuthorizationError, DatabaseError } from "../../utils/errors";
import Response from "../../utils/response";
import { NextRequest } from "next/server";
import { addressSchema } from "@/lib/schemas/auth-schemas/address-schema";
import { prisma } from "@/prisma/prisma-client";


export async function GET() {
  try {
    const session = await getSession();

    if (!session) throw new AuthorizationError("You need to be logged");

    const addresses = await prisma.address.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return Response.success({
      status: "success",
      data: addresses,
    });
  } catch (error) {
    return Response.error(error);
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session) throw new AuthorizationError("You need to be logged");

    const data = await req.json();
    const parsedBody = addressSchema.safeParse(data);
    if (!parsedBody.success) return Response.error(parsedBody.error);

    const address = prisma.address.create({
      data: parsedBody.data,
    });

    if (!address) throw new DatabaseError("Failed to create address");
    return Response.success({ data: address });
  } catch (error) {
    return Response.error(error);
  }
};
