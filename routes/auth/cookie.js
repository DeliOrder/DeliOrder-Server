const express = require("express");
const router = express.Router();

router.delete("/", (req, res, next) => {
  try {
    res.clearCookie("refreshToken", {
      sameSite: "Strict",
      httpOnly: true,
      path: "/",
    });

    return res
      .status(200)
      .json({ message: "성공적으로 쿠키를 삭제하였습니다." });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "성공적으로 쿠키를 삭제하지못했습니다." });
  }
});

module.exports = router;
