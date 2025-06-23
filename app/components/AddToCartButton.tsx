"use client";
import { MouseEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/swr/useCart";

interface AddToCartButtonProps {
  productId: string;
  variantId?: string;
  disabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function AddToCartButton({
  productId,
  variantId,
  disabled = false,
  onSuccess,
  onError,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async (e: MouseEvent<HTMLButtonElement>) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setIsLoading(true);
    try {
      const success = await addToCart(productId, variantId, 1);

      if (success) {
        setIsSuccess(true);
        onSuccess?.();
        // Reset success state after 2 seconds
        setTimeout(() => setIsSuccess(false), 2000);
      } else {
        throw new Error("Failed to add item to cart");
      }
    } catch (error) {
      onError?.(
        error instanceof Error ? error.message : "Failed to add item to cart"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={(e) => handleAddToCart(e)}
      disabled={disabled || isLoading}
      className="absolute bottom-4 right-4 p-2 px-4 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 z-10"
    >
      <span
        className={`flex items-center gap-2 transition-opacity duration-200 ${isLoading || isSuccess ? "opacity-0" : "opacity-100"}`}
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="hidden sm:block">Add to Cart</span>
      </span>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </motion.div>
        ) : isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Check className="w-5 h-5" />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </button>
  );
}
