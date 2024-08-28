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
      return res.status(400).json({ error: "비정상적인 접근입니다." });
    }
    await User.create({
      nickname,
      email,
      loginType: "email",
    });

    return res.status(201).json({ message: "회원가입에 성공하였습니다" });
  } catch (error) {
    console.error("회원가입에 실패하였습니다.", error);
    next(error);
  }
});

router.post("/check-email", async (req, res, next) => {
  try {
    const { emailValue: email } = req.body;
    const existUser = await User.findOne({ email }).lean();

    if (existUser) {
      return res.status(409).json({ error: "이미 가입한 회원입니다." });
    } else {
      return res.status(200).json({ message: "중복회원이 아닙니다." });
    }
  } catch (error) {
    console.error("중복아이디 검증 실패: ", error);
    next(error);
  }
});

module.exports = router;
