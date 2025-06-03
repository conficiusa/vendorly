import { prisma } from "@/prisma/prisma-client";
import { BadRequestError, DatabaseError } from "./errors";
import { generateOrderId } from "@/lib/utils/order";

export async function createPendingOrderFromCart({
  userId,
  addressId,
  address,
}: {
  userId: string;
  addressId?: string;
  address?: {
    region: string;
    city: string;
    digital_address: string;
    address_line1: string;
    address_line2?: string;
  };
}) {
  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: {
      cartItems: {
        include: {
          product: true,
          productVariantOption: true,
        },
      },
    },
  });

  if (!cart || cart.cartItems.length === 0) {
    throw new BadRequestError("Cart is empty");
  }

  // Calculate totals
  let subtotal = 0;
  const orderItems = [];

  for (const item of cart.cartItems) {
    const price = item.product.price;
    const total = price * item.quantity;
    subtotal += total;

    orderItems.push({
      productId: item.productId,
      productVariantOptionId: item.productVariantOptionId,
      quantity: item.quantity,
      price,
      total,
      storeId: item.product.storeId,
    });
  }

  // Create address if needed
  let finalAddressId = addressId;
  if (!addressId && address) {
    const newAddress = await prisma.address.create({
      data: {
        ...address,
        userId,
      },
    });
    finalAddressId = newAddress.id;
  }

  if (!finalAddressId) {
    throw new BadRequestError("Address is required");
  }

  // Create order
  const order = await prisma.order.create({
    data: {
      userId,
      addressId: finalAddressId,
      subtotal,
      total: subtotal, // Add delivery fee if needed
      orderItems: {
        create: orderItems,
      },
    },
    include: {
      orderItems: true,
    },
  });

  // // Clear cart after order creation
  // await prisma.cartItem.deleteMany({
  //   where: { cartId: cart.id },
  // });

  if (!order) {
    throw new DatabaseError("Failed to create order");
  }
  return order;
}

export async function createPendingOrderFromProduct({
  userId,
  productId,
  variantId,
  addressId,
  address,
}: {
  userId: string;
  productId: string;
  variantId?: string | null;
  addressId?: string;
  address?: {
    region: string;
    city: string;
    digital_address: string;
    address_line1: string;
    address_line2?: string;
  };
}) {
  // Get product with variant
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      variantOptions: variantId
        ? {
            where: { id: variantId },
          }
        : undefined,
    },
  });

  if (!product) {
    throw new BadRequestError("Product not found");
  }

  // Check stock
  if (variantId) {
    const variant = product.variantOptions[0];
    if (!variant || variant.stock < 1) {
      throw new BadRequestError("Insufficient stock");
    }
  } else if (product.stock < 1) {
    throw new BadRequestError("Insufficient stock");
  }

  // Create address if needed
  let finalAddressId = addressId;
  if (!addressId && address) {
    const newAddress = await prisma.address.create({
      data: {
        ...address,
        userId,
      },
    });
    finalAddressId = newAddress.id;
  }

  if (!finalAddressId) {
    throw new BadRequestError("Address is required");
  }

  // Create order with single item
  const order = await prisma.order.create({
    data: {
      id: await generateOrderId(),
      userId,
      addressId: finalAddressId,
      subtotal: product.price,
      total: product.price, // Add delivery fee if needed
      orderItems: {
        create: [
          {
            productId: product.id,
            productVariantOptionId: variantId || null,
            quantity: 1,
            price: product.price,
            total: product.price,
            storeId: product.storeId,
          },
        ],
      },
    },
    include: {
      orderItems: true,
    },
  });

  return order;
}
