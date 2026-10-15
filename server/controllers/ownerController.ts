
import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import { Restaurant } from "../models/restaurant.js";
import {v2 as cloudinary} from 'cloudinary'
import { Booking } from "../models/Booking.js";
import { notifyAdmins } from "../services/notify.js";
import { notifyUser } from "../services/notify.js";


//Helper function to upload buffer to cloudinary
const uploadTocloudinary = (fileBuffer: Buffer) : Promise<{secure_url: string}> => {
    return new Promise ((resolve, reject)=>{
        const stream = cloudinary.uploader.upload_stream({folder: "DashDine"}, (error, result)=>{
            if(error) return reject(error);
            if(!result) return reject(new Error("upload failed"));
            resolve({secure_url: result.secure_url})
        })
        stream.end(fileBuffer)
    })
}

// Get ALL restaurants for this owner
// GET /api/owner/restaurant
export const getOwnerRestaurant = async (req: AuthRequest, res : Response): Promise<void> =>{
    try {
        const restaurants = await Restaurant.find({owner: req.user?._id})
        res.json(restaurants); // ab array return hoga, chahe empty [] ho
    } catch (error:any) {
        console.error(error);
        res.status(400).json({message: error.message});
    }
}

// Create a new restaurant for this owner (multiple allowed)
// POST /api/owner/restaurant
export const createOwnerRestaurant = async (req: AuthRequest, res : Response): Promise<void> =>{
    try {
        
        const {name, description, cuisine, priceRange, location, address, chef, tags, availableSlots, totalSeats } = req.body;

        if(!name || !description || !cuisine || !priceRange || !location || !address|| !chef){
            res.status(400).json({Message: "Please provide all required field"})
            return;
        }

        // Generate slug from name
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

        const slugExists = await Restaurant.findOne({slug});
        if(slugExists){
            res.status(400).json({message: "A restaurant with this name already exists"});
            return;
        }

        //handle image
        let imageUrl = "";
        if(req.file){
            const result = await uploadTocloudinary(req.file.buffer);
            imageUrl = result.secure_url;
        }

        //Setup parsed tags and slots
        const parsedTags = typeof tags === "string" ? tags.split(",").map((t)=> t.trim()): tags || [];
        const parsedSlots = typeof availableSlots === "string" ? availableSlots.split(",").map((s) => s.trim()) : availableSlots || ["7:00 pm", "8:00 pm", "9:00 pm", "10:00 pm", "11:00 pm"] ;

        const restaurant = await Restaurant.create({
            name, 
            slug,
            description,
            cuisine,
            priceRange,
            location,
            address,
            chef,
            image: imageUrl,
            tags: parsedTags,
            availableSlots: parsedSlots,
            totalSeats: totalSeats ? Number(totalSeats) : 20,
            owner: req.user?._id,
            status: "pending"
        })

        try {
            await notifyAdmins({
                type: "RESTAURANT_SUBMITTED",
                title: "New restaurant awaiting approval",
                message: `${restaurant.name} needs your approval`,
                link: "/admin/restaurants",
            });
        } catch (err) {
            console.error("Failed to send notification:", err);
        }

        res.status(201).json(restaurant);

    } catch (error:any) {
        console.error(error);
        res.status(400).json({message: error.message});
    }
}

// Update ONE specific owner restaurant by its ID
// PUT /api/owner/restaurant/:id
export const updateOwnerRestaurant = async (req: AuthRequest, res : Response): Promise<void> =>{
    try {
        console.log("BODY RECEIVED:", req.body);
        const restaurant = await Restaurant.findOne({_id: req.params.id, owner: req.user?._id})
    if(!restaurant){
        res.status(404).json({message: "Restaurant profile not found"});
        return;
    }

     const {name, description, cuisine, priceRange, location, address, chef, tags, availableSlots, totalSeats } = req.body; 

     if(name) restaurant.name = name;
     if (description) restaurant.description = description;
     if (cuisine) restaurant.cuisine = cuisine;
     if (priceRange) restaurant.priceRange = priceRange;
     if (location) restaurant.location = location;
     if (address) restaurant.address = address;
     if (chef) restaurant.chef = chef;
     if (totalSeats) restaurant.totalSeats = totalSeats;

        if (tags){
        restaurant.tags = typeof tags === "string" ? tags.split(",").map((s) => s.trim()) : tags;
     }

     if (availableSlots){
        restaurant.availableSlots = typeof availableSlots === "string" 
            ? availableSlots.split(",").map((s) => s.trim()) 
            : availableSlots;
     }

     //Handle new image upload if any
        if(req.file){
            const result = await uploadTocloudinary(req.file.buffer);
            restaurant.image = result.secure_url;
        }

       const updated = await restaurant.save()
       res.json(updated);

    } catch (error:any) {
        console.error(error);
        res.status(400).json({message: error.message});
    }
}

// Get bookings across ALL of this owner's restaurants
// GET /api/owner/bookings
export const getOwnerBookings = async (req: AuthRequest, res : Response): Promise<void> =>{
    try {
        const restaurants = await Restaurant.find({owner: req.user?._id}).select("_id")

        if(!restaurants.length){
        res.status(404).json({message: "No restaurant profile found"});
        return;
    }

    const restaurantIds = restaurants.map(r => r._id);

    const bookings = await Booking.find({restaurant: {$in: restaurantIds} }).populate("user", "name email phone").populate("restaurant", "name").sort({date: -1, time: -1})

    res.json(bookings);

    } catch (error:any) {
        console.error(error);
        res.status(400).json({message: error.message});
    }
}

// update status of a booking — unchanged, already correct
export const updateBookingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { status } = req.body;
        if (!status || !["confirmed", "rejected", "cancelled", "completed"].includes(status)) {
            res.status(400).json({ message: "Please enter a valid booking status" });
            return;
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            res.status(404).json({ message: "Booking not found" });
            return;
        }

        const restaurant = await Restaurant.findById(booking.restaurant);
        if (!restaurant || restaurant.owner.toString() !== req.user?._id.toString()) {
            res.status(401).json({ message: "Not authorized to manage this booking" });
            return;
        }

        booking.status = status;
        await booking.save();

        // Notify the user about the booking decision
        if (status === "confirmed" || status === "rejected") {
            try {
                const isConfirmed = status === "confirmed";

                await notifyUser(booking.user.toString(), {
                    type: isConfirmed ? "BOOKING_CONFIRMED" : "BOOKING_REJECTED",
                    title: isConfirmed ? "Booking confirmed" : "Booking not accepted",
                    message: isConfirmed
                        ? `Your table at ${restaurant.name} for ${booking.guests} guests at ${booking.time} is confirmed`
                        : `Your booking at ${restaurant.name} for ${booking.time} could not be accepted`,
                    link: "/dashboard",
                });
            } catch (err) {
                console.error("Failed to notify user:", err);
            }
        }

        res.json(booking);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};