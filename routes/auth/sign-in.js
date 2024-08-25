const express = require("express");
const axios = require("axios");

const admin = require("../../config/firebase-config");
const { User } = require("../../model/User");

const router = express.Router();

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/generateToken");

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

    res.status(200).json({
      deliOrderToken,
      deliOrderRefreshToken,
      userId,
      loginType: "google",
    });
  } catch (error) {
    console.error("구글 로그인 토큰 검증 실패", error);
    res.status(401).json({ error: "구글 로그인 토큰 검증 실패" });
  }
});

router.post("/local", async (req, res, next) => {
  try {
    const { firebaseIdToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
    const { email } = decodedToken;

    const existUser = await User.findOne({ email }).lean();
    if (!existUser) {
      res.status(401).json({ error: "유효하지 않은 사용자입니다." });
    }
    const userId = existUser._id;
    const deliOrderToken = generateAccessToken(existUser._id, "email");
    const deliOrderRefreshToken = generateRefreshToken(existUser._id, "email");

    res.status(200).json({
      deliOrderToken,
      deliOrderRefreshToken,
      userId,
      loginType: "email",
    });
  } catch (error) {
    console.error("로컬로그인 에러: ", error);
    res.status(500).json({ error: "로그인 중 서버 에러가 발생했습니다." });
  }
});

router.post("/kakao", async (req, res, next) => {
  const { authCode } = req.body;

  try {
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
        refreshToken: refresh_token,
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
          refreshToken: refresh_token,
        },
      );
    }

    const userId = existUser._id;
    const deliOrderToken = generateAccessToken(existUser._id, "kakao", {
      targetId: uid,
    });
    const deliOrderRefreshToken = generateRefreshToken(existUser._id, "kakao");

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
    console.error("Error authenticating with Kakao:", error);
    res.status(500).send("Authentication failed");
  }
});

module.exports = router;
