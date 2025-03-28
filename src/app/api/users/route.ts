import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth"; // Utility function to verify JWT
import { createUser, getUsers, getUserById } from "@/controllers/userController"; // Import controller functions
import { UserRole } from "@/models/User";

// GET request to fetch users or a specific user by ID
export async function GET(req: Request) {
  try {
    // Extract token from the Authorization header
    const token = req.headers.get("authorization")?.split(" ")[1];
    
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Verify the token (you could use a utility function for JWT verification)
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, error: "Invalid Token" }, { status: 403 });
    }

    // Extract query parameter from the URL
    const url = new URL(req.url);
    const userId = url.searchParams.get("id");

    // If userId is provided, get the user by ID
    if (userId) {
      const user = await getUserById(userId);
      if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, user });
    }

    // If no userId, fetch all users
    const users = await getUsers();
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST request to create a new user
export async function POST(req: Request) {
  try {
    // Extract the request body data
    const { name, email, password, role } = await req.json();

    // Basic validation for required fields
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Assign a role if it's provided; otherwise, default to 'user'
    const assignedRole = Object.values(UserRole).includes(role) ? role : UserRole.USER;

    // Prepare the user object to be passed to the controller
    const newUser = {
      name,
      email,
      password,
      role: assignedRole,
    };

    // Call the controller's createUser function to create the new user
    const createdUser = await createUser(newUser);

    // Return the response with the user ID of the created user
    return NextResponse.json({ success: true, userId: createdUser._id }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 });
  }
}
