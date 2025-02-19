"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyJWTToken = (req, res, next) => {
    try {
        const JWTToken = req.headers.authorization?.split(" ")[1];
        if (!JWTToken) {
            next();
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(JWTToken, process.env.JWT_SECRET_KEY);
        req.userId = decoded._id;
        req.targetId = decoded.targetId;
        req.loginType = decoded.type;
        next();
    }
    catch (error) {
        console.error("JWT 인증 오류:", error);
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({ error: "Token expired" });
            return;
        }
        res.status(401).json({ error: "Invalid token" });
    }
};
exports.default = verifyJWTToken;
