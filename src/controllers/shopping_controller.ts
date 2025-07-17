import express, { Request, Response, NextFunction } from "express";
import { FoodDoc, Offer, Vendor } from "../models";

export const GetFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;
  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: true,
  })
    .sort([["rating", "desc"]])
    .populate("foods");

  if (result.length > 0) {
    return res.status(200).json(result);
  }
  return res.status(404).json({ message: "data not found" });
};

export const GetTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;
  const result = await Vendor.find({ pincode: pincode, serviceAvailable: true })
    .sort([["rating", "desc"]])
    .limit(2);

  if (result.length > 0) {
    return res.status(200).json(result);
  }
  return res.status(404).json({ message: "data not found" });
};

export const GetFoodsIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;
  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: true,
  }).populate("foods");

  if (result.length > 0) {
    let foodsIn30Min: any = [];

    result.map((vendor) => {
      const foods = vendor.foods as FoodDoc[];
      foodsIn30Min.push(...foods.filter((food) => food.readyTime <= 30));
    });
    return res.status(200).json(foodsIn30Min);
  }
  return res.status(404).json({ message: "data not found" });
};

export const SearchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;
  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: true,
  }).populate("foods");

  if (result.length > 0) {
    let foodsSearch: any = [];
    result.map((item) => foodsSearch.push(...item.foods));
    return res.status(200).json(foodsSearch);
  }
  return res.status(404).json({ message: "data not found" });
};
export const RestaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const result = await Vendor.findById(id).populate("foods");

  if (result) {
    return res.status(200).json(result);
  }
  return res.status(404).json({ message: "data not found" });
};
/****************  *****************/
export const GetOffersByPincode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;
  // Assuming you have an Offer model to fetch offers
  const offers = await Offer.find({
    pincode: pincode,
    isActive: true,
  }).populate("vendors");

  if (offers.length > 0) {
    return res.status(200).json(offers);
  }
  return res.status(404).json({ message: "No offers found" });
};
