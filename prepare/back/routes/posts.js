const express = require("express");
const { Post, Image, Comment, User } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      //   where: { id: lastId },
      limit: 10, //10개만 가져온다.
      // offset: 0, //0부터 시작해서 10개 가져온다. (id: 1 ~ 10)
      order: [
        ["createdAt", "DESC"], // 최신 날짜 순으로
        [Comment, "createdAt", "DESC"], // include된 Comment의 최신 날짜 순으로 여기다가 명시해야함
      ],
      /*
       ! limit과 offset을 같이 쓰면 중간에 데이터가 들어왔을때 불러와 지는 데이터가 꼬여버린다.
       ! 그래서 실무에서는 잘 안쓰임
       ? 대안: offset 말고 lastId를 사용한다.
       ? lastId 부터 10개를 가져온다. 라스트아이디가 삭제되도 그 뒷 숫자부터해서 가져 옴
       */
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
          include: [{ model: User, attributes: { exclude: "password" } }],
        },
        {
          model: User,
          attributes: { exclude: ["password"] },
        },
        {
          model: User, // 좋아요 누른 사람
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
