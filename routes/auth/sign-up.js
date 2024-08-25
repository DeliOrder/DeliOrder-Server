const express = require("express");
const axios = require("axios");

const { User } = require("../../model/User");

const router = express.Router();

router.post("/local", async (req, res, next) => {
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

module.exports = router;
