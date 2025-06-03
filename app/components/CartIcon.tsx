"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface CartIconProps {
  itemCount: number;
  className?: string;
}

export default function CartIcon({ itemCount, className = "" }: CartIconProps) {
  return (
    <Link href="/cart" className={`relative inline-block ${className}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <ShoppingCart className="w-6 h-6" />

        {itemCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-black text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center"
          >
            {itemCount > 99 ? "99+" : itemCount}
          </motion.div>
        )}
      </motion.div>
    </Link>
  );
}
