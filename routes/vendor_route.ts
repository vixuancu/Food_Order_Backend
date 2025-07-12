import express, { NextFunction, Request, Response } from "express";
import { GetVendorProfile, UpdateVendorProfile, UpdateVendorService, VendorLogin } from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router(); // Define the router

router.post("/login",VendorLogin);

router.use(Authenticate); // Apply authentication middleware to all routes below
router.get("/profile",GetVendorProfile);
router.patch("/profile",UpdateVendorProfile);
router.patch("/service",UpdateVendorService);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: "Vendor route is working",
  });
});
export { router as vendorRouter };

