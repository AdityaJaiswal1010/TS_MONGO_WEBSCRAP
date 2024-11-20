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
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("test");
    const collection = db.collection<UuidDocument>("uuid");
    // Insert 100,000 UUIDs into the collection
    console.log("Inserting 100,000 UUIDs...");
    const uuids = Array.from({ length: 100000 }, () => ({ _id: uuidv4() }));
    for (let i = 0; i < uuids.length; i += 1000) {
      const batch = uuids.slice(i, i + 1000);
      await collection.insertMany(batch);
    }
    console.log("UUIDs inserted.");

    // Analyze UUIDs for per-character counts
    console.log("Analyzing UUIDs...");
    const uuidDocs = await collection.find().toArray(); 

    // Map to store the count of UUIDs sharing the same character count profile
    const charCountMap = new Map<string, number>();

    for (const doc of uuidDocs) {
      const charCount = getCharacterCount(doc._id); 
      const key = JSON.stringify(charCount); 
      charCountMap.set(key, (charCountMap.get(key) || 0) + 1); 
    }

    // Calculate total and average counts
    const totalSharedCounts = Array.from(charCountMap.values()).reduce((a, b) => a + b, 0);
    const uniqueProfiles = charCountMap.size;
    const averageSharedCount = totalSharedCounts / uniqueProfiles;

    console.log(`Total number of UUIDs sharing the same per-character counts: ${totalSharedCounts}`);
    console.log(`Average number of UUIDs sharing the same per-character counts: ${averageSharedCount}`);
  } finally {
    await client.close();
    console.log("Connection to MongoDB closed.");
  }
}

function getCharacterCount(uuid: string): Record<string, number> {
  const charCount: Record<string, number> = {};
  for (const char of uuid.replace(/-/g, "")) { // Remove hyphens for accurate counts
    charCount[char] = (charCount[char] || 0) + 1;
  }
  return charCount;
}

main().catch(console.error);
