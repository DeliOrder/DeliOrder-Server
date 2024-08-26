const express = require("express");
const axios = require("axios");

const { User } = require("../../model/User");

const router = express.Router();

router.post("/email", async (req, res, next) => {
  try {
    const { nicknameValue: nickname, emailValue: email } =
      req.body.signUpFormValue;
    const existUser = await User.findOne({ email }).lean();
    if (existUser) {
      res.status(400).json({ error: "비정상적인 접근입니다." });
    }
    await User.create({
      nickname,
      email,
      loginType: "email",
    });

    res.status(201).json({ message: "회원가입에 성공하였습니다" });
  } catch (error) {
    console.error("회원가입에 실패하였습니다.", error);
    res.status(400).json({ error: "회원가입에 실패하였습니다." });
  }
});

router.post("/check-email", async (req, res, next) => {
  try {
    const { emailValue: email } = req.body;
    const existUser = await User.findOne({ email }).lean();

    if (existUser) {
      res.status(409).json({ error: "이미 가입한 회원입니다." });
    } else {
      res.status(200).json({ error: "중복회원이 아닙니다." });
    }
  } catch (error) {
    console.error("중복아이디 검증 실패: ", error);
    res.status(500).json({ error: "일시적 서버 오류입니다." });
  }
});

module.exports = router;
