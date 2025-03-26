import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { UserRole } from "@/models/User"; // Import UserRole


export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export const createUser = async (user: User): Promise<User> => {
  const client = await clientPromise;
  const db = client.db("dukandarshandar");

  // ✅ Ensure role is set to "user" if not provided
  const userData = { ...user, role: user.role || "user" };

  const result = await db.collection("users").insertOne(userData);
  return { ...userData, _id: result.insertedId };
};

export const getUsers = async (): Promise<User[]> => {
  const client = await clientPromise;
  const db = client.db("dukandarshandar");

  const users = await db.collection<User>("users").find().toArray();
  
  return users.map(user => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role, 
  }));
};

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const client = await clientPromise;
    const db = client.db("dukandarshandar");

    // Convert userId (string) to ObjectId
    const objectId = new ObjectId(userId);

    const user = await db.collection<User>("users").findOne({ _id: objectId });

    return user; // ✅ Return user object directly, not NextResponse
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

