import { PrismaClient } from "@/prisma/generated/prisma-client";

const prisma = new PrismaClient();

/**
 * Generates a unique order ID with format ORD + timestamp + random number
 * Ensures uniqueness by checking against existing orders in the database
 * @returns {Promise<string>} A unique order ID in the format ORD + timestamp + random number
 */
export async function generateOrderId(): Promise<string> {
  let isUnique = false;
  let orderId: string;
  let attempts = 0;
  const maxAttempts = 5;

  while (!isUnique && attempts < maxAttempts) {
    // Get current timestamp in milliseconds
    const timestamp = Date.now();

    // Generate a random 3-digit number between 100-999
    const randomNum = Math.floor(Math.random() * 900) + 100;

    // Combine timestamp and random number to ensure uniqueness
    const uniqueNum = `${timestamp}${randomNum}`;

    // Format as ORD + unique number
    orderId = `ORD${uniqueNum}`;

    // Check if this orderId already exists in the database
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      isUnique = true;
    } else {
      attempts++;
    }
  }

  if (!isUnique) {
    throw new Error(
      "Failed to generate unique order ID after multiple attempts"
    );
  }

  return orderId!;
}
