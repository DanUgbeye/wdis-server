import mongoose from "mongoose";
import { USER_ROLES, UserDocument } from "./user.types";

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: {
      required: true,
      type: String,
      unique: true,
    },
    fullname: {
      required: true,
      type: String,
    },
    sex: {
      required: true,
      type: String,
    },
    dob: {
      required: true,
      type: Date,
    },
    address: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    password: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    setupComplete: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: USER_ROLES.USER,
      enum: [USER_ROLES.USER, USER_ROLES.DISPOSER, USER_ROLES.ADMIN],
    },
  },
  {
    timestamps: true,
  }
);

export default userSchema;
