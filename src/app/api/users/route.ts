import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth"; // Utility function to verify JWT

export async function GET(req: Request) {
  try {
    // Get token from request headers
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      console.error("Token Verification Error:", err);
      return NextResponse.json({ success: false, error: "Invalid Token" }, { status: 403 });
    }

    if (!decoded) {
      return NextResponse.json({ success: false, error: "Invalid Token" }, { status: 403 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("dukandarshandar");

    // Fetch users
    const users = await db.collection("users").find({}).toArray();

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch users";

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
