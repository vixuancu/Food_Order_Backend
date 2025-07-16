import mongoose, { Schema, Document } from "mongoose";

export interface OrderDoc extends Document {
  orderId: string; // 5948764
  vendorId: string; // Vendor ID
  items: [any]; //[{food,unit:1}]
  totalAmount: number; // 100.00
  orderDate: Date; // 2023-10-01T12:00:00Z
  paidThrough: string; // "COD", "CASH", etc.
  paymentResponse: string; // "Payment successful", "Payment failed", etc.
  orderStatus: string; //status //waiting-failed  ACCEPTED // REJECTED // UNDER_PROCESS // READY
  remarks: string; // Additional remarks about the order
  deliveryId: string; // ID of the delivery person
  appliedOffers: boolean; // Whether the order has applied offers
  offerId: string; // ID of the offer applied to the order
  readyTime: number; // max 60 minutes
}
const OrderSchema = new Schema<OrderDoc>(
  {
    orderId: { type: String, required: true, unique: true },
    vendorId: { type: String, required: true },
    items: [
      {
        food: { type: Schema.Types.ObjectId, ref: "food", required: true },
        unit: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date },
    paidThrough: { type: String },
    paymentResponse: { type: String },
    orderStatus: { type: String },
    remarks: { type: String },
    deliveryId: { type: String },
    appliedOffers: { type: Boolean },
    offerId: { type: String },
    readyTime: { type: Number, required: true, max: 60 },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        delete (ret as any).__v;
        delete (ret as any).createdAt;
        delete (ret as any).updatedAt;
      },
    },
    timestamps: true,
  }
);
const Order = mongoose.model<OrderDoc>("order", OrderSchema);
export { Order };
