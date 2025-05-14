import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";

//get all stores
export async function GET() {
  const stores = await prisma.store.findMany();
  return NextResponse.json({
    status: "success",
    message: "Stores fetched successfully",
    data: stores,
  });
}
