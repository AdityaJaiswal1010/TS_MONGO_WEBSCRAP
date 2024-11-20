import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";

dotenv.config(); 

interface UuidDocument {
  _id: string; 
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

    console.log("Inserting 100,000 UUIDs...");
    const uuids = Array.from({ length: 100000 }, () => ({ _id: uuidv4() }));

    for (let i = 0; i < uuids.length; i += 1000) {
      const batch = uuids.slice(i, i + 1000);
      await collection.insertMany(batch);
    }
    console.log("UUIDs inserted.");
    console.log("Analyzing UUIDs...");
    const uuidDocs = await collection.find().toArray(); 
    const charCountMap = new Map<string, number>();
    for (const doc of uuidDocs) {
      const charCount = getCharacterCount(doc._id); 
      const key = JSON.stringify(charCount);
      charCountMap.set(key, (charCountMap.get(key) || 0) + 1);
    }
    const averageSharedCount =
      Array.from(charCountMap.values()).reduce((a, b) => a + b, 0) /
      charCountMap.size;
    console.log(
      `Average number of UUIDs sharing the same per-character counts: ${averageSharedCount}`
    );
  } finally {
    await client.close();
  }
}
function getCharacterCount(uuid: string): Record<string, number> {
  const charCount: Record<string, number> = {};
  for (const char of uuid) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  return charCount;
}

main().catch(console.error);