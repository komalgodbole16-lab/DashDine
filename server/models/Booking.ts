import {Document, model, Schema, Types} from 'mongoose'
import { Restaurant } from './restaurant.js';
import crypto from "crypto";

export interface IBooking extends Document{
    user: Types.ObjectId;
    restaurant: Types.ObjectId;
    date: Date; 
    time: string;
    guests: number;
    occasion?: string;
    specialRequest?: string;
    status: "pending" | "confirmed" | "rejected" | "cancelled" | "completed";
    bookingId: string;
    advanceAmount: number;
    paymentStatus: "pending" | "paid";
    createAt: Date;
    updateAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true, min: 1 },
    occasion: { type: String, trim: true },
    specialRequest: { type: String },
    status: { type: String, enum: ["pending", "confirmed", "rejected", "cancelled", "completed"], default: "pending" },
    bookingId: { type: String, unique: true },
    advanceAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
  },
  { timestamps: true }
);

BookingSchema.pre("save", function(this: IBooking){
    if(!this.bookingId){
        this.bookingId =`GR-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    }
});


export const Booking = model<IBooking>("Booking", BookingSchema)