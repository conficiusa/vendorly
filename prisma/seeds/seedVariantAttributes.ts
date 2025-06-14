import { prisma } from "../prisma-client";

type VariantAttribute = {
  name: string;
  values: string[];
};

type CategoryVariantMap = {
  [key: string]: VariantAttribute[];
};

// Generic attributes to apply to categories without specific ones
const genericVariantAttributes: VariantAttribute[] = [
  { name: "Color", values: ["Red", "Blue", "Green", "Black", "White"] },
  { name: "Size", values: ["XS", "S", "M", "L", "XL"] },
  {
    name: "Material",
    values: ["Cotton", "Polyester", "Leather", "Metal", "Plastic"],
  },
];

// Define category-specific variant attributes
const categoryVariantMap: CategoryVariantMap = {
  // Clothing & Apparel
  "Clothing & Apparel": [
    { name: "Size", values: ["XS", "S", "M", "L", "XL", "XXL"] },
    { name: "Color", values: ["Black", "White", "Blue", "Red", "Green"] },
    { name: "Material", values: ["Cotton", "Polyester", "Wool", "Silk"] },
    { name: "Gender", values: ["Men", "Women", "Unisex"] },
    { name: "Pattern", values: ["Solid", "Striped", "Checked", "Printed"] },
  ],

  // Electronics
  Electronics: [
    { name: "Brand", values: ["Apple", "Samsung", "Sony", "LG", "Dell"] },
    {
      name: "Storage Capacity",
      values: ["64GB", "128GB", "256GB", "512GB", "1TB"],
    },
    { name: "RAM", values: ["4GB", "6GB", "8GB", "16GB"] },
    { name: "Color", values: ["Black", "White", "Silver", "Gold"] },
    { name: "Screen Size", values: ['13"', '14"', '15.6"', '17"'] },
  ],

  // Home & Kitchen
  "Home & Kitchen": [
    {
      name: "Material",
      values: ["Stainless Steel", "Plastic", "Glass", "Ceramic"],
    },
    { name: "Color", values: ["Silver", "Black", "White", "Red"] },
    { name: "Capacity", values: ["1L", "2L", "5L", "10L"] },
    { name: "Energy Rating", values: ["A+", "A", "B", "C"] },
    { name: "Type", values: ["Cookware", "Appliance", "Utensil"] },
  ],

  // Beauty & Personal Care
  "Beauty & Personal Care": [
    { name: "Type", values: ["Cream", "Lotion", "Serum", "Oil"] },
    { name: "Skin Type", values: ["Oily", "Dry", "Combination", "Normal"] },
    { name: "Brand", values: ["L'Oreal", "Nivea", "Dove", "Neutrogena"] },
    { name: "Volume", values: ["30ml", "50ml", "100ml", "200ml"] },
    { name: "Fragrance", values: ["Floral", "Citrus", "Unscented"] },
  ],

  // Sports & Outdoors
  "Sports & Outdoors": [
    {
      name: "Sport Type",
      values: ["Running", "Cycling", "Basketball", "Football"],
    },
    { name: "Size", values: ["S", "M", "L", "XL"] },
    { name: "Material", values: ["Polyester", "Nylon", "Leather"] },
    { name: "Brand", values: ["Nike", "Adidas", "Puma", "Reebok"] },
    { name: "Color", values: ["Black", "Blue", "Red", "Green"] },
  ],

  // Automotive
  Automotive: [
    { name: "Part Type", values: ["Engine", "Brake", "Filter", "Battery"] },
    { name: "Brand", values: ["Bosch", "Denso", "Valeo", "Philips"] },
    { name: "Compatibility", values: ["Toyota", "Honda", "Ford", "BMW"] },
    { name: "Material", values: ["Metal", "Plastic", "Rubber"] },
    { name: "Color", values: ["Black", "Silver", "Red"] },
  ],

  // Books & Media
  "Books & Media": [
    {
      name: "Format",
      values: ["Hardcover", "Paperback", "eBook", "Audiobook"],
    },
    { name: "Language", values: ["English", "Spanish", "French", "German"] },
    {
      name: "Genre",
      values: ["Fiction", "Non-Fiction", "Mystery", "Self-Help"],
    },
    { name: "Age Group", values: ["Children", "Young Adult", "Adult"] },
    { name: "Edition", values: ["1st", "2nd", "3rd", "Revised"] },
  ],

  // Toys & Games
  "Toys & Games": [
    { name: "Age Group", values: ["0-2", "3-5", "6-8", "9-12"] },
    { name: "Material", values: ["Plastic", "Wood", "Metal"] },
    { name: "Brand", values: ["Lego", "Hasbro", "Mattel"] },
    { name: "Color", values: ["Red", "Blue", "Green", "Yellow"] },
    { name: "Type", values: ["Puzzle", "Board Game", "Doll", "Vehicle"] },
  ],

  // Health & Wellness
  "Health & Wellness": [
    { name: "Type", values: ["Supplement", "Equipment", "Device"] },
    { name: "Form", values: ["Tablet", "Capsule", "Powder", "Liquid"] },
    { name: "Purpose", values: ["Weight Loss", "Energy", "Relaxation"] },
    { name: "Brand", values: ["GNC", "Nature Made", "Now Foods"] },
    { name: "Flavor", values: ["Vanilla", "Chocolate", "Berry"] },
  ],

  // Pet Supplies
  "Pet Supplies": [
    { name: "Type", values: ["Food", "Toy", "Bed", "Leash"] },
    { name: "Pet", values: ["Dog", "Cat", "Bird", "Fish"] },
    { name: "Size", values: ["Small", "Medium", "Large"] },
    { name: "Material", values: ["Plastic", "Fabric", "Rubber"] },
    { name: "Flavor", values: ["Chicken", "Beef", "Fish"] },
  ],

  // Garden & Outdoor
  "Garden & Outdoor": [
    { name: "Type", values: ["Furniture", "Tool", "Lighting", "Planter"] },
    { name: "Material", values: ["Wood", "Metal", "Plastic"] },
    { name: "Color", values: ["Green", "Brown", "Black", "White"] },
    { name: "Size", values: ["Small", "Medium", "Large"] },
    { name: "Purpose", values: ["Decor", "Planting", "Seating"] },
  ],

  // Office Supplies
  "Office Supplies": [
    { name: "Type", values: ["Pen", "Notebook", "Folder", "Marker"] },
    { name: "Color", values: ["Blue", "Black", "Red", "Green"] },
    { name: "Material", values: ["Plastic", "Metal", "Paper"] },
    { name: "Pack Size", values: ["1", "5", "10", "20"] },
    { name: "Brand", values: ["Pilot", "Bic", "Staples", "3M"] },
  ],
};

