import express, { NextFunction, Request, Response } from "express";
import {
  AddFood,
  GetCurrentOrders,
  GetFoods,
  GetOrderDetails,
  GetVendorProfile,
  ProcessOrder,
  UpdateVendorCoverimage,
  UpdateVendorProfile,
  UpdateVendorService,
  VendorLogin,
} from "../controllers";
import { Authenticate } from "../middlewares";
import multer from "multer";
const router = express.Router(); // Define the router

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const images = multer({ storage: imageStorage }).array("images", 10); // tối đa upload 10 file cùng lúc
router.post("/login", VendorLogin);

router.use(Authenticate); // Apply authentication middleware to all routes below
router.get("/profile", GetVendorProfile);
router.patch("/profile", UpdateVendorProfile);
router.patch("/coverimage", images, UpdateVendorCoverimage); // Use multer middleware for file uploads
router.patch("/service", UpdateVendorService);

router.post("/food", images, AddFood);
router.get("/foods", GetFoods);

/**************** Orders *****************/
router.get("/orders", GetCurrentOrders);
router.put("/order/:id/process", ProcessOrder);
router.get("/order/:id", GetOrderDetails);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: "Vendor route is working",
  });
});
export { router as vendorRouter };
