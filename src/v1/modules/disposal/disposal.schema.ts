import mongoose from "mongoose";
import { DisposalDocument } from "./disposal.types";

const disposalSchema = new mongoose.Schema<DisposalDocument>({
  binId: {
    type: String,
    ref: "Bin",
  },
  status: {
    type: String,
    enum: ["ongoing", "completed"],
    default: "ongoing",
  },
  disposedAt: {
    type: Date,
    default: () => new Date(),
  },
});

const disposalRepo = mongoose.model("Disposal", disposalSchema);
export default disposalRepo;
