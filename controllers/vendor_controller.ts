import {Request,Response,NextFunction} from "express";
import { EditVendorInput, LoginVendorInput } from "../dto";
import { FindVendor } from "./admin_controller";
import { GenerateSignature, validatePassword } from "../ultil";

export const VendorLogin = async (req: Request, res: Response, next: NextFunction) => {
    // Logic for vendor login
    const { email, password } = <LoginVendorInput>req.body;

    const existingVendor = await FindVendor(undefined, email);
    if (existingVendor !== null) {
        // validation and give access
        const validation = await validatePassword(password, existingVendor.password, existingVendor.salt);
        if (validation) {
            const signature = GenerateSignature({
                _id: existingVendor._id,
                email: existingVendor.email,
                name: existingVendor.name,
                foodType: existingVendor.foodType
            })
            return res.status(200).json({
                message: "Login successful",
                signature: signature,});
        }else {
            return res.status(401).json({ message: "Invalid password" });
        }
    }
    return res.status(400).json({ message: "Login credential not valid" });
}
export const GetVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
        const existingVendor = await FindVendor(user._id);
        if (existingVendor) {
            return res.status(200).json(existingVendor);
        } 
    }
     return res.status(404).json({ message: "Vendor not found" });
}
export const UpdateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const {name,address,phone,foodType} = <EditVendorInput>req.body;
    const user = req.user;
    if (user) {
        const existingVendor = await FindVendor(user._id);
        if (existingVendor!== null) {
            existingVendor.name = name;
            existingVendor.address = address;
            existingVendor.phone = phone;
            existingVendor.foodType = foodType;

            const updatedVendor = await existingVendor.save();
            return res.status(200).json(updatedVendor);
        }
        

    }
     return res.status(404).json({ message: "Vendor not found" });
}
export const UpdateVendorService = async (req: Request, res: Response, next: NextFunction) => {
    
    const user = req.user;
    if (user) {
        const existingVendor = await FindVendor(user._id);
        if (existingVendor!== null) {
            existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
            

            const updatedService = await existingVendor.save();
            return res.status(200).json(updatedService);
        }
        
    }
      return res.status(404).json({ message: "Vendor not found to Update Service" });
}
