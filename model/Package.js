const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    attachmentName: { type: String },
    attachmentUrl: { type: String },
    sourcePath: { type: String },
    executionPath: { type: String, required: true },
    editingName: { type: String },
  },
  { timestamps: true },
);

const PackageSchema = new mongoose.Schema(
  {
    serialNumber: { type: Number },
    orders: {
      type: [OrderSchema],
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    expireAt: { type: Date, default: new Date(), expires: 600 },
  },
  { timestamps: true },
);

const Package = mongoose.model("Package", PackageSchema);

module.exports = { Package };
