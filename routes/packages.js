const express = require("express");

const { Package } = require("../model/Package");
const { User } = require("../model/User");
const { verifyJWTToken } = require("../middlewares/verifyJWTToken");

const router = express.Router();
router.post("/new", verifyJWTToken, async (req, res, next) => {
  try {
    const userId = req.userId;
    const { orders } = req.body;

    if (!orders || orders.length === 0) {
      return res.status(400).json({ error: "조합된 행동이 없습니다." });
    }

    const createRandomSerialNumber = () => {
      const randomNumber = Math.floor(Math.random() * 1000000);
      return String(randomNumber).padStart(6, "0");
    };

    let serialNumber = createRandomSerialNumber();
    let existingPackage = await Package.findOne({ serialNumber }).lean();

    while (existingPackage) {
      serialNumber = createRandomSerialNumber();
      existingPackage = await Package.findOne({ serialNumber }).lean();
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

    return res.json({ serialNumber, packageId: newPackage._id });
  } catch (error) {
    console.error("새로운 패키지 생성 오류 발생:", error);
    next(error);
  }
});

router.get("/:serialNumber", async (req, res, next) => {
  try {
    const serialNumber = req.params?.serialNumber;

    if (!serialNumber) {
      return res.status(400).json({ error: "일련번호가 필요합니다." });
    }

    const existPackage = await Package.findOne({ serialNumber }).lean();

    if (!existPackage) {
      return res.status(404).json({ error: "찾을 수 없는 주문입니다." });
    }

    return res.status(200).json({
      message: "성공적으로 주문을 불러왔습니다.",
      existPackage,
    });
  } catch (error) {
    console.error("패키지 불러오기 오류 발생:", error);
    next(error);
  }
});

module.exports = router;
