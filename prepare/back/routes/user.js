const express = require("express");
const bycrypt = require("bcrypt");
const passport = require("passport");

const { Post, User, Image, Comment } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { Op } = require("sequelize");

const router = express.Router();

//* 미들웨어 확장 패턴
router.post("/login", isNotLoggedIn, (req, res, next) => {
  // POST /user/login
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        // attributes: ['id', 'nickname', 'email'], // <= 명시된 것만 가져오겠다.
        attributes: {
          exclude: ["password"], // <= 명시된 것만 제외하고 가져오겠다.
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
          },
          {
            model: User,
            as: "Followers",
          },
        ],
      });
      console.log("유저정보확인", fullUserWithoutPassword);
      // res.setHeader('Cookie', 'cxlhy')
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.post("/logout", isLoggedIn, (req, res, next) => {
  // console.log("유저 정보 ===", req.user);
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy();
    res.send("ok");
  });
});

router.get("/", async (req, res, next) => {
  try {
    console.log("유저 확인", req.user);
    if (req.user) {
      const user = await User.findOne({
        where: { id: req.user.id },
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
          },
          {
            model: User,
            as: "Followers",
          },
        ],
      });
      console.log("유저정보확인", user);
      res.status(200).json(user);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/", isNotLoggedIn, async (req, res, next) => {
  // POST /user/
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send("이미 사용중인 아이디입니다.");
    }
    const hashedPassword = await bycrypt.hash(req.body.password, 12);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.status(201).send("ok");
  } catch (error) {
    console.error(error);
    next(error); // status 500
  }
});

router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: { id: req.user.id },
      }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/followers", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    if (!user) {
      return res.status(403).send("Ooops!");
    }
    const followers = await user.getFollowers({
      attributes: ["id", "nickname"],
      limit: parseInt(req.query.limit, 10),
    });
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/followings", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    if (!user) {
      return res.status(403).send("Ooops!");
    }
    const followings = await user.getFollowings({
      attributes: ["id", "nickname"],
      limit: parseInt(req.query.limit, 10),
    });
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router
  .route("/:userId/follow", isLoggedIn)
  .patch(async (req, res, next) => {
    try {
      const followUser = await User.findOne({
        where: { id: req.params.userId },
      });
      if (!followUser) {
        return res.status(403).send("유령을 팔로우 하려고 하시네요.");
      }
      await followUser.addFollowers(req.user.id);
      res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    } catch (error) {
      console.error(error);
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const followUser = await User.findOne({
        where: { id: req.params.userId },
      });
      if (!followUser) {
        return res.status(403).send("유령을 언팔로우 하려고 하시네요.");
      }
      await followUser.removeFollowers(req.user.id);
      res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    } catch (error) {
      console.error(error);
      next(error);
    }
  });

router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!user) {
      return res.status(403).send("잘못된 접근 입니다.");
    }
    await user.removeFollowers(req.user.userId);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:userId/posts", async (req, res, next) => {
  try {
    const where = { UserId: req.params.userId };
    if (parseInt(req.query.lastId, 10)) {
      // 초기로딩 아닐시!
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; // lastId보다 작은 숫자 10개 기져와야함
    }
    const posts = await Post.findAll({
      where,
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
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:userId", async (req, res, next) => {
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.userId },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Post,
          attributes: ["id"],
        },
        {
          model: User,
          as: "Followings",
        },
        {
          model: User,
          as: "Followers",
        },
      ],
    });
    if (fullUserWithoutPassword) {
      const data = fullUserWithoutPassword.toJSON(); // 조작하려면 json으로 변환해야 한다.
      data.Posts = data.Posts.length; // 개인정보 보호를 위해
      data.Followings = data.Followings.length;
      data.Followers = data.Followers.length;
      res.status(200).json(data);
    } else {
      res.status(404).json("존재하지 않는 유저입니다.");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
