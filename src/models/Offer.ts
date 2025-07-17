import mongoose, { Schema, Document } from "mongoose";

export interface OfferDoc extends Document {
  offerType: string; // VENDOR , GENERIC
  vendors: [any]; // Array of vendor IDs or objects
  title: string;
  description: string;
  minValue: number; // Minimum order value to apply the offer
  offerAmount: number; // Amount to be discounted
  startValidity: Date; // Start date of the offer
  endValidity: Date; // End date of the offer
  promoCode: string; // Optional promo code for the offer
  promoType: string; // USER,ALL,BANK,CARD
  bank: [any];
  bins: [any]; // Array of bank IDs or objects
  pincode: string; // Applicable pincode for the offer
  isActive: boolean; // Whether the offer is currently active
}
const OfferSchema = new Schema<OfferDoc>(
  {
    offerType: { type: String, required: true },
    vendors: [{ type: Schema.Types.ObjectId, ref: "vendor" }], // Array of vendor IDs or objects
    title: { type: String },
    description: { type: String },
    minValue: { type: Number, required: true },
    offerAmount: { type: Number, required: true },
    startValidity: { type: Date },
    endValidity: { type: Date },
    promoCode: { type: String },
    promoType: { type: String },
    bank: [{ type: String }],
    bins: [{ type: String }],
    pincode: { type: String, required: true },
    isActive: { type: Boolean },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        delete (ret as any).__v;
      },
    },
    timestamps: true,
  }
);
const Offer = mongoose.model<OfferDoc>("offer", OfferSchema);
export { Offer };
