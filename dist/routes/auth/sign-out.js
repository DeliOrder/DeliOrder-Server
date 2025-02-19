"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const User_1 = __importDefault(require("../../model/User"));
const router = express_1.default.Router();
router.post("/kakao", async (req, res, next) => {
    try {
        const { deliOrderUserId: userId } = req.body;
        const existUser = await User_1.default.findById(userId).lean();
        if (!existUser) {
            res.status(400).json({ error: "해당 유저가 존재하지 않습니다." });
            return;
        }
        const { targetId, loginType } = existUser;
        if (targetId && loginType === "kakao") {
            const params = new URLSearchParams();
            params.append("target_id_type", "user_id");
            params.append("target_id", targetId);
            const result = await axios_1.default.post("https://kapi.kakao.com/v1/user/logout", params, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
                    Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`,
                },
            });
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
    }
    catch (error) {
        console.error("로그아웃에 실패 했습니다.", error);
        next(error);
    }
});
exports.default = router;
