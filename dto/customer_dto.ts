import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateCustomerInput {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(8, 12)
  Phone: string;

  @Length(6, 20)
  password: string;
}
export class EditCustomerProfileInput {
  @Length(1, 16)
  firstName: string;

  @Length(1, 16)
  lastName: string;

  address: string;
}
export interface CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
}
export class UserLoginInput {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
