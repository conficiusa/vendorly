import "dotenv/config";
import { addItemPropertiesToRecombee } from "../utils/recombee";

async function main() {
  try {
    console.log("Starting Add properties to recombee");

    await addItemPropertiesToRecombee();

    console.log("Added item properties you can add items now");
    process.exit(0);
  } catch (error) {
    console.error("Error during add properties:", error);
    process.exit(1);
  }
}

main();
