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
        access_token,
        refresh_token,
        expires_in,
        refresh_token_expires_in,
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
        Authorization: "Bearer " + access_token,
      },
    });

    const refresh_token_expires = Date.parse(
      new Date() + refresh_token_expires_in * 1000,
    );

    const existUser = await User.findOne({ email }).lean();
    let _id;

    if (existUser) {
      await User.updateOne(
        { email },
        {
          refresh_token: {
            id: refresh_token,
            expires: refresh_token_expires,
          },
        },
      );

      _id = existUser._id;
    } else {
      const userDate = await User.create({
        nickname,
        email,
        loginType: "kakao",
        refresh_token: {
          id: refresh_token,
          expires: refresh_token_expires,
        },
      });

      _id = userDate._id;
    }

    const jwtToken = jwt.sign({ _id }, process.env.JWT_SECRET_KEY, {
      expiresIn: expires_in,
    });

    res.send({ jwtToken, refresh_token, _id, target_id });
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

module.exports = router;