async function main() {
  console.log("🌱 Seeding variant attributes...");

  // First, create all variant attributes
  const createdAttributes = new Map<string, any>();

  for (const categoryName in categoryVariantMap) {
    const attributes = categoryVariantMap[categoryName];

    for (const attribute of attributes) {
      if (!createdAttributes.has(attribute.name)) {
        const created = await prisma.variantAttribute.upsert({
          where: { name: attribute.name },
          update: {
            values: attribute.values,
          },
          create: {
            name: attribute.name,
            values: attribute.values,
          },
        });
        createdAttributes.set(attribute.name, created);
      }
    }
  }

  // Then, link attributes to categories that have explicit mappings first
  for (const categoryName in categoryVariantMap) {
    const category = await prisma.category.findFirst({
      where: { name: categoryName },
    });

    if (category) {
      const attributes = categoryVariantMap[categoryName];

      for (const attribute of attributes) {
        const variantAttribute = createdAttributes.get(attribute.name);

        if (variantAttribute) {
          await prisma.categoryVariantAttribute.upsert({
            where: {
              categoryId_variantAttributeId: {
                categoryId: category.id,
                variantAttributeId: variantAttribute.id,
              },
            },
            update: {},
            create: {
              categoryId: category.id,
              variantAttributeId: variantAttribute.id,
            },
          });
        }
      }
    }
  }

  // Finally, link generic attributes to any remaining categories
  const allCategories = await prisma.category.findMany();
  for (const category of allCategories) {
    // Skip if category already has at least one attribute linked
    const existingLinks = await prisma.categoryVariantAttribute.findMany({
      where: { categoryId: category.id },
      take: 1,
    });

    if (existingLinks.length === 0) {
      for (const attribute of genericVariantAttributes) {
        // Ensure attribute exists
        let variantAttribute = createdAttributes.get(attribute.name);
        if (!variantAttribute) {
          variantAttribute = await prisma.variantAttribute.upsert({
            where: { name: attribute.name },
            update: { values: attribute.values },
            create: {
              name: attribute.name,
              values: attribute.values,
            },
          });
          createdAttributes.set(attribute.name, variantAttribute);
        }

        await prisma.categoryVariantAttribute.upsert({
          where: {
            categoryId_variantAttributeId: {
              categoryId: category.id,
              variantAttributeId: variantAttribute.id,
            },
          },
          update: {},
          create: {
            categoryId: category.id,
            variantAttributeId: variantAttribute.id,
          },
        });
      }
    }
  }

  console.log("✅ Variant attributes seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding variant attributes:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
