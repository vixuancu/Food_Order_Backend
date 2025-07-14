import mongoose, { Document, Schema } from "mongoose";
interface CustomerDoc extends Document {
  email: string;
  Phone: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  address: string;
  verified: boolean;
  otp: number;
  otp_expiry: Date;
  lat: number; // Latitude
  lng: number; // Longitude
}
const CustomerSchema = new Schema<CustomerDoc>(
  {
    email: { type: String, required: true, unique: true },
    Phone: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    verified: { type: Boolean, required: true },
    otp: { type: Number, required: true },
    otp_expiry: { type: Date, required: true },
    lat: { type: Number },
    lng: { type: Number },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        delete (ret as any).password;
        delete (ret as any).salt;
        delete (ret as any).__v;
        delete (ret as any).createdAt;
        delete (ret as any).updatedAt;
      },
    },
    timestamps: true,
  }
);
const Customer = mongoose.model<CustomerDoc>("customer", CustomerSchema);

export { Customer };
