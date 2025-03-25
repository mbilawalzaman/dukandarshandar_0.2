import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(req: Request) {
  try {
    const { _id, name, category, price, quantity, rating, image, description, updated_by } = await req.json();

    if (!_id) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    if (!ObjectId.isValid(_id)) {
      return NextResponse.json({ success: false, message: "Invalid Product ID format" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("dukandarshandar");

    const updateResult = await db.collection("products").updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: { name, category, price, quantity, rating, image, description, updated_by, updated_at: new Date() },
      }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json({ success: false, message: "Product not found or already updated" }, { status: 404 });
    }

    // Fetch the updated product manually
    const updatedProduct = await db.collection("products").findOne({ _id: new ObjectId(_id) });

    return NextResponse.json({ success: true, message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
