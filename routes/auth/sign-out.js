const express = require("express");
const axios = require("axios");

const { User } = require("../../model/User");

const router = express.Router();

router.post("/kakao", async (req, res, next) => {
  try {
    const { deliOrderUserId: userId } = req.body;

    const existUser = await User.findById(userId).lean();
    if (!existUser) {
      return res.status(400).json({ error: "해당 유저가 존재하지 않습니다." });
    }

    const { targetId, loginType } = existUser;

    if (targetId && loginType === "kakao") {
      const result = await axios.post(
        "https://kapi.kakao.com/v1/user/logout",
        new URLSearchParams({
          target_id_type: "user_id",
          target_id: targetId,
        }),
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8",
            Authorization: "KakaoAK " + process.env.KAKAO_ADMIN_KEY,
          },
        },
      );

      if (!result.data.id) {
        console.error("로그아웃에 실패했습니다.");
        return res.status(400).json({
          message: "유효한 아이디가 아닙니다. 로그아웃에 실패했습니다.",
        });
      }

      return res.status(200).json({ message: "성공적으로 로그아웃 했습니다." });
    }
  } catch (error) {
    console.error("로그아웃에 실패 했습니다.", error);
    return res
      .status(500)
      .json({ message: "서버의 응답이 없습니다. 로그아웃에 실패 했습니다." });
  }
});

module.exports = router;
