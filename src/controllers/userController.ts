import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
}

export const getUsers = async (): Promise<User[]> => {
  const client = await clientPromise;
  const db = client.db("DukandarShandar");

  const users = await db.collection<User>("users").find().toArray();
  
  return users.map(user => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    password: user.password,
  }));
};
