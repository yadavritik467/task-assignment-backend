import mongoose, { Document } from "mongoose";
import { Roles } from "../enums/Role.enum.js";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  qrCodes: {
    shortUrl: String;
    originalUrl: String;
    createdAt: string;
    assignedTo: string;
  }[];
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      default: "admin",
      enum: [Roles.USER, Roles.ADMIN, Roles.MANAGER, Roles.BDE],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
