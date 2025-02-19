"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.delete("/", (_, res) => {
    try {
        res.clearCookie("refreshToken", {
            sameSite: "strict",
            httpOnly: true,
            path: "/",
        });
        res.status(200).json({ message: "성공적으로 쿠키를 삭제하였습니다." });
    }
    catch {
        res.status(400).json({ message: "성공적으로 쿠키를 삭제하지 못했습니다." });
    }
});
exports.default = router;
