import { NextFunction, Request, Response } from "express";
import { AuthPayload } from "../dto";
import { ValidateSignature } from "../ultil";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
export const Authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("🔍 Authentication middleware called");
  console.log("📝 Headers:", req.headers.authorization);

  const validate = await ValidateSignature(req);
  console.log("✅ Validation result:", validate);

  if (validate) {
    console.log("👤 User authenticated:", req.user);
    next();
  } else {
    console.log("❌ Authentication failed");
    return res.status(401).json({ message: "user not Unauthorized" });
  }
};
