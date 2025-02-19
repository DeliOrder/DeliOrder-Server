"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../../model/User"));
const router = express_1.default.Router();
router.post("/email", async (req, res, next) => {
    try {
        const { nicknameValue: nickname, emailValue: email } = req.body.signUpFormValue;
        const existUser = await User_1.default.findOne({
            email,
        }).lean();
        if (existUser) {
            res.status(400).json({ error: "비정상적인 접근입니다." });
            return;
        }
        await User_1.default.create({
            nickname,
            email,
            loginType: "email",
        });
        res.status(201).json({ message: "회원가입에 성공하였습니다" });
    }
    catch (error) {
        console.error("회원가입에 실패하였습니다.", error);
        next(error);
    }
});
router.post("/check-email", async (req, res, next) => {
    try {
        const { emailValue: email } = req.body;
        const existUser = await User_1.default.findOne({
            email,
        }).lean();
        if (existUser) {
            res.status(409).json({ error: "이미 가입한 회원입니다." });
            return;
        }
        res.status(200).json({ message: "중복회원이 아닙니다." });
    }
    catch (error) {
        console.error("중복아이디 검증 실패: ", error);
        next(error);
    }
});
exports.default = router;
