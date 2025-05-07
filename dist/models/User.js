import mongoose from "mongoose";
import { ROLES } from "../enums/enum.js";
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        default: ROLES.USER,
        enum: [ROLES.USER, ROLES.ADMIN, ROLES.MANAGER],
    },
}, { timestamps: true });
export default mongoose.model("User", userSchema);
