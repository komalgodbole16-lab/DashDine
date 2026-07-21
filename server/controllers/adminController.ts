import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import { Restaurant } from "../models/restaurant.js";
import { User } from "../models/user.js";
import { Booking } from "../models/Booking.js";

// Get all restaurant for admin management
// GET /api/admin/restaurants

export const getAllRestaurants = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const restaurants = await Restaurant.find({}).populate("owner", "name, email, phone").sort({ createAt: -1})

    res.json(restaurants)
  } catch (error: any) {
     console.error(error);
     res.status(400).json({message: error.message}); 
  }
}

// Approve/Reject a restaurant profile
// PUT /api/admin/restaurants/:id/approve

export const approveRestaurant = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    if(!status || !["approved", "rejected", "pendind"].includes(status)){
        res.status(400).json({message: "Please provide a valid approval status"});
        return;
    }
  
    const restaurant = await Restaurant.findById(req.params.id);
    if(!restaurant){
        res.status(404).json({message: "Restaurant profile is not found"});
        return;
    }

    restaurant.status = status;
    await restaurant.save();

    res.json(restaurant);

  } catch (error: any) {
     console.error(error);
     res.status(400).json({message: error.message}); 
  }
}

// Get system statistics
// GET /api/admin/statsrestaurants/:id/approve

export const getAdminStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments({role: "user"});
    const totalOwners = await User.countDocuments({role: "owner"});
    const totalBookings = await Booking.countDocuments({});
    const totalRestaurants = await Restaurant.countDocuments({})

   //Get latest 10 bookings
   const latestBookings = await Booking.find({}).populate("user", "name email").populate("restaurant" ,"name").sort({createAt: -1}).limit(10)

   res.json({
    users: {
        totalUsers,
        totalOwners,
        total: totalUsers + totalOwners,
    },
    Restaurant: {
        total: totalRestaurants,
    },
    bookings: {
        total: totalBookings
    },
    latestBookings
   })

  } catch (error: any) {
     console.error(error);
     res.status(400).json({message: error.message}); 
  }
}