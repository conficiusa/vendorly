import { CheckoutForm } from "@/components/checkout-form";
import Modal from "@/components/modal";
import { getSession } from "@/lib/auth";
import { fetchProduct } from "@/lib/queries/products/fetchProduct";
import { getUserCart } from "@/lib/queries/user/me";
import { tryCatch } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{
    from: "cart" | "product";
    productId?: string;
    variantId?: string;
  }>;
}) {
  const session = await getSession();
  const { from, productId, variantId } = await searchParams;
  if (!session) {
    const query = new URLSearchParams();
    query.set("from", from);
    if (productId) query.set("productId", productId);
    if (variantId) query.set("variantId", variantId);
    redirect(`/auth/login?redirect=/checkout?${query.toString()}`);
  }

  if (from === "cart") {
    const { data: cart, error } = await tryCatch(getUserCart(session.user.id));

    const total = cart?.cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    if (error) {
      return (
        <Modal title="Something went wrong" description={error.message}>
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
              <p className="text-muted-foreground mb-4">{error.message}</p>
            </div>
          </div>
        </Modal>
      );
    }

    if (!total) {
      return (
        <Modal
          title="Your cart is empty"
          description="Add some items to your cart before proceeding to checkout."
        >
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
              <p className="text-muted-foreground mb-4">
                Add some items to your cart before proceeding to checkout.
              </p>
            </div>
          </div>
        </Modal>
      );
    }
    return (
      <Modal title="Checkout" description="Proceed to checkout">
        <CheckoutForm total={total} from={from} />
      </Modal>
    );
  }

  const { data: product, error } = await tryCatch(
    fetchProduct(undefined, productId, session?.user?.id)
  );

  if (error) {
    return (
      <Modal title="Something went wrong" description={error.message}>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">{error.message}</p>
          </div>
        </div>
      </Modal>
    );
  }

  if (!product) {
    return (
      <Modal
        title="Product not found"
        description="The product you are looking for does not exist."
      >
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Product not found</h1>
          </div>
        </div>
      </Modal>
    );
  }

  const total = product.price;

  return (
    <Modal title="Checkout" description="Proceed to checkout">
      <CheckoutForm
        total={total}
        productId={productId}
        variantId={variantId}
        from={from}
      />
    </Modal>
  );
}
