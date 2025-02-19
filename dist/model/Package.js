"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.Package = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const OrderSchema = new mongoose_1.default.Schema({
    action: { type: String, required: true },
    attachmentName: { type: String },
    attachmentType: { type: String },
    attachmentUrl: { type: String },
    sourcePath: { type: String },
    executionPath: { type: String, required: true },
    editingName: { type: String },
    useVscode: { type: Boolean, default: false },
}, { timestamps: true });
const PackageSchema = new mongoose_1.default.Schema({
    serialNumber: { type: String, unique: true },
    orders: {
        type: [OrderSchema],
        required: true,
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, { timestamps: true });
const Package = mongoose_1.default.model("Package", PackageSchema);
exports.Package = Package;
const Order = mongoose_1.default.model("Order", OrderSchema);
exports.Order = Order;
