import { Category, Product, Store } from "@/prisma/generated/prisma-client";
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
    category: Category | null;
    store: Store;
  }
) => {
  try {
    client.send(
      new rqs.SetItemValues(
        product.id,
        {
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.images,
          category: product.category?.name,
          stock: product.stock,
          slug: product.slug,
          faults: product.faults,
          rating: product.rating,
          store: product.store.name,
          storeId: product.store.id,
          storeDescription: product.store.bio,
          storeImage: product.store.logo,
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
  recommId?: string,
  product?: Product & { Category: Category | null }
) => {
  try {
    if (!userId || !productId) {
      throw new Error("userId and productId are required");
    }

    const additionalData: Record<string, any> = {};

    if (product) {
      additionalData.title = product.name;
      additionalData.price = product.price;
      additionalData.quantity = 1;
      additionalData.description = product.description;
      additionalData.category = product.Category?.name;

      if (Array.isArray(product.images) && product.images.length > 0) {
        additionalData.image = product.images[0];
      }
    }

    const request = new rqs.AddCartAddition(userId, productId, {
      recommId,
      cascadeCreate: true,
      timestamp: new Date().toISOString(),
      price: product?.price,
      additionalData,
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
