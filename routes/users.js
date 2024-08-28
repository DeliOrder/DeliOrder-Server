const express = require("express");

const { Package, Order } = require("../model/Package");
const { User } = require("../model/User");
const { verifyJWTToken } = require("../middlewares/verifyJWTToken");

const { isDuplicate } = require("../utils/isDuplicate");

const router = express.Router();

router.post("/:userId/bookmark", verifyJWTToken, async (req, res, next) => {
  try {
    const userId = req.userId;
    const { action } = req.body;

    if (!userId) {
      res.status(401).send({ error: "Unauthorized" });
      return;
    }

    const existUser = await User.findById(userId).lean();
    if (!existUser) {
      return res.status(404).json({ error: "존재하지 않는 사용자입니다." });
    }

    const bookmarkList = (
      await User.findById(userId).populate("bookmark").lean()
    ).bookmark;

    const isNewBookmark = !bookmarkList.some((bookmark) =>
      isDuplicate(bookmark, action),
    );

    if (!isNewBookmark) {
      return res.status(400).json({ message: "이미 등록된 즐겨찾기 입니다." });
    }

    const newBookmark = await Order.create(action);

    const result = await User.updateOne(
      { _id: userId },
      { $push: { bookmark: newBookmark } },
    );

    if (!result.acknowledged) {
      next(error);
    }

    return res.status(200).json({
      message: "즐겨찾기 저장이 완료 되었습니다.",
    });
  } catch (error) {
    console.error("북마크 저장 중 에러 발생: ", error);
    next(error);
  }
});

router.get("/:userId/bookmark", verifyJWTToken, async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).send({ error: "Unauthorized" });
      return;
    }

    const existUser = await User.findById(userId).lean();
    if (!existUser) {
      return res.status(404).json({ message: "존재하지 않는 사용자입니다." });
    }

    const bookmarkIdList = existUser.bookmark;
    if (!bookmarkIdList.length) {
      return res.status(404).json({ message: "즐겨찾기가 존재하지 않습니다" });
    }

    const bookmarkList = (
      await User.findById(userId).populate("bookmark").lean()
    ).bookmark;

    return res.status(200).json({
      message: "성공적으로 북마크를 불러왔습니다.",
      bookmarkList,
    });
  } catch (error) {
    console.error("북마크 불러오기 중 에러 발생: ", error);
    next(error);
  }
});

router.get("/:userId/history", verifyJWTToken, async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).send({ error: "Unauthorized" });
      return;
    }

    const { history } = await User.findById(userId).populate("history").lean();

    res.status(200).json({ history });
  } catch (error) {
    console.error("유저정보를 불러오는 중 오류가 발생하였습니다.", error);
  }
});

module.exports = router;
