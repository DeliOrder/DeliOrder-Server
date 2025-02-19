import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

router.get("/", (_: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ message: "정상적으로 작동중입니다." });
  } catch (error) {
    next(error);
  }
});

export default router;
