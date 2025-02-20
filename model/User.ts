import mongoose from "mongoose";

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
    socialRefreshToken: { type: String },
    deliOrderRefreshToken: { type: String },
    targetId: { type: String },
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);

export default User;
