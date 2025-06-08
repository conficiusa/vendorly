import "dotenv/config";
import { getRecombeeUser } from "../utils/recombee";

const userId = process.argv[2];
const sessionId = process.argv[3];

if (!userId && !sessionId) {
  console.error("Please provide a userId or a sessionId as an argument.");
  process.exit(1);
}

console.log(`Fetching user for userId: ${userId}, sessionId: ${sessionId}`);

getRecombeeUser(userId, sessionId)
  .then((user) => {
    console.log("Recombee user:", user);
  })
  .catch((error) => {
    console.error("Error getting Recombee user: code", error.statusCode);
  });
