import { DiscountType } from "../generated/prisma-client";
import { prisma } from "../prisma-client";
import { QueueJob } from "../../app/api/utils/job";
import { QUEUE_URLS } from "../../app/api/utils/constants";

// Helper function to create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// Real-world products data
const productSeeds = [
  // Electronics - TechHub Electronics
  {
    name: "iPhone 15 Pro Max",
    description:
      "The most advanced iPhone ever with titanium design, A17 Pro chip, and advanced camera system",
    price: 1199.99,
    stock: 25,
    rating: 4.8,
    images: [
      "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "smartphones",
    storeSlug: "techhub-electronics",
    variants: [
      {
        attributes: { Storage: "128GB", Color: "Natural Titanium" },
        stock: 10,
      },
      { attributes: { Storage: "256GB", Color: "Natural Titanium" }, stock: 8 },
      { attributes: { Storage: "512GB", Color: "Blue Titanium" }, stock: 7 },
    ],
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description:
      "Premium Android flagship with S Pen, advanced AI features, and exceptional camera capabilities",
    price: 0.01,
    stock: 20,
    rating: 4.7,
    images: [
      "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "smartphones",
    storeSlug: "techhub-electronics",
    variants: [
      { attributes: { Storage: "256GB", Color: "Titanium Black" }, stock: 12 },
      { attributes: { Storage: "512GB", Color: "Titanium Violet" }, stock: 8 },
    ],
  },
  {
    name: "MacBook Pro 16-inch M3",
    description:
      "Powerful laptop with M3 chip, stunning Liquid Retina XDR display, and all-day battery life",
    price: 0.02,
    stock: 15,
    rating: 4.9,
    images: [
      "https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "laptops",
    storeSlug: "techhub-electronics",
    variants: [
      {
        attributes: { RAM: "16GB", Storage: "512GB", Color: "Space Gray" },
        stock: 8,
      },
      {
        attributes: { RAM: "32GB", Storage: "1TB", Color: "Silver" },
        stock: 7,
      },
    ],
  },
  {
    name: "Dell XPS 13 Plus",
    description:
      "Ultra-portable Windows laptop with InfinityEdge display and premium build quality",
    price: 0.03,
    stock: 18,
    rating: 4.5,
    images: [
      "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "ultrabooks",
    storeSlug: "techhub-electronics",
  },
  {
    name: "iPad Pro 12.9-inch",
    description:
      "Professional tablet with M2 chip, Liquid Retina XDR display, and Apple Pencil support",
    price: 0.04,
    stock: 22,
    rating: 4.6,
    images: [
      "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1334598/pexels-photo-1334598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "ipad",
    storeSlug: "techhub-electronics",
    variants: [
      { attributes: { Storage: "128GB", Color: "Space Gray" }, stock: 12 },
      { attributes: { Storage: "256GB", Color: "Silver" }, stock: 10 },
    ],
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description:
      "Industry-leading noise canceling wireless headphones with premium sound quality",
    price: 0.05,
    stock: 30,
    rating: 4.8,
    images: [
      "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "electronics",
    storeSlug: "techhub-electronics",
    variants: [
      { attributes: { Color: "Black" }, stock: 15 },
      { attributes: { Color: "Silver" }, stock: 15 },
    ],
  },

  // Fashion - Fashion Forward
  {
    name: "Levi's 501 Original Jeans",
    description:
      "The original straight fit jeans with button fly, crafted from premium denim",
    price: 0.06,
    discount: 15,
    discountType: DiscountType.PERCENTAGE,
    stock: 50,
    rating: 4.4,
    images: [
      "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "mens-clothing",
    storeSlug: "fashion-forward",
    variants: [
      { attributes: { Size: "30", Color: "Blue" }, stock: 10 },
      { attributes: { Size: "32", Color: "Blue" }, stock: 15 },
      { attributes: { Size: "34", Color: "Black" }, stock: 12 },
      { attributes: { Size: "36", Color: "Black" }, stock: 13 },
    ],
  },
  {
    name: "Nike Air Force 1 Low",
    description:
      "Classic basketball shoe with leather upper and Air cushioning for comfort and style",
    price: 0.07,
    stock: 40,
    rating: 4.6,
    images: [
      "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/2529149/pexels-photo-2529149.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "mens-clothing",
    storeSlug: "fashion-forward",
    variants: [
      { attributes: { Size: "8", Color: "White" }, stock: 8 },
      { attributes: { Size: "9", Color: "White" }, stock: 10 },
      { attributes: { Size: "10", Color: "Black" }, stock: 12 },
      { attributes: { Size: "11", Color: "Black" }, stock: 10 },
    ],
  },
  {
    name: "Zara Midi Dress",
    description:
      "Elegant midi dress with flowing silhouette, perfect for casual and formal occasions",
    price: 0.02,
    stock: 35,
    rating: 4.3,
    images: [
      "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1536620/pexels-photo-1536620.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "dresses",
    storeSlug: "fashion-forward",
    variants: [
      { attributes: { Size: "S", Color: "Navy" }, stock: 8 },
      { attributes: { Size: "M", Color: "Navy" }, stock: 12 },
      { attributes: { Size: "L", Color: "Black" }, stock: 10 },
      { attributes: { Size: "XL", Color: "Black" }, stock: 5 },
    ],
  },
  {
    name: "Adidas Ultraboost 23",
    description:
      "High-performance running shoes with Boost midsole and Primeknit upper",
    price: 0.01,
    stock: 28,
    rating: 4.7,
    images: [
      "https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "mens-clothing",
    storeSlug: "fashion-forward",
    variants: [
      { attributes: { Size: "8.5", Color: "Core Black" }, stock: 7 },
      { attributes: { Size: "9.5", Color: "Cloud White" }, stock: 10 },
      { attributes: { Size: "10.5", Color: "Core Black" }, stock: 11 },
    ],
  },
  {
    name: "H&M Cotton T-Shirt",
    description: "Comfortable cotton t-shirt with crew neck and regular fit",
    price: 0.02,
    stock: 100,
    rating: 4.1,
    images: [
      "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1598506/pexels-photo-1598506.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "t-shirts",
    storeSlug: "fashion-forward",
    variants: [
      { attributes: { Size: "S", Color: "White" }, stock: 20 },
      { attributes: { Size: "M", Color: "White" }, stock: 25 },
      { attributes: { Size: "L", Color: "Black" }, stock: 30 },
      { attributes: { Size: "XL", Color: "Black" }, stock: 25 },
    ],
  },

  // Beauty & Personal Care - Beauty Bliss
  {
    name: "The Ordinary Niacinamide 10% + Zinc 1%",
    description:
      "High-strength vitamin and mineral blemish formula for clearer skin",
    price: 0.03,
    stock: 75,
    rating: 4.5,
    images: [
      "https://images.pexels.com/photos/3685235/pexels-photo-3685235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/3685236/pexels-photo-3685236.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "skin-care",
    storeSlug: "beauty-bliss",
    variants: [{ attributes: { Volume: "30ml" }, stock: 75 }],
  },
  {
    name: "CeraVe Foaming Facial Cleanser",
    description:
      "Gentle foaming cleanser with ceramides and hyaluronic acid for normal to oily skin",
    price: 0.04,
    stock: 60,
    rating: 4.6,
    images: [
      "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/3762880/pexels-photo-3762880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "skin-care",
    storeSlug: "beauty-bliss",
  },
  {
    name: "Fenty Beauty Gloss Bomb",
    description:
      "Universal lip luminizer with explosive shine and plumping formula",
    price: 21.0,
    stock: 45,
    rating: 4.7,
    images: [
      "https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/2113856/pexels-photo-2113856.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "makeup",
    storeSlug: "beauty-bliss",
    variants: [
      { attributes: { Color: "Fenty Glow" }, stock: 15 },
      { attributes: { Color: "Fu$$y" }, stock: 15 },
      { attributes: { Color: "Sweet Mouth" }, stock: 15 },
    ],
  },
  {
    name: "Maybelline Fit Me Foundation",
    description:
      "Matte and poreless foundation that matches skin tone and texture",
    price: 8.99,
    stock: 80,
    rating: 4.3,
    images: [
      "https://images.pexels.com/photos/3685234/pexels-photo-3685234.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/3685237/pexels-photo-3685237.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "makeup",
    storeSlug: "beauty-bliss",
    variants: [
      { attributes: { Shade: "110 Porcelain" }, stock: 15 },
      { attributes: { Shade: "120 Classic Ivory" }, stock: 20 },
      { attributes: { Shade: "220 Natural Beige" }, stock: 25 },
      { attributes: { Shade: "310 Sun Beige" }, stock: 20 },
    ],
  },
  {
    name: "Neutrogena Hydrating Hyaluronic Acid Serum",
    description:
      "Intensive hydrating serum with pure hyaluronic acid for plump, smooth skin",
    price: 19.99,
    stock: 50,
    rating: 4.4,
    images: [
      "https://images.pexels.com/photos/3762877/pexels-photo-3762877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/3762878/pexels-photo-3762878.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "skin-care",
    storeSlug: "beauty-bliss",
  },

  // Home & Kitchen - Home Comfort
  {
    name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    description:
      "Multi-functional cooker: pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker",
    price: 99.95,
    discount: 20,
    discountType: DiscountType.PERCENTAGE,
    stock: 30,
    rating: 4.8,
    images: [
      "https://images.pexels.com/photos/4226769/pexels-photo-4226769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/4226770/pexels-photo-4226770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "kitchen-appliances",
    storeSlug: "home-comfort",
    variants: [
      { attributes: { Capacity: "6 Quart" }, stock: 20 },
      { attributes: { Capacity: "8 Quart" }, stock: 10 },
    ],
  },
  {
    name: "Vitamix 5200 Blender",
    description:
      "Professional-grade blender with variable speed control and aircraft-grade stainless steel blades",
    price: 399.95,
    stock: 15,
    rating: 4.9,
    images: [
      "https://images.pexels.com/photos/4226771/pexels-photo-4226771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/4226772/pexels-photo-4226772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "blenders",
    storeSlug: "home-comfort",
    variants: [
      { attributes: { Color: "Black" }, stock: 8 },
      { attributes: { Color: "Red" }, stock: 7 },
    ],
  },
  {
    name: "All-Clad D3 Stainless Steel Cookware Set",
    description:
      "Professional-quality 10-piece cookware set with tri-ply construction",
    price: 599.99,
    stock: 12,
    rating: 4.7,
    images: [
      "https://images.pexels.com/photos/4226473/pexels-photo-4226473.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/4226474/pexels-photo-4226474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "pots-pans",
    storeSlug: "home-comfort",
  },
  {
    name: "KitchenAid Stand Mixer",
    description:
      "Iconic stand mixer with 10-speed solid state control and tilt-head design",
    price: 449.99,
    stock: 18,
    rating: 4.8,
    images: [
      "https://images.pexels.com/photos/4226775/pexels-photo-4226775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/4226776/pexels-photo-4226776.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "kitchen-appliances",
    storeSlug: "home-comfort",
    variants: [
      { attributes: { Color: "Empire Red" }, stock: 6 },
      { attributes: { Color: "Onyx Black" }, stock: 6 },
      { attributes: { Color: "Silver" }, stock: 6 },
    ],
  },
  {
    name: "Breville Smart Oven Pro",
    description:
      "Countertop convection oven with 10 cooking functions and smart features",
    price: 299.95,
    stock: 20,
    rating: 4.6,
    images: [
      "https://images.pexels.com/photos/4226777/pexels-photo-4226777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/4226778/pexels-photo-4226778.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "kitchen-appliances",
    storeSlug: "home-comfort",
  },

  // Sports & Outdoors - Active Sports
  {
    name: "Peloton Bike+",
    description:
      "Interactive exercise bike with rotating HD touchscreen and live/on-demand classes",
    price: 2495.0,
    stock: 8,
    rating: 4.6,
    images: [
      "https://images.pexels.com/photos/4944311/pexels-photo-4944311.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/4944312/pexels-photo-4944312.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "fitness-equipment",
    storeSlug: "active-sports",
  },
  {
    name: "NordicTrack Commercial 1750 Treadmill",
    description:
      "Premium treadmill with iFit interactive training and commercial-grade motor",
    price: 1999.0,
    discount: 15,
    discountType: DiscountType.PERCENTAGE,
    stock: 10,
    rating: 4.5,
    images: [
      "https://images.pexels.com/photos/4944313/pexels-photo-4944313.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/4944314/pexels-photo-4944314.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "treadmills",
    storeSlug: "active-sports",
  },
  {
    name: "Specialized Rockhopper Mountain Bike",
    description:
      "Versatile mountain bike with lightweight aluminum frame and reliable components",
    price: 650.0,
    stock: 15,
    rating: 4.4,
    images: [
      "https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/100583/pexels-photo-100583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "mountain-bikes",
    storeSlug: "active-sports",
    variants: [
      { attributes: { Size: "Small", Color: "Red" }, stock: 5 },
      { attributes: { Size: "Medium", Color: "Blue" }, stock: 5 },
      { attributes: { Size: "Large", Color: "Black" }, stock: 5 },
    ],
  },
  {
    name: "Bowflex Adjustable Dumbbells",
    description:
      "Space-saving adjustable dumbbells that replace 15 sets of weights",
    price: 349.99,
    stock: 25,
    rating: 4.7,
    images: [
      "https://images.pexels.com/photos/4944315/pexels-photo-4944315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/4944316/pexels-photo-4944316.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "fitness-equipment",
    storeSlug: "active-sports",
    variants: [
      { attributes: { "Weight Range": "5-50 lbs" }, stock: 15 },
      { attributes: { "Weight Range": "10-90 lbs" }, stock: 10 },
    ],
  },
  {
    name: "Yoga Mat Premium",
    description:
      "Non-slip yoga mat with superior cushioning and alignment lines",
    price: 79.99,
    stock: 40,
    rating: 4.3,
    images: [
      "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/4056724/pexels-photo-4056724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "fitness-equipment",
    storeSlug: "active-sports",
    variants: [
      { attributes: { Color: "Purple" }, stock: 10 },
      { attributes: { Color: "Blue" }, stock: 15 },
      { attributes: { Color: "Pink" }, stock: 15 },
    ],
  },

  // Books & Media
  {
    name: "Atomic Habits by James Clear",
    description:
      "An Easy & Proven Way to Build Good Habits & Break Bad Ones - #1 New York Times Bestseller",
    price: 16.99,
    stock: 60,
    rating: 4.8,
    images: [
      "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/159710/library-la-trobe-study-students-159710.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "non-fiction-books",
    storeSlug: "techhub-electronics",
  },
  {
    name: "The Seven Husbands of Evelyn Hugo",
    description:
      "A captivating novel about a reclusive Hollywood icon and her life story",
    price: 14.99,
    stock: 45,
    rating: 4.7,
    images: [
      "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/159710/library-la-trobe-study-students-159710.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "fiction-books",
    storeSlug: "techhub-electronics",
  },

  // Toys & Games
  {
    name: "LEGO Creator Expert Big Ben",
    description:
      "Detailed LEGO model of the iconic London landmark with authentic architectural details",
    price: 249.99,
    stock: 12,
    rating: 4.9,
    images: [
      "https://images.pexels.com/photos/1422218/pexels-photo-1422218.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1422219/pexels-photo-1422219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "lego-sets",
    storeSlug: "techhub-electronics",
  },
  {
    name: "Nintendo Switch OLED Console",
    description: "Gaming console with vibrant OLED screen and enhanced audio",
    price: 349.99,
    stock: 25,
    rating: 4.8,
    images: [
      "https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1174747/pexels-photo-1174747.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "toys-games",
    storeSlug: "techhub-electronics",
    variants: [
      { attributes: { Color: "White" }, stock: 15 },
      { attributes: { Color: "Neon Red/Blue" }, stock: 10 },
    ],
  },

  // Health & Wellness
  {
    name: "Optimum Nutrition Gold Standard Whey Protein",
    description: "Premium whey protein powder with 24g protein per serving",
    price: 59.99,
    stock: 35,
    rating: 4.6,
    images: [
      "https://images.pexels.com/photos/4944317/pexels-photo-4944317.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/4944318/pexels-photo-4944318.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "supplements",
    storeSlug: "beauty-bliss",
    variants: [
      { attributes: { Flavor: "Double Rich Chocolate" }, stock: 12 },
      { attributes: { Flavor: "Vanilla Ice Cream" }, stock: 12 },
      { attributes: { Flavor: "Strawberry" }, stock: 11 },
    ],
  },
  {
    name: "Multivitamin Gummies for Adults",
    description:
      "Complete daily multivitamin with essential vitamins and minerals",
    price: 24.99,
    stock: 50,
    rating: 4.4,
    images: [
      "https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/3683108/pexels-photo-3683108.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "vitamins",
    storeSlug: "beauty-bliss",
  },

  // Pet Supplies
  {
    name: "Blue Buffalo Life Protection Formula Dog Food",
    description:
      "Natural dog food with real chicken, whole grains, and garden vegetables",
    price: 54.99,
    stock: 30,
    rating: 4.5,
    images: [
      "https://images.pexels.com/photos/1350549/pexels-photo-1350549.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1350550/pexels-photo-1350550.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "dog-food",
    storeSlug: "home-comfort",
    variants: [
      { attributes: { Size: "Small Breed", Flavor: "Chicken" }, stock: 10 },
      { attributes: { Size: "Large Breed", Flavor: "Chicken" }, stock: 20 },
    ],
  },
  {
    name: "Cat Scratching Post Tower",
    description:
      "Multi-level cat tree with scratching posts, hiding spots, and dangling toys",
    price: 89.99,
    stock: 15,
    rating: 4.3,
    images: [
      "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1170987/pexels-photo-1170987.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "pet-supplies",
    storeSlug: "home-comfort",
  },

  // Garden & Outdoor
  {
    name: "Weber Original Kettle Charcoal Grill",
    description:
      "Classic charcoal kettle grill with porcelain-enameled bowl and lid",
    price: 169.0,
    stock: 20,
    rating: 4.7,
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "grills",
    storeSlug: "home-comfort",
    variants: [
      { attributes: { Size: "22-inch", Color: "Black" }, stock: 12 },
      { attributes: { Size: "26-inch", Color: "Black" }, stock: 8 },
    ],
  },
  {
    name: "Outdoor Patio Furniture Set",
    description: "4-piece weather-resistant patio furniture set with cushions",
    price: 599.99,
    stock: 10,
    rating: 4.4,
    images: [
      "https://images.pexels.com/photos/1571462/pexels-photo-1571462.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "outdoor-furniture",
    storeSlug: "home-comfort",
  },

  // Office Supplies
  {
    name: "Pilot G2 Gel Pens Pack",
    description:
      "Smooth writing gel pens with comfortable grip and vibrant ink",
    price: 12.99,
    stock: 80,
    rating: 4.6,
    images: [
      "https://images.pexels.com/photos/159791/pens-crayons-notebook-school-159791.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/159792/pencils-notebook-paper-159792.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "pens",
    storeSlug: "techhub-electronics",
    variants: [
      { attributes: { "Pack Size": "12", Color: "Blue" }, stock: 40 },
      { attributes: { "Pack Size": "12", Color: "Black" }, stock: 40 },
    ],
  },
  {
    name: "Moleskine Classic Notebook",
    description:
      "Premium hardcover notebook with dotted pages and elastic closure",
    price: 21.95,
    stock: 45,
    rating: 4.7,
    images: [
      "https://images.pexels.com/photos/159791/pens-crayons-notebook-school-159791.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/159792/pencils-notebook-paper-159792.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "office-supplies",
    storeSlug: "techhub-electronics",
    variants: [
      { attributes: { Color: "Black", Size: "Large" }, stock: 15 },
      { attributes: { Color: "Red", Size: "Large" }, stock: 15 },
      { attributes: { Color: "Black", Size: "Pocket" }, stock: 15 },
    ],
  },

  // Automotive
  {
    name: "WeatherTech All-Weather Car Mats",
    description:
      "Custom-fit floor mats that provide complete protection for your vehicle",
    price: 129.99,
    stock: 25,
    rating: 4.8,
    images: [
      "https://images.pexels.com/photos/3752169/pexels-photo-3752169.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/3752170/pexels-photo-3752170.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "car-accessories",
    storeSlug: "techhub-electronics",
    variants: [
      { attributes: { Compatibility: "Toyota Camry" }, stock: 8 },
      { attributes: { Compatibility: "Honda Accord" }, stock: 9 },
      { attributes: { Compatibility: "Universal" }, stock: 8 },
    ],
  },
  {
    name: "Car Phone Mount Dashboard",
    description: "Adjustable dashboard phone mount with 360-degree rotation",
    price: 24.99,
    stock: 60,
    rating: 4.4,
    images: [
      "https://images.pexels.com/photos/3752171/pexels-photo-3752171.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/3752172/pexels-photo-3752172.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "car-accessories",
    storeSlug: "techhub-electronics",
  },
  // Additional products to reach 50+
  {
    name: "AirPods Pro 2nd Gen",
    description:
      "Apple's premium wireless earbuds with active noise cancellation and spatial audio",
    price: 249.99,
    stock: 40,
    rating: 4.7,
    images: [
      "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "electronics",
    storeSlug: "techhub-electronics",
  },
  {
    name: "Stanley Adventure Quencher Travel Tumbler",
    description:
      "Insulated stainless steel tumbler that keeps drinks cold for 11+ hours and hot for 7+ hours",
    price: 44.95,
    stock: 65,
    rating: 4.5,
    images: [
      "https://images.pexels.com/photos/1337474/pexels-photo-1337474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1337475/pexels-photo-1337475.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "home-kitchen",
    storeSlug: "home-comfort",
    variants: [
      { attributes: { Size: "30oz", Color: "Charcoal" }, stock: 20 },
      { attributes: { Size: "40oz", Color: "Rose Quartz" }, stock: 25 },
      { attributes: { Size: "40oz", Color: "Cream" }, stock: 20 },
    ],
  },
  {
    name: "Dyson V15 Detect Cordless Vacuum",
    description:
      "Advanced cordless vacuum with laser dust detection and powerful suction",
    price: 749.99,
    stock: 12,
    rating: 4.8,
    images: [
      "https://images.pexels.com/photos/4099468/pexels-photo-4099468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/4099469/pexels-photo-4099469.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "kitchen-appliances",
    storeSlug: "home-comfort",
  },
  {
    name: "Patagonia Better Sweater Fleece Jacket",
    description:
      "Classic fleece jacket made from recycled polyester with a timeless design",
    price: 99.0,
    stock: 30,
    rating: 4.6,
    images: [
      "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1124466/pexels-photo-1124466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "mens-clothing",
    storeSlug: "fashion-forward",
    variants: [
      { attributes: { Size: "S", Color: "Navy" }, stock: 8 },
      { attributes: { Size: "M", Color: "Navy" }, stock: 10 },
      { attributes: { Size: "L", Color: "Black" }, stock: 12 },
    ],
  },
  {
    name: "Hydro Flask Water Bottle",
    description:
      "Insulated stainless steel water bottle that keeps drinks cold for 24 hours",
    price: 44.95,
    stock: 55,
    rating: 4.7,
    images: [
      "https://images.pexels.com/photos/1337474/pexels-photo-1337474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1337475/pexels-photo-1337475.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "home-kitchen",
    storeSlug: "home-comfort",
    variants: [
      { attributes: { Size: "32oz", Color: "Pacific" }, stock: 18 },
      { attributes: { Size: "40oz", Color: "Black" }, stock: 20 },
      { attributes: { Size: "24oz", Color: "White" }, stock: 17 },
    ],
  },
  {
    name: "Crocs Classic Clogs",
    description:
      "Comfortable foam clogs with ventilation holes and pivoting heel straps",
    price: 49.99,
    stock: 70,
    rating: 4.4,
    images: [
      "https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1240893/pexels-photo-1240893.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "mens-clothing",
    storeSlug: "fashion-forward",
    variants: [
      { attributes: { Size: "8", Color: "Black" }, stock: 15 },
      { attributes: { Size: "9", Color: "Navy" }, stock: 20 },
      { attributes: { Size: "10", Color: "White" }, stock: 18 },
      { attributes: { Size: "11", Color: "Olive" }, stock: 17 },
    ],
  },
  {
    name: "Fitbit Charge 5 Fitness Tracker",
    description:
      "Advanced fitness tracker with built-in GPS, heart rate monitoring, and 6+ day battery",
    price: 179.95,
    stock: 35,
    rating: 4.3,
    images: [
      "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/437038/pexels-photo-437038.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "fitness-equipment",
    storeSlug: "active-sports",
    variants: [
      { attributes: { Color: "Black" }, stock: 15 },
      { attributes: { Color: "Lunar White" }, stock: 20 },
    ],
  },
  {
    name: "Ray-Ban Aviator Classic Sunglasses",
    description:
      "Iconic aviator sunglasses with crystal lenses and lightweight metal frame",
    price: 154.0,
    stock: 25,
    rating: 4.8,
    images: [
      "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/701878/pexels-photo-701878.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "mens-clothing",
    storeSlug: "fashion-forward",
    variants: [
      { attributes: { Lens: "Green Classic G-15" }, stock: 12 },
      { attributes: { Lens: "Brown Classic B-15" }, stock: 13 },
    ],
  },
  {
    name: "Yeti Rambler Tumbler",
    description: "Double-wall vacuum insulated tumbler with MagSlider lid",
    price: 34.95,
    stock: 45,
    rating: 4.7,
    images: [
      "https://images.pexels.com/photos/1337474/pexels-photo-1337474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1337475/pexels-photo-1337475.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "home-kitchen",
    storeSlug: "home-comfort",
    variants: [
      { attributes: { Size: "20oz", Color: "Navy" }, stock: 15 },
      { attributes: { Size: "30oz", Color: "Charcoal" }, stock: 15 },
      { attributes: { Size: "20oz", Color: "White" }, stock: 15 },
    ],
  },
  {
    name: "Kindle Paperwhite E-reader",
    description:
      "Waterproof e-reader with 6.8 inch display and adjustable warm light",
    price: 139.99,
    stock: 40,
    rating: 4.6,
    images: [
      "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/159710/library-la-trobe-study-students-159710.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "electronics",
    storeSlug: "techhub-electronics",
    variants: [
      { attributes: { Storage: "8GB", Color: "Black" }, stock: 20 },
      { attributes: { Storage: "32GB", Color: "Sage" }, stock: 20 },
    ],
  },
  {
    name: "Beats Studio Buds Wireless Earbuds",
    description:
      "True wireless earbuds with active noise cancelling and transparency mode",
    price: 149.95,
    stock: 50,
    rating: 4.4,
    images: [
      "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "electronics",
    storeSlug: "techhub-electronics",
    variants: [
      { attributes: { Color: "Red" }, stock: 15 },
      { attributes: { Color: "White" }, stock: 20 },
      { attributes: { Color: "Black" }, stock: 15 },
    ],
  },
  {
    name: "Ninja Foodi Personal Blender",
    description:
      "Compact personal blender perfect for smoothies and protein shakes",
    price: 79.99,
    stock: 35,
    rating: 4.5,
    images: [
      "https://images.pexels.com/photos/4226771/pexels-photo-4226771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/4226772/pexels-photo-4226772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "blenders",
    storeSlug: "home-comfort",
  },
  {
    name: "Lululemon Align High-Rise Pant",
    description:
      "Buttery-soft leggings with four-way stretch and sweat-wicking fabric",
    price: 128.0,
    stock: 45,
    rating: 4.7,
    images: [
      "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1536620/pexels-photo-1536620.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "womens-clothing",
    storeSlug: "fashion-forward",
    variants: [
      { attributes: { Size: "XS", Color: "Black" }, stock: 10 },
      { attributes: { Size: "S", Color: "Black" }, stock: 12 },
      { attributes: { Size: "M", Color: "Navy" }, stock: 13 },
      { attributes: { Size: "L", Color: "Navy" }, stock: 10 },
    ],
  },
  {
    name: "Apple Watch Series 9",
    description:
      "Advanced smartwatch with fitness tracking, health monitoring, and cellular connectivity",
    price: 429.0,
    stock: 30,
    rating: 4.8,
    images: [
      "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/437038/pexels-photo-437038.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "electronics",
    storeSlug: "techhub-electronics",
    variants: [
      { attributes: { Size: "41mm", Color: "Pink" }, stock: 10 },
      { attributes: { Size: "45mm", Color: "Midnight" }, stock: 20 },
    ],
  },
  {
    name: "Allbirds Tree Runners",
    description: "Sustainable running shoes made from eucalyptus tree fiber",
    price: 98.0,
    stock: 40,
    rating: 4.3,
    images: [
      "https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "mens-clothing",
    storeSlug: "fashion-forward",
    variants: [
      { attributes: { Size: "8", Color: "White" }, stock: 10 },
      { attributes: { Size: "9", Color: "Grey" }, stock: 15 },
      { attributes: { Size: "10", Color: "Navy" }, stock: 15 },
    ],
  },
  {
    name: "Olaplex No.3 Hair Perfector",
    description:
      "At-home hair treatment that repairs and strengthens damaged hair",
    price: 28.0,
    stock: 60,
    rating: 4.6,
    images: [
      "https://images.pexels.com/photos/3685235/pexels-photo-3685235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/3685236/pexels-photo-3685236.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "skin-care",
    storeSlug: "beauty-bliss",
  },
  {
    name: "Glossier Cloud Paint Blush",
    description: "Gel-cream blush that blends seamlessly for a natural flush",
    price: 20.0,
    stock: 55,
    rating: 4.5,
    images: [
      "https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/2113856/pexels-photo-2113856.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "makeup",
    storeSlug: "beauty-bliss",
    variants: [
      { attributes: { Color: "Puff" }, stock: 15 },
      { attributes: { Color: "Beam" }, stock: 20 },
      { attributes: { Color: "Dawn" }, stock: 20 },
    ],
  },
  {
    name: "Tesla Model S Plaid",
    description:
      "High-performance electric vehicle with ludicrous acceleration",
    price: 135000.0,
    stock: 2,
    rating: 4.9,
    images: [
      "https://images.pexels.com/photos/3752169/pexels-photo-3752169.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/3752170/pexels-photo-3752170.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    categorySlug: "automotive",
    storeSlug: "techhub-electronics",
    variants: [
      { attributes: { Color: "Pearl White" }, stock: 1 },
      { attributes: { Color: "Solid Black" }, stock: 1 },
    ],
  },
];

async function main() {
  console.log("🌱 Starting to seed products...");

  // First, get all categories and stores
  const categories = await prisma.category.findMany();
  const stores = await prisma.store.findMany();

  const categoryMap = new Map(categories.map((cat) => [cat.slug, cat.id]));
  const storeMap = new Map(stores.map((store) => [store.slug, store.id]));

  let successCount = 0;
  let errorCount = 0;

  for (const productSeed of productSeeds) {
    try {
      const categoryId = categoryMap.get(productSeed.categorySlug);
      const storeId = storeMap.get(productSeed.storeSlug);

      if (!categoryId) {
        console.warn(
          `⚠️ Category not found: ${productSeed.categorySlug} for product: ${productSeed.name}`
        );
        errorCount++;
        continue;
      }

      if (!storeId) {
        console.warn(
          `⚠️ Store not found: ${productSeed.storeSlug} for product: ${productSeed.name}`
        );
        errorCount++;
        continue;
      }

      const slug = createSlug(productSeed.name);

      // Create the product
      const product = await prisma.product.create({
        data: {
          name: productSeed.name,
          slug,
          description: productSeed.description,
          price: productSeed.price,
          discount: (productSeed as any).discount || null,
          discountType: (productSeed as any).discountType || null,
          stock: productSeed.stock,
          rating: productSeed.rating || null,
          images: productSeed.images,
          storeId,
          categoryId,
        },
        include: {
          Category: true,
          store: true,
        },
      });

      // Create variant options if they exist
      if (
        (productSeed as any).variants &&
        (productSeed as any).variants.length > 0
      ) {
        for (const variant of (productSeed as any).variants) {
          await prisma.productVariantOption.create({
            data: {
              productId: product.id,
              attributes: variant.attributes,
              stock: variant.stock,
            },
          });
        }
      }

      // Queue the product for Recombee (only if not in development)
      try {
        await QueueJob(QUEUE_URLS.RECOMBEE, {
          type: "addProduct",
          product,
        });
      } catch (queueError) {
        console.warn(
          `⚠️ Failed to queue product ${productSeed.name} for Recombee:`,
          queueError
        );
        // Continue processing even if queue fails
      }

      console.log(
        `✅ Created product: ${productSeed.name} (${successCount + 1}/${productSeeds.length})`
      );
      successCount++;

      // Add a small delay to avoid overwhelming the system
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`❌ Error creating product ${productSeed.name}:`, error);
      errorCount++;
    }
  }

  console.log(`\n🎉 Products seeding completed!`);
  console.log(`✅ Successfully created: ${successCount} products`);
  console.log(`❌ Errors: ${errorCount} products`);
  console.log(
    `📊 Total processed: ${successCount + errorCount}/${productSeeds.length} products`
  );
}

main()
  .catch((e) => {
    console.error("❌ Error seeding products:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
