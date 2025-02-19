import express, { Request, Response, NextFunction } from "express";
import axios from "axios";
import User from "../../model/User";

const router = express.Router();

router.post(
  "/kakao",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { deliOrderUserId: userId } = req.body;

      const existUser = await User.findById(userId).lean();

      if (!existUser) {
        res.status(400).json({ error: "해당 유저가 존재하지 않습니다." });
        return;
      }

      const { targetId, loginType } = existUser;

      if (targetId && loginType === "kakao") {
        const params = new URLSearchParams();
        params.append("target_id_type", "user_id");
        params.append("target_id", targetId);

        const result = await axios.post<{ id: string }>(
          "https://kapi.kakao.com/v1/user/logout",
          params,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
              Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`,
            },
          },
        );

        if (!result.data.id) {
          console.error("로그아웃에 실패했습니다.");
          res.status(400).json({
            message: "유효한 아이디가 아닙니다. 로그아웃에 실패했습니다.",
          });
          return;
        }

        res.clearCookie("refreshToken", {
          sameSite: "strict",
          httpOnly: true,
          maxAge: 3 * 30 * 24 * 60 * 60 * 1000,
          path: "/",
        });

        res.status(200).json({ message: "성공적으로 로그아웃 했습니다." });
        return;
      }

      res.status(400).json({ error: "카카오 로그인 사용자가 아닙니다." });
    } catch (error) {
      console.error("로그아웃에 실패 했습니다.", error);
      next(error);
    }
  },
);

export default router;
