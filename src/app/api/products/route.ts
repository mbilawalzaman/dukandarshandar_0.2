import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("dukandarshandar");

    const products = await db.collection("products").find({}).toArray();

    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch products" }, { status: 500 });
  }
}
