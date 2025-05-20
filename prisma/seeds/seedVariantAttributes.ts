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
    { name: "Size", values: ["XS", "S", "M", "L", "XL"] },
    { name: "Color", values: ["Red", "Blue", "Black", "White", "Green"] },
    {
      name: "Material",
      values: ["Cotton", "Polyester", "Wool", "Silk", "Denim"],
    },
    {
      name: "Style",
      values: ["Casual", "Formal", "Sport", "Vintage", "Modern"],
    },
    {
      name: "Pattern",
      values: ["Solid", "Striped", "Plaid", "Floral", "Geometric"],
    },
    {
      name: "Fit",
      values: ["Regular", "Slim", "Loose", "Oversized", "Relaxed"],
    },
  ],
  Electronics: [
    { name: "Brand", values: ["Apple", "Samsung", "Sony", "LG", "Dell"] },
    { name: "Storage", values: ["64GB", "128GB", "256GB", "512GB", "1TB"] },
    { name: "Color", values: ["Black", "White", "Silver", "Blue", "Gray"] },
    { name: "Screen Size", values: ['13"', '15"', '17"', '21"', '27"'] },
    {
      name: "Warranty",
      values: ["1 Year", "2 Years", "3 Years", "No Warranty", "6 Months"],
    },
  ],
  "Home & Kitchen": [
    {
      name: "Material",
      values: ["Wood", "Metal", "Plastic", "Glass", "Ceramic"],
    },
    { name: "Color", values: ["White", "Black", "Brown", "Gray", "Beige"] },
    { name: "Capacity", values: ["1L", "2L", "5L", "10L", "20L"] },
    {
      name: "Type",
      values: ["Cookware", "Bakeware", "Utensils", "Storage", "Decor"],
    },
    {
      name: "Shape",
      values: ["Round", "Square", "Rectangular", "Oval", "Hexagon"],
    },
  ],
  "Beauty & Personal Care": [
    { name: "Type", values: ["Cream", "Lotion", "Serum", "Oil", "Gel"] },
    {
      name: "Skin Type",
      values: ["Oily", "Dry", "Normal", "Sensitive", "Combination"],
    },
    {
      name: "Fragrance",
      values: ["Floral", "Citrus", "Woody", "Fresh", "Unscented"],
    },
    { name: "Volume", values: ["30ml", "50ml", "100ml", "200ml", "500ml"] },
    {
      name: "Brand",
      values: ["L'Oreal", "Nivea", "Dove", "Neutrogena", "Olay"],
    },
  ],
  "Sports & Outdoors": [
    {
      name: "Sport Type",
      values: ["Football", "Basketball", "Tennis", "Running", "Cycling"],
    },
    { name: "Size", values: ["S", "M", "L", "XL", "XXL"] },
    {
      name: "Material",
      values: ["Polyester", "Nylon", "Rubber", "Leather", "Foam"],
    },
    { name: "Color", values: ["Black", "Blue", "Red", "Green", "Yellow"] },
    { name: "Brand", values: ["Nike", "Adidas", "Puma", "Wilson", "Yonex"] },
  ],
  "Toys & Games": [
    { name: "Age Group", values: ["0-2", "3-5", "6-8", "9-12", "13+"] },
    {
      name: "Material",
      values: ["Plastic", "Wood", "Metal", "Fabric", "Foam"],
    },
    {
      name: "Type",
      values: ["Puzzle", "Board Game", "Action Figure", "Doll", "Vehicle"],
    },
    {
      name: "Brand",
      values: ["Lego", "Mattel", "Hasbro", "Fisher-Price", "Playmobil"],
    },
    { name: "Color", values: ["Red", "Blue", "Green", "Yellow", "Pink"] },
  ],
  Automotive: [
    {
      name: "Part Type",
      values: ["Engine", "Brake", "Filter", "Light", "Battery"],
    },
    {
      name: "Brand",
      values: ["Bosch", "Denso", "Valeo", "Philips", "ACDelco"],
    },
    {
      name: "Compatibility",
      values: ["Toyota", "Honda", "Ford", "BMW", "Audi"],
    },
    { name: "Color", values: ["Black", "Silver", "Red", "Blue", "White"] },
    {
      name: "Material",
      values: ["Metal", "Plastic", "Rubber", "Glass", "Ceramic"],
    },
  ],
  Books: [
    {
      name: "Format",
      values: ["Hardcover", "Paperback", "Ebook", "Audiobook", "Magazine"],
    },
    {
      name: "Language",
      values: ["English", "Spanish", "French", "German", "Chinese"],
    },
    {
      name: "Genre",
      values: ["Fiction", "Non-Fiction", "Mystery", "Romance", "Sci-Fi"],
    },
    {
      name: "Age Group",
      values: ["Children", "Teen", "Adult", "All Ages", "Young Adult"],
    },
    {
      name: "Condition",
      values: ["New", "Used", "Collectible", "Refurbished", "Damaged"],
    },
  ],
  "Health & Wellness": [
    {
      name: "Type",
      values: ["Supplement", "Equipment", "Device", "Apparel", "Accessory"],
    },
    { name: "Form", values: ["Tablet", "Capsule", "Powder", "Liquid", "Bar"] },
    {
      name: "Brand",
      values: ["GNC", "Nature Made", "Fitbit", "Omron", "Philips"],
    },
    {
      name: "Purpose",
      values: [
        "Weight Loss",
        "Muscle Gain",
        "Relaxation",
        "Pain Relief",
        "Energy",
      ],
    },
    {
      name: "Flavor",
      values: ["Vanilla", "Chocolate", "Berry", "Citrus", "Unflavored"],
    },
  ],
  "Jewelry & Accessories": [
    {
      name: "Material",
      values: ["Gold", "Silver", "Platinum", "Leather", "Beads"],
    },
    {
      name: "Type",
      values: ["Necklace", "Ring", "Bracelet", "Earrings", "Watch"],
    },
    {
      name: "Gemstone",
      values: ["Diamond", "Ruby", "Sapphire", "Emerald", "Pearl"],
    },
    {
      name: "Occasion",
      values: ["Wedding", "Party", "Casual", "Formal", "Gift"],
    },
    {
      name: "Color",
      values: ["Gold", "Silver", "Black", "White", "Rose Gold"],
    },
  ],
  "Office Supplies": [
    {
      name: "Type",
      values: ["Pen", "Notebook", "Folder", "Stapler", "Marker"],
    },
    { name: "Color", values: ["Blue", "Black", "Red", "Green", "Yellow"] },
    {
      name: "Material",
      values: ["Plastic", "Metal", "Paper", "Rubber", "Wood"],
    },
    { name: "Pack Size", values: ["1", "5", "10", "20", "50"] },
    {
      name: "Brand",
      values: ["Pilot", "Bic", "Staples", "3M", "Faber-Castell"],
    },
  ],
  "Pet Supplies": [
    { name: "Type", values: ["Food", "Toy", "Bed", "Leash", "Bowl"] },
    { name: "Pet", values: ["Dog", "Cat", "Bird", "Fish", "Rabbit"] },
    {
      name: "Flavor",
      values: ["Chicken", "Beef", "Fish", "Vegetable", "Cheese"],
    },
    { name: "Size", values: ["Small", "Medium", "Large", "XL", "XXL"] },
    {
      name: "Material",
      values: ["Plastic", "Metal", "Fabric", "Rubber", "Wood"],
    },
  ],
  "Garden & Outdoor": [
    {
      name: "Type",
      values: ["Furniture", "Tool", "Lighting", "Planter", "Grill"],
    },
    {
      name: "Material",
      values: ["Wood", "Metal", "Plastic", "Ceramic", "Stone"],
    },
    { name: "Color", values: ["Green", "Brown", "Black", "Gray", "White"] },
    { name: "Size", values: ["Small", "Medium", "Large", "XL", "XXL"] },
    {
      name: "Purpose",
      values: ["Decor", "Planting", "Seating", "Cooking", "Storage"],
    },
  ],
  Footwear: [
    { name: "Size", values: ["6", "7", "8", "9", "10"] },
    { name: "Color", values: ["Black", "White", "Brown", "Blue", "Red"] },
    {
      name: "Material",
      values: ["Leather", "Canvas", "Rubber", "Synthetic", "Mesh"],
    },
    {
      name: "Type",
      values: ["Sneakers", "Boots", "Sandals", "Loafers", "Heels"],
    },
    {
      name: "Closure",
      values: ["Lace-Up", "Slip-On", "Velcro", "Buckle", "Zip"],
    },
    {
      name: "Sole Type",
      values: ["Flat", "Heeled", "Wedge", "Platform", "Sport"],
    },
  ],
  "Baby Products": [
    {
      name: "Type",
      values: ["Diaper", "Stroller", "Bottle", "Toy", "Blanket"],
    },
    { name: "Age Group", values: ["0-3m", "3-6m", "6-12m", "1-2y", "2-3y"] },
    {
      name: "Material",
      values: ["Cotton", "Plastic", "Silicone", "Bamboo", "Wool"],
    },
    { name: "Color", values: ["Pink", "Blue", "White", "Yellow", "Green"] },
    {
      name: "Brand",
      values: ["Pampers", "Huggies", "Chicco", "Fisher-Price", "Philips"],
    },
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
