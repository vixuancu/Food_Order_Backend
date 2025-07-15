import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request } from "express";
import { AuthPayload, VendorPayload } from "../dto";

export const generateSalt = async () => {
  return await bcrypt.genSalt();
};
export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};
export const validatePassword = async (
  enterPassword: string,
  savePassword: string,
  salt: string
) => {
  return (await GeneratePassword(enterPassword, salt)) === savePassword;
};
export const GenerateSignature = (payload: AuthPayload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign(payload, secret, { expiresIn: "1d" });
};
export const ValidateSignature = async (req: Request) => {
  const signature = req.get("Authorization");
  if (signature) {
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }
      const payload = jwt.verify(
        signature.split(" ")[1],
        secret
      ) as AuthPayload;
      req.user = payload;
      return true;
    } catch (error) {
      return false;
    }
  }
  return false;
};
