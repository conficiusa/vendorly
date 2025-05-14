import { prisma } from "../prisma-client";

type VariantAttribute = {
  name: string;
  values: string[];
};

type CategoryVariantMap = {
  [key: string]: VariantAttribute[];
};

// Define category-specific variant attributes
const categoryVariantMap: CategoryVariantMap = {
  "Clothing & Apparel": [
    {
      name: "Size",
      values: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    },
    {
      name: "Color",
      values: [
        "Red",
        "Blue",
        "Green",
        "Black",
        "White",
        "Yellow",
        "Purple",
        "Pink",
        "Orange",
        "Brown",
        "Gray",
        "Navy",
        "Teal",
      ],
    },
    {
      name: "Material",
      values: [
        "Cotton",
        "Polyester",
        "Wool",
        "Silk",
        "Leather",
        "Denim",
        "Linen",
        "Nylon",
        "Spandex",
        "Rayon",
        "Velvet",
        "Suede",
        "Fleece",
        "Cashmere",
        "Lycra",
      ],
    },
    {
      name: "Style",
      values: [
        "Casual",
        "Formal",
        "Sport",
        "Vintage",
        "Modern",
        "Classic",
        "Bohemian",
        "Minimalist",
        "Streetwear",
        "Athletic",
        "Business",
        "Party",
        "Beach",
        "Outdoor",
        "Evening",
      ],
    },
    {
      name: "Pattern",
      values: [
        "Solid",
        "Striped",
        "Plaid",
        "Floral",
        "Geometric",
        "Abstract",
        "Animal Print",
        "Polka Dot",
        "Checkered",
        "Paisley",
        "Tie-Dye",
        "Camouflage",
        "Houndstooth",
        "Herringbone",
        "Chevron",
      ],
    },
    {
      name: "Fit",
      values: [
        "Regular",
        "Slim",
        "Loose",
        "Oversized",
        "Relaxed",
        "Tapered",
        "Straight",
        "Skinny",
        "Bootcut",
        "Wide",
        "Athletic",
        "Boxy",
        "Cropped",
        "High-Waisted",
        "Low-Waisted",
      ],
    },
  ],
//   Electronics: [
//     {
//       name: "Color",
//       values: ["Black", "White", "Silver", "Gold", "Space Gray", "Blue", "Red"],
//     },
//     {
//       name: "Storage",
//       values: ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB", "2TB"],
//     },
//     {
//       name: "RAM",
//       values: ["4GB", "8GB", "16GB", "32GB", "64GB"],
//     },
//     {
//       name: "Warranty",
//       values: ["1 Year", "2 Years", "3 Years", "Extended"],
//     },
//   ],
//   Footwear: [
//     {
//       name: "Size",
//       values: ["5", "6", "7", "8", "9", "10", "11", "12", "13"],
//     },
//     {
//       name: "Color",
//       values: [
//         "Black",
//         "White",
//         "Brown",
//         "Blue",
//         "Red",
//         "Green",
//         "Gray",
//         "Navy",
//       ],
//     },
//     {
//       name: "Width",
//       values: ["Narrow", "Regular", "Wide", "Extra Wide"],
//     },
//     {
//       name: "Material",
//       values: [
//         "Leather",
//         "Synthetic",
//         "Canvas",
//         "Mesh",
//         "Rubber",
//         "Suede",
//         "Textile",
//       ],
//     },
//   ],
//   "Home & Kitchen": [
//     {
//       name: "Color",
//       values: [
//         "White",
//         "Black",
//         "Silver",
//         "Stainless Steel",
//         "Wood",
//         "Beige",
//         "Gray",
//       ],
//     },
//     {
//       name: "Material",
//       values: [
//         "Stainless Steel",
//         "Plastic",
//         "Ceramic",
//         "Glass",
//         "Wood",
//         "Metal",
//         "Fabric",
//       ],
//     },
//     {
//       name: "Size",
//       values: ["Small", "Medium", "Large", "Extra Large"],
//     },
//   ],
//   "Beauty & Personal Care": [
//     {
//       name: "Size",
//       values: ["Travel Size", "Regular", "Large", "Family Size"],
//     },
//     {
//       name: "Scent",
//       values: [
//         "Unscented",
//         "Floral",
//         "Fruity",
//         "Fresh",
//         "Woody",
//         "Spicy",
//         "Citrus",
//       ],
//     },
//     {
//       name: "Skin Type",
//       values: [
//         "All Skin Types",
//         "Dry",
//         "Oily",
//         "Combination",
//         "Sensitive",
//         "Normal",
//       ],
//     },
//   ],
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

  // Then, link attributes to categories
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
