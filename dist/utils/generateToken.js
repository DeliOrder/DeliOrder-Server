"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (userId, loginType, ...additionalData) => {
    const tokenData = { _id: userId, type: loginType };
    additionalData.forEach((data) => {
        Object.assign(tokenData, data);
    });
    return jsonwebtoken_1.default.sign(tokenData, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (userId, loginType) => {
    const tokenData = { _id: userId, type: loginType };
    return jsonwebtoken_1.default.sign(tokenData, process.env.JWT_SECRET_KEY, {
        expiresIn: "3d",
    });
};
exports.generateRefreshToken = generateRefreshToken;
