const express = require("express");
const axios = require("axios");

const admin = require("../../config/firebase-config");
const { User } = require("../../model/User");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/generateToken");

const router = express.Router();

router.post("/google", async (req, res, next) => {
  try {
    const { firebaseIdToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
    const { name, email } = decodedToken;

    let existUser = await User.findOne({ email }).lean();
    if (!existUser) {
      existUser = await User.create({
        nickname: name,
        email,
        loginType: "google",
      });
    }

    const userId = existUser._id;
    const deliOrderToken = generateAccessToken(existUser._id, "google");
    const deliOrderRefreshToken = generateRefreshToken(existUser._id, "google");

    await User.updateOne(
      { email },
      {
        deliOrderRefreshToken,
      },
    );

    return res.status(200).json({
      deliOrderToken,
      deliOrderRefreshToken,
      userId,
      loginType: "google",
    });
  } catch (error) {
    console.error("구글 로그인 에러", error);
    if (
      error.code === "auth/id-token-expired" ||
      error.code === "auth/invalid-id-token"
    ) {
      return res.status(401).json({ error: "유효하지 않은 토큰입니다." });
    } else {
      res.status(500).json({
        error: "서버의 응답이 없습니다. 구글 로그인에 실패하였습니다.",
      });
    }
  }
});

router.post("/email", async (req, res, next) => {
  try {
    const { firebaseIdToken } = req.body;

    if (!firebaseIdToken) {
      return res.status(400).json({ error: "firebaseIdToken이 필요합니다." });
    }

    const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
    const { email } = decodedToken;

    const existUser = await User.findOne({ email }).lean();
    if (!existUser) {
      return res.status(401).json({ error: "유효하지 않은 사용자입니다." });
    }
    const userId = existUser._id;
    const deliOrderToken = generateAccessToken(existUser._id, "email");
    const deliOrderRefreshToken = generateRefreshToken(existUser._id, "email");

    await User.updateOne(
      { email },
      {
        deliOrderRefreshToken,
      },
    );

    res.status(200).json({
      deliOrderToken,
      deliOrderRefreshToken,
      userId,
      loginType: "email",
    });
  } catch (error) {
    console.error("이메일 로그인 에러", error);
    if (
      error.code === "auth/id-token-expired" ||
      error.code === "auth/invalid-id-token"
    ) {
      return res.status(401).json({ error: "유효하지 않은 토큰입니다." });
    } else {
      return res.status(500).json({
        error: "서버의 응답이 없습니다. 이메일 로그인에 실패하였습니다.",
      });
    }
  }
});

router.post("/kakao", async (req, res, next) => {
  try {
    const { authCode } = req.body;

    if (!authCode) {
      return res.status(400).json({ error: "잘못된 요청입니다." });
    }

    const kakaoResponse = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_CLIENT_ID,
        redirect_uri: process.env.CLIENT_PORT,
        code: authCode,
      }),
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      },
    );
    const { access_token, refresh_token } = kakaoResponse.data;

    const userInfoResponse = await axios.get(
      "https://kapi.kakao.com/v2/user/me",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    const email = userInfoResponse.data.kakao_account.email;
    const nickname = userInfoResponse.data.kakao_account.profile.nickname;
    const uid = userInfoResponse.data.id;

    let existUser = await User.findOne({ email }).lean();

    if (!existUser) {
      existUser = await User.create({
        nickname,
        email,
        loginType: "kakao",
        socialRefreshToken: refresh_token,
        targetId: uid,
      });

      await admin.auth().createUser({
        uid: String(uid),
        email,
        displayName: nickname,
      });
    } else {
      await User.updateOne(
        { email },
        {
          socialRefreshToken: refresh_token,
        },
      );
    }
    const userId = existUser._id;
    const deliOrderToken = generateAccessToken(existUser._id, "kakao", {
      targetId: uid,
    });
    const deliOrderRefreshToken = generateRefreshToken(existUser._id, "kakao");

    await User.updateOne(
      { email },
      {
        deliOrderRefreshToken,
      },
    );

    const firebaseToken = await admin
      .auth()
      .createCustomToken(String(uid), { nickname, email, loginType: "kakao" });

    res.json({
      firebaseToken,
      deliOrderToken,
      deliOrderRefreshToken,
      userId,
      loginType: "kakao",
    });
  } catch (error) {
    console.error("카카오 로그인 에러: ", error);
    if (error.response) {
      return res
        .status(400)
        .json({ error: "잘못된 요청입니다. 카카오 로그인에 실패하였습니다." });
    } else {
      return res.status(500).json({
        error: "서버의 응답이 없습니다. 카카오 로그인에 실패하였습니다.",
      });
    }
  }
});

module.exports = router;
