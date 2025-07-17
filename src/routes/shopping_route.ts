import express, { Request, Response, NextFunction } from "express";
import {
  GetFoodAvailability,
  GetFoodsIn30Min,
  GetOffersByPincode,
  GetTopRestaurants,
  RestaurantById,
  SearchFoods,
} from "../controllers";

const router = express.Router();

/**************** Food Availability *****************/
router.get("/:pincode", GetFoodAvailability);
/**************** Top Restaurants *****************/
router.get("/top-restaurants/:pincode", GetTopRestaurants);
/**************** Food Available in 30 minutes *****************/
router.get("/foods-in-30-min/:pincode", GetFoodsIn30Min);

/**************** Search Foods *****************/
router.get("/search/:pincode", SearchFoods);
/**************** Find restaurant by id *****************/
router.get("/restaurant/:id", RestaurantById);

/**************** Find Offers *****************/
router.get("/offers/:pincode", GetOffersByPincode);

export { router as ShoppingRouter };
