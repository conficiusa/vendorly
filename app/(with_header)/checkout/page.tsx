import { CheckoutForm } from "@/components/checkout-form";
import { getSession } from "@/lib/auth";
import { fetchProduct } from "@/lib/queries/products/fetchProduct";
import { getUserCart } from "@/lib/queries/user/me";
import { tryCatch } from "@/lib/utils";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    from: "cart" | "product";
    productId?: string;
    variantId?: string;
  }>;
}) => {
  const session = await getSession();
  const { from, productId, variantId } = await searchParams;
  if (!session) {
    const query = new URLSearchParams();
    query.set("from", from);
    if (productId) query.set("productId", productId);
    if (variantId) query.set("variantId", variantId);
    redirect(
      `/auth/login?redirect=${encodeURIComponent(`/checkout?${query.toString()}`)}`
    );
  }

  if (from === "cart") {
    const { data: cart, error } = await tryCatch(getUserCart(session.user.id));

    const total = cart?.cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    if (error) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">{error.message}</p>
          </div>
        </div>
      );
    }

    if (!total) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-4">
              Add some items to your cart before proceeding to checkout.
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <CheckoutForm total={total} from={from} />
      </div>
    );
  }

  const { data: product, error } = await tryCatch(
    fetchProduct(undefined, productId, session?.user?.id)
  );

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-muted-foreground mb-4">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Product not found</h1>
        </div>
      </div>
    );
  }

  const total = product.price;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <CheckoutForm
        total={total}
        productId={productId}
        variantId={variantId}
        from={from}
      />
    </div>
  );
};

export default page;
