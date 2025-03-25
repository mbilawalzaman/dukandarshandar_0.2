import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("dukandarshandar");
    const collections = await db.listCollections().toArray();

    return NextResponse.json({ success: true, collections });
  } catch (error) {
    console.error("MongoDB Connection Error:", error);

    // ✅ Type assertion to ensure `error` has a `message` property
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json({ success: false, error: errorMessage });
  }
}
