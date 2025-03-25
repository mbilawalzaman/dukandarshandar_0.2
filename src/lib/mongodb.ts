import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL;
if (!uri) {
  throw new Error("Please add your MongoDB URI to .env");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Extend globalThis type
declare global {
  // Extend NodeJS.Global with _mongoClientPromise
  interface Global {
    _mongoClientPromise?: Promise<MongoClient>;
  }
}

// Use globalThis as a type-safe object
const globalWithMongo = global as unknown as Global;

if (process.env.NODE_ENV === "development") {
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
