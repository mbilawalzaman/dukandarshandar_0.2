import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth"; // Utility function to verify JWT

export async function GET(req: Request) {
  try {
    // Get token from request headers
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: "Invalid Token" }, { status: 403 });

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("dukandarshandar");

    // Fetch users
    const users = await db.collection("users").find({}).toArray();

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch users" });
  }
}
