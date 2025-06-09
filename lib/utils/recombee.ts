import {
  Category,
  GENDERTYPE,
  Product,
  Store,
} from "@/prisma/generated/prisma-client";
import * as recombee from "recombee-api-client";
const rqs = recombee.requests;

const RECOMBEE_DB = process.env.RECOMBEE_DB;
const RECOMBEE_PRIVATE_TOKEN = process.env.RECOMBEE_PRIVATE_TOKEN;
const RECOMBEE_REGION = process.env.RECOMBEE_REGION;

if (!RECOMBEE_DB || !RECOMBEE_PRIVATE_TOKEN || !RECOMBEE_REGION) {
  throw new Error("Recombee credentials are not properly configured");
}

const client = new recombee.ApiClient(RECOMBEE_DB, RECOMBEE_PRIVATE_TOKEN, {
  region: RECOMBEE_REGION || "eu-west",
});

export const addProductToRecombee = async (
  product: Product & {
    Category: Category | null;
    store: Store;
  }
) => {
  try {
    console.log("product", product);
    await client.send(
      new rqs.SetItemValues(
        product.id,
        {
          name: product.name,
          description: product.description,
          price: product.price,
          images: product.images,
          category: product.Category?.name,
          slug: product.slug,
          faults: product.faults,
          rating: product.rating,
          store: product.store.name,
          storeId: product.store.id,
          storeDescription: product.store.bio,
        },
        {
          cascadeCreate: true,
        }
      )
    );
  } catch (error) {
    console.error("Error adding product to Recombee:", error);
    throw error;
  }
};
/**
 * @description This function sends the "Add to cart" interaction to Recombee
 * @param userId - The user ID of the user who is adding the product to the cart
 * @param productId - The product ID of the product being added to the cart
 * @param recommId - The recomm ID of the product being added to the cart
 * @param product - The product being added to the cart
 * */
export const addToCart = async (
  userId: string,
  productId: string,
  recommId?: string
) => {
  try {
    if (!userId || !productId) {
      throw new Error("userId and productId are required");
    }

    const request = new rqs.AddCartAddition(userId, productId, {
      recommId,
      cascadeCreate: true,
      timestamp: new Date().toISOString(),
    });

    await client.send(request);
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const addItemPropertiesToRecombee = async () => {
  const itemProperties = [
    new rqs.AddItemProperty("name", "string"),
    new rqs.AddItemProperty("images", "imageList"),
    new rqs.AddItemProperty("price", "double"),
    new rqs.AddItemProperty("description", "string"),
    new rqs.AddItemProperty("category", "string"),
    new rqs.AddItemProperty("available", "boolean"),
    new rqs.AddItemProperty("store", "string"),
    new rqs.AddItemProperty("faults", "string"),
    new rqs.AddItemProperty("rating", "double"),
    new rqs.AddItemProperty("storeId", "string"),
    new rqs.AddItemProperty("storeDescription", "string"),
    new rqs.AddItemProperty("slug", "string"),
  ];

  let count = 0;
  for (const property of itemProperties) {
    try {
      await client.send(property);
      count++;
    } catch (error) {
      // Ignore if property already exists
      if (
        !(error instanceof Error && error.message.includes("already exists"))
      ) {
        throw error;
      }
    }
  }
  console.log(`${count} new properties added`);
};

export const addPurchaseToRecombee = async (
  userId: string,
  productId: string,
  recommId?: string,
  quantity?: number,
  price?: number
) => {
  const request = new rqs.AddPurchase(userId, productId, {
    timestamp: new Date().toISOString(),
    recommId,
    price,
    amount: quantity,
  });

  await client.send(request);
};

export const addDetailViewToRecombee = async (
  userId: string,
  productId: string
) => {
  const request = new rqs.AddDetailView(userId, productId, {
    timestamp: new Date().toISOString(),
  });

  await client.send(request);
};

export const addUserPropertiesToRecombee = async () => {
  const userProperties = [
    new rqs.AddUserProperty("name", "string"),
    new rqs.AddUserProperty("email", "string"),
    new rqs.AddUserProperty("role", "string"),
    new rqs.AddUserProperty("gender", "string"),
  ];
  let count = 0;
  for (const property of userProperties) {
    try {
      await client.send(property);
      count++;
    } catch (error) {
      // Ignore if property already exists
      if (
        !(error instanceof Error && error.message.includes("already exists"))
      ) {
        throw error;
      }
    }
  }
  console.log(`${count} new properties added`);
};

export const modifyRecombeeUser = async (
  {
    name,
    email,
    role,
    gender,
  }: {
    name: string;
    email: string;
    role: string;
    gender: string;
  },
  userId?: string,
  sessionId?: string
) => {
  const request = new rqs.SetUserValues((userId || sessionId) as string, {
    name,
    email,
    role,
    gender,
  });
  await client.send(request);
};

export const addUserToRecombee = async (
  userId?: string,
  sessionId?: string
) => {
  const request = new rqs.AddUser((userId || sessionId) as string);
  await client.send(request);
};

export const addRatingToRecombee = async (
  userId: string,
  productId: string,
  rating: number
) => {
  const request = new rqs.AddRating(userId, productId, rating);
  await client.send(request);
};
export const mergeRecombeeUsers = async (
  userId: string,
  sessionId: string,
  newUser: {
    name: string;
    email: string;
    role: string;
    gender: GENDERTYPE;
  }
) => {
  try {
    await getRecombeeUser(sessionId);
  } catch (err: any) {
    if (err.statusCode === 404) {
      return; // Terminate the function if user not found
    }
    throw err; // Re-throw other errors
  }

  const request = new rqs.MergeUsers(userId, sessionId, {
    cascadeCreate: true,
  });
  // modify the new user
  await client.send(request);
  await modifyRecombeeUser(newUser, userId);
};

export const getRecombeeUser = async (userId?: string, sessionId?: string) => {
  const request = new rqs.GetUserValues(userId || (sessionId as string));
  const response = await client.send(request);
  return response;
};
