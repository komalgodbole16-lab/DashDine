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
    status: "confirmed" | "cancelled" | "completed";
    bookingId: string;
    createAt: Date;
    updateAt: Date;
}

const BookingSchema = new Schema<IBooking>(
    {
    user: {type : Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: {type : Schema.Types.ObjectId, ref: "Restaurant", required: true },
    date: {type : Date, required: true },
    time: {type : String, required: true },
    guests: {type : Number, required: true, min: 1 },
    occasion: {type : String, trim: true },
    specialRequest: {type : String},
    status: {type: String, enum: ["confirmed" , "cancelled" , "completed"], defaulat: "confirmed" },
    bookingId: { type: String, unique: true}
    },
    {timestamps: true}
)  
// Reomve password when converting to JSON
BookingSchema.pre("save", function(this: IBooking){
    if(!this.bookingId){
        this.bookingId =`GR-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    }
});


export const Booking = model<IBooking>("Booking", BookingSchema)