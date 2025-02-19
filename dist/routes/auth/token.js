"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken_1 = require("../../utils/generateToken");
const User_1 = __importDefault(require("../../model/User"));
const router = express_1.default.Router();
router.get("/validate", async (req, res) => {
    try {
        const deliOrderToken = req.headers.authorization?.split(" ")[1];
        if (!deliOrderToken) {
            res.status(401).json({ error: "토큰이 제공되지 않았습니다." });
            return;
        }
        jsonwebtoken_1.default.verify(deliOrderToken, process.env.JWT_SECRET_KEY);
        res.status(200).json({ message: "정상 인증된 유저입니다." });
    }
    catch {
        res.status(401).json({ error: "유효하지 않은 유저입니다." });
    }
});
router.post("/refresh", async (req, res) => {
    try {
        const { deliOrderUserId: userId } = req.body;
        const userRefreshToken = req.cookies.refreshToken;
        if (!userId) {
            res.status(401).json({ error: "유효하지 않은 유저입니다." });
            return;
        }
        const existUser = await User_1.default.findById(userId).lean();
        const dbRefreshToken = existUser?.deliOrderRefreshToken;
        if (!existUser || userRefreshToken !== dbRefreshToken) {
            res.status(401).json({ error: "유효하지 않은 유저입니다." });
            return;
        }
        const decodedToken = jsonwebtoken_1.default.verify(userRefreshToken, process.env.JWT_SECRET_KEY);
        if (decodedToken._id !== userId || decodedToken.type !== "kakao") {
            res.status(401).json({ error: "유효하지 않은 유저입니다." });
            return;
        }
        const newDeliOrderToken = (0, generateToken_1.generateAccessToken)(existUser._id.toString(), "kakao");
        const newDeliOrderRefreshToken = (0, generateToken_1.generateRefreshToken)(existUser._id.toString(), "kakao");
        await User_1.default.updateOne({ _id: userId }, { deliOrderRefreshToken: newDeliOrderRefreshToken });
        res.cookie("refreshToken", newDeliOrderRefreshToken, {
            sameSite: "strict",
            httpOnly: true,
            maxAge: 3 * 30 * 24 * 60 * 60 * 1000,
            path: "/",
        });
        res.status(200).json({
            newDeliOrderToken,
        });
    }
    catch (error) {
        console.error("토큰 재발급 시도 중 오류:", error);
        res.status(401).json({
            error: "토큰 재발급에 실패했습니다.",
        });
    }
});
exports.default = router;
