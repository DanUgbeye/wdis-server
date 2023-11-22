import { Document } from "mongoose";

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  DISPOSER: "disposer",
} as const;

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
  role: UserRole;
}

export interface UserDocument extends Document, UserData {}
