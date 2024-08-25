const express = require("express");
const axios = require("axios");

const { User } = require("../../model/User");

const router = express.Router();

// TODO: userId로 조회되는 정보가 없을 경우 등 에러처리 로직 보강필요
router.post("/kakao", async (req, res, next) => {
  try {
    const { deliOrderUserId: userId } = req.body;

    const { targetId, loginType } = await User.findById(userId).lean();

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
        return res.status(400).json({ message: "로그아웃에 실패했습니다." });
      }

      return res.status(200).json({ message: "성공적으로 로그아웃 했습니다." });
    }
  } catch (error) {
    console.error("로그아웃에 실패 했습니다.", error);
    return res.status(500).json({ message: "로그아웃에 실패 했습니다." });
  }
});

module.exports = router;
