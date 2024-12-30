const express = require("express");
const jwt = require("jsonwebtoken");

const { User } = require("../../model/User");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/generateToken");

const router = express.Router();

router.get("/validate", async (req, res, next) => {
  try {
    const deliOrderToken = req.headers["authorization"]?.split(" ")[1];

    jwt.verify(deliOrderToken, process.env.JWT_SECRET_KEY);
    return res.status(200).json({ message: "정상인증된 유저입니다." });
  } catch {
    return res.status(401).json({ error: "유효하지 않은 유저입니다." });
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const { deliOrderUserId: userId } = req.body;
    const { refreshToken: userRefreshToken } = req.cookies;

    if (!userId) {
      return res.status(401).json({ error: "유효하지 않은 유저입니다." });
    }

    const existUser = await User.findById(userId).lean();
    const dbRefreshToken = existUser.deliOrderRefreshToken;

    if (!existUser || userRefreshToken !== dbRefreshToken) {
      return res.status(401).json({ error: "유효하지 않은 유저입니다." });
    }

    const { _id, type } = jwt.verify(
      userRefreshToken,
      process.env.JWT_SECRET_KEY,
    );

    if (_id !== userId || type !== "kakao") {
      return res.status(401).json({ error: "유효하지 않은 유저입니다." });
    }

    const newDeliOrderToken = generateAccessToken(existUser._id, "kakao");
    const newDeliOrderRefreshToken = generateRefreshToken(
      existUser._id,
      "kakao",
    );

    await User.updateOne(
      { _id: userId },
      { deliOrderRefreshToken: newDeliOrderRefreshToken },
    );

    res.cookie("refreshToken", newDeliOrderRefreshToken, {
      sameSite: "strict",
      httpOnly: true,
      maxAge: 3 * 30 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      newDeliOrderToken,
    });
  } catch (error) {
    console.error("토큰 재발급 시도중 오류:", error);
    return res.status(401).json({
      error: "토큰 재발급에 실패했습니다.",
    });
  }
});

module.exports = router;
