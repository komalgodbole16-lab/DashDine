import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { cancelBookings, createBooking, getMyBookings, confirmPayment } from "../controllers/bookingController.js";

const bookingRouter = Router();

bookingRouter.post("/", protect, createBooking)
bookingRouter.get("/my", protect, getMyBookings)
bookingRouter.put("/:id/cancel", protect, cancelBookings)
bookingRouter.put("/:id/confirm-payment", protect, confirmPayment);

export default bookingRouter;