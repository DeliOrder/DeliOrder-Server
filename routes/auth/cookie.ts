import { Router, Request, Response } from "express";

const router: Router = Router();

router.delete("/", (_: Request, res: Response) => {
  try {
    res.clearCookie("refreshToken", {
      sameSite: "strict",
      httpOnly: true,
      path: "/",
    });

    res.status(200).json({ message: "성공적으로 쿠키를 삭제하였습니다." });
  } catch {
    res.status(400).json({ message: "성공적으로 쿠키를 삭제하지 못했습니다." });
  }
});

export default router;
