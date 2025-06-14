import { CategoryType } from "../generated/prisma-client";
import { prisma } from "../prisma-client";

// --- CURATED HIERARCHICAL CATEGORY DATA (≈50 EACH) ---

type CategorySeed = {
  name: string;
  slug: string;
  type: CategoryType;
  parentSlug?: string;
};

const productCategorySeeds: CategorySeed[] = [
  // Electronics
  { name: "Electronics", slug: "electronics", type: CategoryType.PRODUCT },
  {
    name: "Mobile Phones",
    slug: "mobile-phones",
    type: CategoryType.PRODUCT,
    parentSlug: "electronics",
  },
  {
    name: "Smartphones",
    slug: "smartphones",
    type: CategoryType.PRODUCT,
    parentSlug: "mobile-phones",
  },
  {
    name: "Feature Phones",
    slug: "feature-phones",
    type: CategoryType.PRODUCT,
    parentSlug: "mobile-phones",
  },
  {
    name: "Laptops",
    slug: "laptops",
    type: CategoryType.PRODUCT,
    parentSlug: "electronics",
  },
  {
    name: "Ultrabooks",
    slug: "ultrabooks",
    type: CategoryType.PRODUCT,
    parentSlug: "laptops",
  },
  {
    name: "Gaming Laptops",
    slug: "gaming-laptops",
    type: CategoryType.PRODUCT,
    parentSlug: "laptops",
  },
  {
    name: "Tablets",
    slug: "tablets",
    type: CategoryType.PRODUCT,
    parentSlug: "electronics",
  },
  {
    name: "Android Tablets",
    slug: "android-tablets",
    type: CategoryType.PRODUCT,
    parentSlug: "tablets",
  },
  {
    name: "iPad",
    slug: "ipad",
    type: CategoryType.PRODUCT,
    parentSlug: "tablets",
  },

  // Home & Kitchen
  { name: "Home & Kitchen", slug: "home-kitchen", type: CategoryType.PRODUCT },
  {
    name: "Cookware",
    slug: "cookware",
    type: CategoryType.PRODUCT,
    parentSlug: "home-kitchen",
  },
  {
    name: "Pots & Pans",
    slug: "pots-pans",
    type: CategoryType.PRODUCT,
    parentSlug: "cookware",
  },
  {
    name: "Kitchen Appliances",
    slug: "kitchen-appliances",
    type: CategoryType.PRODUCT,
    parentSlug: "home-kitchen",
  },
  {
    name: "Microwaves",
    slug: "microwaves",
    type: CategoryType.PRODUCT,
    parentSlug: "kitchen-appliances",
  },
  {
    name: "Blenders",
    slug: "blenders",
    type: CategoryType.PRODUCT,
    parentSlug: "kitchen-appliances",
  },

  // Clothing & Apparel
  {
    name: "Clothing & Apparel",
    slug: "clothing-apparel",
    type: CategoryType.PRODUCT,
  },
  {
    name: "Men's Clothing",
    slug: "mens-clothing",
    type: CategoryType.PRODUCT,
    parentSlug: "clothing-apparel",
  },
  {
    name: "T-Shirts",
    slug: "t-shirts",
    type: CategoryType.PRODUCT,
    parentSlug: "mens-clothing",
  },
  {
    name: "Women's Clothing",
    slug: "womens-clothing",
    type: CategoryType.PRODUCT,
    parentSlug: "clothing-apparel",
  },
  {
    name: "Dresses",
    slug: "dresses",
    type: CategoryType.PRODUCT,
    parentSlug: "womens-clothing",
  },

  // Beauty & Personal Care
  {
    name: "Beauty & Personal Care",
    slug: "beauty-personal-care",
    type: CategoryType.PRODUCT,
  },
  {
    name: "Skin Care",
    slug: "skin-care",
    type: CategoryType.PRODUCT,
    parentSlug: "beauty-personal-care",
  },
  {
    name: "Face Creams",
    slug: "face-creams",
    type: CategoryType.PRODUCT,
    parentSlug: "skin-care",
  },
  {
    name: "Makeup",
    slug: "makeup",
    type: CategoryType.PRODUCT,
    parentSlug: "beauty-personal-care",
  },
  {
    name: "Lipsticks",
    slug: "lipsticks",
    type: CategoryType.PRODUCT,
    parentSlug: "makeup",
  },

  // Sports & Outdoors
  {
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    type: CategoryType.PRODUCT,
  },
  {
    name: "Fitness Equipment",
    slug: "fitness-equipment",
    type: CategoryType.PRODUCT,
    parentSlug: "sports-outdoors",
  },
  {
    name: "Treadmills",
    slug: "treadmills",
    type: CategoryType.PRODUCT,
    parentSlug: "fitness-equipment",
  },
  {
    name: "Cycling",
    slug: "cycling",
    type: CategoryType.PRODUCT,
    parentSlug: "sports-outdoors",
  },
  {
    name: "Mountain Bikes",
    slug: "mountain-bikes",
    type: CategoryType.PRODUCT,
    parentSlug: "cycling",
  },

  // Automotive
  { name: "Automotive", slug: "automotive", type: CategoryType.PRODUCT },
  {
    name: "Car Accessories",
    slug: "car-accessories",
    type: CategoryType.PRODUCT,
    parentSlug: "automotive",
  },
  {
    name: "Car Covers",
    slug: "car-covers",
    type: CategoryType.PRODUCT,
    parentSlug: "car-accessories",
  },

  // Books & Media
  { name: "Books & Media", slug: "books-media", type: CategoryType.PRODUCT },
  {
    name: "Fiction",
    slug: "fiction-books",
    type: CategoryType.PRODUCT,
    parentSlug: "books-media",
  },
  {
    name: "Science Fiction",
    slug: "science-fiction",
    type: CategoryType.PRODUCT,
    parentSlug: "fiction-books",
  },
  {
    name: "Non-Fiction",
    slug: "non-fiction-books",
    type: CategoryType.PRODUCT,
    parentSlug: "books-media",
  },
  {
    name: "Biographies",
    slug: "biographies",
    type: CategoryType.PRODUCT,
    parentSlug: "non-fiction-books",
  },

  // Toys & Games
  { name: "Toys & Games", slug: "toys-games", type: CategoryType.PRODUCT },
  {
    name: "Building Toys",
    slug: "building-toys",
    type: CategoryType.PRODUCT,
    parentSlug: "toys-games",
  },
  {
    name: "LEGO Sets",
    slug: "lego-sets",
    type: CategoryType.PRODUCT,
    parentSlug: "building-toys",
  },

  // Health & Wellness
  {
    name: "Health & Wellness",
    slug: "health-wellness",
    type: CategoryType.PRODUCT,
  },
  {
    name: "Supplements",
    slug: "supplements",
    type: CategoryType.PRODUCT,
    parentSlug: "health-wellness",
  },
  {
    name: "Vitamins",
    slug: "vitamins",
    type: CategoryType.PRODUCT,
    parentSlug: "supplements",
  },

  // Pet Supplies
  { name: "Pet Supplies", slug: "pet-supplies", type: CategoryType.PRODUCT },
  {
    name: "Dog Supplies",
    slug: "dog-supplies",
    type: CategoryType.PRODUCT,
    parentSlug: "pet-supplies",
  },
  {
    name: "Dog Food",
    slug: "dog-food",
    type: CategoryType.PRODUCT,
    parentSlug: "dog-supplies",
  },

  // Garden & Outdoor
  {
    name: "Garden & Outdoor",
    slug: "garden-outdoor",
    type: CategoryType.PRODUCT,
  },
  {
    name: "Outdoor Furniture",
    slug: "outdoor-furniture",
    type: CategoryType.PRODUCT,
    parentSlug: "garden-outdoor",
  },
  {
    name: "Grills",
    slug: "grills",
    type: CategoryType.PRODUCT,
    parentSlug: "garden-outdoor",
  },

  // Office Supplies
  {
    name: "Office Supplies",
    slug: "office-supplies",
    type: CategoryType.PRODUCT,
  },
  {
    name: "Writing Instruments",
    slug: "writing-instruments",
    type: CategoryType.PRODUCT,
    parentSlug: "office-supplies",
  },
  {
    name: "Pens",
    slug: "pens",
    type: CategoryType.PRODUCT,
    parentSlug: "writing-instruments",
  },
];

