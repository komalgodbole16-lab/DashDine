import { Schema, model, Document, Types } from "mongoose";

export interface INotification extends Document {
  recipient: Types.ObjectId;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "RESTAURANT_SUBMITTED",
        "RESTAURANT_APPROVED",
        "RESTAURANT_REJECTED",
        "NEW_RESTAURANT_LIVE",
        "BOOKING_CREATED",
        "BOOKING_CONFIRMED",
        "BOOKING_REJECTED",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

export default model<INotification>("Notification", notificationSchema);