const express = require("express");

const jwt = require("jsonwebtoken");
const axios = require("axios");
const { User } = require("../model/User");

const router = express.Router();

router.post("/sign-in/kakao", async (req, res, next) => {
  try {
    const { authCode } = req.body;
    const {
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn,
      },
    } = await axios.post(
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

    const {
      data: {
        id: target_id,
        properties: { nickname },
        kakao_account: { email },
      },
    } = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: "Bearer " + accessToken,
      },
    });

    const existUser = await User.findOne({ email }).lean();
    let _id;

    if (existUser) {
      await User.updateOne(
        { email },
        {
          refreshToken,
        },
      );

      _id = existUser._id;
    } else {
      const userDate = await User.create({
        nickname,
        email,
        loginType: "kakao",
        refreshToken,
      });

      _id = userDate._id;
    }

    const jwtToken = jwt.sign({ _id }, process.env.JWT_SECRET_KEY, {
      expiresIn,
    });

    res.send({ jwtToken, refreshToken, target_id, _id });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/sign-out/kakao", async (req, res, next) => {
  try {
    const { target_id } = req.body;
    const result = await axios.post(
      "https://kapi.kakao.com/v1/user/logout",
      new URLSearchParams({
        target_id_type: "user_id",
        target_id,
      }),
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
          Authorization: "KakaoAK " + process.env.KAKAO_ADMIN_KEY,
        },
      },
    );

    if (result.data.id) {
      res.send({ message: "성공적으로 로그아웃 했습니다." });
    } else {
      res.send({ message: "로그아웃에 실패했습니다." });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/refresh/kakao", async (req, res, next) => {
  const clientRefreshToken = req.headers["authorization"]?.split(" ")[1];
  const { userId } = req.body;
  const { refreshToken: userRefreshToken } = await User.findById(userId).lean();

  if (clientRefreshToken === userRefreshToken) {
    const {
      data: { expires_in: expiresIn, refresh_token: refreshToken },
    } = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.KAKAO_CLIENT_ID,
        refresh_token: clientRefreshToken,
      }),
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      },
    );

    if (refreshToken) {
      await User.updateOne(
        { _id: userId },
        {
          refreshToken,
        },
      );
    }

    const jwtToken = jwt.sign({ _id: userId }, process.env.JWT_SECRET_KEY, {
      expiresIn,
    });

    res.send({ jwtToken, refreshToken });
  }
});

module.exports = router;
