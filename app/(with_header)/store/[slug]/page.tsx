import * as React from "react";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import StorePageImages from "@/components/store-page-images";
import StorePageTabs from "@/components/store-page-tabs";

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

export default function StorePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <StorePageImages />
            <StorePageTabs />
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
