import express, { Request, Response, NextFunction } from "express";
import axios, { AxiosError } from "axios";
import { FirebaseAppError } from "firebase-admin/app";
import admin from "../../config/firebase-config";
import User from "../../model/User";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken";

const router = express.Router();

router.post(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firebaseIdToken }: { firebaseIdToken: string } = req.body;
      const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
      const { name, email } = decodedToken;

      let existUser = await User.findOne({ email }).lean();
      if (!existUser) {
        existUser = await User.create({
          nickname: name,
          email,
          loginType: "google",
        });
      }

      const userId = existUser._id.toString();
      const deliOrderToken = generateAccessToken(userId, "google");
      const deliOrderRefreshToken = generateRefreshToken(userId, "google");

      await User.updateOne({ email }, { deliOrderRefreshToken });

      res.cookie("refreshToken", deliOrderRefreshToken, {
        sameSite: "lax",
        httpOnly: true,
        maxAge: 3 * 30 * 24 * 60 * 60 * 1000,
        secure: true,
      });

      res.status(200).json({
        deliOrderToken,
        userId,
        loginType: "google",
      });
    } catch (error) {
      console.error("구글 로그인 에러", error);

      if (
        error instanceof FirebaseAppError &&
        (error.code === "auth/id-token-expired" ||
          error.code === "auth/invalid-id-token")
      ) {
        res.status(401).json({ error: "유효하지 않은 토큰입니다." });
        return;
      }

      next(error);
    }
  },
);

router.post(
  "/email",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firebaseIdToken }: { firebaseIdToken: string } = req.body;

      if (!firebaseIdToken) {
        res.status(400).json({ error: "firebaseIdToken이 필요합니다." });
        return;
      }

      const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
      const { email } = decodedToken;

      const existUser = await User.findOne({
        email,
      }).lean();
      if (!existUser) {
        res.status(401).json({ error: "유효하지 않은 사용자입니다." });
        return;
      }

      const userId = existUser._id.toString();
      const deliOrderToken = generateAccessToken(userId, "email");
      const deliOrderRefreshToken = generateRefreshToken(userId, "email");

      await User.updateOne({ email }, { deliOrderRefreshToken });

      res.cookie("refreshToken", deliOrderRefreshToken, {
        sameSite: "lax",
        httpOnly: true,
        maxAge: 3 * 30 * 24 * 60 * 60 * 1000,
        secure: true,
      });

      res.status(200).json({
        deliOrderToken,
        userId,
        loginType: "email",
      });
    } catch (error) {
      console.error("이메일 로그인 에러", error);
      if (
        error instanceof FirebaseAppError &&
        (error.code === "auth/id-token-expired" ||
          error.code === "auth/invalid-id-token")
      ) {
        res.status(401).json({ error: "유효하지 않은 토큰입니다." });
      }

      next(error);
    }
  },
);

interface User {
  targetId?: string | number;
}

router.post(
  "/kakao",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authCode }: { authCode: string } = req.body;

      if (!authCode) {
        res.status(400).json({ error: "잘못된 요청입니다." });
        return;
      }

      const kakaoResponse = await axios.post(
        "https://kauth.kakao.com/oauth/token",
        new URLSearchParams({
          grant_type: "authorization_code",
          client_id: process.env.KAKAO_CLIENT_ID!,
          redirect_uri: process.env.CLIENT_PORT!,
          code: authCode,
        }),
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        },
      );
      const { accessToken, refreshToken } = kakaoResponse.data;

      const userInfoResponse = await axios.get(
        "https://kapi.kakao.com/v2/user/me",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const { email } = userInfoResponse.data.kakao_account;
      const { nickname } = userInfoResponse.data.kakao_account.profile;
      const uid: number = userInfoResponse.data.id;

      let existUser = await User.findOne({ email }).lean();

      if (!existUser) {
        existUser = await User.create({
          nickname,
          email,
          loginType: "kakao",
          socialRefreshToken: refreshToken,
          targetId: uid.toString(),
        });

        await admin.auth().createUser({
          uid: String(uid),
          email,
          displayName: nickname,
        });
      } else {
        await User.updateOne({ email }, { socialRefreshToken: refreshToken });
      }

      const userId = existUser._id.toString();
      const deliOrderToken = generateAccessToken(userId, "kakao", {
        targetId: uid,
      });
      const deliOrderRefreshToken = generateRefreshToken(userId, "kakao");

      await User.updateOne({ email }, { deliOrderRefreshToken });

      const firebaseToken = await admin.auth().createCustomToken(String(uid), {
        nickname,
        email,
        loginType: "kakao",
      });

      res.cookie("refreshToken", deliOrderRefreshToken, {
        sameSite: "strict",
        httpOnly: true,
        maxAge: 3 * 30 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      res.status(200).json({
        firebaseToken,
        deliOrderToken,
        userId,
        loginType: "kakao",
      });
    } catch (error) {
      console.error("카카오 로그인 에러: ", error);

      if (error instanceof AxiosError && error.response) {
        res.status(400).json({
          error: "잘못된 요청입니다. 카카오 로그인에 실패하였습니다.",
        });
      }

      next(error);
    }
  },
);

export default router;
