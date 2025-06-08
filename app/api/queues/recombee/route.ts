import Response from "@/app/api/utils/response";
import {
  addToCart,
  addPurchaseToRecombee,
  addDetailViewToRecombee,
  addProductToRecombee,
  addUserToRecombee,
  addRatingToRecombee,
  modifyRecombeeUser,
  mergeRecombeeUsers,
} from "@/lib/utils/recombee";
import {
  Category,
  GENDERTYPE,
  Product,
  Store,
} from "@/prisma/generated/prisma-client";
import { prisma } from "@/prisma/prisma-client";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextRequest } from "next/server";
import { BadRequestError, NotFoundError } from "@/app/api/utils/errors";

type InteractionType =
  | "addToCart"
  | "purchase"
  | "detailView"
  | "addProduct"
  | "addUser"
  | "addRating"
  | "modifyUser"
  | "mergeUsers";

interface RecombeePayload {
  type: InteractionType;
  userId?: string;
  sessionId?: string;
  productId?: string;
  rating?: number;
  gender?: GENDERTYPE;
  recommId?: string;
  quantity?: number;
  price?: number;
  name?: string;
  email?: string;
  role?: string;
  product?: Product & {
    category: Category | null;
    store: Store;
  };
  orderId?: string;
}

export const POST = verifySignatureAppRouter(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const payload = body as RecombeePayload;
    const { type, ...params } = payload;

    switch (type) {
      case "addToCart":
        await handleAddToCart(params);
        break;

      case "purchase":
        await handlePurchase(params);
        break;

      case "detailView":
        await handleDetailView(params);
        break;

      case "addProduct":
        await handleAddProduct(params);
        break;

      case "addUser":
        await handleAddUser(params);
        break;

      case "addRating":
        await handleAddRating(params);
        break;

      case "modifyUser":
        await handleModifyUser(params);
        break;

      case "mergeUsers":
        await handleMergeUsers(params);
        break;

      default:
        throw new BadRequestError(`Unknown interaction type: ${type}`);
    }

    return Response.success(`Successfully processed ${type} interaction`);
  } catch (error) {
    console.error("Recombee interaction error:", error);
    return Response.error(error);
  }
});

async function handleAddToCart(params: Omit<RecombeePayload, "type">) {
  if (!params.userId || !params.productId) {
    throw new BadRequestError(
      "userId and productId are required for addToCart"
    );
  }
  await addToCart(params.userId, params.productId, params.recommId);
}

async function handlePurchase(params: Omit<RecombeePayload, "type">) {
  if (!params.orderId) {
    throw new BadRequestError("orderId is required for purchase");
  }

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  for (const item of order.orderItems) {
    await addPurchaseToRecombee(
      order.userId,
      item.product.id,
      undefined,
      item.quantity,
      item.price
    );
  }
}

async function handleDetailView(params: Omit<RecombeePayload, "type">) {
  if (!params.userId || !params.productId) {
    throw new BadRequestError(
      "userId and productId are required for detailView"
    );
  }
  await addDetailViewToRecombee(params.userId, params.productId);
}

async function handleAddProduct(params: Omit<RecombeePayload, "type">) {
  if (!params.product) {
    throw new BadRequestError("product is required for addProduct");
  }
  await addProductToRecombee(params.product);
}

async function handleAddUser(params: Omit<RecombeePayload, "type">) {
  if (!params.userId && !params.sessionId) {
    throw new BadRequestError("userId or sessionId is required for addUser");
  }
  await addUserToRecombee(params.userId, params.sessionId);
}

async function handleAddRating(params: Omit<RecombeePayload, "type">) {
  if (!params.userId || !params.productId) {
    throw new BadRequestError(
      "userId and productId are required for addRating"
    );
  }
  await addRatingToRecombee(
    params.userId,
    params.productId,
    params.rating || 0
  );
}

async function handleModifyUser(params: Omit<RecombeePayload, "type">) {
  if (!params.userId && !params.sessionId) {
    throw new BadRequestError("userId or sessionId is required for modifyUser");
  }
  await modifyRecombeeUser(
    {
      name: params.name || "",
      email: params.email || "",
      role: params.role || "",
      gender: params.gender || "",
    },
    params.userId,
    params.sessionId
  );
}

async function handleMergeUsers(params: Omit<RecombeePayload, "type">) {
  if (!params.userId || !params.sessionId) {
    throw new BadRequestError(
      "userId and sessionId are required for mergeUsers"
    );
  }
  await mergeRecombeeUsers(params.userId, params.sessionId);
}
