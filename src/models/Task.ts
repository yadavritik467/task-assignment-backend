import mongoose, { Document, Mongoose } from "mongoose";
import { PRIORITY, STATUS } from "../enums/enum.js";

export interface Tasks extends Document {
  title: string;
  description: string;
  assignedTo: mongoose.Schema.Types.ObjectId;
  status: string;
  dueDate: string;
  priority: string;
}

const TaskSchema = new mongoose.Schema<Tasks>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dueDate: { type: String, required: true },
    status: {
      type: String,
      default: STATUS.PENDING,
      enum: [STATUS.PENDING, STATUS.DOING, STATUS.DONE],
    },
    priority: {
      type: String,
      required:true,
      enum: [PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH],
    },
  },
  { timestamps: true }
);

export default mongoose.model<Tasks>("Tasks", TaskSchema);
