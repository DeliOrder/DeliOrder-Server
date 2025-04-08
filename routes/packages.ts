import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import verifyJWTToken from "../middlewares/verifyJWTToken";
import { Package } from "../model/Package";
import User from "../model/User";
import deleteFilesFromAWS from "../utils/deleteFileToAWS";
import generateUniqueSerialNumber from "../utils/createRandomNum";
import processOrdersWithFiles from "../utils/uploadFileToAWS";

const router = express.Router();

interface UserRequest extends Request {
  userId?: string;
}

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/new",
  verifyJWTToken,
  upload.array("files"),
  async (req: UserRequest, res: Response, next: NextFunction) => {
    let orders;

    try {
      const { userId } = req;
      const files = req.files as Express.Multer.File[];
      orders = JSON.parse(req.body.orders);

      if (!orders || orders.length === 0) {
        res.status(400).json({ error: "조합된 행동이 없습니다." });
        return;
      }

      const updatedOrders = await processOrdersWithFiles(orders, files);
      const serialNumber = await generateUniqueSerialNumber();

      const newPackage = await Package.create({
        serialNumber,
        orders: updatedOrders,
        ...(userId && { author: userId }),
      });

      if (userId) {
        await User.updateOne(
          { _id: userId },
          { $push: { history: newPackage._id } },
        );
      }

      res.status(201).json({
        serialNumber,
        packageId: newPackage._id,
      });
    } catch (error) {
      console.error("패키지 생성 중 오류:", error);

      if (orders) {
        await deleteFilesFromAWS(orders);
      }

      next(error);
    }
  },
);

router.get(
  "/:serialNumber",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const serialNumber = req.params?.serialNumber;

      if (!serialNumber) {
        res.status(400).json({ error: "일련번호가 필요합니다." });
        return;
      }

      const existPackage = await Package.findOne({ serialNumber }).lean();

      if (!existPackage) {
        res.status(404).json({ error: "찾을 수 없는 주문입니다." });
        return;
      }

      res.status(200).json({
        message: "성공적으로 주문을 불러왔습니다.",
        existPackage,
      });
    } catch (error) {
      console.error("패키지 불러오기 오류 발생:", error);
      next(error);
    }
  },
);

export default router;
