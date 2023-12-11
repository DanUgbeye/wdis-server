import { Document } from "mongoose";

export type DisposalStatus =
  (typeof DISPOSAL_STATUS)[keyof typeof DISPOSAL_STATUS];

export const DISPOSAL_STATUS = {
  ONGOING: "ongoing",
  COMPLETED: "completed",
} as const;

export interface DisposalData {
  binId: string;
  status: DisposalStatus;
  disposedAt: Date;
}

export interface DisposalDocument extends Document, DisposalData {}

export type DisposalStats = {
  total: number;
  ongoing: number;
  completed: number;
};
