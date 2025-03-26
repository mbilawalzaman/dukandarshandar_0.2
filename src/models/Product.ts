import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  category: string;
  price: number;
  quantity: number;
  rating: number;
  image: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  created_by?: string;
  updated_by?: string;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    ratings: [Number], // Store all user ratings
    rating: { type: Number, default: 0 },
    description: {type: String, required: true},
    image: { type: String, required: true }, // Base64 image

    status: { type: String, default: "active" },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_at: { type: Date, default: null },
    created_by: { type: String, default: null },
    updated_by: { type: String, default: null },
  },
  { timestamps: true } // Auto-manages createdAt and updatedAt
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
