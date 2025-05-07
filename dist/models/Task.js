import mongoose from "mongoose";
import { PRIORITY, STATUS } from "../enums/enum.js";
const TaskSchema = new mongoose.Schema({
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
        required: true,
        enum: [PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH],
    },
}, { timestamps: true });
export default mongoose.model("Tasks", TaskSchema);
