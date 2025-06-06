import { NextRequest, NextResponse } from "next/server";
import { getSessionId } from "@/lib/utils/session";
import { prisma } from "@/prisma/prisma-client";
import { getSession } from "@/lib/auth";
import { z } from "zod";
import { Prisma } from "@/prisma/generated/prisma-client";
import Response from "../utils/response";
import { BadRequestError, DatabaseError, NotFoundError } from "../utils/errors";
import { revalidateTag } from "next/cache";
import { addToCart } from "@/lib/utils/recombee";

// Schema for adding items to cart
const addToCartSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().min(1),
});

export async function GET() {
  try {
    const session = await getSession();
    const sessionId = await getSessionId();

    const where: Prisma.CartWhereInput = {
      OR: [{ userId: session?.user?.id }, { sessionId: sessionId }],
    };

    // Find cart based on user status
    const cart = await prisma.cart.findFirst({
      where,
      include: {
        cartItems: {
          include: {
            product: true,
            productVariantOption: true,
          },
        },
      },
    });

    if (!cart) throw new NotFoundError("Cart not found");

    const total = await prisma.cart.count({
      where,
    });

    return Response.success({
      items: cart.cartItems,
      total,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return Response.error(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const sessionId = await getSessionId();
    const body = await req.json();

    // Validate request body
    const validationResult = addToCartSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { productId, variantId, quantity } = validationResult.data;

    // Find or create cart
    let cart = await prisma.cart.findFirst({
      where: {
        OR: [{ userId: session?.user?.id }, { sessionId: sessionId }],
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session?.user?.id,
          sessionId: session?.user?.id ? null : sessionId,
        },
      });
    }

    // Check if product exists and has sufficient stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        Category: true,
        store: true,
        variantOptions: variantId
          ? {
              where: { id: variantId },
            }
          : undefined,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check stock
    if (variantId) {
      const variant = product.variantOptions[0];
      if (!variant || variant.stock < quantity) {
        return NextResponse.json(
          { error: "Insufficient stock" },
          { status: 400 }
        );
      }
    } else if (product.stock < quantity) {
      return NextResponse.json(
        { error: "Insufficient stock" },
        { status: 400 }
      );
    }

    // Add or update cart item
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        productVariantOptionId: variantId || null,
      },
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;

      // Check if new quantity exceeds stock
      if (variantId) {
        const variant = product.variantOptions[0];
        if (variant.stock < newQuantity) {
          return NextResponse.json(
            { error: "Insufficient stock" },
            { status: 400 }
          );
        }
      } else if (product.stock < newQuantity) {
        return NextResponse.json(
          { error: "Insufficient stock" },
          { status: 400 }
        );
      }

      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            include: {
              store: true,
            },
          },
          productVariantOption: true,
        },
      });

      await addToCart(
        session?.user.id || sessionId,
        productId,
        undefined,
        product
      );
      revalidateTag("cartCount");

      return NextResponse.json(updatedItem);
    } else {
      // Create new cart item
      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          productVariantOptionId: variantId || null,
          quantity,
        },
        include: {
          product: true,
          productVariantOption: true,
        },
      });
      await addToCart(
        session?.user.id || sessionId,
        productId,
        undefined,
        product
      );
      revalidateTag("cartCount");
      return NextResponse.json(newItem);
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    const sessionId = await getSessionId();
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) throw new BadRequestError("Item ID is required");
    // Find cart
    const cart = await prisma.cart.findFirst({
      where: {
        OR: [{ userId: session?.user?.id }, { sessionId: sessionId }],
      },
    });

    if (!cart) throw new NotFoundError("Cart not found");

    // Delete cart item
    await prisma.cartItem.delete({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    revalidateTag("cardCount");

    return Response.success({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return Response.error(error);
  }
}

const updateQuantitySchema = z.object({
  itemId: z.string(),
  quantity: z.number().min(1),
});

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    const sessionId = await getSessionId();
    const body = await req.json();

    // Validate request body
    const validationResult = updateQuantitySchema.safeParse(body);
    if (!validationResult.success) {
      return Response.error(validationResult.error);
    }

    const { itemId, quantity } = validationResult.data;

    // Find cart
    const cart = await prisma.cart.findFirst({
      where: {
        OR: [{ userId: session?.user?.id }, { sessionId: sessionId }],
      },
    });

    if (!cart) throw new NotFoundError("Cart not found");

    // Find cart item
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
      include: {
        product: {
          include: {
            variantOptions: true,
          },
        },
      },
    });

    if (!cartItem) throw new NotFoundError("Item not found");

    if (cartItem.product.stock < quantity)
      throw new DatabaseError("Insufficient stock");

    // Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: true,
        productVariantOption: true,
      },
    });

    return Response.success(updatedItem);
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    return Response.error(error);
  }
}
