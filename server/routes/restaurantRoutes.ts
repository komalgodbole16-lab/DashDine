import { Router } from "express";
import { getFeaturedRestaurants, getRestaurantAvailability, getRestaurants, getRestaurantsBySlug } from "../controllers/restaurant.Controller.js";

const restaurantRouter = Router();

restaurantRouter.get('/', getRestaurants);
restaurantRouter.get('/featured', getFeaturedRestaurants);
restaurantRouter.get('/:slug', getRestaurantsBySlug);
restaurantRouter.get('/:id/availibility', getRestaurantAvailability);

export default restaurantRouter;
