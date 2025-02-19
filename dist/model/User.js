"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    nickname: { type: String, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    history: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Package",
        },
    ],
    bookmark: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Order",
        },
    ],
    loginType: {
        type: String,
        enum: ["email", "kakao", "google"],
        required: true,
    },
    socialRefreshToken: { type: String },
    deliOrderRefreshToken: { type: String },
    targetId: { type: String },
}, { timestamps: true });
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
