import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";

dotenv.config();

interface UuidDocument {
  _id: string; // UUID will be stored as the primary key
}

async function main() {
  const uri = process.env.DB_URL;
  if (!uri) {
    throw new Error("DB_URL environment variable is not defined!");
  }
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    // Select the database and collection
    const db = client.db("test");
    const collection = db.collection<UuidDocument>("uuid");

    // Step 1: Insert 100,000 UUIDs into the collection
    console.log("Inserting 100,000 UUIDs...");
    const uuids = Array.from({ length: 100000 }, () => ({ _id: uuidv4() }));

    for (let i = 0; i < uuids.length; i += 1000) {
      const batch = uuids.slice(i, i + 1000);
      await collection.insertMany(batch);
    }
    console.log("UUIDs inserted.");

    // Step 2: Analyze UUIDs for per-character counts
    console.log("Analyzing UUIDs...");
    const uuidDocs = await collection.find().toArray(); // Fetch all UUIDs

    // Map to store the count of UUIDs sharing the same character count profile
    const charCountMap = new Map<string, number>();

    for (const doc of uuidDocs) {
      const charCount = getCharacterCount(doc._id); // Get character count profile
      const key = JSON.stringify(charCount); // Serialize the profile as a unique key
      charCountMap.set(key, (charCountMap.get(key) || 0) + 1); // Count occurrences
    }

    // Step 3: Calculate total and average counts
    const totalSharedCounts = Array.from(charCountMap.values()).reduce((a, b) => a + b, 0);
    const uniqueProfiles = charCountMap.size;
    const averageSharedCount = totalSharedCounts / uniqueProfiles;

    console.log(`Total number of UUIDs sharing the same per-character counts: ${totalSharedCounts}`);
    console.log(`Average number of UUIDs sharing the same per-character counts: ${averageSharedCount}`);
  } finally {
    // Ensure the client is closed
    await client.close();
    console.log("Connection to MongoDB closed.");
  }
}

/**
 * Function to calculate the character count profile for a UUID.
 * @param uuid - UUID string
 * @returns A record object with character counts
 */
function getCharacterCount(uuid: string): Record<string, number> {
  const charCount: Record<string, number> = {};
  for (const char of uuid.replace(/-/g, "")) { // Remove hyphens for accurate counts
    charCount[char] = (charCount[char] || 0) + 1;
  }
  return charCount;
}

// Run the main function
main().catch(console.error);
