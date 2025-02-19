import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    attachmentName: { type: String },
    attachmentType: { type: String },
    attachmentUrl: { type: String },
    sourcePath: { type: String },
    executionPath: { type: String, required: true },
    editingName: { type: String },
    useVscode: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const PackageSchema = new mongoose.Schema(
  {
    serialNumber: { type: String, unique: true },
    orders: {
      type: [OrderSchema],
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    expireAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      index: { expires: "7d" },
    },
    validUntil: {
      type: Date,
      default: () => new Date(Date.now() + 1000 * 30 * 60 * 1000),
    },
  },
  { timestamps: true },
);

const Package = mongoose.model("Package", PackageSchema);
const Order = mongoose.model("Order", OrderSchema);

export { Package, Order };
