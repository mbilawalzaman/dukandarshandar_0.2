import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export function verifyToken(token: string) {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT secret is not defined");
    }

    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}