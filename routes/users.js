const express = require("express");

const { Package, Order } = require("../model/Package");
const { User } = require("../model/User");
const { verifyJWTToken } = require("../middlewares/verifyJWTtoken");

const { isDuplicate } = require("../utils/isDuplicate");

const router = express.Router();

router.post("/:userId/bookmark", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { action } = req.body;

    const existUser = await User.findById(userId).lean();
    if (!existUser) {
      return res.status(404).json({ error: "존재하지 않는 사용자입니다." });
    }

    const userBookmark_idList = existUser.bookmark;

    const userWithBookmarks = await User.findById(userId)
      .populate("bookmark")
      .lean();
    const bookmarkList = userWithBookmarks.bookmark;

    const isNewBookmark = !bookmarkList.some((bookmark) =>
      isDuplicate(bookmark, action),
    );
    if (!userBookmark_idList.length || isNewBookmark) {
      const newBookmark = await Order.create(action);

      await User.updateOne(
        { _id: userId },
        { $push: { bookmark: newBookmark } },
      );

      return res.status(200).json({
        message: "즐겨찾기 저장이 완료 되었습니다.",
      });
    } else {
      return res.status(400).json({ message: "이미 등록된 즐겨찾기 입니다." });
    }
  } catch (error) {
    return res.status(500).json({
      message: "일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요..",
    });
  }
});

router.get("/:userId/bookmark", async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const existUser = await User.findById(userId).lean();
    if (!existUser) {
      return res.status(404).json({ message: "존재하지 않는 사용자입니다." });
    }

    const userBookmark_idList = existUser.bookmark;
    if (!userBookmark_idList.length) {
      return res.status(404).json({ message: "즐겨찾기가 존재하지 않습니다" });
    }

    const userWithBookmarks = await User.findById(userId)
      .populate("bookmark")
      .lean();
    const bookmarkList = userWithBookmarks.bookmark; // 실제 Order 객체 배열

    return res.status(200).json({
      message: "성공적으로 북마크를 불러왔습니다.",
      bookmarkList,
    });
  } catch (error) {
    console.error("북마크 불러오기 중 에러 발생: ", error);
    return res.status(500).json({
      message: "일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    });
  }
});

module.exports = router;
