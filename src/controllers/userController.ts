import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { UserRole } from "@/models/User"; // Import UserRole

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}

export interface UserWithoutPassword {
  _id: ObjectId;
  name: string;
  email: string;
  role: UserRole;
}


// Function to fetch users from the database
export const getUsers = async (): Promise<User[]> => {
  const client = await clientPromise;
  const db = client.db("dukandarshandar");

  const users = await db.collection<User>("users").find().toArray();
  return users.map(user => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  }));
};

// Function to get a user by ID
export const getUserById = async (userId: string): Promise<User | null> => {
  const client = await clientPromise;
  const db = client.db("dukandarshandar");

  // Convert userId to ObjectId
  const objectId = new ObjectId(userId);

  const user = await db.collection<User>("users").findOne({ _id: objectId });

  return user || null; // Return user or null if not found
};

// Function to create a new user
export const createUser = async (user: User): Promise<User> => {
  const client = await clientPromise;
  const db = client.db("dukandarshandar");

  // Ensure the role is set to "user" if not provided
  const userData = { ...user, role: user.role || UserRole.USER };

  const result = await db.collection("users").insertOne(userData);
  return { ...userData, _id: result.insertedId };
};
