import "dotenv/config";

import { removeItemPropertiesFromRecombee } from "../utils/recombee";

// Get command line arguments, skipping the first two (node and script path)
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error(
    "Please provide properties to remove as command line arguments"
  );
  console.error(
    "Example: npm run remove-item-property -- name price description"
  );
  process.exit(1);
}

async function main() {
  try {
    await removeItemPropertiesFromRecombee(args);
    console.log(`Successfully removed properties: ${args.join(", ")}`);
  } catch (error) {
    console.error("Error removing item properties:", error);
    process.exit(1);
  }
}

main();
