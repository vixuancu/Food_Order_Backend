import mongoose, { Document, Schema } from "mongoose";
interface VendorDoc extends Document {
    name: string;
    ownerName: string;
    foodType: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    salt: string;
    serviceAvailable: boolean;
    coverImage: [string];
    rating: number;
    foods: any;
}
const vendorSchema = new Schema<VendorDoc>({
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodType: { type: [String], required: true },
    pincode: { type: String, required: true },
    address: { type: String},
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvailable: { type: Boolean },
    coverImage: { type: [String] },
    rating: { type: Number },
    foods:[
        {
            type: Schema.Types.ObjectId,
            ref: "food"
        }
    ]
}, {
    toJSON:{
        transform: (doc, ret) => {
            delete (ret as any).password;
            delete (ret as any).salt;
            delete (ret as any).__v; 
            delete (ret as any).createdAt; 
            delete (ret as any).updatedAt; 
        }
    },
    timestamps: true,
});
const Vendor = mongoose.model<VendorDoc>("vendor", vendorSchema);

export { Vendor };
