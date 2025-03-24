import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: "Invalid Token" }, { status: 403 });

    const { name, category, price, quantity, rating, image, created_by } = await req.json();

    if (!name || !category || !price || !quantity || !image) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("dukandarshandar");

    const result = await db.collection("products").insertOne({
      name,
      category,
      price,
      quantity,
      rating: rating || 0,
      image,
      status: "active",
      created_by,
      updated_by: created_by,
      created_at: new Date(),
    });

    return NextResponse.json({ success: true, message: "Product created successfully", product: result });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to upload product" }, { status: 500 });
  }
}
