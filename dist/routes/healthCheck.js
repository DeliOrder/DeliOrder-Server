"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/", (_, res, next) => {
    try {
        res.status(200).json({ message: "정상적으로 작동중입니다." });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
