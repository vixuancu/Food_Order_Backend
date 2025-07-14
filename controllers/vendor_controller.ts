import { Request, Response, NextFunction } from "express";
import { CreateFoodInput, EditVendorInput, LoginVendorInput } from "../dto";
import { FindVendor } from "./admin_controller";
import { GenerateSignature, validatePassword } from "../ultil";
import { Food } from "../models";

export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Logic for vendor login
  const { email, password } = <LoginVendorInput>req.body;

  const existingVendor = await FindVendor(undefined, email);
  if (existingVendor !== null) {
    // validation and give access
    const validation = await validatePassword(
      password,
      existingVendor.password,
      existingVendor.salt
    );
    if (validation) {
      const signature = GenerateSignature({
        _id: String(existingVendor._id),
        email: existingVendor.email,
        name: existingVendor.name,
        foodType: existingVendor.foodType,
      });
      return res.status(200).json({
        message: "Login successful",
        signature: signature,
      });
    } else {
      return res.status(401).json({ message: "Invalid password" });
    }
  }
  return res.status(400).json({ message: "Login credential not valid" });
};
export const GetVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingVendor = await FindVendor(user._id);
    if (existingVendor) {
      return res.status(200).json(existingVendor);
    }
  }
  return res.status(404).json({ message: "Vendor not found" });
};
export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, address, phone, foodType } = <EditVendorInput>req.body;
  const user = req.user;
  if (user) {
    const existingVendor = await FindVendor(user._id);
    if (existingVendor !== null) {
      existingVendor.name = name;
      existingVendor.address = address;
      existingVendor.phone = phone;
      existingVendor.foodType = foodType;

      const updatedVendor = await existingVendor.save();
      return res.status(200).json(updatedVendor);
    }
  }
  return res.status(404).json({ message: "Vendor not found" });
};
export const UpdateVendorCoverimage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingVendor = await FindVendor(user._id);
    if (existingVendor !== null) {
      const files = req.files as Express.Multer.File[];
      const images = files.map((file) => file.filename); // Assuming you want to store the filenames of uploaded images

      existingVendor.coverImage.push(...images); // Add new images to the existing coverImage array
      const result = await existingVendor.save();

      return res.status(201).json(result);
    }
  }

  return res
    .status(501)
    .json({ message: "something went wrong update coverimage" });
};
export const UpdateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingVendor = await FindVendor(user._id);
    if (existingVendor !== null) {
      existingVendor.serviceAvailable = !existingVendor.serviceAvailable;

      const updatedService = await existingVendor.save();
      return res.status(200).json(updatedService);
    }
  }
  return res
    .status(404)
    .json({ message: "Vendor not found to Update Service" });
};
export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const { name, description, category, foodType, readyTime, price } = <
      CreateFoodInput
    >req.body;
    const existingVendor = await FindVendor(user._id);
    if (existingVendor !== null) {
      const files = req.files as Express.Multer.File[];
      const images = files.map((file) => file.filename); // Assuming you want to store the filenames of uploaded images
      const createFood = await Food.create({
        vendorId: existingVendor._id,
        name,
        description,
        category,
        foodType,
        readyTime,
        price,
        images: images,
        rating: 0,
      });

      existingVendor.foods.push(createFood._id);
      await existingVendor.save();

      // Populate foods để trả về đầy đủ thông tin food thay vì chỉ ID
      const result = await existingVendor.populate("foods");
      return res.status(201).json(result);
    }
  }

  return res.status(501).json({ message: "something went wrong add food" });
};
export const GetFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const foods = await Food.find({ vendorId: user._id });
    if (foods.length > 0) {
      return res.status(200).json(foods);
    }
  }

  return res.status(501).json({ message: "something went wrong Get foods" });
};
