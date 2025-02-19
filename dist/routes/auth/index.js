"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sign_in_1 = __importDefault(require("./sign-in"));
const sign_out_1 = __importDefault(require("./sign-out"));
const sign_up_1 = __importDefault(require("./sign-up"));
const token_1 = __importDefault(require("./token"));
const cookie_1 = __importDefault(require("./cookie"));
const router = express_1.default.Router();
router.use("/sign-in", sign_in_1.default);
router.use("/sign-out", sign_out_1.default);
router.use("/sign-up", sign_up_1.default);
router.use("/token", token_1.default);
router.use("/cookie", cookie_1.default);
exports.default = router;
