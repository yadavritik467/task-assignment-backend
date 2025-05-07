import mongoose, { Document, Mongoose } from "mongoose";
import { PRIORITY, STATUS } from "../enums/enum.js";

export interface Tasks extends Document {
  title: string;
  description: string;
  assignedTo: mongoose.Schema.Types.ObjectId;
  createdBy: mongoose.Schema.Types.ObjectId;
  status: string;
  dueDate: Date;
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: [STATUS.TODO, STATUS.INPROGRESS, STATUS.COMPLETED],
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
