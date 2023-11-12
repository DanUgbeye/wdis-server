import { Document } from "mongoose";

export type BinStatus = (typeof BIN_STATUS)[keyof typeof BIN_STATUS];

export const BIN_STATUS = {
  FULL: "full",
  EMPTY: "empty",
  IN_DISPOSAL: "in-disposal",
} as const;

export interface BinData {
  location: string;
  status: BinStatus;
}

export interface BinDocument extends Document, BinData {}
