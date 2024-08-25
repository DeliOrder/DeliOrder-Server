const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    nickname: { type: String, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    history: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package",
      },
    ],
    bookmark: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    loginType: {
      type: String,
      enum: ["email", "kakao", "google"],
      required: true,
    },
    refreshToken: { type: String },
    targetId: { type: String },
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);

module.exports = { User };
