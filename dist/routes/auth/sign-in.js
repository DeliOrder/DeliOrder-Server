"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importStar(require("axios"));
const app_1 = require("firebase-admin/app");
const firebase_config_1 = __importDefault(require("../../config/firebase-config"));
const User_1 = __importDefault(require("../../model/User"));
const generateToken_1 = require("../../utils/generateToken");
const router = express_1.default.Router();
router.post("/google", async (req, res, next) => {
    try {
        const { firebaseIdToken } = req.body;
        const decodedToken = await firebase_config_1.default.auth().verifyIdToken(firebaseIdToken);
        const { name, email } = decodedToken;
        let existUser = await User_1.default.findOne({ email }).lean();
        if (!existUser) {
            existUser = await User_1.default.create({
                nickname: name,
                email,
                loginType: "google",
            });
        }
        const userId = existUser._id.toString();
        const deliOrderToken = (0, generateToken_1.generateAccessToken)(userId, "google");
        const deliOrderRefreshToken = (0, generateToken_1.generateRefreshToken)(userId, "google");
        await User_1.default.updateOne({ email }, { deliOrderRefreshToken });
        res.cookie("refreshToken", deliOrderRefreshToken, {
            sameSite: "lax",
            httpOnly: true,
            maxAge: 3 * 30 * 24 * 60 * 60 * 1000,
            secure: true,
        });
        res.status(200).json({
            deliOrderToken,
            userId,
            loginType: "google",
        });
    }
    catch (error) {
        console.error("구글 로그인 에러", error);
        if (error instanceof app_1.FirebaseAppError &&
            (error.code === "auth/id-token-expired" ||
                error.code === "auth/invalid-id-token")) {
            res.status(401).json({ error: "유효하지 않은 토큰입니다." });
            return;
        }
        next(error);
    }
});
router.post("/email", async (req, res, next) => {
    try {
        const { firebaseIdToken } = req.body;
        if (!firebaseIdToken) {
            res.status(400).json({ error: "firebaseIdToken이 필요합니다." });
            return;
        }
        const decodedToken = await firebase_config_1.default.auth().verifyIdToken(firebaseIdToken);
        const { email } = decodedToken;
        const existUser = await User_1.default.findOne({
            email,
        }).lean();
        if (!existUser) {
            res.status(401).json({ error: "유효하지 않은 사용자입니다." });
            return;
        }
        const userId = existUser._id.toString();
        const deliOrderToken = (0, generateToken_1.generateAccessToken)(userId, "email");
        const deliOrderRefreshToken = (0, generateToken_1.generateRefreshToken)(userId, "email");
        await User_1.default.updateOne({ email }, { deliOrderRefreshToken });
        res.cookie("refreshToken", deliOrderRefreshToken, {
            sameSite: "lax",
            httpOnly: true,
            maxAge: 3 * 30 * 24 * 60 * 60 * 1000,
            secure: true,
        });
        res.status(200).json({
            deliOrderToken,
            userId,
            loginType: "email",
        });
    }
    catch (error) {
        console.error("이메일 로그인 에러", error);
        if (error instanceof app_1.FirebaseAppError &&
            (error.code === "auth/id-token-expired" ||
                error.code === "auth/invalid-id-token")) {
            res.status(401).json({ error: "유효하지 않은 토큰입니다." });
        }
        next(error);
    }
});
router.post("/kakao", async (req, res, next) => {
    try {
        const { authCode } = req.body;
        if (!authCode) {
            res.status(400).json({ error: "잘못된 요청입니다." });
            return;
        }
        const kakaoResponse = await axios_1.default.post("https://kauth.kakao.com/oauth/token", new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.KAKAO_CLIENT_ID,
            redirect_uri: process.env.CLIENT_PORT,
            code: authCode,
        }), {
            headers: {
                "content-type": "application/x-www-form-urlencoded;charset=utf-8",
            },
        });
        const { access_token: accessToken, refresh_token: refreshToken } = kakaoResponse.data;
        const userInfoResponse = await axios_1.default.get("https://kapi.kakao.com/v2/user/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const { email } = userInfoResponse.data.kakao_account;
        const { nickname } = userInfoResponse.data.kakao_account.profile;
        const uid = userInfoResponse.data.id;
        let existUser = await User_1.default.findOne({ email }).lean();
        if (!existUser) {
            existUser = await User_1.default.create({
                nickname,
                email,
                loginType: "kakao",
                socialRefreshToken: refreshToken,
                targetId: uid.toString(),
            });
            await firebase_config_1.default.auth().createUser({
                uid: String(uid),
                email,
                displayName: nickname,
            });
        }
        else {
            await User_1.default.updateOne({ email }, { socialRefreshToken: refreshToken });
        }
        const userId = existUser._id.toString();
        const deliOrderToken = (0, generateToken_1.generateAccessToken)(userId, "kakao", {
            targetId: uid,
        });
        const deliOrderRefreshToken = (0, generateToken_1.generateRefreshToken)(userId, "kakao");
        await User_1.default.updateOne({ email }, { deliOrderRefreshToken });
        const firebaseToken = await firebase_config_1.default.auth().createCustomToken(String(uid), {
            nickname,
            email,
            loginType: "kakao",
        });
        res.cookie("refreshToken", deliOrderRefreshToken, {
            sameSite: "strict",
            httpOnly: true,
            maxAge: 3 * 30 * 24 * 60 * 60 * 1000,
            path: "/",
        });
        res.status(200).json({
            firebaseToken,
            deliOrderToken,
            userId,
            loginType: "kakao",
        });
    }
    catch (error) {
        console.error("카카오 로그인 에러: ", error);
        if (error instanceof axios_1.AxiosError && error.response) {
            res.status(400).json({
                error: "잘못된 요청입니다. 카카오 로그인에 실패하였습니다.",
            });
        }
        next(error);
    }
});
exports.default = router;