const serviceCategorySeeds: CategorySeed[] = [
  // Home Services
  { name: "Home Services", slug: "home-services", type: CategoryType.SERVICE },
  {
    name: "Cleaning Services",
    slug: "cleaning-services",
    type: CategoryType.SERVICE,
    parentSlug: "home-services",
  },
  {
    name: "Home Deep Cleaning",
    slug: "home-deep-cleaning",
    type: CategoryType.SERVICE,
    parentSlug: "cleaning-services",
  },
  {
    name: "Plumbing",
    slug: "plumbing",
    type: CategoryType.SERVICE,
    parentSlug: "home-services",
  },
  {
    name: "Pipe Repair",
    slug: "pipe-repair",
    type: CategoryType.SERVICE,
    parentSlug: "plumbing",
  },

  // Beauty & Grooming
  {
    name: "Beauty & Grooming",
    slug: "beauty-grooming",
    type: CategoryType.SERVICE,
  },
  {
    name: "Hair Styling",
    slug: "hair-styling",
    type: CategoryType.SERVICE,
    parentSlug: "beauty-grooming",
  },
  {
    name: "Haircut",
    slug: "haircut",
    type: CategoryType.SERVICE,
    parentSlug: "hair-styling",
  },
  {
    name: "Makeup Artists",
    slug: "makeup-artists",
    type: CategoryType.SERVICE,
    parentSlug: "beauty-grooming",
  },
  {
    name: "Bridal Makeup",
    slug: "bridal-makeup",
    type: CategoryType.SERVICE,
    parentSlug: "makeup-artists",
  },

  // Education & Tutoring
  {
    name: "Education & Tutoring",
    slug: "education-tutoring",
    type: CategoryType.SERVICE,
  },
  {
    name: "Language Lessons",
    slug: "language-lessons",
    type: CategoryType.SERVICE,
    parentSlug: "education-tutoring",
  },
  {
    name: "English Tutors",
    slug: "english-tutors",
    type: CategoryType.SERVICE,
    parentSlug: "language-lessons",
  },
  {
    name: "Music Lessons",
    slug: "music-lessons",
    type: CategoryType.SERVICE,
    parentSlug: "education-tutoring",
  },
  {
    name: "Guitar Lessons",
    slug: "guitar-lessons",
    type: CategoryType.SERVICE,
    parentSlug: "music-lessons",
  },

  // Automotive Services
  {
    name: "Automotive Services",
    slug: "automotive-services",
    type: CategoryType.SERVICE,
  },
  {
    name: "Car Wash",
    slug: "car-wash",
    type: CategoryType.SERVICE,
    parentSlug: "automotive-services",
  },
  {
    name: "Mobile Car Wash",
    slug: "mobile-car-wash",
    type: CategoryType.SERVICE,
    parentSlug: "car-wash",
  },
  {
    name: "Car Repair",
    slug: "car-repair",
    type: CategoryType.SERVICE,
    parentSlug: "automotive-services",
  },
  {
    name: "Brake Repair",
    slug: "brake-repair",
    type: CategoryType.SERVICE,
    parentSlug: "car-repair",
  },

  // Health & Wellness Services
  {
    name: "Health & Wellness Services",
    slug: "health-wellness-services",
    type: CategoryType.SERVICE,
  },
  {
    name: "Personal Training",
    slug: "personal-training",
    type: CategoryType.SERVICE,
    parentSlug: "health-wellness-services",
  },
  {
    name: "Yoga Instructors",
    slug: "yoga-instructors",
    type: CategoryType.SERVICE,
    parentSlug: "health-wellness-services",
  },
  {
    name: "Massage Therapy",
    slug: "massage-therapy",
    type: CategoryType.SERVICE,
    parentSlug: "health-wellness-services",
  },
  {
    name: "Deep Tissue Massage",
    slug: "deep-tissue-massage",
    type: CategoryType.SERVICE,
    parentSlug: "massage-therapy",
  },

  // Event Services
  {
    name: "Event Services",
    slug: "event-services",
    type: CategoryType.SERVICE,
  },
  {
    name: "Photography",
    slug: "photography",
    type: CategoryType.SERVICE,
    parentSlug: "event-services",
  },
  {
    name: "Wedding Photography",
    slug: "wedding-photography",
    type: CategoryType.SERVICE,
    parentSlug: "photography",
  },
  {
    name: "Catering",
    slug: "catering",
    type: CategoryType.SERVICE,
    parentSlug: "event-services",
  },
  {
    name: "Buffet Catering",
    slug: "buffet-catering",
    type: CategoryType.SERVICE,
    parentSlug: "catering",
  },

  // Financial Services
  {
    name: "Financial Services",
    slug: "financial-services",
    type: CategoryType.SERVICE,
  },
  {
    name: "Tax Consultants",
    slug: "tax-consultants",
    type: CategoryType.SERVICE,
    parentSlug: "financial-services",
  },
  {
    name: "Investment Advisors",
    slug: "investment-advisors",
    type: CategoryType.SERVICE,
    parentSlug: "financial-services",
  },

  // Legal Services
  {
    name: "Legal Services",
    slug: "legal-services",
    type: CategoryType.SERVICE,
  },
  {
    name: "Immigration Lawyers",
    slug: "immigration-lawyers",
    type: CategoryType.SERVICE,
    parentSlug: "legal-services",
  },
  {
    name: "Family Lawyers",
    slug: "family-lawyers",
    type: CategoryType.SERVICE,
    parentSlug: "legal-services",
  },

  // Tech Support
  { name: "Tech Support", slug: "tech-support", type: CategoryType.SERVICE },
  {
    name: "Computer Repair",
    slug: "computer-repair",
    type: CategoryType.SERVICE,
    parentSlug: "tech-support",
  },
  {
    name: "Mobile Phone Repair",
    slug: "mobile-phone-repair",
    type: CategoryType.SERVICE,
    parentSlug: "tech-support",
  },
];

