import { NextRequest, NextResponse } from "next/server";
import { getProductByID } from "@/controllers/productController"; // Adjust path accordingly

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Ensure `params` is awaited properly
    const { id } = await context.params;

    // Call the controller function
    const response = await getProductByID(id);

    // Return response based on the result from the controller
    return NextResponse.json({ success: response.success, message: response.message, product: response.product || null }, { status: response.status });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
