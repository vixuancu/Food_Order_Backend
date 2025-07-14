import express, { Request, Response, NextFunction } from "express";
import {
  CustomerLogin,
  CustomerSignup,
  CustomerVerify,
  EditCustomerProfile,
  GetCustomerProfile,
  RequestOtp,
} from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

/**************** Signup/ Create customer *****************/
router.post("/signup", CustomerSignup);
/**************** Login *****************/
router.post("/login", CustomerLogin);

// authentication
router.use(Authenticate);
/**************** Verify Customer Account *****************/
router.patch("/verify-account", CustomerVerify);
/**************** OTP / requesting OTP *****************/
router.get("/otp", RequestOtp);
/**************** Profile *****************/
router.get("/profile", GetCustomerProfile);
router.patch("/profile", EditCustomerProfile);

// cart
//order
// payment
export { router as CustomerRouter };
