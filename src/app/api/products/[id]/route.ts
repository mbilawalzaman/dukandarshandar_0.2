import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // ✅ Ensure `params` is awaited properly
    const params = await context.params;

    if (!params?.id) {
      return NextResponse.json(
        { success: false, message: "Missing product ID" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("dukandarshandar");

    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(params.id) });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
