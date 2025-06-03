import { Product, ProductVariantOption } from "@/prisma/generated/prisma-client";

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  provider: string;
  rating: number;
  availability: boolean;
  location: string;
}

export interface ProductCard extends Product {
  Category: {
    name: string;
    id: string;
    slug: string;
    rating: number;
    };
    store: {
      name: string;
      id: string;
      slug: string;
      logo: string;
    };
    variantOptions: ProductVariantOption[];
  };

