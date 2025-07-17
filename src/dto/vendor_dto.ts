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
  _id: string;
  email: string;
  name: string;
  foodType: [string];
}
export interface CreateOfferInput {
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
