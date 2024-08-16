const express = require("express");

const { verifyJwtToken } = require("../middlewares/verifyJwtToken");
const { Package } = require("../model/Package");
const { User } = require("../model/User");

const router = express.Router();

router.post("/new", verifyJwtToken, async (req, res, next) => {
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
    author: userId,
  });

  await User.updateOne({ _id: userId }, { $push: { history: newPackage._id } });

  res.send({ serialNumber, packageId: newPackage._id });
});

module.exports = router;
