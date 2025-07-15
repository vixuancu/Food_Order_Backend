import { VendorPayload } from "./vendor_dto";
import { CustomerPayload } from "./customer_dto";

export type AuthPayload = VendorPayload | CustomerPayload;
