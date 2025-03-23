import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb"; // Ensure correct import path

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db("dukandarshandar");

    // Fetch all users
    const users = await db.collection("users").find({}).toArray();

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, error: "Failed to fetch users" });
  }
}
