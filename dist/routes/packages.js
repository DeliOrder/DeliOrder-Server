"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyJWTToken_1 = __importDefault(require("../middlewares/verifyJWTToken"));
const Package_1 = require("../model/Package");
const User_1 = __importDefault(require("../model/User"));
const router = express_1.default.Router();
const createRandomSerialNumber = () => {
    const randomNumber = Math.floor(Math.random() * 1000000);
    return String(randomNumber).padStart(6, "0");
};
router.post("/new", verifyJWTToken_1.default, async (req, res, next) => {
    try {
        const { userId } = req;
        const { orders } = req.body;
        if (!orders || orders.length === 0) {
            res.status(400).json({ error: "조합된 행동이 없습니다." });
            return;
        }
        const serialNumberSet = new Set();
        let serialNumber = createRandomSerialNumber();
        while (serialNumberSet.has(serialNumber)) {
            serialNumber = createRandomSerialNumber();
        }
        serialNumberSet.add(serialNumber);
        const existingPackages = await Package_1.Package.find({ serialNumber: { $in: [...serialNumberSet] } }, { serialNumber: 1 }).lean();
        const existingSerialNumbers = new Set(existingPackages.map((pkg) => pkg.serialNumber));
        while (existingSerialNumbers.has(serialNumber)) {
            serialNumber = createRandomSerialNumber();
        }
        const newPackage = await Package_1.Package.create({
            serialNumber,
            orders,
            ...(userId && { author: userId }),
        });
        if (userId) {
            await User_1.default.updateOne({ _id: userId }, { $push: { history: newPackage._id } });
        }
        res.status(201).json({
            serialNumber,
            packageId: newPackage._id,
        });
    }
    catch (error) {
        console.error("새로운 패키지 생성 오류 발생:", error);
        next(error);
    }
});
router.get("/:serialNumber", async (req, res, next) => {
    try {
        const serialNumber = req.params?.serialNumber;
        if (!serialNumber) {
            res.status(400).json({ error: "일련번호가 필요합니다." });
            return;
        }
        const existPackage = await Package_1.Package.findOne({ serialNumber }).lean();
        if (!existPackage) {
            res.status(404).json({ error: "찾을 수 없는 주문입니다." });
            return;
        }
        res.status(200).json({
            message: "성공적으로 주문을 불러왔습니다.",
            existPackage,
        });
    }
    catch (error) {
        console.error("패키지 불러오기 오류 발생:", error);
        next(error);
    }
});
exports.default = router;
