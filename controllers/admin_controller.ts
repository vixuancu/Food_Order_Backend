import { NextFunction, Request, Response } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { generateSalt, hashPassword } from "../ultil";


export const CreateVendor = async (req: Request, res: Response, next: NextFunction) => {


    // Logic to create a vendor
    const { name, ownerName, address, foodType, pincode, phone, email, password } = <CreateVendorInput>req.body;


    const existingVendor = await Vendor.findOne({ email: email });
    if (existingVendor !== null) {
         return res.status(409).json({ message: "Vendor with this email already exists" });
    }
    
    // generate salt
    const salt = await generateSalt();
    const userPassword = await hashPassword(password, salt); // hash the password with the salt
    //encrypt password using the salt

    const createVendor = await Vendor.create({
        name: name,
        ownerName: ownerName,
        address: address,
        foodType: foodType,
        pincode: pincode,
        phone: phone,
        email: email,
        password: userPassword,
        salt: salt,
        serviceAvailable: false,
        coverImage: [],
        rating: 0,
    });

    res.json(createVendor);
};
export const GetVendors = (req: Request, res: Response, next: NextFunction) => {
    // Logic to get all vendors
    res.status(200).json({ message: "Vendors retrieved successfully" });
};

export const GetVendorById = (req: Request, res: Response, next: NextFunction) => {
    // Logic to get a vendor by ID
    const vendorId = req.params.id;
    res.status(200).json({ message: `Vendor with ID ${vendorId} retrieved` });
};
