import express, { NextFunction, Request, Response } from "express";
import { CreateVendor, GetVendorById, GetVendors } from "../controllers";

const router = express.Router(); // Define the router

router.post("/vendor", CreateVendor);
router.get("/vendors", GetVendors);
router.get("/vendor/:id", GetVendorById);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: "Admin route is working test port 8000",
  });
});

export { router as adminRouter };

