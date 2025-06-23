"use client";

import { useState } from "react";
import { Heart, Eye } from "lucide-react";
import Image from "next/image";
import { ProductCard as ProductCardType } from "@/lib/types/product.types";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import AddToCartButton from "@/app/components/AddToCartButton";

export default function ProductCard({ product }: { product: ProductCardType }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <motion.div
      className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={hoverEffect}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-[14/10] relative overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300"></div>

          {/* Discount Badge */}
          {product.discount && (
            <div className="absolute top-4 left-4 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
              {product.discount}% OFF
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 z-10"
          >
            <Heart
              className={`w-5 h-5 ${isWishlisted ? "fill-rose-500 text-rose-500" : "text-slate-400"}`}
            />
          </button>
          {/* Quick Add to Cart - appears on hover */}
          <AddToCartButton productId={product.id} />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <div className="flex space-x-3">
              <Link href={`/${product.slug}`}>
                <button
                  title="Quick View"
                  className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all transform hover:scale-110 focus:outline-none"
                >
                  <Eye size={20} />
                  <span className="sr-only">Quick View</span>
                </button>
              </Link>
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

        {/* Product Info */}
        <Link href={`/${product.slug}`}>
          <div className="p-6">
            <h3 className="font-semibold text-slate-800 mb-2 text-sm leading-tight line-clamp-2">
              {product.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">{product.category}</p>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-slate-800">
                  {formatCurrency(product.price - (product?.discount || 0))}
                </span>
                {product.discount && (
                  <span className="text-sm text-slate-500 line-through">
                    Was:
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>

              {/* {product.coupon && (
              <div className="text-xs text-rose-600 font-medium">
                after {product.coupon}
              </div>
              )} */}
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
