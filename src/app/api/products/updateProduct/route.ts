import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(req: Request) {
  try {
    const { _id, rating, ...updateFields } = await req.json(); // Extract `_id`, rating, and other fields

    if (!_id) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    if (!ObjectId.isValid(_id)) {
      return NextResponse.json({ success: false, message: "Invalid Product ID format" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("dukandarshandar");

    // Fetch the existing product
    const product = await db.collection("products").findOne({ _id: new ObjectId(_id) });

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // Prepare update object
    const updateQuery: any = { $currentDate: { updated_at: true } }; // Always update timestamp

    // If `rating` is provided, update rating logic
    if (rating !== undefined) {
      const ratings = product.ratings || [];
      ratings.push(rating);

      const newAverageRating = Math.round((ratings.reduce((sum, r) => sum + r, 0) / ratings.length) * 2) / 2;


      updateQuery.$set = { ...updateFields, rating: newAverageRating, ratings };
    } else {
      updateQuery.$set = { ...updateFields };
    }

    // Remove undefined fields from update
    Object.keys(updateQuery.$set).forEach((key) => {
      if (updateQuery.$set[key] === undefined) {
        delete updateQuery.$set[key];
      }
    });

    // Perform update
    const updateResult = await db.collection("products").updateOne(
      { _id: new ObjectId(_id) },
      updateQuery
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json({ success: false, message: "No changes were made" }, { status: 400 });
    }

    // Fetch and return the updated product
    const updatedProduct = await db.collection("products").findOne({ _id: new ObjectId(_id) });

    return NextResponse.json({ success: true, message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
