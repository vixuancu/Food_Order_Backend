import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { APP_SECRET } from "../config";
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
  return jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
};
export const ValidateSignature = async (req: Request) => {
  const signature = req.get("Authorization");
  if (signature) {
    const payload = jwt.verify(
      signature.split(" ")[1],
      APP_SECRET
    ) as AuthPayload;
    req.user = payload;
    return true;
  }
  return false;
};
