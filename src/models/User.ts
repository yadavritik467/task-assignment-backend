import mongoose, { Document } from "mongoose";
import { ROLES } from "../enums/enum.js";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      default: ROLES.USER,
      enum: [ROLES.USER, ROLES.ADMIN, ROLES.MANAGER],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
