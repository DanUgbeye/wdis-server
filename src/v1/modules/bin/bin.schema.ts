import mongoose from "mongoose";
import { BIN_STATUS, BinDocument } from "./bin.types";

const binSchema = new mongoose.Schema<BinDocument>(
  {
    name: {
      required: true,
      type: String,
    },
    location: {
      required: true,
      type: String,
      unique: true,
    },
    status: {
      required: true,
      type: String,
      enum: [BIN_STATUS.EMPTY, BIN_STATUS.FULL, BIN_STATUS.IN_DISPOSAL],
      default: BIN_STATUS.EMPTY,
    },
  },
  {
    timestamps: true,
  }
);

const binRepo = mongoose.model("Bin", binSchema);
export default binRepo;
