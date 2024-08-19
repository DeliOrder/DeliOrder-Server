const express = require("express");

const { Package } = require("../model/Package");
const { User } = require("../model/User");
const { verifyJWTToken } = require("../middlewares/verifyJWTtoken");

const router = express.Router();

router.post("/new", verifyJWTToken, async (req, res, next) => {
  const userId = req.userId;
  const { orders } = req.body;

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
  res.send({ serialNumber, packageId: newPackage._id });
});

router.get("/:serialNumber", async (req, res, next) => {
  try {
    const serialNumber = req.params?.serialNumber;
    const existPackage = await Package.findOne({ serialNumber }).lean();

    if (!existPackage) {
      return res.status(404).json({ message: "찾을 수 없는 주문입니다." });
    }

    return res.status(200).json({
      message: "성공적으로 주문을 불러왔습니다.",
      existPackage,
    });
  } catch {
    return res.status(500).json({
      message: "일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    });
  }
});

module.exports = router;
