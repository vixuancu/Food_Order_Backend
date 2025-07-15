import mongoose, { Schema, Document } from "mongoose";

export interface OrderDoc extends Document {
  orderId: string; // 5948764
  items: [any]; //[{food,unit:1}]
  totalAmount: number; // 100.00
  orderDate: Date; // 2023-10-01T12:00:00Z
  paidThrough: string; // "COD", "CASH", etc.
  paymentResponse: string; // "Payment successful", "Payment failed", etc.
  orderStatus: string; // "PENDING", "COMPLETED", "CANCELLED"
}
const OrderSchema = new Schema<OrderDoc>(
  {
    orderId: { type: String, required: true, unique: true },
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
