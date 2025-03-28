import { NextResponse } from "next/server";
import { fetchProducts } from "@/controllers/productController";

// GET request to fetch products
export async function GET() {
  const result = await fetchProducts();

  if (!result.success) {
    // If there was an error, return failure response
    return NextResponse.json({ success: false, message: result.message }, { status: 500 });
  }

  // Return the products if success
  return NextResponse.json({ success: true, products: result.products });
}
