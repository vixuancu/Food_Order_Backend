import express, { Request, Response, NextFunction } from "express";
import {
  CustomerLogin,
  CustomerSignup,
  CustomerVerify,
  EditCustomerProfile,
  GetCustomerProfile,
  RequestOtp,
  CreateOrder,
  GetOrders,
  GetOrderById,
  AddToCart,
  DeleteCart,
  GetCart,
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
router.post("/cart", AddToCart);
router.get("/cart", GetCart);
router.delete("/cart", DeleteCart);
// payment

//order
router.post("/create-order", CreateOrder);
router.get("/orders", GetOrders);
router.get("/order/:id", GetOrderById);

export { router as CustomerRouter };
