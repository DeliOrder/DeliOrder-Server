const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/validate", async (req, res, next) => {
  try {
    const deliOrderToken = req.headers["authorization"]?.split(" ")[1];

    jwt.verify(deliOrderToken, process.env.JWT_SECRET_KEY);
    return res.status(200).json({ message: "정상인증된 유저입니다." });
  } catch {
    return res.status(401).json({ error: "유효하지 않은 유저입니다." });
  }
});

module.exports = router;
