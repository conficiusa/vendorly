"use client";
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Category,
  Product,
  ProductVariantOption,
  Review,
  Store,
  User,
} from "@/prisma/generated/prisma-client";
import {
  Clock,
  Shield,
  Star,
  Store as StoreIcon,
  Minus,
  Plus,
  ThumbsUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Helper function to format date
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

type ProductDetailsProp = {
  product: Product & {
    Category: Category | null;
    Review: (Review & {
      user: User;
    })[];
    variantOptions: ProductVariantOption[];
    store: Store | null;
  };
};

const ProductDetails = ({ product }: ProductDetailsProp) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variantOptions.length > 0 ? product.variantOptions[0].id : null
  );
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const checkoutparams = new URLSearchParams();
  checkoutparams.set("productId", product.id);
  checkoutparams.set("quantity", quantity.toString());
  if (selectedVariantId) {
    checkoutparams.set("variantId", selectedVariantId);
  }

  const checkoutUrl = `/checkout?${checkoutparams.toString()}`;
  const router = useRouter();

  // Get all unique variant attributes from the variant options
  const variantAttributes = useMemo(() => {
    const attributes: Record<string, Set<string>> = {};

    product.variantOptions.forEach((variant) => {
      const variantAttrs = variant.attributes as Record<string, string>;
      Object.entries(variantAttrs).forEach(([key, value]) => {
        if (!attributes[key]) {
          attributes[key] = new Set();
        }
        attributes[key].add(value);
      });
    });

    return attributes;
  }, [product.variantOptions]);

  // Find the current selected variant based on ID
  const currentVariant = useMemo(() => {
    return product.variantOptions.find(
      (variant) => variant.id === selectedVariantId
    );
  }, [product.variantOptions, selectedVariantId]);

  // Get available options for each attribute based on current selection
  const getAvailableOptions = (attributeName: string) => {
    const availableOptions = new Set<string>();

    product.variantOptions.forEach((variant) => {
      const variantAttrs = variant.attributes as Record<string, string>;
      const currentAttrs = { ...variantAttrs };

      // Check if this variant matches all currently selected attributes except the one we're checking
      const isCompatible = Object.entries(currentAttrs).every(
        ([key, value]) => {
          if (key === attributeName) return true;
          const selectedVariant = product.variantOptions.find(
            (v) => v.id === selectedVariantId
          );
          return (
            selectedVariant &&
            (selectedVariant.attributes as Record<string, string>)[key] ===
              value
          );
        }
      );

      if (isCompatible) {
        availableOptions.add(currentAttrs[attributeName]);
      }
    });

    return Array.from(availableOptions);
  };

  // Handle variant selection
  const handleVariantSelect = (attributeName: string, value: string) => {
    // Find a variant that matches all current selections plus the new one
    const newVariant = product.variantOptions.find((variant) => {
      const variantAttrs = variant.attributes as Record<string, string>;
      return variantAttrs[attributeName] === value;
    });

    if (newVariant) {
      setSelectedVariantId(newVariant.id);
    }
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          variantId: selectedVariantId,
          quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add item to cart");
      }

      toast.success("Item added to cart successfully");

      // Refresh the cart count
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add item to cart"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col"
    >
      <div className="mb-6">
        <div className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm mb-4">
          {product.Category?.name}
        </div>
        <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
            <span className="font-medium">{product.rating}</span>
            <span className="mx-1">·</span>
            <span>{product.Review.length} reviews</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-3xl font-bold mb-2">
          $
          {currentVariant ? product.price.toFixed(2) : product.price.toFixed(2)}
        </p>
        <p
          className={cn(
            "text-sm font-medium mb-4",
            (currentVariant?.stock || product.stock) > 10
              ? "text-green-600"
              : "text-orange-600"
          )}
        >
          {currentVariant?.stock || product.stock} items left in stock
        </p>

        {Object.entries(variantAttributes).length > 0 && (
          <div className="space-y-4 mb-6">
            {Object.keys(variantAttributes).map((attributeName) => (
              <div key={attributeName}>
                <label className="block text-sm font-medium mb-2">
                  {attributeName}
                </label>
                <div className="flex flex-wrap gap-2">
                  {getAvailableOptions(attributeName).map((value) => {
                    const isSelected =
                      currentVariant &&
                      (currentVariant.attributes as Record<string, string>)[
                        attributeName
                      ] === value;

                    return (
                      <button
                        key={value}
                        onClick={() =>
                          handleVariantSelect(attributeName, value)
                        }
                        className={cn(
                          "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                          isSelected
                            ? "bg-primary text-primary-foreground ring-2 ring-primary/20"
                            : "bg-secondary hover:bg-secondary/80"
                        )}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 mb-6">
          <label className="block text-sm font-medium">Quantity</label>
          <div className="flex items-center border rounded-md">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2 hover:bg-secondary transition-colors"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 py-2 text-center min-w-[3rem]">
              {quantity}
            </span>
            <button
              onClick={() =>
                setQuantity((q) =>
                  Math.min(currentVariant?.stock || product.stock, q + 1)
                )
              }
              className="p-2 hover:bg-secondary transition-colors"
              disabled={quantity >= (currentVariant?.stock || product.stock)}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="prose prose-sm text-muted-foreground">
          <h3 className="text-foreground text-lg font-semibold mb-2">
            Product Description
          </h3>
          <p className="mb-4">{product.description}</p>

          {product.faults && (
            <>
              <h3 className="text-foreground text-lg font-semibold mb-2">
                Known Issues
              </h3>
              <ul className="list-disc list-inside text-destructive space-y-1">
                {product.faults.split(",").map((fault, index) => (
                  <li key={index}>{fault.trim()}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="border rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <StoreIcon className="h-5 w-5 text-primary mt-1" />
          <div>
            <p className="font-medium">{product.store?.name}</p>
            <p className="text-sm text-muted-foreground">
              Campus Verified Vendor
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
          <Clock className="h-5 w-5 text-primary mt-1" />
          <div>
            <p className="font-medium">Fast Delivery</p>
            <p className="text-sm text-muted-foreground">
              Same-day campus delivery
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
          <Shield className="h-5 w-5 text-primary mt-1" />
          <div>
            <p className="font-medium">Secure Payment</p>
            <p className="text-sm text-muted-foreground">
              Protected transaction
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          className="flex-1 bg-secondary text-secondary-foreground rounded-full px-8 py-4 font-medium hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={
            currentVariant?.stock === 0 || product.stock === 0 || isLoading
          }
          onClick={handleAddToCart}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Adding...
            </span>
          ) : currentVariant?.stock === 0 || product.stock === 0 ? (
            "Out of Stock"
          ) : (
            "Add to Cart"
          )}
        </button>
        <Link href={checkoutUrl}>
          <button
            className="flex-1 bg-primary text-primary-foreground rounded-full px-8 py-4 font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              currentVariant?.stock === 0 || product.stock === 0 || isLoading
            }
          >
            {currentVariant?.stock === 0 || product.stock === 0
              ? "Out of Stock"
              : "Buy Now"}
          </button>
        </Link>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              <span className="ml-1 font-medium">
                {product.rating?.toFixed(1) || "0.0"}
              </span>
            </div>
            <span className="text-muted-foreground">
              ({product.Review.length} reviews)
            </span>
          </div>
        </div>

        {product.Review.length > 0 ? (
          <div className="space-y-6">
            {product.Review.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{review.user.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={cn(
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-neutral-300 text-neutral-300"
                            )}
                          />
                        ))}
                      </div>
                      <span>·</span>
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <ThumbsUp size={16} />
                  </button>
                </div>
                {review.comment && (
                  <p className="text-muted-foreground mt-2">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No reviews yet. Be the first to review this product!
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductDetails;
