"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const verifyJWTToken_1 = __importDefault(require("../middlewares/verifyJWTToken"));
const Package_1 = require("../model/Package");
const User_1 = __importDefault(require("../model/User"));
const deleteFileToAWS_1 = __importDefault(require("../utils/deleteFileToAWS"));
const createRandomNum_1 = __importDefault(require("../utils/createRandomNum"));
const uploadFileToAWS_1 = __importDefault(require("../utils/uploadFileToAWS"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.post("/new", verifyJWTToken_1.default, upload.array("files"), async (req, res, next) => {
    let orders;
    try {
        const { userId } = req;
        const files = req.files;
        orders = JSON.parse(req.body.orders);
        if (!orders || orders.length === 0) {
            res.status(400).json({ error: "조합된 행동이 없습니다." });
            return;
        }
        const updatedOrders = await (0, uploadFileToAWS_1.default)(orders, files);
        const serialNumber = await (0, createRandomNum_1.default)();
        const newPackage = await Package_1.Package.create({
            serialNumber,
            orders: updatedOrders,
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
        console.error("패키지 생성 중 오류:", error);
        if (orders) {
            await (0, deleteFileToAWS_1.default)(orders);
        }
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
