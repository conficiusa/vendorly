import { Prisma } from "@/prisma/generated/prisma-client";

export function handlePrismaError(error: unknown): {
  message: string;
  status: number;
} {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle unique constraint violations
    if (error.code === "P2002") {
      const field = (error.meta?.target as string[])?.[0] || "field";
      return {
        message: `A record with this ${field} already exists`,
        status: 400,
      };
    }

    // Handle foreign key constraint violations
    if (error.code === "P2003") {
      return {
        message:
          "The operation failed because it references a record that does not exist",
        status: 400,
      };
    }

    // Handle record not found
    if (error.code === "P2025") {
      return {
        message: "The requested record was not found",
        status: 404,
      };
    }
  }

  // Handle validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      message: "Invalid data provided",
      status: 400,
    };
  }

  // Default error message for unknown errors
  return {
    message: "An unexpected error occurred",
    status: 500,
  };
}
