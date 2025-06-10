"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Eye, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { cn, formatCurrency } from "@/lib/utils";
import { ProductCard as ProductCardType } from "@/lib/types/product.types";
import AddToCartButton from "@/app/components/AddToCartButton";

interface ProductCardProps {
  product: ProductCardType;
  className?: string;
  isListView?: boolean;
}

export function ProductCard({
  product,
  className,
  isListView = false,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const imageUrl = product.images?.[0];

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
  };

  const hoverEffect = {
    y: -8,
    boxShadow: "0px 20px 30px -10px rgba(0, 0, 0, 0.2)",
    transition: { type: "spring", stiffness: 300, damping: 15 },
  };

  if (isListView) {
    return (
      <div
        className={cn(
          "flex gap-4 p-4 border rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow",
          className
        )}
      >
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 overflow-hidden rounded-md flex-shrink-0">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div>
            <Link href={`/discover/${product.slug}`}>
              <h3 className="font-semibold text-base sm:text-lg hover:text-primary transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {product.store}
              </p>
            {product.description && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2 sm:line-clamp-3">
                {product.description}
              </p>
            )}
          </div>
          <div className="mt-auto pt-2 flex items-end justify-between">
            <div className="min-w-0 mr-2">
              <p className="font-bold text-primary text-base sm:text-lg truncate">
                {formatCurrency(product.price)}
              </p>
              {product.rating && (
                <div className="flex items-center mt-0.5">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
            <AddToCartButton
              productId={product.id}
              className="text-xs px-3 py-1.5 sm:text-sm sm:px-4 sm:py-2 flex-shrink-0"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={hoverEffect}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-all duration-300 flex flex-col justify-between",
        className
      )}
      style={{ boxShadow: "0px 10px 20px -10px rgba(0, 0, 0, 0.1)" }}
    >
      <Link href={`/discover/${product.slug}`} className="block">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300"></div>

          {product.category && (
            <div className="absolute top-3 left-3">
              <span className="inline-block rounded-full bg-white/90 dark:bg-black/70 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 shadow-md backdrop-blur-sm">
                {product.category}
              </span>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <div className="flex space-x-3">
              <button
                title="Quick View"
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all transform hover:scale-110 focus:outline-none"
              >
                <Eye size={20} />
                <span className="sr-only">Quick View</span>
              </button>
              <button
                title="Add to Wishlist"
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all transform hover:scale-110 focus:outline-none"
              >
                <Heart size={20} />
                <span className="sr-only">Add to Wishlist</span>
              </button>
            </div>
          </motion.div>
        </div>
      </Link>

      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="font-semibold text-base sm:text-lg text-neutral-800 dark:text-neutral-100 group-hover:text-primary dark:group-hover:text-primary-dark transition-colors duration-300 line-clamp-2">
            <Link href={`/discover/${product.slug}`}>{product.name}</Link>
          </h3>
          {product.store && (
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
              By {product.store}
            </p>
          )}
        </div>

        <div className="mt-3 sm:mt-4 flex items-end justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <p className="text-lg sm:text-xl font-bold text-primary dark:text-primary-dark whitespace-nowrap overflow-hidden text-ellipsis">
              {formatCurrency(product.price)}
            </p>
            {product.rating && (
              <div className="flex items-center mt-0.5 sm:mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={cn(
                      i < Math.round(product.rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-neutral-300 dark:fill-neutral-600 text-neutral-300 dark:text-neutral-600"
                    )}
                  />
                ))}
                <span className="ml-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                  ({product.rating.toFixed(1)})
                </span>
              </div>
            )}
          </div>
          <AddToCartButton
            productId={product.id}
            className="text-xs px-3 py-1.5 sm:text-sm sm:px-4 sm:py-2 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-neutral-700 text-white hover:bg-neutral-600 dark:bg-neutral-300 dark:text-black dark:hover:bg-neutral-400 flex-shrink-0"
          />
        </div>
      </div>
    </motion.div>
  );
}
