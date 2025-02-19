import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
  userId?: string;
  targetId?: string;
  loginType?: string;
}

interface JwtPayload {
  _id: string;
  targetId?: string;
  type?: string;
}

const verifyJWTToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const JWTToken = req.headers.authorization?.split(" ")[1];

    if (!JWTToken) {
      next();
      return;
    }

    const decoded = jwt.verify(
      JWTToken,
      process.env.JWT_SECRET_KEY as string,
    ) as JwtPayload;

    req.userId = decoded._id;
    req.targetId = decoded.targetId;
    req.loginType = decoded.type;

    next();
  } catch (error) {
    console.error("JWT 인증 오류:", error);

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Token expired" });
      return;
    }

    res.status(401).json({ error: "Invalid token" });
  }
};

export default verifyJWTToken;
