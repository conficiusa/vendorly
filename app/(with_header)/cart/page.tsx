"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Heart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CheckoutDialog } from "@/components/checkout-dialog";
import { useCart } from "@/lib/swr/useCart";
import { CartSkeleton } from "@/components/skeletons/cart-skeleton";
import { useRecombeeRecommendations } from "@/lib/swr/useRecombeeRecommendations";
import { useInView } from "react-intersection-observer";
import { ProductCard } from "@/components/product-card";
import { ProductsGridSkeleton } from "@/components/skeletons/products-grid-skeleton";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/prisma/generated/prisma-client";

interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  productVariantOptionId: string | null;
  image: string | null;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: Product | null;
  productVariantOption?: {
    id: string;
    attributes: Record<string, string>;
  };
}

export default function CartPage() {
  const {
    data: cartItems,
    error,
    isLoading,
    mutate,
    updateQuantity,
    removeItem,
  } = useCart();

  const { ref, inView } = useInView();
  const anchorItemId = cartItems?.[0]?.productId;
  const recScenario = anchorItemId ? ("cartpage" as const) : undefined;

  const {
    recommendations: recommendedProducts,
    isLoadingInitialData: isRecInitialLoading,
    isReachingEnd: isRecEnd,
    isValidating: isRecLoadingMore,
    setSize: setRecSize,
    error: recError,
  } = useRecombeeRecommendations(recScenario, anchorItemId);

  useEffect(() => {
    if (inView && !isRecLoadingMore && !isRecEnd && !recError) {
      setRecSize((s) => s + 1);
    }
  }, [inView, isRecLoadingMore, isRecEnd, recError, setRecSize]);

  const handleQuantityUpdate = async (id: string, change: number) => {
    const item = cartItems?.find((item) => item.id === id);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + change);
    await updateQuantity(id, newQuantity);
  };

  const subtotal =
    cartItems?.reduce(
      (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
      0
    ) || 0;

  if (isLoading) {
    return <CartSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl text-center max-w-md shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Unable to load cart
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => mutate("/api/cart")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-2">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Shopping Cart
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {cartItems && cartItems.length > 0
              ? `${cartItems.length} item${cartItems.length !== 1 ? "s" : ""} in your cart`
              : "Your cart is empty"}
          </p>
        </motion.div>

        {!cartItems || cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Items in your cart
                  </h2>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  <AnimatePresence>
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-6"
                      >
                        <CartItem
                          item={item}
                          onUpdateQuantity={handleQuantityUpdate}
                          onRemove={() => removeItem(item.id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Cart Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <CartSummary subtotal={subtotal} items={cartItems} />
            </motion.div>
          </div>
        )}

        {/* Recommended Products */}
        <RecommendedProducts
          products={recommendedProducts}
          isLoading={isRecInitialLoading && recommendedProducts.length === 0}
        />

        {recommendedProducts.length > 0 && !isRecEnd && (
          <div ref={ref} className="h-4"></div>
        )}
      </div>
    </div>
  );
}

interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (id: string, change: number) => void;
  onRemove: (id: string) => void;
}

function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  if (!item.product) {
    return null;
  }

  return (
    <div className="flex items-start space-x-4">
      {/* Product Image */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
        <Image
          src={item.product.images[0] || "/placeholder.jpg"}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {item.product.name}
        </h3>

        {item.productVariantOption && (
          <div className="mt-1">
            <div className="flex flex-wrap gap-2">
              {Object.entries(item.productVariantOption.attributes).map(
                ([key, value]) => (
                  <span
                    key={key}
                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md"
                  >
                    {key}: {value}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        <div className="mt-2 flex items-center justify-between">
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(item.product.price)}
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onUpdateQuantity(item.id, -1)}
              className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              disabled={item.quantity <= 1}
            >
              <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>

            <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
              {item.quantity}
            </span>

            <button
              onClick={() => onUpdateQuantity(item.id, 1)}
              className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Total Price for Item */}
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Total: {formatCurrency(item.product.price * item.quantity)}
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id)}
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        aria-label="Remove item"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}

interface CartSummaryProps {
  subtotal: number;
  items: CartItem[];
}

function CartSummary({ subtotal, items }: CartSummaryProps) {
  const shippingThreshold = 50;
  const shippingCost = subtotal >= shippingThreshold ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingCost + tax;
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Order Summary
      </h2>

      {/* Order Details */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Subtotal ({items.length} items)</span>
          <span>{formatCurrency(subtotal as number)}</span>
        </div>

        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Shipping</span>
          <span>
            {shippingCost === 0 ? (
              <span className="text-green-600 font-medium">FREE</span>
            ) : (
              formatCurrency(shippingCost as number)
            )}
          </span>
        </div>

        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Tax</span>
          <span>{formatCurrency(tax as number)}</span>
        </div>

        {subtotal < shippingThreshold && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Add ${(shippingThreshold - subtotal).toFixed(2)} more for free
              shipping!
            </p>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            Total
          </span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(total as number)}
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      <Link href={`/checkout?from=cart`}>
        <button
          // onClick={() => setShowCheckout(true)}
          className="w-full bg-primary  hover:bg-primary/80 text-white py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2 shadow-sm"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </Link>

      {/* Security Note */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
        🔒 Secure checkout
      </p>

      <CheckoutDialog
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        total={total}
        from="cart"
      />
    </div>
  );
}

function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-sm border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-12 h-12 text-gray-400 dark:text-gray-500" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Your cart is empty
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Looks like you haven't added anything to your cart yet. Start browsing
          to find amazing products!
        </p>

        <Link
          href="/discover"
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-sm"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

interface RecommendedProductsProps {
  products: import("@/lib/types/product.types").ProductCard[];
  isLoading?: boolean;
}

function RecommendedProducts({
  products,
  isLoading = false,
}: RecommendedProductsProps) {
  if (isLoading) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          You might also like
        </h2>
        <ProductsGridSkeleton count={4} />
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-16"
    >
      <div className="flex items-center space-x-2 mb-8">
        <Heart className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          You might also like
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </motion.div>
  );
}
