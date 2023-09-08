import { Document } from "mongoose";

export interface UserData {
  email: string;
  fullname: string;
  password?: string;
  googleId?: string;
  sex: string;
  dob: Date;
  address?: string;
  phoneNumber?: string;
  profileImage?: string;
  disabled: boolean;
  verified: boolean;
  setupComplete: boolean;
}

export interface UserDocument extends Document, UserData {}
