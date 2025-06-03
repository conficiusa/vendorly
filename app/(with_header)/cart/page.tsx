"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CheckoutDialog } from "@/components/checkout-dialog";
import { useCart } from "@/lib/swr/useCart";
import { CartSkeleton } from "@/components/skeletons/cart-skeleton";

interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  productVariantOptionId: string | null;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  productVariantOption?: {
    id: string;
    attributes: Record<string, string>;
  };
}

// Define a primary color (Rose Gold)
const primaryColor = "#B76E79"; // A sample rose gold hex code
const accentColor = "#D9A6B0"; // Lighter rose gold
const subtleBg = "#FFF7F5"; // Very light rose/peach for subtle backgrounds

export default function CartPage() {
  const {
    data: cartItems,
    error,
    isLoading,
    mutate,
    updateQuantity,
    removeItem
  } = useCart();
  const [recommendedProducts, setRecommendedProducts] = useState<
    CartItem["product"][]
  >([]);

  // Fetch cart items & recommended products
  useEffect(() => {
    fetchRecommendedProducts();
  }, []);

  const fetchRecommendedProducts = async () => {
    // Placeholder: In a real app, fetch actual recommendations
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRecommendedProducts([
      {
        id: "rec1",
        name: "Enchanted Rose Elixir",
        price: 199.99,
        image: "/bag.jpg",
      },
      {
        id: "rec2",
        name: "Gilded Leaf Notebook",
        price: 89.99,
        image: "/bag.jpg",
      },
      {
        id: "rec3",
        name: "Velvet Cushion & Throw Set",
        price: 24.5,
        image: "/bag.jpg",
      },
      {
        id: "rec4",
        name: "Artisan Ceramic Mug",
        price: 59.0,
        image: "/bag.jpg",
      },
    ]);
  };

  const handleQuantityUpdate = async (id: string, change: number) => {
    const item = cartItems?.find((item) => item.id === id);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + change);
    await updateQuantity(id, newQuantity);
  };


  const subtotal =
    (cartItems as CartItem[])?.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) || 0;

  if (isLoading) {
    return <CartSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl text-center max-w-md">
          <h2
            style={{ color: primaryColor }}
            className="text-2xl font-bold mb-4"
          >
            A slight hiccup...
          </h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => mutate("/api/cart")}
            style={{ backgroundColor: primaryColor }}
            className="px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-rose-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ color: primaryColor }}
          className="text-5xl font-extrabold text-center mb-12 tracking-tight"
        >
          Your Shopping Cart
        </motion.h1>

        {!cartItems || cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-8">
            {/* Cart Items */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-8"
            >
              <div className="bg-white rounded-xl overflow-hidden divide-y divide-rose-100 border border-rose-200">
                <AnimatePresence>
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        x: -30,
                        transition: { duration: 0.3 },
                      }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="p-6 hover:bg-rose-50/50 transition-colors duration-300"
                    >
                      <CartItem
                        item={item as CartItem}
                        onUpdateQuantity={handleQuantityUpdate}
                        onRemove={() => removeItem(item.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Cart Summary */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-4"
            >
              <CartSummary
                subtotal={subtotal}
                items={cartItems as CartItem[]}
              />
            </motion.div>
          </div>
        )}

        {/* You May Also Like Section */}
        {recommendedProducts.length > 0 && (
          <RecommendedProducts products={recommendedProducts} />
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
  return (
    <div className="flex items-center gap-6">
      <div className="relative w-28 h-28 rounded-lg overflow-hidden flex-shrink-0 border border-rose-200 shadow-md">
        <Image
          src={item.product.image || "/bag.jpg"}
          alt={item.product.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-xl font-semibold hover:text-rose-600 transition-colors cursor-default">
          {item.product.name}
        </h3>
        {item.productVariantOption && (
          <p style={{ color: primaryColor }} className="text-sm mt-1">
            {Object.entries(item.productVariantOption.attributes)
              .map(
                ([key, value]) =>
                  `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`
              )
              .join(" / ")}
          </p>
        )}
        <p className="text-2xl font-bold mt-2">
          ${item.product.price.toFixed(2)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.id, -1)}
          className="p-1 rounded-full hover:bg-rose-100 transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" style={{ color: primaryColor }} />
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, 1)}
          className="p-1 rounded-full hover:bg-rose-100 transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" style={{ color: primaryColor }} />
        </button>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        style={{ color: primaryColor }}
        className="p-3 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 ring-red-500 ring-offset-1"
        aria-label="Remove item"
      >
        <Trash2 className="w-6 h-6" />
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
  const shippingCost = subtotal > shippingThreshold ? 0 : 0.1;
  const total = subtotal + shippingCost;
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <div
      style={{ backgroundColor: subtleBg }}
      className="rounded-xl p-8 sticky top-12 border border-rose-200"
    >
      <h2
        style={{ color: primaryColor }}
        className="text-3xl font-bold mb-8 border-b border-rose-200 pb-4"
      >
        Order Summary
      </h2>
      <div className="space-y-5">
        {/* Item Details */}
        <div className="space-y-3 mb-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center text-sm"
            >
              <div>
                <span className="font-medium italic">{item.product.name}</span>
              </div>
              <span className="opacity-70 ml-2">x{item.quantity}</span>
              <span className="font-semibold">
                ${(item.product.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-rose-200 pt-4">
          <div className="flex justify-between text-lg">
            <span>Subtotal</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg mt-4">
            <span>Shipping</span>
            {shippingCost === 0 ? (
              <span style={{ color: primaryColor }} className="font-semibold">
                FREE
              </span>
            ) : (
              <span className="font-semibold">${shippingCost.toFixed(2)}</span>
            )}
          </div>
        </div>
        <div className="border-t border-rose-200 pt-6 mt-6">
          <div className="flex justify-between items-center font-bold text-2xl">
            <span>Total</span>
            <span style={{ color: primaryColor }}>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <motion.button
        whileHover={{
          scale: 1.03,
          boxShadow: `0 10px 15px -3px ${accentColor}40, 0 4px 6px -2px ${accentColor}20`,
        }}
        whileTap={{ scale: 0.98 }}
        style={{ backgroundColor: primaryColor }}
        className="w-full mt-10 text-white py-3.5 px-6 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-opacity-50"
        onClick={() => setShowCheckout(true)}
      >
        Proceed to Checkout
      </motion.button>
      <p className="text-xs opacity-70 mt-4 text-center">
        Secure payments | Easy returns
      </p>

      <CheckoutDialog
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        total={total}
      />
    </div>
  );
}

function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
      style={{ backgroundColor: subtleBg }}
      className="text-center py-20 rounded-xl shadow-xl p-10 border border-rose-200"
    >
      <div
        style={{
          background: `linear-gradient(to bottom right, ${primaryColor}, ${accentColor})`,
        }}
        className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 shadow-lg"
      >
        <ShoppingCart className="w-12 h-12 text-white" />
      </div>
      <h2 style={{ color: primaryColor }} className="text-4xl font-bold mb-4">
        Your Cart Awaits Treasures
      </h2>
      <p className="text-lg mb-10 max-w-md mx-auto opacity-80">
        Adorn your cart with beautiful finds. Let the shopping journey begin!
      </p>
      <Link
        href="/"
        style={{ backgroundColor: primaryColor }}
        className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-lg font-semibold rounded-lg text-white hover:opacity-90 transition-opacity shadow-md hover:shadow-lg transform hover:scale-105"
      >
        Discover Collections
      </Link>
    </motion.div>
  );
}

interface RecommendedProductsProps {
  products: CartItem["product"][];
}

function RecommendedProducts({ products }: RecommendedProductsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mt-20"
    >
      <h2
        style={{ color: primaryColor }}
        className="text-3xl font-bold text-center mb-12 tracking-tight"
      >
        Perhaps You'll Adore These?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{
              y: -8,
              boxShadow: `0 10px 20px -5px ${accentColor}30, 0 4px 8px -4px ${accentColor}20`,
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer border border-rose-100 hover:border-rose-300 transition-all duration-300 flex flex-col"
          >
            <div className="relative w-full h-60">
              <Image
                src={product.image || "/bag.jpg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold mb-2 truncate flex-grow">
                {product.name}
              </h3>
              <p
                style={{ color: primaryColor }}
                className="text-xl font-bold mb-4"
              >
                ${product.price.toFixed(2)}
              </p>
              <button
                style={{ backgroundColor: accentColor, color: "white" }}
                className="w-full py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity font-medium text-sm mt-auto"
              >
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
