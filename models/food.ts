import mongoose, {Schema,Document} from "mongoose";

export interface FoodDoc extends Document {
    vendorId: string;
    name: string;
    description: string;
    category: string;
    foodType: string;
    readyTime: number;
    price: number;
    rating: number;
    images: [string];
}
const FoodSchema = new Schema<FoodDoc>({
    vendorId: { type: String,required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    foodType: { type: String, required: true },
    readyTime: { type: Number, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, },
    images: { type: [String] }
}, {
    toJSON:{
        transform:(doc,ret) => {
            delete (ret as any).__v;
            delete (ret as any).createdAt;
            delete (ret as any).updatedAt;
        }
    },
    timestamps:true
});
const Food = mongoose.model<FoodDoc>("food", FoodSchema);
export {Food};