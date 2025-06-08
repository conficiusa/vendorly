import "dotenv/config";
import { addUserPropertiesToRecombee } from "../utils/recombee";

async function main() {
  try {
    console.log("Starting Add user properties to recombee");

    await addUserPropertiesToRecombee();

    console.log("Added user properties you can add user now");
    process.exit(0);
  } catch (error) {
    console.error("Error during add properties:", error);
    process.exit(1);
  }
}

main();
