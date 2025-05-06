import mongoose, { Document } from "mongoose";

export interface Notification extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  message: string;
  isRead: boolean;
}

const NotificationSchema = new mongoose.Schema<Notification>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, required: true },
    isRead:{type:Boolean,default:false}
  },
  { timestamps: true }
);

export default mongoose.model<Notification>("Notification", NotificationSchema);
