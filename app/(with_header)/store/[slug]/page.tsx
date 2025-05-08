"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MapPin, ChevronLeft, ChevronRight, Store } from "lucide-react";

// Mock store data
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

export default function StorePage({ params }: { params: { slug: string } }) {
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState<
    "products" | "services" | "reviews"
  >("products");

  const nextImage = () => {
    setActiveImageIndex((prev) =>
      prev === mockStore.images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? mockStore.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/marketplace"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Store className="mr-1 h-4 w-4" />
            All Stores
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
              <Image
                src={mockStore.images[activeImageIndex]}
                alt={`${mockStore.name} - Image ${activeImageIndex + 1}`}
                fill
                className="object-cover"
              />
              <button
                onClick={previousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground hover:bg-background/90 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground hover:bg-background/90 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {mockStore.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === activeImageIndex
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-primary/50"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${mockStore.name} - Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

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
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
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
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
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
                      <div
                        key={review.id}
                        className="rounded-lg border bg-card p-4"
                      >
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
                              <h4 className="font-medium">
                                {review.user.name}
                              </h4>
                              <time className="text-sm text-muted-foreground">
                                {new Date(review.date).toLocaleDateString()}
                              </time>
                            </div>
                            <div className="flex items-center mt-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
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
          </div>

          <div className="space-y-6">
            <div className="sticky top-24">
              <div className="rounded-xl border bg-card p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden">
                    <Image
                      src={mockStore.profileImage}
                      alt={mockStore.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{mockStore.name}</h1>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                      <span>{mockStore.rating}</span>
                      <span className="mx-1">·</span>
                      <span>{mockStore.reviewCount} reviews</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm">{mockStore.bio}</p>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p>{mockStore.address.address_line1}</p>
                    <p>
                      {mockStore.address.city}, {mockStore.address.region}
                    </p>
                    {mockStore.address.digital_address && (
                      <p className="text-muted-foreground">
                        Digital Address: {mockStore.address.digital_address}
                      </p>
                    )}
                  </div>
                </div>

                <button className="w-full bg-primary text-primary-foreground rounded-lg px-4 py-2 font-medium hover:bg-primary/90 transition-colors">
                  Contact Store
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
