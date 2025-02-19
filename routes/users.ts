import express, { Request, Response, NextFunction } from "express";
import verifyJWTToken from "../middlewares/verifyJWTToken";
import User from "../model/User";
import { Order } from "../model/Package";
import isDuplicate from "../utils/isDuplicate";

const router = express.Router();

interface UserRequest extends Request {
  userId?: string;
}

router.post(
  "/:userId/bookmark",
  verifyJWTToken,
  async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { userId } = req;
      const { action } = req.body;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const existUser = await User.findById(userId).lean();
      if (!existUser) {
        res.status(404).json({ error: "존재하지 않는 사용자입니다." });
        return;
      }

      const bookmarkList = await User.findById(userId)
        .populate("bookmark")
        .lean();

      if (!bookmarkList) {
        res.json({ message: "등록된 북마크 리스트가 없습니다." });
        return;
      }

      const isNewBookmark = !bookmarkList.bookmark.some((bookmark) =>
        isDuplicate(bookmark, action),
      );

      if (!isNewBookmark) {
        res.status(400).json({ message: "이미 등록된 즐겨찾기입니다." });
        return;
      }

      const newBookmark = await Order.create(action);

      const result = await User.updateOne(
        { _id: userId },
        { $push: { bookmark: newBookmark } },
      );

      if (!result.acknowledged) {
        next(new Error("북마크 저장 중 문제가 발생했습니다."));
        return;
      }

      res.status(200).json({ message: "즐겨찾기 저장이 완료되었습니다." });
    } catch (error) {
      console.error("북마크 저장 중 에러 발생: ", error);
      next(error);
    }
  },
);

router.get(
  "/:userId/bookmark",
  verifyJWTToken,
  async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { userId } = req;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const existUser = await User.findById(userId).lean();
      if (!existUser) {
        res.status(404).json({ message: "존재하지 않는 사용자입니다." });
        return;
      }

      const bookmarkIdList = existUser.bookmark;
      if (!bookmarkIdList || bookmarkIdList.length === 0) {
        res.status(404).json({ message: "즐겨찾기가 존재하지 않습니다." });
        return;
      }

      const bookmarkList = await User.findById(userId)
        .populate("bookmark")
        .lean();

      if (!bookmarkList) {
        res.json({ message: "등록된 북마크 리스트가 없습니다." });
        return;
      }

      res.status(200).json({
        message: "성공적으로 북마크를 불러왔습니다.",
        bookmarkList: bookmarkList.bookmark,
      });
    } catch (error) {
      console.error("북마크 불러오기 중 에러 발생: ", error);
      next(error);
    }
  },
);

router.get(
  "/:userId/history",
  verifyJWTToken,
  async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { userId } = req;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const user = await User.findById(userId).populate("history").lean();
      if (!user) {
        res.status(404).json({ message: "존재하지 않는 사용자입니다." });
        return;
      }

      res.status(200).json({ history: user.history });
    } catch (error) {
      console.error("유저 정보 불러오기 중 오류 발생: ", error);
      next(error);
    }
  },
);

export default router;
