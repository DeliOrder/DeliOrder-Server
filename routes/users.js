const express = require("express");

const { User } = require("../model/User");

const router = express.Router();

router.get("/:userId/history", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { history } = await User.findById(userId).populate("history").lean();

    res.send({ history });
  } catch (error) {
    console.error("유저정보를 불러오는 중 오류가 발생하였습니다.", error);
  }
});

module.exports = router;
