import express, { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import {
  CreateCustomerInput,
  UserLoginInput,
  EditCustomerProfileInput,
  OrderInputs,
} from "../dto";
import {
  GeneratePassword,
  generateSalt,
  GenerateOTP,
  onRequestOtp,
  GenerateSignature,
  validatePassword,
} from "../ultil";
import { Customer, Food, Order } from "../models";

export const CustomerSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInput = plainToClass(CreateCustomerInput, req.body);

  const inputErrors = await validate(customerInput);
  if (inputErrors.length > 0) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: inputErrors });
  }
  const { email, Phone, password } = customerInput;
  const salt = await generateSalt();
  const userPassword = await GeneratePassword(password, salt); // hash the password with the salt
  const { otp, expiry } = GenerateOTP();
  const existCustomer = await Customer.findOne({ email: email });
  if (existCustomer !== null) {
    return res
      .status(409)
      .json({ message: "Customer with this email already exists" });
  }
  const result = await Customer.create({
    email: email,
    Phone: Phone,
    password: userPassword,
    salt: salt,
    otp: otp,
    otp_expiry: expiry,
    verified: false,
    lat: 0, // Default value, can be updated later
    lng: 0, // Default value, can be updated later
    firstName: "",
    lastName: "",
    address: "",
    orders: [],
  });
  if (result) {
    // send the OTP to the user
    await onRequestOtp(otp, Phone);
    // generate a signature for the user
    const signature = GenerateSignature({
      _id: String(result._id),
      email: result.email,
      verified: result.verified,
    });
    //send the result client
    return res.status(201).json({
      message: "Customer created successfully. Please verify your OTP.",
      signature: signature,
      verified: result.verified,
      email: result.email,
    });
  }

  return res.status(500).json({
    message: "Failed to create customer",
  });
};
export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginInput = plainToClass(UserLoginInput, req.body);
  const inputErrors = await validate(loginInput);
  if (inputErrors.length > 0) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: inputErrors });
  }
  const { email, password } = loginInput;
  const customer = await Customer.findOne({ email: email });

  if (customer) {
    const validation = await validatePassword(
      password,
      customer.password,
      customer.salt
    );
    if (validation) {
      const signature = GenerateSignature({
        _id: String(customer._id),
        email: customer.email,
        verified: customer.verified,
      });
      return res.status(200).json({
        message: "Login successful",
        signature: signature,
        verified: customer.verified,
        email: customer.email,
      });
    }
    return res.status(401).json({ message: "Invalid password" });
  }
  return res.status(400).json({ message: "Login credential not valid" });
};
export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;
  const user = req.user;
  if (user) {
    const existingCustomer = await Customer.findById(user._id);
    if (existingCustomer) {
      if (existingCustomer.otp === parseInt(otp)) {
        if (existingCustomer.otp_expiry < new Date()) {
          return res.status(400).json({ message: "OTP expired het han" });
        }
        existingCustomer.verified = true;
        const updateCustomerRes = await existingCustomer.save();
        const signature = GenerateSignature({
          _id: String(updateCustomerRes._id),
          email: updateCustomerRes.email,
          verified: updateCustomerRes.verified,
        });
        return res.status(200).json({
          message: "Account verified successfully",
          signature: signature,
          verified: updateCustomerRes.verified,
          email: updateCustomerRes.email,
        });
      } else {
        return res.status(400).json({ message: "Invalid OTP" });
      }
    }
    return res.status(404).json({ message: "Customer not found" });
  }
  return res
    .status(400)
    .json({ message: "User not authenticated validate OTP" });
};

export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const existingCustomer = await Customer.findById(customer._id);
    if (existingCustomer) {
      const { otp, expiry } = GenerateOTP();
      existingCustomer.otp = otp;
      existingCustomer.otp_expiry = expiry;
      await existingCustomer.save();
      // send the OTP to the user
      await onRequestOtp(otp, existingCustomer.Phone);
      return res.status(200).json({
        message: "OTP sent successfully",
      });
    }
    return res.status(404).json({ message: "Customer not found" });
  }
  return res.status(400).json({ message: "User not authenticated" });
};

export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const existingCustomer = await Customer.findById(customer._id).populate({
      path: "orders",
      populate: {
        path: "items.food",
        model: "food",
      },
    });
    if (existingCustomer) {
      return res.status(200).json(existingCustomer);
    }
    return res.status(404).json({ message: "Customer not found" });
  }
  return res.status(400).json({ message: "User not authenticated" });
};

export const EditCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  const ProfileInput = plainToClass(EditCustomerProfileInput, req.body);
  // Validate the input
  const inputErrors = await validate(ProfileInput);
  if (inputErrors.length > 0) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: inputErrors });
  }
  const { firstName, lastName, address } = ProfileInput;
  if (customer) {
    const existingCustomer = await Customer.findById(customer._id);
    if (existingCustomer) {
      existingCustomer.firstName = firstName;
      existingCustomer.lastName = lastName;
      existingCustomer.address = address;

      const updatedCustomer = await existingCustomer.save();
      return res.status(200).json(updatedCustomer);
    }
    return res.status(404).json({ message: "Customer not found" });
  }
  return res.status(400).json({ message: "User not authenticated" });
};
export const CreateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //grab current login customer
  const customer = req.user;
  if (customer) {
    // create an order Id
    const orderId = `${Math.floor(Math.random() * 8999) + 1000}`;

    const existingCustomer = await Customer.findById(customer._id);
    if (!existingCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    //grab order items from request [{id:xx, unit:xx}]
    const cart = <OrderInputs[]>req.body; // [{id:xx, unit:xx}]
    let cartItems = Array();
    let netAmount = 0.0;

    //caculate total amount
    const foods = await Food.find()
      .where("_id")
      .in(cart.map((item) => item._id))
      .exec();

    foods.map((food) => {
      cart.map(({ _id, unit }) => {
        if (String(food._id) === _id) {
          netAmount += food.price * unit;
          cartItems.push({ food, unit });
        }
      });
    });
    //create order with item description
    if (cartItems) {
      // create order
      const currentOrder = await Order.create({
        orderId: orderId,
        items: cartItems,
        totalAmount: netAmount,
        orderDate: new Date(),
        paidThrough: "COD", // default payment method
        paymentResponse: "", // default response
        orderStatus: "Waiting", // default status
      });
      if (currentOrder !== null) {
        existingCustomer.orders.push(currentOrder);
        await existingCustomer.save();
        return res.status(201).json(currentOrder);
      }
    }
    //finlly update orders to user account
  }
  return res.status(500).json({ message: "Failed to create order" });
};

export const GetOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const existingCustomer = await Customer.findById(customer._id).populate({
      path: "orders",
    });
    if (existingCustomer) {
      return res.status(200).json(existingCustomer.orders);
    }
    return res.status(404).json({ message: "Customer not found" });
  }
  return res.status(400).json({ message: "User not authenticated" });
};
export const GetOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  const orderId = req.params.id;

  if (customer) {
    const order = await Order.findById(orderId).populate("items.food");
    if (order) {
      return res.status(200).json(order);
    }
    return res.status(404).json({ message: "Order not found" });
  }
  return res.status(400).json({ message: "User not authenticated" });
};
