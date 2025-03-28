import { updateProduct } from "@/controllers/productController";

export async function PATCH(req: Request) {
  return await updateProduct(req);
}