async function main() {
  console.log("🌱 Starting to seed categories...");

  // Seed product categories
  console.log("📦 Seeding product categories (with nesting)...");

  const slugToId = new Map<string, string>();

  for (const category of productCategorySeeds) {
    let parentConnect: any = undefined;
    if (category.parentSlug) {
      const parentId = slugToId.get(category.parentSlug);
      parentConnect = parentId ? { connect: { id: parentId } } : undefined;
    }

    await prisma.category
      .upsert({
      where: { slug: category.slug },
        update: {
          type: category.type,
          parentId: category.parentSlug
            ? slugToId.get(category.parentSlug)
            : null,
        },
      create: {
        name: category.name,
        slug: category.slug,
        type: category.type,
          ...(parentConnect ? { parent: parentConnect } : {}),
      },
      })
      .then((created) => {
        slugToId.set(category.slug, created.id);
    });
  }

  // Seed service categories
  console.log("🔧 Seeding service categories (with nesting)...");

  const serviceSlugToId = new Map<string, string>();

  for (const category of serviceCategorySeeds) {
    let parentConnect: any = undefined;
    if (category.parentSlug) {
      const parentId = serviceSlugToId.get(category.parentSlug);
      parentConnect = parentId ? { connect: { id: parentId } } : undefined;
    }
    await prisma.category
      .upsert({
      where: { slug: category.slug },
        update: {
          type: category.type,
          parentId: category.parentSlug
            ? serviceSlugToId.get(category.parentSlug)
            : null,
        },
      create: {
        name: category.name,
        slug: category.slug,
        type: category.type,
          ...(parentConnect ? { parent: parentConnect } : {}),
      },
      })
      .then((created) => {
        serviceSlugToId.set(category.slug, created.id);
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
