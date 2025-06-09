import { CartItem } from "@/prisma/generated/prisma-client";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";

export const useCart = () => {
  const { mutate } = useSWRConfig();
  const fetcher = async (url: string) => {
    const res = await fetch(url);
    return res.json();
  };
  const { data, error, isLoading } = useSWR("/api/cart", fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  const addToCart = async (
    productId: string,
    variantId?: string,
    quantity: number = 1
  ) => {
    // Optimistically update the cart
    const optimisticData = {
      success: true,
      data: {
        ...data?.data,
        items: [
          ...(data?.data?.items || []),
          {
            id: "temp-id",
            productId,
            productVariantOptionId: variantId || null,
            quantity,
            createdAt: new Date(),
            updatedAt: new Date(),
            cartId: data?.data?.id,
            product: {
              id: productId,
              // Add minimal product data needed for display
              name: "Loading...",
              price: 0,
            },
          },
        ],
      },
    };

    try {
      // Optimistically update the UI
      await mutate(
        "/api/cart",
        async () => {
          const response = await fetch("/api/cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              productId,
              variantId,
              quantity,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            toast.error(error.error.message);
            return data;
          }

          const newItem = await response.json();

          // Return the complete updated data structure
          return {
            success: true,
            data: {
              ...data?.data,
              items: [...(data?.data?.items || []), newItem],
            },
          };
        },
        {
          optimisticData,
          rollbackOnError: true,
          populateCache: true,
          revalidate: false,
        }
      );

      return true;
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      toast.error(error.message || "Failed to add item to cart");
      return false;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    // Optimistically update the cart
    const optimisticData = {
      success: true,
      data: {
        ...data?.data,
        items: data?.data?.items.map((item: CartItem) =>
          item.id === itemId ? { ...item, quantity } : item
        ),
      },
    };

    try {
      // Optimistically update the UI
      await mutate(
        "/api/cart",
        async () => {
          const response = await fetch("/api/cart", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ itemId, quantity }),
          });

          if (!response.ok) {
            const error = await response.json();
            toast.error(error.error.message);
            return data;
          }

          const updatedItem = await response.json();

          // Return the complete updated data structure
          return {
            success: true,
            data: {
              ...data?.data,
              items: data?.data?.items.map((item: CartItem) =>
                item.id === itemId ? updatedItem.data : item
              ),
            },
          };
        },
        {
          optimisticData,
          rollbackOnError: true,
          populateCache: true,
          revalidate: false,
        }
      );
    } catch (error: any) {
      console.error("Error updating quantity:", error.error);
      // The optimistic update will be automatically rolled back
    }
  };

  const removeItem = async (itemId: string) => {
    // Optimistically update the cart by removing the item
    const optimisticData = {
      success: true,
      data: {
        ...data?.data,
        items: data?.data?.items.filter((item: CartItem) => item.id !== itemId),
      },
    };

    try {
      // Optimistically update the UI
      await mutate(
        "/api/cart",
        async () => {
          const response = await fetch(`/api/cart?itemId=${itemId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            const error = await response.json();
            toast.error(error.error.message);
            return data;
          }

          // Return the complete updated data structure
          return {
            success: true,
            data: {
              ...data?.data,
              items: data?.data?.items.filter(
                (item: CartItem) => item.id !== itemId
              ),
            },
          };
        },
        {
          optimisticData,
          rollbackOnError: true,
          populateCache: true,
          revalidate: false,
        }
      );
    } catch (error) {
      console.error("Error removing item:", error);
      // The optimistic update will be automatically rolled back
    }
  };

  return {
    data: data?.data?.items as CartItem[],
    error,
    isLoading,
    mutate,
    updateQuantity,
    removeItem,
    addToCart,
  };
};
