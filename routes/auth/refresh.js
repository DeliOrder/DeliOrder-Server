const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const { User } = require("../../model/User");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/generateToken");

const router = express.Router();

router.post("/kakao", async (req, res, next) => {
  try {
    const { userId, deliOrderRefreshToken: userRefreshToken } = req.body;

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
      { newDeliOrderRefreshToken, newDeliOrderToken },
    );

    res.json({
      newDeliOrderToken,
      newDeliOrderRefreshToken,
    });
  } catch (error) {
    console.error("토큰 재발급 시도중 오류:", error);
    return res.status(401).json({
      error: "토큰 재발급에 실패했습니다.",
    });
  }
});

module.exports = router;
