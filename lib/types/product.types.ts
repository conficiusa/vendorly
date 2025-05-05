export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    vendor: string;
    rating: number;
    stock: number;
    location: string;
  }
  
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