import express, { NextFunction, Request, Response } from "express";

const router = express.Router(); // Define the router

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: "Vendor route is working",
  });
});
export { router as vendorRouter };

