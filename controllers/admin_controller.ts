import { NextFunction, Request, Response } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { generateSalt, GeneratePassword } from "../ultil";

export const FindVendor = async (id : string | undefined,email?: string) => {
if(email) {
    return await Vendor.findOne({ email: email });
    
}else {
    return await Vendor.findById(id);
}

}

export const CreateVendor = async (req: Request, res: Response, next: NextFunction) => {


    // Logic to create a vendor
    const { name, ownerName, address, foodType, pincode, phone, email, password } = <CreateVendorInput>req.body;


    const existingVendor = await FindVendor(undefined, email);
    if (existingVendor !== null) {
         return res.status(409).json({ message: "Vendor with this email already exists" });
    }
    
    // generate salt
    const salt = await generateSalt();
    const userPassword = await GeneratePassword(password, salt); // hash the password with the salt
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
export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {
    // Logic to get all vendors
    const vendors = await Vendor.find();
    if (vendors !== null) {
        return res.status(200).json(vendors);
    }
    res.status(404).json({ message: "No vendors found" });
};

export const GetVendorById = async (req: Request, res: Response, next: NextFunction) => {
    // Logic to get a vendor by ID
    const vendorId = req.params.id;
    const vendor = await FindVendor(vendorId);
    if (vendor !== null) {
        return res.status(200).json(vendor);
    }
    res.status(404).json({ message: "Vendor not found" });
};
