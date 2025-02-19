import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken";
import User from "../../model/User";

const router = express.Router();

router.get("/validate", async (req: Request, res: Response) => {
  try {
    const deliOrderToken = req.headers.authorization?.split(" ")[1];

    if (!deliOrderToken) {
      res.status(401).json({ error: "토큰이 제공되지 않았습니다." });
      return;
    }

    jwt.verify(deliOrderToken, process.env.JWT_SECRET_KEY as string);
    res.status(200).json({ message: "정상 인증된 유저입니다." });
  } catch {
    res.status(401).json({ error: "유효하지 않은 유저입니다." });
  }
});

router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const { deliOrderUserId: userId } = req.body;
    const userRefreshToken = req.cookies.refreshToken;

    if (!userId) {
      res.status(401).json({ error: "유효하지 않은 유저입니다." });
      return;
    }

    const existUser = await User.findById(userId).lean();
    const dbRefreshToken = existUser?.deliOrderRefreshToken;

    if (!existUser || userRefreshToken !== dbRefreshToken) {
      res.status(401).json({ error: "유효하지 않은 유저입니다." });
      return;
    }

    const decodedToken = jwt.verify(
      userRefreshToken,
      process.env.JWT_SECRET_KEY as string,
    ) as {
      _id: string;
      type: string;
    };

    if (decodedToken._id !== userId || decodedToken.type !== "kakao") {
      res.status(401).json({ error: "유효하지 않은 유저입니다." });
      return;
    }

    const newDeliOrderToken = generateAccessToken(
      existUser._id.toString(),
      "kakao",
    );
    const newDeliOrderRefreshToken = generateRefreshToken(
      existUser._id.toString(),
      "kakao",
    );

    await User.updateOne(
      { _id: userId },
      { deliOrderRefreshToken: newDeliOrderRefreshToken },
    );

    res.cookie("refreshToken", newDeliOrderRefreshToken, {
      sameSite: "strict",
      httpOnly: true,
      maxAge: 3 * 30 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      newDeliOrderToken,
    });
  } catch (error) {
    console.error("토큰 재발급 시도 중 오류:", error);
    res.status(401).json({
      error: "토큰 재발급에 실패했습니다.",
    });
  }
});

export default router;
