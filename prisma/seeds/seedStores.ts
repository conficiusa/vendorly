import { UserRole } from "../generated/prisma-client";
import { prisma } from "../prisma-client";

// Create some test stores first to associate products with
const storeSeeds = [
  {
    name: "TechHub Electronics",
    slug: "techhub-electronics",
    bio: "Your premier destination for cutting-edge electronics and gadgets",
    logo: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    user: {
      name: "Alex Johnson",
      email: "alex@techhub.com",
      role: UserRole.VENDOR,
      emailVerified: true,
      first_name: "Alex",
      last_name: "Johnson",
    },
    address: {
      address_line1: "123 Tech Street",
      city: "Accra",
      region: "Greater Accra",
      digital_address: "GA-123-4567",
    },
  },
  {
    name: "Fashion Forward",
    slug: "fashion-forward",
    bio: "Trendy clothing and accessories for modern lifestyle",
    logo: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    user: {
      name: "Sarah Williams",
      email: "sarah@fashionforward.com",
      role: UserRole.VENDOR,
      emailVerified: true,
      first_name: "Sarah",
      last_name: "Williams",
    },
    address: {
      address_line1: "456 Fashion Avenue",
      city: "Kumasi",
      region: "Ashanti",
      digital_address: "AS-234-5678",
    },
  },
  {
    name: "Beauty Bliss",
    slug: "beauty-bliss",
    bio: "Premium beauty and personal care products",
    logo: "https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    user: {
      name: "Maria Rodriguez",
      email: "maria@beautybliss.com",
      role: UserRole.VENDOR,
      emailVerified: true,
      first_name: "Maria",
      last_name: "Rodriguez",
    },
    address: {
      address_line1: "789 Beauty Lane",
      city: "Takoradi",
      region: "Western",
      digital_address: "WR-345-6789",
    },
  },
  {
    name: "Home Comfort",
    slug: "home-comfort",
    bio: "Everything you need to make your house a home",
    logo: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    user: {
      name: "David Chen",
      email: "david@homecomfort.com",
      role: UserRole.VENDOR,
      emailVerified: true,
      first_name: "David",
      last_name: "Chen",
    },
    address: {
      address_line1: "321 Home Boulevard",
      city: "Cape Coast",
      region: "Central",
      digital_address: "CR-456-7890",
    },
  },
  {
    name: "Active Sports",
    slug: "active-sports",
    bio: "Sports equipment and fitness gear for active lifestyles",
    logo: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    user: {
      name: "Michael Thompson",
      email: "michael@activesports.com",
      role: UserRole.VENDOR,
      emailVerified: true,
      first_name: "Michael",
      last_name: "Thompson",
    },
    address: {
      address_line1: "654 Sports Drive",
      city: "Tamale",
      region: "Northern",
      digital_address: "NR-567-8901",
    },
  },
];

async function main() {
  console.log("🌱 Starting to seed stores...");

  for (const storeSeed of storeSeeds) {
    try {
      // Create user first
      const user = await prisma.user.upsert({
        where: { email: storeSeed.user.email },
        update: storeSeed.user,
        create: storeSeed.user,
      });

      // Create store with address
      await prisma.store.upsert({
        where: { slug: storeSeed.slug },
        update: {
          name: storeSeed.name,
          bio: storeSeed.bio,
          logo: storeSeed.logo,
        },
        create: {
          name: storeSeed.name,
          slug: storeSeed.slug,
          bio: storeSeed.bio,
          logo: storeSeed.logo,
          userId: user.id,
          address: {
            create: storeSeed.address,
          },
        },
      });

      console.log(`✅ Created store: ${storeSeed.name}`);
    } catch (error) {
      console.error(`❌ Error creating store ${storeSeed.name}:`, error);
    }
  }

  console.log("✅ Stores seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding stores:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
