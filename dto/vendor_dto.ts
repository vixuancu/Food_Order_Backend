export interface CreateVendorInput {
    name: string;
    ownerName: string;
    address: string;
    foodType: [string];
    pincode: string;
    phone: string;
    email: string;
    password: string;
}
export interface LoginVendorInput {
    email: string;
    password: string;
}
export interface EditVendorInput {
    name: string;
    address: string;
    phone: string;
    foodType: [string];
}
export interface VendorPayload {
    _id:string;
    email:string;
    name:string;
    foodType:[string];
}