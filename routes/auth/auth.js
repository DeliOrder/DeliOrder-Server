const express = require("express");
const axios = require("axios");

const { User } = require("../../model/User");

const router = express.Router();
const signInRouter = require("./sign-in");

router.post("/sign-out/kakao", async (req, res, next) => {
  try {
    const { deliOrderUserId: userId } = req.body;

    const { targetId, loginType } = await User.findById(userId).lean();

    if (targetId && loginType === "kakao") {
      const result = await axios.post(
        "https://kapi.kakao.com/v1/user/logout",
        new URLSearchParams({
          target_id_type: "user_id",
          target_id: targetId,
        }),
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8",
            Authorization: "KakaoAK " + process.env.KAKAO_ADMIN_KEY,
          },
        },
      );

      if (!result.data.id) {
        console.error("로그아웃에 실패했습니다.");
        return res.status(400).json({ message: "로그아웃에 실패했습니다." });
      }

      return res.status(200).json({ message: "성공적으로 로그아웃 했습니다." });
    }
  } catch (error) {
    console.error("로그아웃에 실패 했습니다.", error);
    return res.status(500).json({ message: "로그아웃에 실패 했습니다." });
  }
});

router.post("/refresh/kakao", async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "유효하지 않은 유저입니다." });
    }

    const existUser = await User.findById(userId).lean();
    const userRefreshToken = existUser.refreshToken;
    if (!existUser || !userRefreshToken) {
      return res.status(401).json({ error: "유효하지 않은 유저입니다." });
    }

    const tokenResponse = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.KAKAO_CLIENT_ID,
        refresh_token: userRefreshToken,
      }),
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      },
    );

    const { refresh_token: newRefreshToken } = tokenResponse.data;

    if (newRefreshToken) {
      await User.updateOne({ _id: userId }, { refreshToken: newRefreshToken });
    }

    const newDeliOrderToken = generateAccessToken(existUser._id, "kakao", {
      targetId: uid,
    });

    res.json({
      newDeliOrderToken,
      refreshToken: newRefreshToken || userRefreshToken,
    });
  } catch (error) {
    console.error("토큰 재발급 시도중 오류:", error);
    return res.status(400).json({
      error: "토큰 재발급을 실패했습니다.",
    });
  }
});

router.post("/sign-up/local", async (req, res, next) => {
  try {
    const { nicknameValue, emailValue } = req.body.signUpFormValue;
    const existUser = await User.findOne({ emailValue }).lean();
    if (existUser) {
      res.status(400).json({ error: "비정상적인 접근입니다." });
    }
    await User.create({
      nickname: nicknameValue,
      email: emailValue,
      loginType: "email",
    });

    res.status(201).json({ message: "회원가입에 성공하였습니다" });
  } catch (error) {
    console.error("회원가입에 실패하였습니다.", error);
    res.status(400).json({ error: "회원가입에 실패하였습니다." });
  }
});

router.use("/sign-in", signInRouter);

module.exports = router;
