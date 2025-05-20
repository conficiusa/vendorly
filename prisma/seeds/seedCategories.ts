import { CategoryType } from "../generated/prisma-client";
import { prisma } from "../prisma-client";

const productCategories = [
  { name: "Clothing & Apparel", slug: "clothing-apparel", type: CategoryType.PRODUCT},
  { name: "Electronics", slug: "electronics", type: CategoryType.PRODUCT},
  { name: "Home & Kitchen", slug: "home-kitchen", type: CategoryType.PRODUCT},
  {
    name: "Beauty & Personal Care",
    slug: "beauty-personal-care",
    type: CategoryType.PRODUCT
  },
  { name: "Sports & Outdoors", slug: "sports-outdoors", type: CategoryType.PRODUCT},
  { name: "Toys & Games", slug: "toys-games", type: CategoryType.PRODUCT},
  { name: "Automotive", slug: "automotive", type: CategoryType.PRODUCT},
  { name: "Books", slug: "books", type: CategoryType.PRODUCT},
  { name: "Health & Wellness", slug: "health-wellness", type: CategoryType.PRODUCT},
  {
    name: "Jewelry & Accessories",
    slug: "jewelry-accessories",
    type: CategoryType.PRODUCT
  },
  { name: "Office Supplies", slug: "office-supplies", type: CategoryType.PRODUCT},
  { name: "Pet Supplies", slug: "pet-supplies", type: CategoryType.PRODUCT},
  { name: "Garden & Outdoor", slug: "garden-outdoor", type: CategoryType.PRODUCT},
  { name: "Footwear", slug: "footwear", type: CategoryType.PRODUCT},
  { name: "Baby Products", slug: "baby-products", type: CategoryType.PRODUCT},
];

const serviceCategories = [
  { name: "Beauty & Grooming", slug: "beauty-grooming", type: CategoryType.SERVICE },
  { name: "Home Services", slug: "home-services", type: CategoryType.SERVICE },
  {
    name: "Professional Services",
    slug: "professional-services",
    type: CategoryType.SERVICE,
  },
  { name: "Education & Tutoring", slug: "education-tutoring", type: CategoryType.SERVICE },
  {
    name: "Health & Wellness",
    slug: "health-wellness-services",
    type: CategoryType.SERVICE,
  },
  { name: "Automotive Services", slug: "automotive-services", type: CategoryType.SERVICE },
  { name: "Event Services", slug: "event-services", type: CategoryType.SERVICE },
  { name: "Cleaning Services", slug: "cleaning-services", type: CategoryType.SERVICE },
  { name: "Tech Support", slug: "tech-support", type: CategoryType.SERVICE },
  { name: "Moving & Storage", slug: "moving-storage", type: CategoryType.SERVICE },
  { name: "Legal Services", slug: "legal-services", type: CategoryType.SERVICE },
  { name: "Financial Services", slug: "financial-services", type: CategoryType.SERVICE },
  {
    name: "Photography & Videography",
    slug: "photography-videography",
    type: CategoryType.SERVICE,
  },
  { name: "Fitness & Training", slug: "fitness-training", type: CategoryType.SERVICE },
  { name: "Pet Services", slug: "pet-services", type: CategoryType.SERVICE },
  { name: "Repair & Maintenance", slug: "repair-maintenance", type: CategoryType.SERVICE },
  { name: "Consulting", slug: "consulting", type: CategoryType.SERVICE },
  { name: "Transportation", slug: "transportation", type: CategoryType.SERVICE },
  { name: "Security Services", slug: "security-services", type: CategoryType.SERVICE },
  { name: "Digital Services", slug: "digital-services", type: CategoryType.SERVICE },
];

async function main() {
  console.log("🌱 Starting to seed categories...");

  // Seed product categories
  console.log("📦 Seeding product categories...");
  for (const category of productCategories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { type: category.type },
      create: {
        name: category.name,
        slug: category.slug,
        type: category.type,
      },
    });
  }

  // Seed service categories
  console.log("🔧 Seeding service categories...");
  for (const category of serviceCategories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { type: category.type },
      create: {
        name: category.name,
        slug: category.slug,
        type: category.type,
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
