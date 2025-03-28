// app/api/products/route.ts
import { createProduct } from "@/controllers/productController";

// POST request handler for creating a product
export async function POST(req: Request) {
  return await createProduct(req);
}
