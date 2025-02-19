import express, { Request, Response, NextFunction } from "express";
import verifyJWTToken from "../middlewares/verifyJWTToken";
import { Package } from "../model/Package";
import User from "../model/User";

const router = express.Router();

interface UserRequest extends Request {
  userId?: string;
}

const createRandomSerialNumber = (): string => {
  const randomNumber = Math.floor(Math.random() * 1000000);
  return String(randomNumber).padStart(6, "0");
};

router.post(
  "/new",
  verifyJWTToken,
  async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { userId } = req;
      const { orders } = req.body;

      if (!orders || orders.length === 0) {
        res.status(400).json({ error: "조합된 행동이 없습니다." });
        return;
      }

      const serialNumberSet = new Set<string>();
      let serialNumber: string = createRandomSerialNumber();

      while (serialNumberSet.has(serialNumber)) {
        serialNumber = createRandomSerialNumber();
      }

      serialNumberSet.add(serialNumber);

      const existingPackages = await Package.find(
        { serialNumber: { $in: [...serialNumberSet] } },
        { serialNumber: 1 },
      ).lean();

      const existingSerialNumbers = new Set(
        existingPackages.map((pkg) => pkg.serialNumber),
      );

      while (existingSerialNumbers.has(serialNumber)) {
        serialNumber = createRandomSerialNumber();
      }

      const newPackage = await Package.create({
        serialNumber,
        orders,
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
      console.error("새로운 패키지 생성 오류 발생:", error);
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
