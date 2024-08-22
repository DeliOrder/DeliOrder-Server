const express = require("express");

const { User } = require("../model/User");
const { verifyJWTToken } = require("../middlewares/verifyJWTtoken");

const router = express.Router();

router.get("/:userId/history", verifyJWTToken, async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).send({ error: "Unauthorized" });
      return;
    }

    const { history } = await User.findById(userId).populate("history").lean();

    res.send({ history });
  } catch (error) {
    console.error("유저정보를 불러오는 중 오류가 발생하였습니다.", error);
  }
});

module.exports = router;
