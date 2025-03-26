import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth"; // Utility function to verify JWT
import { getUserById } from "@/controllers/userController";
import { UserRole } from "@/models/User";
import { hashPassword } from "@/lib/auth"; 

export async function GET(req: Request) {
  try {
    console.log(req.headers)
    // Get token from request headers
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: "Invalid Token" }, { status: 403 });

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("dukandarshandar");

    const url = new URL(req.url);
    const userId = url.searchParams.get("id");

    if (userId) {
      return getUserById(userId); // ✅ Use the controller function
    }


    // Fetch users
    const users = await db.collection("users").find({}).toArray();

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch users" });
  }
}

export async function POST(req: Request) {
  try {
    console.log("Incoming POST request...");
    const { name, email, password, role } = await req.json();
    console.log("Received data:", { name, email, role });

    if (!name || !email || !password) {
      console.error("Missing required fields");
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const assignedRole = Object.values(UserRole).includes(role) ? role : UserRole.USER;
    console.log("Assigned role:", assignedRole);

    const hashedPassword = await hashPassword(password);
    console.log("Hashed password generated");

    const client = await clientPromise;
    const db = client.db("dukandarshandar");

    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
    });

    console.log("User inserted:", result.insertedId);
    return NextResponse.json({ success: true, userId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 });
  }
}
