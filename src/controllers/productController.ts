import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

// 🛍️ Create Product
export async function createProduct(req: Request) {
  try {
    // Authenticate user
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: "Invalid Token" }, { status: 403 });

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("dukandarshandar");

    // Extract product details
    const { name, category, price, quantity, rating, image, created_by } = await req.json();

    if (!name || !category || !price || !quantity || !image) {
      return NextResponse.json({ success: false, message: "All required fields must be provided." }, { status: 400 });
    }

    const newProduct = {
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
      updated_at: new Date(),
    };

    // Insert product into database
    const result = await db.collection("products").insertOne(newProduct);

    // Fetch the newly inserted product
    const insertedProduct = await db.collection("products").findOne({ _id: new ObjectId(result.insertedId) });

    if (!insertedProduct) {
      return NextResponse.json({ success: false, message: "Failed to fetch the product after insertion." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Product created successfully", product: insertedProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ success: false, message: "Failed to create product" }, { status: 500 });
  }
}

// ✏️ Update Product
export async function updateProduct(req: Request) {
  try {
    // Authenticate user
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: "Invalid Token" }, { status: 403 });

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("dukandarshandar");

    // Extract product details
    const { _id, name, category, price, quantity, rating, image, updated_by } = await req.json();

    if (!_id) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    // Update product in database
    const updatedProduct = await db.collection("products").findOneAndUpdate(
      { _id: new ObjectId(_id) },
      {
        $set: {
          ...(name && { name }),
          ...(category && { category }),
          ...(price && { price }),
          ...(quantity && { quantity }),
          ...(rating !== undefined && { rating }),
          ...(image && { image }),
          updated_by,
          updated_at: new Date(),
        },
      },
      { returnDocument: "after" } // Return the updated document
    );

    if (!updatedProduct || !updatedProduct.value) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product updated successfully", product: updatedProduct.value });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ success: false, message: "Failed to update product" }, { status: 500 });
  }
}
