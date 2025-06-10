import "dotenv/config";
import { updateRecombeeItem } from "../utils/recombee";

// Get command line arguments, skipping the first two (node and script path)
const args = process.argv.slice(2);

if (args.length < 3) {
  console.error("Please provide item ID and at least one property to update");
  console.error(
    "Example: npm run update-recombee-item -- item123 name 'New Name' price '99.99'"
  );
  process.exit(1);
}

const itemId = args[0];
const updates: { [key: string]: string } = {};

// Process arguments in pairs (key-value)
for (let i = 1; i < args.length; i += 2) {
  if (i + 1 >= args.length) {
    console.error("Invalid number of arguments. Each property needs a value.");
    process.exit(1);
  }
  const key = args[i];
  const value = args[i + 1];
  updates[key] = value;
}

async function main() {
  try {
    await updateRecombeeItem(itemId, updates);
    console.log(
      `Successfully updated item ${itemId} with properties:`,
      updates
    );
  } catch (error) {
    console.error("Error updating Recombee item:", error);
    process.exit(1);
  }
}

main();

