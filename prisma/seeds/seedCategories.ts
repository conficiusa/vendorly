import { prisma } from "../prisma-client";


const categories = [
  //   // Fashion & Apparel
  //   { name: "Men's Clothing", slug: "mens-clothing" },
  //   { name: "Women's Clothing", slug: "womens-clothing" },
  //   { name: "Kids & Baby", slug: "kids-baby" },
  //   { name: "Footwear", slug: "footwear" },
  //   { name: "Accessories", slug: "accessories" },
  //   { name: "Jewelry", slug: "jewelry" },
  //   { name: "Watches", slug: "watches" },

  //   // Electronics
  //   { name: "Smartphones", slug: "smartphones" },
  //   { name: "Laptops & Computers", slug: "laptops-computers" },
  //   { name: "Audio & Headphones", slug: "audio-headphones" },
  //   { name: "Cameras & Photography", slug: "cameras-photography" },
  //   { name: "Gaming", slug: "gaming" },

  //   // Home & Living
  //   { name: "Furniture", slug: "furniture" },
  //   { name: "Home Decor", slug: "home-decor" },
  //   { name: "Kitchen & Dining", slug: "kitchen-dining" },
  //   { name: "Bedding & Bath", slug: "bedding-bath" },
  //   { name: "Lighting", slug: "lighting" },

  //   // Beauty & Personal Care
  //   { name: "Skincare", slug: "skincare" },
  //   { name: "Makeup", slug: "makeup" },
  //   { name: "Hair Care", slug: "hair-care" },
  //   { name: "Fragrances", slug: "fragrances" },

  //   // Health & Wellness
  //   { name: "Fitness & Exercise", slug: "fitness-exercise" },
  //   { name: "Sports Equipment", slug: "sports-equipment" },
  //   { name: "Yoga & Meditation", slug: "yoga-meditation" },

  //   // Food & Beverages
  //   { name: "Organic Foods", slug: "organic-foods" },
  //   { name: "Beverages", slug: "beverages" },
  //   { name: "Snacks & Confectionery", slug: "snacks-confectionery" },

  //   // Arts & Crafts
  //   { name: "Art Supplies", slug: "art-supplies" },
  //   { name: "Craft Materials", slug: "craft-materials" },
  //   { name: "Stationery", slug: "stationery" },

  //   // Pet Supplies
  //   { name: "Pet Food", slug: "pet-food" },
  //   { name: "Pet Accessories", slug: "pet-accessories" },
  //   { name: "Pet Care", slug: "pet-care" },

  //   // Automotive
  //   { name: "Car Accessories", slug: "car-accessories" },
  //   { name: "Motorcycle Parts", slug: "motorcycle-parts" },
  //   { name: "Auto Care", slug: "auto-care" },

  //   // Books & Media
  //   { name: "Books", slug: "books" },
  //   { name: "Music", slug: "music" },
  //   { name: "Movies & TV Shows", slug: "movies-tv-shows" },

  //   // Toys & Games
  //   { name: "Toys", slug: "toys" },
  //   { name: "Board Games", slug: "board-games" },
  //   { name: "Educational Toys", slug: "educational-toys" },

  //   // Garden & Outdoor
  //   { name: "Plants & Seeds", slug: "plants-seeds" },
  //   { name: "Garden Tools", slug: "garden-tools" },
  //   { name: "Outdoor Living", slug: "outdoor-living" },

  //   // Office & Business
  //   { name: "Office Supplies", slug: "office-supplies" },
  //   { name: "Business Equipment", slug: "business-equipment" },
  //   { name: "Printing & Paper", slug: "printing-paper" },

  { name: "Clothing & Apparel", slug:"clothing-apparel"},
];

async function main() {
  console.log("🌱 Starting to seed categories...");

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        name: category.name,
        slug: category.slug,
      },
    });
  }

  console.log("✅ Categories seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding categories:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
