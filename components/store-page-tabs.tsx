"use client";
import { motion, AnimatePresence } from "framer-motion";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const mockStore = {
  id: "store1",
  name: "Campus Tech Hub",
  slug: "campus-tech-hub",
  bio: "Your one-stop shop for all campus tech needs. We offer the latest gadgets, repair services, and tech accessories at student-friendly prices.",
  images: [
    "https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg",
    "https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg",
    "https://images.pexels.com/photos/892757/pexels-photo-892757.jpeg",
  ],
  profileImage:
    "https://images.pexels.com/photos/7679682/pexels-photo-7679682.jpeg",
  address: {
    region: "Greater Accra",
    city: "Accra",
    address_line1: "123 Tech Street",
    digital_address: "GA-145-9283",
  },
  rating: 4.8,
  reviewCount: 156,
  products: [
    {
      id: "p1",
      name: "Wireless Earbuds",
      price: 49.99,
      image:
        "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg",
      rating: 4.7,
      reviewCount: 45,
    },
    {
      id: "p2",
      name: "Laptop Stand",
      price: 29.99,
      image: "https://images.pexels.com/photos/7974/pexels-photo.jpg",
      rating: 4.5,
      reviewCount: 32,
    },
  ],
  services: [
    {
      id: "s1",
      name: "Phone Screen Repair",
      price: 39.99,
      image:
        "https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg",
      rating: 4.9,
      reviewCount: 78,
    },
    {
      id: "s2",
      name: "Laptop Maintenance",
      price: 49.99,
      image:
        "https://images.pexels.com/photos/6771985/pexels-photo-6771985.jpeg",
      rating: 4.8,
      reviewCount: 56,
    },
  ],
  reviews: [
    {
      id: "r1",
      user: {
        name: "John Doe",
        image:
          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
      },
      rating: 5,
      comment: "Great service and quick delivery! Will definitely buy again.",
      date: "2024-03-15",
    },
    {
      id: "r2",
      user: {
        name: "Jane Smith",
        image:
          "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      },
      rating: 4,
      comment: "Good products but shipping took a bit longer than expected.",
      date: "2024-03-10",
    },
  ],
};

const StorePageTabs = () => {
  const [activeTab, setActiveTab] = useState<
    "products" | "services" | "reviews"
  >("products");
  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b">
        {(["products", "services", "reviews"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-2 text-sm font-medium capitalize ${
              activeTab === tab
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                transition={{
                  type: "spring",
                  bounce: 0.2,
                  duration: 0.6,
                }}
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "products" && (
          <motion.div
            key="products"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {mockStore.products.map((product) => (
              <div
                key={product.id}
                className="group relative overflow-hidden rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-lg font-semibold text-primary">
                    ${product.price.toFixed(2)}
                  </p>
                  <div className="mt-2 flex items-center text-sm text-muted-foreground">
                    <StarIcon className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                    <span>{product.rating}</span>
                    <span className="mx-1">·</span>
                    <span>{product.reviewCount} reviews</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === "services" && (
          <motion.div
            key="services"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {mockStore.services.map((service) => (
              <div
                key={service.id}
                className="group relative overflow-hidden rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{service.name}</h3>
                  <p className="text-lg font-semibold text-primary">
                    ${service.price.toFixed(2)}
                  </p>
                  <div className="mt-2 flex items-center text-sm text-muted-foreground">
                    <StarIcon className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                    <span>{service.rating}</span>
                    <span className="mx-1">·</span>
                    <span>{service.reviewCount} reviews</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === "reviews" && (
          <motion.div
            key="reviews"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {mockStore.reviews.map((review) => (
              <div key={review.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden">
                    <Image
                      src={review.user.image}
                      alt={review.user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{review.user.name}</h4>
                      <time className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString()}
                      </time>
                    </div>
                    <div className="flex items-center mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-sm">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StorePageTabs;
