const express = require("express");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const admin = require("../config/firebase-config");
const { User } = require("../model/User");
const { verifyJWTToken } = require("../middlewares/verifyJWTToken");

const router = express.Router();

const generateToken = (userId, loginType, ...additionalData) => {
  const tokenData = { _id: userId, type: loginType };

  additionalData.forEach((data) => {
    Object.assign(tokenData, data);
  });

  return jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
};

router.post("/sign-in/google", async (req, res, next) => {
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
    const deliOrderToken = generateToken(existUser._id, "google");
    res.status(200).json({ deliOrderToken, userId, loginType: "google" });
  } catch (error) {
    console.error("구글 로그인 토큰 검증 실패", error);
    res.status(401).json({ error: "구글 로그인 토큰 검증 실패" });
  }
});

router.post("/sign-in/local", async (req, res, next) => {
  try {
    const { firebaseIdToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
    const { email } = decodedToken;

    const existUser = await User.findOne({ email }).lean();
    if (!existUser) {
      res.status(401).json({ error: "유효하지 않은 사용자입니다." });
    }
    const userId = existUser._id;
    const deliOrderToken = generateToken(existUser._id, "local");
    res.status(200).json({ deliOrderToken, userId, loginType: "local" });
  } catch (error) {
    console.error("로컬로그인 에러: ", error);
    res.status(500).json({ error: "로그인 중 서버 에러가 발생했습니다." });
  }
});

router.post("/sign-in/kakao", async (req, res, next) => {
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
    const deliOrderToken = generateToken(existUser._id, "kakao", {
      targetId: uid,
    });

    const firebaseToken = await admin
      .auth()
      .createCustomToken(String(uid), { nickname, email, loginType: "kakao" });

    res.json({ firebaseToken, deliOrderToken, userId, loginType: "kakao" });
  } catch (error) {
    console.error("Error authenticating with Kakao:", error);
    res.status(500).send("Authentication failed");
  }
});

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
    if (!existUser || !existUser.refreshToken) {
      return res.status(401).json({ error: "유효하지 않은 유저입니다." });
    }

    const userRefreshToken = existUser.refreshToken;

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

    const { expires_in: expiresIn, refresh_token: newRefreshToken } =
      tokenResponse.data;

    if (newRefreshToken) {
      await User.updateOne({ _id: userId }, { refreshToken: newRefreshToken });
    }

    const jwtToken = jwt.sign({ _id: userId }, process.env.JWT_SECRET_KEY, {
      expiresIn,
    });

    res.json({
      jwtToken,
      refreshToken: newRefreshToken || userRefreshToken,
    });
  } catch (error) {
    console.error("토큰 재발급 시도중 오류:", error);
    return res.status(400).json({
      error: "토큰 재발급을 실패했습니다.",
    });
  }
});

module.exports = router;
