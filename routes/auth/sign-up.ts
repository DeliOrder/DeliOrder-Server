import express, { Request, Response, NextFunction } from "express";
import User from "../../model/User";

const router = express.Router();

router.post(
  "/email",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { nicknameValue: nickname, emailValue: email } =
        req.body.signUpFormValue;

      const existUser = await User.findOne({
        email,
      }).lean();

      if (existUser) {
        res.status(400).json({ error: "비정상적인 접근입니다." });
        return;
      }

      await User.create({
        nickname,
        email,
        loginType: "email",
      });

      res.status(201).json({ message: "회원가입에 성공하였습니다" });
    } catch (error) {
      console.error("회원가입에 실패하였습니다.", error);
      next(error);
    }
  },
);

router.post(
  "/check-email",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { emailValue: email } = req.body;

      const existUser = await User.findOne({
        email,
      }).lean();

      if (existUser) {
        res.status(409).json({ error: "이미 가입한 회원입니다." });
        return;
      }
      res.status(200).json({ message: "중복회원이 아닙니다." });
    } catch (error) {
      console.error("중복아이디 검증 실패: ", error);
      next(error);
    }
  },
);

export default router;
