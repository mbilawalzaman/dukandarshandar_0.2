import clientPromise from "@/lib/mongodb";
import { User } from "@/models/User";

export const getUsers = async (): Promise<User[]> => {
  const client = await clientPromise;
  const db = client.db("DukandarShandar");
  return await db.collection("users").find().toArray();
};

export const createUser = async (user: User): Promise<User> => {
  const client = await clientPromise;
  const db = client.db("DukandarShandar");
  const result = await db.collection("users").insertOne(user);
  return { ...user, _id: result.insertedId };
};