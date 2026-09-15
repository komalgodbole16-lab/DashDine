import "dotenv/config";
import mongoose from "mongoose";
import bcrypt  from 'bcrypt'
import { User } from "./models/user.js";
import { Restaurant } from "./models/restaurant.js";
import { Booking } from "./models/Booking.js";

const MONGO_URI = process.env.MONGODB_URI || "";

const seedData = async ()=>{
    try {
        console.log("Connecting to database for seeding...");

        console.log("URI being used:", MONGO_URI);

        console.log("Connected to DB:", mongoose.connection.name);

        await mongoose.connect(MONGO_URI)

        console.log("Database connected. Clearing existing collections...");

        await User.deleteMany({})
        await Restaurant.deleteMany({})
        await Booking.deleteMany({})

        console.log("Creating default users...");

        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash("admin123", salt)
        const userPassword = await bcrypt.hash("user123", salt)
        const ownerPassword = await bcrypt.hash("owner123", salt)

        //Admin
        const adminUser = await User.create({
            name: "Alex Mercer",
            email: "admin@example.com",
            password: adminPassword,
            phone: "+0123456789",
            role: "admin",
        })

         //User
        const testUser = await User.create({
            name: "Sarah Jenkins",
            email: "user@example.com",
            password: userPassword,
            phone: "+0123456789",
            role: "user",
        })

        //Owner
        const ownerUser = await User.create({
            name: "Marc Dubois",
            email: "owner@example.com",
            password: ownerPassword, 
            phone: "+0123456789",
            role: "owner"
        });

        console.log("Creating restaurants...")

         const RestaurantsData = [

    {

        name: "Ambika Restaurant",
        slug: "ambika-restaurant",
        description:
            "A sun-drenched rooftop oasis celebrating Italian and Mediterranean lifestyles. Featuring floor-to-ceiling foliage, white marble bistro tables, and panoramic skyline views, Terraza Cielo serves hand-crafted pastas and coastal seafood paired with bright botanical cocktails.",
        cuisine: "Italian",
        priceRange: "₹₹₹",
        rating: 4.7,
        reviewCount: 205,
        location: "Saoner, Maharashtra",
        address: "244 Fifth Ave Rooftop, New York, NY 10001",
        image: "/restaurant_3.png",
        chef: "Elena Rossi",
        tags: ["Rooftop", "Skyline Views", "Handmade Pasta", "Craft Cocktails"],
        availableSlots: ["12:00 pm", "1:00 pm", " pm", "3:00 pm", "4:00 pm", "5:00 pm", "6:00 pm"],
        featured: true,
        exclusive: false,
    },
  
];

  console.log("Inserting restaurants...");
  const updatedRestaurantsData = RestaurantsData.map((rest, idx)=>{
    const {...restInfo} = rest;
    return {
        ...restInfo,
        owner: ownerUser._id,
        status: "approved",
        totalSeats: 20 + idx * 5,
    }
  })
  await Restaurant.insertMany(updatedRestaurantsData)
  console.log("Seeding complete! Disconnecting...");

  await mongoose.disconnect();  
  console.log("Disconnected from database");

    } catch (error:any) {
        console.error("Seeding failed", error)
        process.exit(1);
    }
}
seedData();