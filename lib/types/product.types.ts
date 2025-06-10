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

//  available: product.stock > 0,
//       name: product.name,
//       description: product.description,
//       price: product.price,
//       images: product.images,
//       category: product.Category?.name,
//       slug: product.slug,
//       faults: product.faults,
//       rating: product.rating,
//       store: product.store.name,
//       storeId: product.store.id,
//       storeDescription: product.store.bio,
export interface ProductCard {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  store: string;
  slug: string;
  rating: number | null;
}
