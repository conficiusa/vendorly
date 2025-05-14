"use client";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

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

const StorePageImages = () => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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
    <>
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
    </>
  );
};

export default StorePageImages;
